import { useState, useEffect, memo } from 'react'
import Map, { Layer, LayerProps, Source } from 'react-map-gl/mapbox'
// components
import { MapControl, MapBoxProps } from '@/components/map'

function MapGeoJSONAnimation({ ...other }: MapBoxProps) {
  const pointLayer: LayerProps = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': 'var(--primary)',
    },
  }

  const [pointData, setPointData] = useState<{
    type: string
    coordinates: number[]
  } | null>(null)

  useEffect(() => {
    const animation = window.requestAnimationFrame(() =>
      setPointData(
        pointOnCircle({
          center: [-100, 0],
          angle: Date.now() / 1000,
          radius: 20,
        })
      )
    )

    return () => window.cancelAnimationFrame(animation)
  })

  return (
    <Map
      initialViewState={{
        latitude: 0,
        longitude: -100,
        zoom: 3,
      }}
      mapStyle='mapbox://styles/mapbox/satellite-streets-v11'
      {...other}
    >
      <MapControl />

      {pointData && (
        <Source type='geojson' data={pointData}>
          <Layer {...pointLayer} />
        </Source>
      )}
    </Map>
  )
}

export default memo(MapGeoJSONAnimation)

function pointOnCircle({
  center,
  angle,
  radius,
}: {
  center: [number, number]
  angle: number
  radius: number
}) {
  return {
    type: 'Point',
    coordinates: [
      center[0] + Math.cos(angle) * radius,
      center[1] + Math.sin(angle) * radius,
    ],
  }
}
