export type ShippingOrder = {
    orderCode: string
    recipientName: string
    recipientPhone: string
    recipientAddress: string
    itemName: string
    quantity: number | null
    weight: number | null
    itemValue: number | null
    codAmount: number | null
    itemType: string
    specialCharacteristics: string
    service: string
    additionalServices: string
    collectOnInspection: string
    length: number | null
    width: number | null
    height: number | null
    shippingFeePayer: string
    otherRequests: string
    pickupAppointment: string
    deliveryTime: string
}
