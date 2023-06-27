const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const monthsValues = [
  {
    value: 1,
    label: 'January',
  },
  {
    value: 2,
    label: 'February',
  },
  {
    value: 3,
    label: 'March',
  },
  {
    value: 4,
    label: 'April',
  },
  {
    value: 5,
    label: 'May',
  },
  {
    value: 6,
    label: 'June',
  },
  {
    value: 7,
    label: 'July',
  },
  {
    value: 8,
    label: 'August',
  },
  {
    value: 9,
    label: 'September',
  },
  {
    value: 10,
    label: 'October',
  },
  {
    value: 11,

    label: 'November',
  },
  {
    value: 12,
    label: 'December',
  },
]

const months = (config: any) => {
  const cfg = config || {}
  const count = cfg.count || 12
  const section = cfg.section
  const values = []
  let i, value

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12]
    values.push(value.substring(0, section))
  }

  return values
}

export default months
