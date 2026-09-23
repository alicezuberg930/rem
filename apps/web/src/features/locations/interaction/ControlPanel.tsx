import { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  StyledControlPanel,
  type MapSettingKeys,
  type MapSettings,
} from '@/components/map'

const camelPattern = /(^|[A-Z])[a-z]*/g

function formatSettingName(name: string) {
  return name.match(camelPattern)?.join(' ')
}

type Props = {
  settings: MapSettings
  onChange: (name: MapSettingKeys, value: boolean | number) => void
}

function ControlPanel({ settings, onChange }: Props) {
  const renderSetting = (name: MapSettingKeys, value: boolean | number) => {
    switch (typeof value) {
      case 'boolean':
        return (
          <div
            key={name}
            className='flex items-center justify-between capitalize'
          >
            <span className='text-xs'>{formatSettingName(name)}</span>
            <Switch
              checked={value}
              onCheckedChange={(v) => onChange(name, v)}
            />
          </div>
        )
      case 'number':
        return (
          <div
            key={name}
            className='flex items-center justify-between capitalize'
          >
            <span className='text-xs'>{formatSettingName(name)}</span>
            <Input
              type='number'
              value={value}
              className='h-8 w-20 text-right tabular-nums'
              onChange={(event) => onChange(name, Number(event.target.value))}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <StyledControlPanel className='sm:min-w-[260px]'>
      <p className='text-sm font-medium'>Map interaction</p>
      {Object.keys(settings).map((name) =>
        renderSetting(name as MapSettingKeys, settings[name as MapSettingKeys])
      )}
    </StyledControlPanel>
  )
}

export default memo(ControlPanel)
