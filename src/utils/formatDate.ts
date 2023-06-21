export default function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }
  const datetime = new Date(date)
  return datetime.toLocaleString('vi-VN', options)
}
