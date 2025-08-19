import QRCode from 'qrcode'
import { Student } from '@/types'
import { getStudents, saveStudents } from './storage-local'

const QR_STORAGE_KEY = 'qr-system-qrcodes'

// 서버사이드용 메모리 저장소
let serverQRMemoryData: Record<string, string> = {}

/**
 * QR 코드 데이터를 읽어옵니다 (localStorage 또는 서버 메모리).
 * @returns Record<string, string> 학생 ID를 키로 하는 QR 코드 Base64 데이터
 */
function getQRStorage(): Record<string, string> {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 메모리 저장소 사용
    return serverQRMemoryData
  }
  
  try {
    const data = localStorage.getItem(QR_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error reading QR storage:', error)
    return {}
  }
}

/**
 * QR 코드 데이터를 저장합니다 (localStorage 또는 서버 메모리).
 * @param qrData - QR 코드 데이터
 */
function setQRStorage(qrData: Record<string, string>): void {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 메모리 저장소에 저장
    serverQRMemoryData = { ...qrData }
    return
  }
  
  try {
    localStorage.setItem(QR_STORAGE_KEY, JSON.stringify(qrData))
  } catch (error) {
    console.error('Error saving QR storage:', error)
  }
}

/**
 * 학생 ID를 바탕으로 QR 코드 파일명을 생성합니다.
 * @param studentId - 학생 ID
 * @returns string QR 코드 파일명
 */
export function getQRFileName(studentId: string): string {
  return `qr-${studentId}.png`
}

/**
 * 학생 ID를 바탕으로 학생 페이지 URL을 생성합니다.
 * @param studentId - 학생 ID
 * @returns string 학생 페이지의 전체 URL
 */
export function getStudentPageUrl(studentId: string): string {
  // VERCEL_URL은 서버사이드에서만 사용 가능
  // 클라이언트에서는 window.location 사용
  let baseUrl: string
  
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드
    baseUrl = `${window.location.protocol}//${window.location.host}`
  } else {
    // 서버 사이드 
    baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
  }

  console.log("baseUrl::: " , baseUrl )
  console.log("VERCEL_URL::: " , process.env.VERCEL_URL )
  console.log("full url::: " , `${baseUrl}/student/${studentId}` )
  return `${baseUrl}/student/${studentId}`
}

/**
 * 학생 정보를 바탕으로 QR 코드를 생성하고 저장합니다.
 * @param student - QR 코드를 생성할 학생 정보
 * @returns Promise<string> QR 코드의 data URL
 * @throws Error QR 코드 생성에 실패할 경우
 */
export async function generateQRCode(student: Student): Promise<string> {
  const studentPageUrl = getStudentPageUrl(student.id)
  
  try {
    // QR 코드 생성 옵션
    const qrOptions = {
      errorCorrectionLevel: 'M' as const,
      type: 'image/png' as const,
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    }
    
    // QR 코드를 Base64 데이터 URL로 생성
    const qrDataUrl = await QRCode.toDataURL(studentPageUrl, qrOptions)
    
    // localStorage에 QR 코드 저장
    const qrStorage = getQRStorage()
    qrStorage[student.id] = qrDataUrl
    setQRStorage(qrStorage)
    
    // 학생 데이터에 QR 코드 경로 업데이트
    const students = getStudents()
    const studentIndex = students.findIndex(s => s.id === student.id)
    
    if (studentIndex !== -1) {
      students[studentIndex].qrCodePath = qrDataUrl
      saveStudents(students)
    }
    
    return qrDataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('QR 코드 생성에 실패했습니다.')
  }
}

/**
 * 학생 ID에 해당하는 QR 코드를 삭제합니다.
 * @param studentId - 삭제할 QR 코드의 학생 ID
 */
export function deleteQRCode(studentId: string): void {
  const qrStorage = getQRStorage()
  
  if (qrStorage[studentId]) {
    delete qrStorage[studentId]
    setQRStorage(qrStorage)
  }
}

/**
 * 학생 ID에 해당하는 QR 코드를 Buffer로 변환합니다.
 * @param studentId - 읽을 QR 코드의 학생 ID
 * @returns Buffer | null QR 코드의 Buffer 또는 null
 */
export function getQRCodeBuffer(studentId: string): Buffer | null {
  const qrStorage = getQRStorage()
  const qrDataUrl = qrStorage[studentId]
  
  if (!qrDataUrl) {
    return null
  }
  
  try {
    // data:image/png;base64, 부분 제거하고 Buffer로 변환
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '')
    return Buffer.from(base64Data, 'base64')
  } catch (error) {
    console.error('Error converting QR data to buffer:', error)
    return null
  }
}

/**
 * 모든 학생의 QR 코드를 재생성합니다.
 * @returns Promise<void>
 */
export async function regenerateAllQRCodes(): Promise<void> {
  const students = getStudents()
  
  for (const student of students) {
    try {
      await generateQRCode(student)
      console.log(`QR code regenerated for student: ${student.name}`)
    } catch {
      console.error(`Failed to regenerate QR for ${student.name}`)
    }
  }
}