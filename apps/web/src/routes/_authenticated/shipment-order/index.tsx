import { createFileRoute } from '@tanstack/react-router'
import { ShipmentOrder } from '@/features/shipment-order'

export const Route = createFileRoute('/_authenticated/shipment-order/')({
  component: ShipmentOrder,
})
