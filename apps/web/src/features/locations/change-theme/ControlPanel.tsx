import { memo } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { StyledControlPanel } from '@/components/map'

type Props = {
  themes: {
    [key: string]: string
  }
  selectTheme: string
  onChangeTheme: (theme: string) => void
}

function ControlPanel({ themes, selectTheme, onChangeTheme }: Props) {
  return (
    <StyledControlPanel>
      <p className='text-sm font-medium'>Map style</p>
      <RadioGroup
        value={selectTheme}
        onValueChange={(v) => onChangeTheme(v)}
        className='w-full gap-2'
      >
        {Object.keys(themes).map((item) => (
          <div key={item} className='flex items-center gap-2.5'>
            <RadioGroupItem value={item} id={`map-theme-${item}`} />
            <Label
              className='cursor-pointer text-sm capitalize'
              htmlFor={`map-theme-${item}`}
            >
              {item.replace(/([A-Z])/g, ' $1')}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </StyledControlPanel>
  )
}

export default memo(ControlPanel)
