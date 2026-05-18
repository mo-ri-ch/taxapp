export function toNum(val) {
  if (val === '' || val === null || val === undefined) return 0
  const num = Number(val)
  return isNaN(num) ? 0 : num
}

export function fmtNum(num) {
  const n = toNum(num)
  if (!n) return '0'
  return Math.round(n).toLocaleString('en-IN')
}

export function fmt(num) {
  return `₹${fmtNum(num)}`
}

export function calc80CTotal(data) {
  const items = data?.has80CItems || []
  const values = data?.investments80C || {}
  let total = 0
  for (const key of items) {
    total += toNum(values[key])
  }
  return total
}
