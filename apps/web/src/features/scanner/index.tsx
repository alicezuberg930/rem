import { useEffect, useState } from "react"
import { Scanner as ScannerCamera } from "@/lib/scanner"
import { Header } from "@/layout/header"
import { Search } from "@/components/search"
import { ClockInButton } from "@/layout/clock-in-button"
import { ThemeSwitch } from "@/components/theme-switch"
import { ConfigDrawer } from "@/components/config-drawer"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { Main } from "@/layout/main"
import { toast } from "@/components/ui/toast"

export function ScannerFeature() {
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined)
    const [running, setRunning] = useState(false)

    useEffect(() => {
        const update = async () => {
            try {
                const list = await navigator.mediaDevices.enumerateDevices()
                console.log(list)
                const videoInputs = list.filter((d) => d.kind === "videoinput")
                setDevices(videoInputs)
                if (!deviceId && videoInputs.length > 0) setDeviceId(videoInputs[0].deviceId)
            } catch (e) {
                // ignore
            }
        }
        update()
        navigator.mediaDevices.addEventListener("devicechange", update)
        return () => navigator.mediaDevices.removeEventListener("devicechange", update)
    }, [deviceId])

    return (
        <>
            <Header fixed>
                <Search />
                <ClockInButton />
                <div className='ms-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ConfigDrawer />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                <div className='flex flex-wrap items-end justify-between gap-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Scanner</h2>
                        <p className='text-muted-foreground'>
                            Demo scanner using BarcodeDetector with JS fallbacks.
                        </p>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <select
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            className='rounded border px-2 py-1'
                        >
                            {devices.map((d) => (
                                <option key={d.deviceId} value={d.deviceId}>{d.label || d.deviceId}</option>
                            ))}
                        </select>
                        <button className='rounded border px-3 py-1' onClick={() => setRunning((r) => !r)}>
                            {running ? 'Stop' : 'Start'}
                        </button>
                    </div>
                </div>

                <div className='flex gap-4'>
                    <div className='w-full max-w-2xl'>
                        <div className='aspect-video w-full overflow-hidden rounded-md bg-black'>
                            {running ? (
                                <ScannerCamera
                                    deviceId={deviceId}
                                    onScan={(r) => toast.message(`Scanned: ${r.content} (${r.format ?? 'unknown'})`)}
                                    onError={(e) => toast.error(e.message)}
                                    fps={10}
                                />
                            ) : (
                                <div className='flex h-full w-full items-center justify-center text-white'>
                                    <span>Scanner stopped</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Main>
        </>
    )
}

export const Scanner = ScannerFeature