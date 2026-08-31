"use client"

import { CalendarX, Check, Download, Eye, LockKeyhole, PencilLine, Search, Trash2, X } from "lucide-react"
import { Modal } from "../../ui/modal"
import { Button, FormGroup, ImageAdvanced } from "@/components/Form"
import { accept, cancelEvent, cancelEventV2, cancelUndoEvent, cancelUndoEventV2, deleteEvent, deleteEventV2, getDetailEventCalendar, getDetailEventCalendarV2, lockEvent, lockEventV2, refuse } from "@/lib/api/calendarApi"
import { Fragment, useContext, useEffect, useState } from "react"
import FileUtils from "@/utils/fileUtils"
import Tab2s from "@/components/tab2s/Tab2s"
import { CalendarConstants } from "@/constants/calendarConstants"
import { convertDateTimeToDateAndTime } from "@/helpers/objectHelpers"
import { convertDateTimeToDate } from "@/helpers/stringHelpers"
import PreviewFileModal from "@/components/files/PreviewFileModal"
import ConfirmationBanner from "../confirmBanner"
import ConfirmEventItem from "./confirm-event-item"
import ConfirmEventModal from "./confirm-event-modal"
import CalendarForm from "./calendar-form"
import ProgressContext from "@/contexts/ProgressContext"
import ActionConfirmModal from "./action-confirm-modal"
import { useToast } from "@/contexts/ToastContext"
import { useCalendarReload } from "@/contexts/CalendarReloadContext"
import { ActionConstants, FunctionConstants } from "@/constants/dataConstants"
import { usePermission } from "@/hooks/usePermission"
import ExpandableContent from "@/components/ExpandableContent"
import LoadingContext from "@/contexts/LoadingContext"
import { UserFileConstants } from "@/constants/userConstants"
import RenderFileToken from "@/components/controls/renderFileTokens/RenderFileToken"
import AvatarWithFrame from "../../avatars/avatarFrame";

function userItem(data, searchTerm = "") {
    // Filter data based on search term
    const filteredData = data.filter((user) => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return user.fullName?.toLowerCase().includes(searchLower) || user.roleName?.toLowerCase().includes(searchLower)
    })

    return (
        <>
            {filteredData.length ? (
                filteredData.map((user, index) => (
                    <div key={user.id || index} className="flex items-center border-b p-2 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                            {user.avatar && (
                                <AvatarWithFrame size={40} avatarPath={user.avatar} DepartmentFrames={[]} PersonalFrames={[]} />
                            )}
                            <div className="text-md">
                                <p className="font-semibold">{user.fullName || "Phong Hoang"}</p>
                                <p className="text-gray-500">{user.roleName || "Nhân Viên"} {
                                    user.departmentName && (`- ${user.departmentName}`)}</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center h-full min-h-[100px]">
                    <p className="text-gray-500 text-center">
                        {searchTerm ? "Không tìm thấy nhân viên nào" : "Không có nhân viên nào"}
                    </p>
                </div>
            )}
        </>
    )
}

function userItemRefuse(data, searchTerm = "") {
    // Filter data based on search term
    const filteredData = data.filter((user) => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        return user.fullName?.toLowerCase().includes(searchLower) || user.roleName?.toLowerCase().includes(searchLower)
    })

    return (
        <>
            {filteredData.length ? (
                filteredData.map((user, index) => (
                    <div
                        key={user.id || index}
                        className="flex flex-col md:flex-row md:items-center border-b p-2 gap-2 md:gap-0 hover:bg-gray-50"
                    >
                        {/* Avatar + Info */}
                        <div className="flex flex-row md:flex-row items-center gap-2">
                            {user.avatar && (
                                <AvatarWithFrame size={40} avatarPath={user.avatar} DepartmentFrames={[]} PersonalFrames={[]} />
                            )}
                            <div className="text-sm md:text-md">
                                <p className="font-semibold break-all">
                                    {user.fullName || "Phong Hoang"}
                                </p>
                                <p className="text-gray-500 break-all text-xs md:text-sm">
                                    {user.roleName || "Nhân Viên"} - {user.departmentName}
                                </p>
                            </div>
                        </div>
                        {/* Lý do từ chối */}
                        <div className="italic flex md:flex-1 w-full md:justify-end mt-2 md:mt-0 text-xs md:text-sm">
                            <p>
                                Lý do từ chối:{" "}
                                {user.refuseContent || <span className="text-gray-400">Không lý do</span>}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex items-center justify-center h-full min-h-[100px]">
                    <p className="text-gray-500 text-center text-sm">
                        {searchTerm
                            ? "Không tìm thấy nhân viên nào"
                            : "Không có nhân viên nào"}
                    </p>
                </div>
            )}

        </>
    )
}

export const EventDetail = ({ isOpen, onClose, info, view }) => {

    // Check permissions
    const _function = FunctionConstants.calendar;
    const isCanEdit = usePermission(_function, ActionConstants.edit);
    const isCanDelete = usePermission(_function, ActionConstants.delete);
    const [calendar, setCalendar] = useState({
        item: {},
        calendarJoineds: [],
        calendarNotYets: [],
        calendarFiles: [],
        calendarRefuses: [],
        createdBy: {},
        roleByUser: "",
        typeUserJoin: null,
        typeAccept: null,
        refuseContentJoin: "",
        isHiddenEdit: false,
        departmentsJoin: [],
        usersJoin: [],
        isHiddenChangeDecision: false,
        isHiddenCancel: false,
        isHiddenRemove: false,
        isTurnOnLock: false,
        isHiddenAllButton: false,
        isUndoCancel: false,
        isHiddenParticipant: false
    });
    const [type, setType] = useState(CalendarConstants.viewParticipant.Joined);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectFile, setSelectFile] = useState(null);
    const [refuseReason, setRefuseReason] = useState("");
    const [typeAcceptOfUser, setTypeAcceptOfUser] = useState(null);
    const [errorCheck, setErrorCheck] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [isOpenConfirmAction, setIsOpenConfirmAction] = useState(false);
    const [messageConfirm, setMessageConfirm] = useState({
        title: '',
        message: <p></p>,
    });
    const [actionSelected, setActionSelected] = useState('');
    const [reasonCancel, setRefuseCancel] = useState('');
    const [staffFiles, setStaffFiles] = useState([])
    const progressContext = useContext(ProgressContext);
    const toast = useToast();
    const { triggerReload } = useCalendarReload();
    const loadingContext = useContext(LoadingContext);

    const {
        calendarFiles,
        calendarJoineds,
        calendarNotYets,
        calendarRefuses,
        item, createdBy,
        roleByUser, refuseContentJoin,
        typeAccept, typeUserJoin, isHiddenEdit,
        departmentsJoin, usersJoin, isHiddenChangeDecision,
        isTurnOnLock, isHiddenRemove, isHiddenCancel,
        isHiddenAllButton, isUndoCancel, isHiddenParticipant
    } = calendar

    useEffect(() => {
        getEventDetail()
    }, [info.id])

    const getEventDetail = async () => {}

    const onSelectType = (item) => () => {
        setType(item.value)
        // Reset search when switching tabs
        setSearchTerm("")
    }

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const convertType = ({ type }) => {
        let result = {}
        switch (type) {
            case CalendarConstants.typeEvent.Meeting:
                result = {
                    color: "green",
                    text: "Cuộc họp",
                }
                break
            case CalendarConstants.typeEvent.Collaborate:
                result = {
                    color: "blue",
                    text: "Công tác",
                }
                break
            default:
                result = {
                    color: "gray",
                    text: "Khác",
                }
                break
        }
        return result
    }

    const titleDate = (dateStr) => {
        let title = ""
        if (dateStr) {
            const { date, timeWithoutSeconds } = convertDateTimeToDateAndTime(dateStr)
            const convertDate = convertDateTimeToDate(date, "dd/MM/yyyy")
            title = `${timeWithoutSeconds} - ${convertDate}`
        }
        return title
    }

    const participants = (tab) => {
        let DOM = null
        switch (tab) {
            case CalendarConstants.viewParticipant.Joined:
                DOM = userItem(calendarJoineds, searchTerm)
                break
            case CalendarConstants.viewParticipant.Refuse:
                DOM = userItemRefuse(calendarRefuses, searchTerm)
                break
            case CalendarConstants.viewParticipant.NotYet:
                DOM = userItem(calendarNotYets, searchTerm)
                break
        }
        return DOM
    }

    // Get current tab data count for display
    const getCurrentTabCount = () => {
        let currentData = []
        switch (type) {
            case CalendarConstants.viewParticipant.Joined:
                currentData = calendarJoineds
                break
            case CalendarConstants.viewParticipant.Refuse:
                currentData = calendarRefuses
                break
            case CalendarConstants.viewParticipant.NotYet:
                currentData = calendarNotYets
                break
        }

        if (!searchTerm) return currentData.length

        // Count filtered results
        return currentData.filter((user) => {
            const searchLower = searchTerm.toLowerCase()
            return (
                user.fullName?.toLowerCase().includes(searchLower) ||
                user.position?.toLowerCase().includes(searchLower) ||
                user.email?.toLowerCase().includes(searchLower) ||
                (type === CalendarConstants.viewParticipant.Refuse && user.reason?.toLowerCase().includes(searchLower))
            )
        }).length
    }

    const onClosePreview = () => {
        setSelectFile(null)
    }

    const handleTypeAccept = (typeAcceptOfUserSelected) => {
        setTypeAcceptOfUser(typeAcceptOfUserSelected)
        setRefuseReason("")
    }

    const handleConfirm = async () => {
        try {
            const { id } = info
            if (id && typeAcceptOfUser) {
                setErrorCheck(true);
                if (typeAcceptOfUser === CalendarConstants.userTypeAccept.refuse) {
                    if (!refuseReason) return
                    const response = await refuse({ id, refuseContent: refuseReason })
                    if (response.status === 200) {
                        await getEventDetail();
                        if (showConfirmModal) {
                            handleIsConfirm();
                        }
                    }
                }
                else {
                    const response = await accept({ id })
                    if (response.status === 200) {
                        await getEventDetail();
                        if (showConfirmModal) {
                            handleIsConfirm();
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error("Error handling confirm data:", error);
        }
    }

    const handleIsConfirm = () => {
        setShowConfirmModal(!showConfirmModal);
    }

    const onDownload = (file) => () => {
        progressContext.addProgress({ ...file, isPrivate: true });
    }

    const handleOpenConfirmAction = (action = 'Cancel' | 'Delete' | 'Lock' | 'Undo') => {
        setIsOpenConfirmAction(true);
        setMessageConfirm(() => {
            let temp = {};
            switch (action) {
                case 'Lock':
                    temp = {
                        title: 'Khóa lịch',
                        message: (
                            <div className="flex flex-col gap-5">
                                <p className="font-semibold">Bạn muốn khóa lịch này?</p>
                                <p>Lịch sẽ không thể chỉnh sửa hoặc cập nhật thông tin mới. Hành động này không thể hoàn tác.</p>
                            </div>
                        ),
                    }
                    break;
                case 'Delete':
                    temp = {
                        title: 'Xóa lịch',
                        message: (
                            <div className="flex flex-col gap-5">
                                <p className="font-semibold">Bạn muốn xóa lịch này?</p>
                                <p>Lịch sẽ không thể chỉnh sửa hoặc cập nhật thông tin mới. Hành động này không thể hoàn tác.</p>
                            </div>
                        ),
                    }
                    break;
                case 'Cancel':
                    temp = {
                        title: 'Hủy lịch',
                        message: (
                            <div className="flex flex-col gap-5 mb-5">
                                <p className="font-semibold">Bạn có chắc chắn muốn hủy lịch này không?</p>
                                <p>Sau khi hủy, tất cả người tham gia sẽ nhận được thông báo và không thể truy cập nội dung lịch này nữa.</p>
                            </div>
                        ),
                    }
                    break;
                case 'Undo':
                    temp = {
                        title: 'Hoàn tác lịch bị hủy',
                        message: (
                            <div className="flex flex-col gap-5 mb-5">
                                <p className="font-semibold">Bạn có chắc chắn muốn hoàn tác lịch này?</p>
                                <p className="font-semibold">Hành động này sẽ khôi phục lại sự kiện đã bị hủy và thông báo sẽ được gửi lại đến tất cả người tham gia (nếu có).</p>
                                <p className="font-semibold">Mỗi sự kiện chỉ được hoàn tác một lần duy nhất. Sau khi hoàn tác, bạn không thể tiếp tục hoàn tác lần nữa.</p>
                                <p className="font-semibold">Bạn có chắc muốn tiếp tục?</p>
                            </div>
                        ),
                    }
                    break;
            }
            return temp;
        });
        setActionSelected(action);
    }

    const handleSubmitConfirmAction = async () => {
    }

    const actions = {
        cancel: {
            condition: (typeUserJoin === CalendarConstants.userJoin.createBy || typeUserJoin === CalendarConstants.userJoin.personal) && !isHiddenAllButton && !isHiddenCancel && isCanEdit,
            render: (
                <Button onClick={() => handleOpenConfirmAction('Cancel')} className="!bg-[#D46B08] text-white hover:!bg-[#B65507] focus:ring-[#D46B08]" type="button">
                    <CalendarX size={16} className="mr-2" />
                    Hủy lịch
                </Button>
            )
        },
        lock: {
            condition: (typeUserJoin === CalendarConstants.userJoin.createBy || typeUserJoin === CalendarConstants.userJoin.personal) && !isHiddenAllButton && isTurnOnLock && isCanEdit,
            render: (
                <Button onClick={() => handleOpenConfirmAction('Lock')} variant="destructive" type="button">
                    <LockKeyhole size={16} className="mr-2" />
                    Khóa lịch
                </Button>
            )
        },
        edit: {
            condition: ((typeUserJoin === CalendarConstants.userJoin.createBy || typeUserJoin === CalendarConstants.userJoin.personal) && !isHiddenEdit && !isHiddenAllButton && isCanEdit),
            render: (
                <Button onClick={() => setIsOpenForm(true)} variant="danger" type="button">
                    <PencilLine size={16} className="mr-2" />
                    Chỉnh sửa
                </Button>
            )
        },
        confirm: {
            condition: typeUserJoin === CalendarConstants.userJoin.participant && !isHiddenEdit && typeAccept === 0 && !isHiddenAllButton && isCanEdit && !isHiddenParticipant,
            render: (
                <Button onClick={handleConfirm} variant="danger" type="button" disabled={typeAcceptOfUser ? false : true}>
                    <Check size={16} className="mr-2" />
                    Xác nhận
                </Button>
            )
        }
    }

    const avatarFile = staffFiles?.find(x => x.TypeFile == UserFileConstants.typeFile.Avatar)?.File;
    
    return (
        <>
            <Modal
                title={item?.name}
                size="lg"
                id="modal-event-detail"
                onClose={onClose}
                isOpen={isOpen}
                footer={
                    <div className="flex items-center justify-between">
                        {
                            (typeUserJoin === CalendarConstants.userJoin.createBy || typeUserJoin === CalendarConstants.userJoin.personal) && !isHiddenAllButton && !isHiddenRemove && isCanDelete && (
                                <Button onClick={() => handleOpenConfirmAction('Delete')} variant="outline" className="border-none text-red-500 bg-transparent">
                                    <Trash2 size={16} className="mr-2" /> Xóa Lịch
                                </Button>
                            )
                        }
                        <div className="flex-1 flex justify-end gap-3">
                            <Button className="hidden md:flex" variant="outline" onClick={onClose}>
                                <X size={16} className="mr-2" /> Đóng
                            </Button>
                            {
                                Object.values(actions).map((action, index) => (
                                    <Fragment key={`action-${index}`}>
                                        {action.condition && action.render}
                                    </Fragment>
                                ))
                            }
                        </div>
                    </div>
                }
            >
                <div id="event-detail">
                    {/* Tên cuộc họp */}
                    <FormGroup>
                        <label className="text-sm font-bold text-gray-700">Tên Lịch</label>
                        <p className="text-gray-600">{item?.name}</p>
                    </FormGroup>
                    {/* Phân loại */}
                    <FormGroup>
                        <label className="text-sm font-bold text-gray-700">Phân Loại</label>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 bg-${convertType({ type: item?.type }).color}-500 rounded-full`}></div>
                            <span className="text-gray-600">{convertType({ type: item?.type }).text}</span>
                        </div>
                    </FormGroup>
                    {/* Nội dung */}
                    <FormGroup>
                        <ExpandableContent colorLabel="text-gray-700" id="modal-event-detail" label="Mô tả lịch" content={item?.description} isCol={true}>
                            {/* {item?.description} */}
                        </ExpandableContent>
                    </FormGroup>
                    {/* Người tạo */}
                    <FormGroup>
                        <label className="text-sm font-bold text-gray-700">Người tạo</label>
                        <div className="flex items-center mt-2 gap-2">
                            {avatarFile && (
                                <AvatarWithFrame size={40} avatarPath={avatarFile} DepartmentFrames={[]} PersonalFrames={[]} />
                            )}
                            <div className="text-md">
                                <p className="font-semibold">{createdBy?.fullName}</p>
                                <p className="text-gray-500">{roleByUser}</p>
                            </div>
                        </div>
                    </FormGroup>
                    {/* Thời gian */}
                    <FormGroup>
                        <label className="text-sm font-bold text-gray-700">Thời gian tham gia</label>
                        <div className="md:flex gap-2 items-center text-gray-700">
                            <p className="space-x-1 text-gray-600">
                                <span className="font-semibold">Bắt đầu:</span>
                                <span>{titleDate(item?.fromTime)}</span>
                            </p>
                            <p className="space-x-1 text-gray-600">
                                <span className="font-semibold">Kết thúc:</span>
                                <span>{titleDate(item?.toTime)}</span>
                            </p>
                        </div>
                    </FormGroup>
                    {
                        item.isCanceled && (
                            <FormGroup>
                                <ConfirmationBanner
                                    message={
                                        <p className="text-sm font-semibold">Lịch đã bị hủy</p>
                                    }
                                    variant="error"
                                    refuseContent={`(Lý do hủy: ${item.cancelReason})`}
                                    isHiddenEdit={isHiddenEdit}
                                    changeText="Hoàn tác"
                                    onChangeClick={!isUndoCancel ? null : () => handleOpenConfirmAction('Undo')}
                                />
                            </FormGroup>
                        )
                    }
                </div>
            </Modal>
            {
                selectFile && (
                    <PreviewFileModal
                        file={selectFile}
                        onClose={onClosePreview}
                    />
                )
            }
            {
                showConfirmModal && (
                    <ConfirmEventModal
                        isOpen={showConfirmModal}
                        errorCheck={errorCheck}
                        handleConfirm={handleConfirm}
                        handleTypeAccept={handleTypeAccept}
                        onClose={handleIsConfirm}
                        refuseReason={refuseReason}
                        setRefuseReason={setRefuseReason}
                        typeAcceptOfUser={typeAcceptOfUser}
                        refuseContentOriginal={refuseContentJoin}
                        typeAcceptOriginal={typeAccept}
                    />
                )
            }
            {
                isOpenForm && (
                    <CalendarForm
                        isOpen={isOpenForm}
                        onClose={() => setIsOpenForm(false)}
                        view={view}
                        update={true}
                        id={info.id}
                        calendarData={{
                            calendarFiles,
                            departmentsJoin,
                            item,
                            usersJoin
                        }}
                        onDataEventDetail={getEventDetail}
                        version={version}
                    />
                )
            }
            {
                isOpenConfirmAction && (
                    <ActionConfirmModal
                        isOpen={isOpenConfirmAction}
                        onClose={() => {
                            setIsOpenConfirmAction(false);
                            setErrorCheck(false);
                            setRefuseReason("");
                        }}
                        errorCheck={errorCheck}
                        reason={reasonCancel}
                        setReason={setRefuseCancel}
                        onSubmit={handleSubmitConfirmAction}
                        type={actionSelected}
                        contents={messageConfirm.message}
                        title={messageConfirm.title}
                    />
                )
            }
        </>
    )
}