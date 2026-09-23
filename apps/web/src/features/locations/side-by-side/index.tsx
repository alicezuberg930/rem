import { memo, useCallback, useState, type CSSProperties } from 'react'
import Map, { type ViewStateChangeEvent } from 'react-map-gl/mapbox'
import type { MapBoxProps } from '@/components/map'
import ControlPanel, { type ModeProps } from './ControlPanel'

function MapSideBySide({ ...other }: MapBoxProps) {
  const [viewState, setViewState] = useState({
    longitude: -122.43,
    latitude: 37.78,
    zoom: 12,
    pitch: 30,
  })

  const [mode, setMode] = useState<ModeProps>('side-by-side')

  const [activeMap, setActiveMap] = useState<'left' | 'right'>('left')

  const onLeftMoveStart = useCallback(() => setActiveMap('left'), [])

  const onRightMoveStart = useCallback(() => setActiveMap('right'), [])

  const onMove = useCallback(
    (event: ViewStateChangeEvent) => setViewState(event.viewState),
    []
  )

  const leftMapStyle: CSSProperties =
    mode === 'side-by-side'
      ? { position: 'absolute', width: '50%', height: '100%' }
      : { position: 'absolute', width: '100%', height: '50%' }

  const rightMapStyle: CSSProperties =
    mode === 'side-by-side'
      ? { position: 'absolute', left: '50%', width: '50%', height: '100%' }
      : { position: 'absolute', top: '50%', width: '100%', height: '50%' }

  const handleChangeMode = (newMode: ModeProps) => setMode(newMode)

  return (
    <>
      <Map
        id='left-map'
        {...viewState}
        onMoveStart={onLeftMoveStart}
        onMove={(event) => {
          if (activeMap === 'left') {
            onMove(event)
          }
        }}
        style={leftMapStyle}
        mapStyle='mapbox://styles/mapbox/light-v10'
        {...other}
      />

      <Map
        id='right-map'
        {...viewState}
        onMoveStart={onRightMoveStart}
        onMove={(event) => {
          if (activeMap === 'right') {
            onMove(event)
          }
        }}
        style={rightMapStyle}
        mapStyle='mapbox://styles/mapbox/dark-v10'
        {...other}
      />

      <ControlPanel mode={mode} onModeChange={handleChangeMode} />
    </>
  )
}

export default memo(MapSideBySide)
