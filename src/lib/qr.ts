import QRCode from 'qrcode'
import fs from 'fs/promises'
import path from 'path'
import { Student } from '@/types'
import { getStudents, saveStudents } from './storage'

const QR_DIR = path.join(process.cwd(), 'public', 'qr-codes')

/**
 * QR 코드 저장 디렉토리가 존재하는지 확인하고, 없으면 생성합니다.
 * @returns Promise<void>
 */
export async function ensureQRDirectory(): Promise<void> {
  try {
    await fs.access(QR_DIR)
  } catch {
    await fs.mkdir(QR_DIR, { recursive: true })
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
 * 학생 ID를 바탕으로 QR 코드 파일의 전체 경로를 생성합니다.
 * @param studentId - 학생 ID
 * @returns string QR 코드 파일의 절대 경로
 */
export function getQRFilePath(studentId: string): string {
  return path.join(QR_DIR, getQRFileName(studentId))
}

/**
 * 학생 ID를 바탕으로 QR 코드의 공개 URL을 생성합니다.
 * @param studentId - 학생 ID
 * @returns string QR 코드의 공개 URL
 */
export function getQRPublicUrl(studentId: string): string {
  return `/qr-codes/${getQRFileName(studentId)}`
}

/**
 * 학생 ID를 바탕으로 학생 페이지 URL을 생성합니다.
 * @param studentId - 학생 ID
 * @returns string 학생 페이지의 전체 URL
 */
export function getStudentPageUrl(studentId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/student/${studentId}`
}

/**
 * 학생 정보를 바탕으로 QR 코드를 생성하고 저장합니다.
 * @param student - QR 코드를 생성할 학생 정보
 * @returns Promise<string> QR 코드의 공개 URL
 * @throws Error QR 코드 생성에 실패할 경우
 */
export async function generateQRCode(student: Student): Promise<string> {
  await ensureQRDirectory()
  
  const studentPageUrl = getStudentPageUrl(student.id)
  const qrFilePath = getQRFilePath(student.id)
  
  try {
    // QR 코드 생성 옵션
    const qrOptions = {
      errorCorrectionLevel: 'M' as const,
      type: 'png' as const,
      quality: 0.92,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 256,
    }
    
    await QRCode.toFile(qrFilePath, studentPageUrl, qrOptions)
    
    // 학생 데이터에 QR 코드 경로 업데이트
    const students = await getStudents()
    const studentIndex = students.findIndex(s => s.id === student.id)
    
    if (studentIndex !== -1) {
      students[studentIndex].qrCodePath = getQRPublicUrl(student.id)
      await saveStudents(students)
    }
    
    return getQRPublicUrl(student.id)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('QR 코드 생성에 실패했습니다.')
  }
}

/**
 * 학생 ID에 해당하는 QR 코드 파일을 삭제합니다.
 * @param studentId - 삭제할 QR 코드의 학생 ID
 * @returns Promise<void>
 */
export async function deleteQRCode(studentId: string): Promise<void> {
  const qrFilePath = getQRFilePath(studentId)
  
  try {
    await fs.access(qrFilePath)
    await fs.unlink(qrFilePath)
  } catch {
    // 파일이 없으면 무시
    console.warn(`QR file not found: ${qrFilePath}`)
  }
}

/**
 * 학생 ID에 해당하는 QR 코드 파일을 Buffer로 읽어옵니다.
 * @param studentId - 읽을 QR 코드의 학생 ID
 * @returns Promise<Buffer | null> QR 코드 파일의 Buffer 또는 null
 */
export async function getQRCodeBuffer(studentId: string): Promise<Buffer | null> {
  const qrFilePath = getQRFilePath(studentId)
  
  try {
    const buffer = await fs.readFile(qrFilePath)
    return buffer
  } catch (error) {
    console.error('Error reading QR file:', error)
    return null
  }
}

/**
 * 모든 학생의 QR 코드를 재생성합니다.
 * @returns Promise<void>
 */
export async function regenerateAllQRCodes(): Promise<void> {
  const students = await getStudents()
  
  for (const student of students) {
    try {
      await generateQRCode(student)
      console.log(`QR code regenerated for student: ${student.name}`)
    } catch {
      console.error(`Failed to regenerate QR for ${student.name}`)
    }
  }
}