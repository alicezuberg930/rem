import {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/mapbox'

type Props = {
  hideScaleControl?: boolean
  hideGeolocateControl?: boolean
  hideFullscreenControl?: boolean
  hideNavigationControl?: boolean
}

export default function MapControl({
  hideScaleControl,
  hideGeolocateControl,
  hideFullscreenControl,
  hideNavigationControl,
}: Props) {
  return (
    <>
      {!hideGeolocateControl && (
        <GeolocateControl
          position='top-left'
          positionOptions={{ enableHighAccuracy: true }}
        />
      )}

      {!hideFullscreenControl && <FullscreenControl position='top-left' />}

      {!hideScaleControl && <ScaleControl position='bottom-left' />}

      {!hideNavigationControl && <NavigationControl position='bottom-left' />}
    </>
  )
}
