import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookings } from './bookings-provider'

export function BookingsPrimaryButtons() {
  const { setOpen } = useBookings()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add booking</span>
        <BookOpen size={18} />
      </Button>
    </div>
  )
}
