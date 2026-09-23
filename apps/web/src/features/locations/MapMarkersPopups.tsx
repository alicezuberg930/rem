import { useState, memo } from 'react'
import Map from 'react-map-gl/mapbox'
import { Typography } from '@/components/ui/typography'
// components
import { LazyLoadImage } from '@/components/lazy-load-image'
import { MapPopup, MapMarker, MapControl, MapBoxProps } from '@/components/map'

type CountryProps = {
  name: string
  photo: string
  capital: string
  latlng: number[]
  timezones: string[]
  country_code: string
}

interface Props extends MapBoxProps {
  data: CountryProps[]
}

function MapMarkersPopups({ data, ...other }: Props) {
  const [popupInfo, setPopupInfo] = useState<CountryProps | null>(null)

  return (
    <Map
      initialViewState={{
        zoom: 2,
      }}
      {...other}
    >
      <MapControl />

      {data.map((city, index) => (
        <MapMarker
          key={`marker-${index}`}
          latitude={city.latlng[0]}
          longitude={city.latlng[1]}
          onClick={(event) => {
            event.originalEvent.stopPropagation()
            setPopupInfo(city)
          }}
        />
      ))}

      {popupInfo && (
        <MapPopup
          latitude={popupInfo.latlng[0]}
          longitude={popupInfo.latlng[1]}
          onClose={() => setPopupInfo(null)}
        >
          <div>
            <div className='mb-1 flex items-center'>
              <div
                className='mr-2 h-4 min-w-7 rounded-md bg-cover bg-center bg-no-repeat'
                style={{
                  backgroundImage: `url(https://cdn.staticaly.com/gh/hjnilsson/country-flags/master/svg/${popupInfo.country_code.toLowerCase()}.svg)`,
                }}
              />
              <Typography variant='p'>{popupInfo.name}</Typography>
            </div>

            <Typography component='div' variant='caption'>
              Timezones: {popupInfo.timezones}
            </Typography>

            <Typography component='div' variant='caption'>
              Lat: {popupInfo.latlng[0]}
            </Typography>

            <Typography component='div' variant='caption'>
              Long: {popupInfo.latlng[1]}
            </Typography>

            <LazyLoadImage
              alt={popupInfo.name}
              src={popupInfo.photo}
              className='mt-1 aspect-4/3 rounded-lg'
            />
          </div>
        </MapPopup>
      )}
    </Map>
  )
}

export default memo(MapMarkersPopups)
