import { memo, useCallback, useRef, useState } from 'react'
import Map, { type MapRef } from 'react-map-gl/mapbox'
// components
import { MapBoxProps, MapControl } from '@/components/map'
//
import ControlPanel, { CityProps } from './ControlPanel'

// ----------------------------------------------------------------------

interface Props extends MapBoxProps {
  data: CityProps[]
}

function MapViewportAnimation({ data, ...other }: Props) {
  const mapRef = useRef<MapRef>(null)

  const [selectedCity, setSelectedCity] = useState(data[2].city)

  const onSelectCity = useCallback(
    ({ city, longitude, latitude }: CityProps) => {
      setSelectedCity(city)
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 })
    },
    []
  )

  return (
    <Map
      initialViewState={{
        latitude: 37.7751,
        longitude: -122.4193,
        zoom: 11,
        bearing: 0,
        pitch: 0,
      }}
      ref={mapRef}
      {...other}
    >
      <MapControl />

      <ControlPanel
        data={data}
        selectedCity={selectedCity}
        onSelectCity={onSelectCity}
      />
    </Map>
  )
}

export default memo(MapViewportAnimation)
