export enum StayBookingStatus {
  PENDING = "pending", // در انتظار تایید
  CONFIRMED = "confirmed", // تایید شده
  CANCELLED = "cancelled", // لغو شده
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID",
}
