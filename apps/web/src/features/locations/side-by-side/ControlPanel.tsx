import { memo } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
// components
import { ControlPanel } from '@/components/map'

export type ModeProps = 'side-by-side' | 'split-screen'

type Props = {
  mode: ModeProps
  onModeChange: (newMode: ModeProps) => void
}

function ControlPanel({ mode, onModeChange }: Props) {
  return (
    <ControlPanel>
      <ToggleGroup
        variant='outline'
        size='sm'
        spacing={0}
        value={[mode]}
        className='w-full'
        onValueChange={(value) => {
          const nextMode = value[0] as ModeProps | undefined

          if (nextMode) {
            onModeChange(nextMode)
          }
        }}
      >
        <ToggleGroupItem
          value='side-by-side'
          aria-label='Side by side'
          className='flex-1'
        >
          Side by side
        </ToggleGroupItem>
        <ToggleGroupItem
          value='split-screen'
          aria-label='Split screen'
          className='flex-1'
        >
          Split screen
        </ToggleGroupItem>
      </ToggleGroup>
    </ControlPanel>
  )
}

export default memo(ControlPanel)
