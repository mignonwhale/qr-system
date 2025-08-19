'use client'

import {useEffect, useState} from 'react'
import StudentForm from '@/components/StudentForm'
import StudentList from '@/components/StudentList'
import {ApiResponse, Student, StudentFormData} from '@/types'

/**
 * QR 시스템 관리자 페이지 컴포넌트
 * 학생 추가, 목록 관리, QR 코드 다운로드 기능을 제공합니다.
 * @returns JSX.Element
 */
export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
  })

  useEffect(() => {
    fetchStudents()
  }, [])

  /**
   * 서버에서 학생 목록을 가져옵니다.
   */
  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/students')
      const result: ApiResponse<Student[]> = await response.json()

      if (result.success && result.data) {
        setStudents(result.data)
      } else {
        setError(result.error || '학생 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setError('학생 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 새로운 학생을 추가합니다.
   * @param formData - 추가할 학생 정보
   */
  const handleAddStudent = async (formData: StudentFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result: ApiResponse<Student> = await response.json()

      if (result.success && result.data) {
        setStudents(prev => [...prev, result.data!])
        setSuccess('학생이 성공적으로 추가되었습니다!')
        
        // 성공 메시지 자동 제거
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || '학생 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error adding student:', error)
      setError('학생 추가에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 학생을 삭제합니다.
   * @param id - 삭제할 학생 ID
   */
  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('정말로 이 학생을 삭제하시겠습니까?')) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      })

      const result: ApiResponse = await response.json()

      if (result.success) {
        setStudents(prev => prev.filter(student => student.id !== id))
        setSuccess('학생이 성공적으로 삭제되었습니다!')
        
        // 성공 메시지 자동 제거
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || '학생 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      setError('학생 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * QR 코드를 다운로드합니다.
   * @param student - QR 코드를 다운로드할 학생 정보
   */
  const handleDownloadQR = async (student: Student) => {
    try {
      const response = await fetch(`/api/qr/${student.id}`)
      
      if (!response.ok) {
        throw new Error('QR 코드 다운로드에 실패했습니다.')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `QR_${student.name}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setSuccess('QR 코드가 다운로드되었습니다!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error downloading QR:', error)
      setError('QR 코드 다운로드에 실패했습니다.')
    }
  }

  return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-slate-800">QR 시스템 관리</h1>
              <p className="text-slate-600">학생들의 출석과 QR 코드를 효율적으로 관리하세요</p>
            </div>

          {/* 알림 메시지 */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-red-800">
                  <strong>오류:</strong> {error}
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-green-800">
                  <strong>성공:</strong> {success}
                </div>
                <button
                  onClick={() => setSuccess(null)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* 메인 컨텐츠 */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* 학생 추가 폼 - 왼쪽 */}
            <div className="lg:col-span-1">
              <StudentForm
                onSubmit={handleAddStudent}
                isLoading={isLoading}
              />
            </div>

            {/* 학생 목록 - 오른쪽 */}
            <div className="lg:col-span-3">
              <StudentList
                students={students}
                onDelete={handleDeleteStudent}
                onDownloadQR={handleDownloadQR}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
  );
}