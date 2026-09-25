import '@/styles/video-player.css'
import { useEffect, useRef, useState } from 'react'
import { formatDuration } from '@/lib/utils'
import type { VideoPlayerProps } from './types'
import { Maximize, Minimize, PauseCircle, PictureInPicture, PlayCircle, Settings, Volume1, Volume2, VolumeOff } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [volume, setVolume] = useState(50)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    // refs to prevent component re-rendering too many times
    const timelineContainer = useRef<HTMLDivElement | null>(null)
    const videoContainer = useRef<HTMLDivElement | null>(null)
    const videoPlayer = useRef<HTMLVideoElement | null>(null)
    const previewVideo = useRef<HTMLVideoElement | null>(null)
    const previewCanvas = useRef<HTMLCanvasElement | null>(null)
    const currentTime = useRef<HTMLSpanElement | null>(null)
    const isScrubbing = useRef<boolean>(false)

    const toggleVideo = () => {
        if (!videoPlayer.current) return
        if (!isPlaying) {
            videoPlayer.current.play()
            setIsPlaying(true)
        } else {
            videoPlayer.current.pause()
            setIsPlaying(false)
        }
    }

    const handleVideoKeyDown = (e: React.KeyboardEvent<HTMLVideoElement>) => {
        if (!videoPlayer.current) return
        if (e.code === 'Space') toggleVideo()
        if (e.code === 'ArrowLeft') videoPlayer.current.currentTime -= 5
        if (e.code === 'ArrowRight') videoPlayer.current.currentTime += 5
    }

    const toggleFullScreen = async () => {
        setIsFullscreen(!isFullscreen)
        if (!document.fullscreenElement) {
            if (!videoContainer.current || !videoPlayer.current) return
            await videoContainer.current.requestFullscreen()
        } else {
            await document.exitFullscreen()
        }
    }

    const togglePictureInPicture = () => {
        if (!videoPlayer.current) return
        if (document.pictureInPictureElement === videoPlayer.current) {
            document.exitPictureInPicture()
        } else {
            videoPlayer.current.requestPictureInPicture()
        }
    }

    const muteAudio = () => {
        if (!videoPlayer.current) return
        videoPlayer.current.muted = !videoPlayer.current.muted
        if (videoPlayer.current.muted) setVolume(0)
        else setVolume(50)
    }

    const changePlayBackRate = (speed: number) => {
        if (videoPlayer.current) videoPlayer.current.playbackRate = speed
        setIsSettingsOpen(false)
    }

    const updateVolumeFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const nextVolume = Math.round(((e.clientX - rect.left) / rect.width) * 100)
        setVolume(Math.min(100, Math.max(0, nextVolume)))
    }

    const handleVolumeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        e.preventDefault()
        setVolume((currentVolume) => Math.min(100, Math.max(0, currentVolume + (e.key === 'ArrowRight' ? 5 : -5))))
    }

    const toggleScrubbing = (e: MouseEvent) => {
        if (!videoPlayer.current || !timelineContainer.current) return
        const rect = timelineContainer.current.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect!.x), rect!.width) / rect.width
        isScrubbing.current = (e.buttons & 1) === 1
        timelineContainer.current.classList.toggle('scrubbing', isScrubbing.current)
        if (isScrubbing.current) {
            videoPlayer.current.pause()
            videoPlayer.current.currentTime = percent * (videoPlayer.current.duration || Infinity)
        } else {
            if (videoPlayer.current.paused) videoPlayer.current.play()
        }
        handleVideoPlaying(e)
    }

    const handleVideoPlaying = (e: MouseEvent) => {
        if (!timelineContainer.current) return
        const rect = timelineContainer.current.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
        timelineContainer.current.style.setProperty('--preview-position', percent.toString())
        if (previewVideo.current && Number.isFinite(previewVideo.current.duration)) {
            previewVideo.current.currentTime = percent * previewVideo.current.duration
        }
        if (isScrubbing.current) {
            e.preventDefault()
            timelineContainer.current.style.setProperty('--progress-position', percent.toString())
        }
    }

    const drawPreviewFrame = () => {
        if (!previewVideo.current || !previewCanvas.current) return
        const context = previewCanvas.current.getContext('2d')
        if (!context) return
        context.drawImage(
            previewVideo.current,
            0,
            0,
            previewCanvas.current.width,
            previewCanvas.current.height,
        )
    }

    const initializeVideoPlayer = (url: string) => {
        if (!videoContainer.current || !videoPlayer.current) return
        videoPlayer.current.pause()
        videoPlayer.current.currentTime = 0
        videoPlayer.current.removeAttribute('src')
        videoPlayer.current.load()
        videoPlayer.current.src = url
        videoPlayer.current.load()
    }

    useEffect(() => {
        initializeVideoPlayer(videoUrl)
    }, [videoUrl])

    useEffect(() => {
        if (!videoPlayer.current || !timelineContainer.current || !currentTime.current || !videoContainer.current) return
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === videoContainer.current)
        }
        const handleUpdateTime = () => {
            const percent = (videoPlayer.current?.currentTime || 0) / (videoPlayer.current?.duration || Infinity)
            timelineContainer.current?.style.setProperty('--progress-position', percent.toString())
            currentTime.current!.innerText = formatDuration(Math.floor(videoPlayer.current?.currentTime ?? 0))
        }
        videoPlayer.current.addEventListener('timeupdate', handleUpdateTime)
        timelineContainer.current?.addEventListener('mousemove', handleVideoPlaying)
        timelineContainer.current?.addEventListener('mousedown', toggleScrubbing)
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('mouseup', (e) => {
            if (isScrubbing.current) toggleScrubbing(e)
        })
        document.addEventListener('mousemove', (e) => {
            if (isScrubbing.current) toggleScrubbing(e)
        })
        return () => {
            videoPlayer.current?.removeEventListener('timeupdate', handleUpdateTime)
            timelineContainer.current?.removeEventListener('mousemove', handleVideoPlaying)
            timelineContainer.current?.removeEventListener('mousedown', toggleScrubbing)
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
            document.removeEventListener('mouseup', (e) => {
                if (isScrubbing.current) toggleScrubbing(e)
            })
            document.removeEventListener('mousemove', (e) => {
                if (isScrubbing.current) toggleScrubbing(e)
            })
        }
    }, [])

    useEffect(() => {
        if (!videoPlayer.current) return
        videoPlayer.current.volume = volume / 100
    }, [volume])

    return (
        <div ref={videoContainer} className='relative h-fit aspect-video w-full'>
            <video
                ref={videoPlayer}
                className='w-full h-full rounded-xl'
                onClick={toggleVideo}
                tabIndex={0}
                onKeyDown={handleVideoKeyDown}
            />
            <video
                ref={previewVideo}
                src={videoUrl}
                preload='metadata'
                muted
                className='hidden'
                onSeeked={drawPreviewFrame}
            />
            <div className='px-2 absolute bottom-0 left-0 right-0 video-controls-container'>
                <div
                    className='timeline-container h-2 rounded-full cursor-pointer flex items-center'
                    ref={timelineContainer}
                >
                    <div className='timeline'>
                        <canvas
                            ref={previewCanvas}
                            width={160}
                            height={90}
                            className='preview-img bg-black object-cover'
                            aria-hidden='true'
                        />
                        <div className='thumb-indicator'></div>
                    </div>
                </div>
                <div className='relative flex items-center text-white py-1 px-3 gap-3'>
                    {isPlaying ? (
                        <PauseCircle strokeWidth={1} size={36} onClick={toggleVideo} />
                    ) : (
                        <PlayCircle strokeWidth={1} size={36} onClick={toggleVideo} />
                    )}
                    <div className='flex items-center group gap-2'>
                        <span onClick={muteAudio}>
                            {(volume < 50 && volume > 0) && <Volume1 strokeWidth={1} size={30} />}
                            {volume >= 50 && <Volume2 strokeWidth={1} size={30} />}
                            {volume === 0 && <VolumeOff strokeWidth={1} size={30} />}
                        </span>
                        <div
                            role='slider'
                            tabIndex={0}
                            aria-label='Volume'
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={volume}
                            onKeyDown={handleVolumeKeyDown}
                            onPointerDown={(e) => {
                                e.currentTarget.setPointerCapture(e.pointerId)
                                updateVolumeFromPointer(e)
                            }}
                            onPointerMove={(e) => {
                                if (e.currentTarget.hasPointerCapture(e.pointerId)) updateVolumeFromPointer(e)
                            }}
                            className='relative h-1 w-0 origin-left scale-x-0 cursor-pointer touch-none rounded-full bg-neutral-500/50 transition-all focus-visible:h-2 focus-visible:w-24 focus-visible:scale-x-100 focus-visible:outline-none group-hover:h-2 group-hover:w-24 group-hover:scale-x-100'
                        >
                            <div
                                className='absolute inset-y-0 left-0 rounded-full bg-main-bg'
                                style={{ width: `${volume}%` }}
                            />
                            <div
                                className='absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main-bg opacity-0 transition-opacity group-hover:opacity-100'
                                style={{ left: `${volume}%` }}
                            />
                        </div>
                    </div>
                    <div className='flex gap-1 text-sm flex-1'>
                        <span ref={currentTime}>00:00</span>
                        <span>/</span>
                        <span>{formatDuration(Math.floor(videoPlayer.current?.duration ?? 0))}</span>
                    </div>
                    <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <PopoverTrigger aria-label='Playback speed' className='cursor-pointer'>
                            <Settings strokeWidth={1} size={30} />
                        </PopoverTrigger>
                        <PopoverContent side='top' align='end' className='w-40 gap-0 bg-[#ffffff4d] p-0 text-white backdrop-blur-xs overflow-hidden'>
                            {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                                <button
                                    key={speed}
                                    type='button'
                                    onClick={() => changePlayBackRate(speed)}
                                    className='flex w-full cursor-pointer items-center px-2 py-2 text-left hover:bg-[#ffffff33]'
                                >
                                    {speed === 1 ? 'Tốc độ chuẩn' : `Tốc độ x${speed}`}
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                    {/* toggle picture in picture mode */}
                    <PictureInPicture strokeWidth={1} size={30} onClick={togglePictureInPicture} />
                    {/* toggle fullscren and exit fullscreen */}
                    {isFullscreen ? (
                        <Minimize strokeWidth={1} size={30} onClick={toggleFullScreen} />
                    ) : (
                        <Maximize strokeWidth={1} size={30} onClick={toggleFullScreen} />
                    )}
                </div>
            </div>
        </div>
    )
}