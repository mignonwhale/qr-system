import fs from 'fs/promises'
import path from 'path'
import { Student, StudentInput, StudentsData } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'students.json')

/**
 * 데이터 파일이 존재하는지 확인하고, 없으면 초기 파일을 생성합니다.
 * @returns Promise<void>
 */
export async function ensureDataFile(): Promise<void> {
  try {
    await fs.access(DATA_FILE)
  } catch {
    const dataDir = path.dirname(DATA_FILE)
    await fs.mkdir(dataDir, { recursive: true })
    
    const initialData: StudentsData = {
      students: [],
      lastUpdated: new Date().toISOString()
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2))
  }
}

/**
 * 모든 학생 목록을 반환합니다.
 * @returns Promise<Student[]> 학생 목록 배열
 */
export async function getStudents(): Promise<Student[]> {
  await ensureDataFile()
  
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    const studentsData: StudentsData = JSON.parse(data)
    return studentsData.students || []
  } catch (error) {
    console.error('Error reading students data:', error)
    return []
  }
}

/**
 * 학생 목록을 파일에 저장합니다.
 * @param students - 저장할 학생 목록
 * @returns Promise<void>
 */
export async function saveStudents(students: Student[]): Promise<void> {
  await ensureDataFile()
  
  const studentsData: StudentsData = {
    students,
    lastUpdated: new Date().toISOString()
  }
  
  await fs.writeFile(DATA_FILE, JSON.stringify(studentsData, null, 2))
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
 * @returns Promise<Student> 추가된 학생 객체
 * @throws Error 중복된 학번이 있을 경우
 */
export async function addStudent(studentInput: StudentInput): Promise<Student> {
  const students = await getStudents()
  
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
  await saveStudents(students)
  
  return newStudent
}

/**
 * ID로 학생을 찾습니다.
 * @param id - 찾을 학생의 ID
 * @returns Promise<Student | null> 찾은 학생 객체 또는 null
 */
export async function getStudentById(id: string): Promise<Student | null> {
  const students = await getStudents()
  return students.find(student => student.id === id) || null
}

/**
 * 학생의 마지막 접속 시간을 업데이트합니다.
 * @param id - 업데이트할 학생의 ID
 * @returns Promise<Student | null> 업데이트된 학생 객체 또는 null
 */
export async function updateStudentAccess(id: string): Promise<Student | null> {
  const students = await getStudents()
  const studentIndex = students.findIndex(s => s.id === id)
  
  if (studentIndex === -1) {
    return null
  }
  
  students[studentIndex].lastAccessAt = new Date().toISOString()
  await saveStudents(students)
  
  return students[studentIndex]
}

/**
 * 학생을 삭제합니다.
 * @param id - 삭제할 학생의 ID
 * @returns Promise<boolean> 삭제 성공 여부
 */
export async function deleteStudent(id: string): Promise<boolean> {
  const students = await getStudents()
  const filteredStudents = students.filter(student => student.id !== id)
  
  if (filteredStudents.length === students.length) {
    return false // 삭제할 학생이 없음
  }
  
  await saveStudents(filteredStudents)
  return true
}