export const DIVISI_CODE = {
  'Web Development': '01',
  'UI/UX Design': '02',
  'Machine Learning': '03',
}

export const CODE_DIVISI = Object.fromEntries(
  Object.entries(DIVISI_CODE).map(([k, v]) => [v, k])
)

export function generateMemberID(tahunMasuk, divisi, nomorUrut) {
  const tahun = String(tahunMasuk).slice(-2)
  const kodDiv = DIVISI_CODE[divisi] || '99'
  const urut = String(nomorUrut).padStart(3, '0') // Strictly 3 digits
  return `ISC${tahun}${kodDiv}${urut}`
}

export function isMemberIDValid(id) {
  return /^ISC\d{2}(01|02|03)\d{3}$/.test(id) // Strictly 3 digits at the end
}

export function parseMemberID(id) {
  if (!isMemberIDValid(id)) return null
  return {
    prefix: id.slice(0, 3),
    tahun: '20' + id.slice(3, 5),
    divisiCode: id.slice(5, 7),
    divisi: CODE_DIVISI[id.slice(5, 7)],
    nomorUrut: parseInt(id.slice(7), 10)
  }
}

export function isBarcodeExpired(barcodeExpiresAt) {
  if (!barcodeExpiresAt) return true
  return new Date(barcodeExpiresAt) < new Date()
}

export function getSemesterExpiryDate() {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  if (month >= 2 && month <= 7) return new Date(year, 6, 31)
  if (month >= 8) return new Date(year + 1, 0, 31)
  return new Date(year, 0, 31)
}

export function getExpiryLabel(barcodeExpiresAt) {
  if (!barcodeExpiresAt) return 'Belum aktif'
  const exp = new Date(barcodeExpiresAt)
  return `Berlaku s/d ${exp.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })}`
}
