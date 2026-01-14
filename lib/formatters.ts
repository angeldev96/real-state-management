// Helper functions for formatting data
export function formatPrice(price: number | null): string {
  if (price === null) return "Price TBD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatSquareFootage(sqft: number | null): string {
  if (sqft === null) return "—";
  return `${sqft.toLocaleString()} sq ft`;
}

export function getNextSendDate(weekNumber: 1 | 2 | 3, dayOfMonth: number): Date {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  let sendDate = new Date(year, month, dayOfMonth);

  // If the date has passed this month, get next month's date
  if (sendDate < now) {
    sendDate = new Date(year, month + 1, dayOfMonth);
  }

  return sendDate;
}
