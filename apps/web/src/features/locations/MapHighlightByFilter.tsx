import { useState, useCallback, useMemo, memo } from 'react'
import Map, {
  Layer,
  type LayerProps,
  type MapMouseEvent,
  Source,
} from 'react-map-gl/mapbox'
import { Typography } from '@/components/ui/typography'
// components
import { MapPopup, MapControl, MapBoxProps } from '@/components/map'

function MapHighlightByFilter({ ...other }: MapBoxProps) {
  const countiesLayer: LayerProps = {
    id: 'counties',
    type: 'fill',
    'source-layer': 'original',
    paint: {
      'fill-outline-color': 'var(--background)',
      'fill-color': 'var(--background)',
      'fill-opacity': 0.1,
    },
  }

  const highlightLayer: LayerProps = {
    id: 'counties-highlighted',
    type: 'fill',
    source: 'counties',
    'source-layer': 'original',
    paint: {
      'fill-outline-color': 'var(--destructive)',
      'fill-color': 'var(--destructive)',
      'fill-opacity': 0.48,
    },
  }

  const [hoverInfo, setHoverInfo] = useState<{
    countyName: string
    longitude: number
    latitude: number
  } | null>(null)

  const onHover = useCallback((event: MapMouseEvent) => {
    const county = event.features?.[0] as
      | { properties?: { COUNTY?: string } }
      | undefined

    setHoverInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      countyName: county?.properties?.COUNTY || '',
    })
  }, [])

  const selectedCounty = (hoverInfo && hoverInfo.countyName) || ''

  const filter = useMemo(
    () => ['in', 'COUNTY', selectedCounty],
    [selectedCounty]
  )

  return (
    <Map
      initialViewState={{
        latitude: 38.88,
        longitude: -98,
        zoom: 3,
      }}
      minZoom={2}
      onMouseMove={onHover}
      interactiveLayerIds={['counties']}
      {...other}
    >
      <MapControl />

      <Source type='vector' url='mapbox://mapbox.82pkq93d'>
        <Layer beforeId='waterway-label' {...countiesLayer} />
        <Layer beforeId='waterway-label' {...highlightLayer} filter={filter} />
      </Source>

      {selectedCounty && hoverInfo && (
        <MapPopup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          closeButton={false}
        >
          <Typography variant='p'>{selectedCounty}</Typography>
        </MapPopup>
      )}
    </Map>
  )
}

export default memo(MapHighlightByFilter)
