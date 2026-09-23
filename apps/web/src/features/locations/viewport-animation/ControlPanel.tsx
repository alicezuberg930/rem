import { memo } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
// components
import { StyledControlPanel } from '@/components/map'

export type CityProps = {
  city: string
  population: string
  image: string
  state: string
  latitude: number
  longitude: number
}

type Props = {
  data: CityProps[]
  selectedCity: string
  onSelectCity: (city: CityProps) => void
}

function ControlPanel({ data, selectedCity, onSelectCity }: Props) {
  return (
    <StyledControlPanel>
      <p className='text-sm font-medium'>Texas cities</p>
      <RadioGroup
        value={selectedCity}
        className='w-full gap-2'
        onValueChange={(cityName) => {
          const city = data.find((item) => item.city === cityName)
          if (city) {
            onSelectCity(city)
          }
        }}
      >
        {data.map((city) => {
          const id = `city-${city.city.toLowerCase().replace(/\s+/g, '-')}`

          return (
            <div key={city.city} className='flex items-center gap-2.5'>
              <RadioGroupItem value={city.city} id={id} />
              <Label className='cursor-pointer text-sm' htmlFor={id}>
                {city.city}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </StyledControlPanel>
  )
}

export default memo(ControlPanel)
