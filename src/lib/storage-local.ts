import { Student, StudentInput, StudentsData } from '@/types'

const STORAGE_KEY = 'qr-system-students'

// 서버사이드용 전역 메모리 저장소
declare global {
  var __qr_system_students: StudentsData | undefined
  var __qr_system_qr_codes: Record<string, string> | undefined
}

function getServerMemoryData(): StudentsData {
  if (!global.__qr_system_students) {
    global.__qr_system_students = {
      students: [],
      lastUpdated: new Date().toISOString()
    }
  }
  return global.__qr_system_students
}

function setServerMemoryData(data: StudentsData): void {
  global.__qr_system_students = { ...data }
}

/**
 * 데이터를 읽어옵니다 (localStorage 또는 서버 메모리).
 * @returns StudentsData 학생 데이터
 */
function getStorageData(): StudentsData {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 전역 메모리 저장소 사용
    return getServerMemoryData()
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return { students: [], lastUpdated: new Date().toISOString() }
    }
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return { students: [], lastUpdated: new Date().toISOString() }
  }
}

/**
 * 데이터를 저장합니다 (localStorage 또는 서버 메모리).
 * @param data - 저장할 학생 데이터
 */
function setStorageData(data: StudentsData): void {
  if (typeof window === 'undefined') {
    // 서버사이드에서는 메모리 저장소에 저장
    setServerMemoryData(data)
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * 모든 학생 목록을 반환합니다.
 * @returns Student[] 학생 목록 배열
 */
export function getStudents(): Student[] {
  const data = getStorageData()
  return data.students || []
}

/**
 * 학생 목록을 저장합니다.
 * @param students - 저장할 학생 목록
 */
export function saveStudents(students: Student[]): void {
  const studentsData: StudentsData = {
    students,
    lastUpdated: new Date().toISOString()
  }
  
  setStorageData(studentsData)
}

/**
 * 고유한 학생 ID를 생성합니다.
 * @returns string 타임스탬프와 랜덤 문자열을 조합한 ID
 */
export function generateStudentId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}`
}

/**
 * 새로운 학생을 추가합니다.
 * @param studentInput - 추가할 학생 정보
 * @returns Student 추가된 학생 객체
 * @throws Error 중복된 이메일이 있을 경우
 */
export function addStudent(studentInput: StudentInput): Student {
  const students = getStudents()
  
  // 이메일 중복 체크
  const existingStudent = students.find(s => s.email === studentInput.email)
  if (existingStudent) {
    throw new Error(`이메일 ${studentInput.email}이(가) 이미 존재합니다.`)
  }
  
  const newStudent: Student = {
    id: generateStudentId(),
    name: studentInput.name,
    email: studentInput.email,
    createdAt: new Date().toISOString(),
  }
  
  students.push(newStudent)
  saveStudents(students)
  
  return newStudent
}

/**
 * ID로 학생을 찾습니다.
 * @param id - 찾을 학생의 ID
 * @returns Student | null 찾은 학생 객체 또는 null
 */
export function getStudentById(id: string): Student | null {
  const students = getStudents()
  return students.find(student => student.id === id) || null
}

/**
 * 학생의 마지막 접속 시간을 업데이트합니다.
 * @param id - 업데이트할 학생의 ID
 * @returns Student | null 업데이트된 학생 객체 또는 null
 */
export function updateStudentAccess(id: string): Student | null {
  const students = getStudents()
  const studentIndex = students.findIndex(s => s.id === id)
  
  if (studentIndex === -1) {
    return null
  }
  
  students[studentIndex].lastAccessAt = new Date().toISOString()
  saveStudents(students)
  
  return students[studentIndex]
}

/**
 * 학생을 삭제합니다.
 * @param id - 삭제할 학생의 ID
 * @returns boolean 삭제 성공 여부
 */
export function deleteStudent(id: string): boolean {
  const students = getStudents()
  const filteredStudents = students.filter(student => student.id !== id)
  
  if (filteredStudents.length === students.length) {
    return false // 삭제할 학생이 없음
  }
  
  saveStudents(filteredStudents)
  return true
}