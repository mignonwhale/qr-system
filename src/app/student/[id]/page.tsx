'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Student } from '@/types'
import { getStudentById, updateStudentAccess } from '@/lib/storage-local'

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

  /**
   * localStorage에서 학생 정보를 가져오고 접속 시간을 업데이트합니다.
   */
  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true)
      const student = getStudentById(studentId)
      
      if (student) {
        // 접속 시간 업데이트
        const updatedStudent = updateStudentAccess(studentId)
        setStudent(updatedStudent || student)
      } else {
        setError('학생 정보를 찾을 수 없습니다.')
      }
    } catch (error) {
      console.error('Error fetching student:', error)
      setError('학생 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

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
  }, [studentId, fetchStudent])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">학생 정보를 불러오는 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
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
              <p className="text-sm text-slate-600">
                QR 코드가 올바른지 확인해주세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">QR 접속 성공! 🎉</h1>
          <p className="text-slate-600">{currentTime.toLocaleString('ko-KR')}</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* 학생 정보 카드 */}
          <Card className="border-2 border-slate-200 bg-white shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-center text-slate-800">
                학생 정보
              </h2>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">이름</div>
                  <div className="text-xl font-semibold text-slate-800">
                    {student.name}
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="text-sm text-slate-500 mb-1">이메일</div>
                  <div className="text-lg font-medium text-slate-800 break-all">
                    {student.email}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 접속 정보 카드 */}
          <Card className="bg-white shadow-md border border-slate-200">
            <CardHeader className="border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">접속 정보</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-slate-600">현재 접속 시간</span>
                  <span className="font-semibold text-blue-700">
                    {currentTime.toLocaleString('ko-KR')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-600">등록일</span>
                  <span className="font-medium text-slate-700">
                    {new Date(student.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                
                {student.lastAccessAt && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-slate-600">이전 접속</span>
                    <span className="font-medium text-green-700">
                      {new Date(student.lastAccessAt).toLocaleString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 성공 메시지 */}
          <Card className="border-green-300 bg-green-50 shadow-md">
            <CardContent className="p-6">
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  QR 코드 인증 완료!
                </h3>
                <p className="text-slate-600">
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