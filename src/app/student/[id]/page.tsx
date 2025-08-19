'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Student, ApiResponse } from '@/types'

/**
 * 학생별 QR 코드 접속 페이지 컴포넌트
 * QR 코드를 통해 접속한 학생의 정보를 표시하고 접속 시간을 업데이트합니다.
 * @returns JSX.Element
 */
export default function StudentPage() {
  const params = useParams()
  const studentId = params.id as string
  
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // 현재 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!studentId) return

    fetchStudent()
  }, [studentId])

  /**
   * 서버에서 학생 정보를 가져오고 접속 시간을 업데이트합니다.
   */
  const fetchStudent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/students/${studentId}`)
      const result: ApiResponse<Student> = await response.json()

      if (result.success && result.data) {
        setStudent(result.data)
      } else {
        setError(result.error || '학생 정보를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      setError('학생 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">학생 정보를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h1 className="text-xl font-semibold text-red-700 text-center">
              오류 발생
            </h1>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-red-600 mb-4">
                {error || '학생 정보를 찾을 수 없습니다.'}
              </p>
              <p className="text-sm text-gray-500">
                QR 코드가 올바른지 확인해주세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            QR 접속 성공! 🎉
          </h1>
          <p className="text-gray-600">
            {currentTime.toLocaleString('ko-KR')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* 학생 정보 카드 */}
          <Card className="border-2 border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                학생 정보
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-sm text-gray-500 mb-1">이름</div>
                  <div className="text-xl font-semibold text-gray-800">
                    {student.name}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-sm text-gray-500 mb-1">이메일</div>
                  <div className="text-lg font-medium text-gray-800 break-all">
                    {student.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 접속 정보 카드 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">접속 정보</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">현재 접속 시간</span>
                  <span className="font-semibold text-blue-700">
                    {currentTime.toLocaleString('ko-KR')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">등록일</span>
                  <span className="font-medium text-gray-700">
                    {new Date(student.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                
                {student.lastAccessAt && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-600">이전 접속</span>
                    <span className="font-medium text-green-700">
                      {new Date(student.lastAccessAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 성공 메시지 */}
          <Card className="border-green-300">
            <CardContent>
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  QR 코드 인증 완료!
                </h3>
                <p className="text-gray-600">
                  {student.name}님의 QR 코드가 성공적으로 인증되었습니다.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}