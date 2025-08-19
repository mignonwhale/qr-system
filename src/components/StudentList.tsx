'use client'

import { Student } from '@/types'
import Button from './ui/Button'
import Card, { CardHeader, CardContent } from './ui/Card'

interface StudentListProps {
  students: Student[]
  onDelete: (id: string) => Promise<void>
  onDownloadQR: (student: Student) => void
  isLoading?: boolean
}

/**
 * 학생 목록 테이블 컴포넌트
 * @param students - 표시할 학생 목록
 * @param onDelete - 학생 삭제 핸들러
 * @param onDownloadQR - QR 코드 다운로드 핸들러
 * @param isLoading - 로딩 상태 여부
 * @returns JSX.Element
 */
export default function StudentList({
  students,
  onDelete,
  onDownloadQR,
  isLoading = false
}: StudentListProps) {
  if (students.length === 0) {
    return (
      <div className="bg-slate-700 text-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">학생 목록</h2>
          <span className="bg-slate-600 text-white px-2 py-1 rounded text-sm">0</span>
        </div>
        <p className="text-slate-300 mb-4">등록된 학생의 정보와 QR 코드를 관리하세요.</p>
        <div className="text-center py-8 text-slate-400">
          <p>등록된 학생이 없습니다.</p>
          <p className="text-sm mt-2">위의 폼을 사용해서 학생을 추가해보세요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-700 text-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">학생 목록</h2>
        <span className="bg-slate-600 text-white px-2 py-1 rounded text-sm">{students.length}</span>
      </div>
      <p className="text-slate-300 mb-6">등록된 학생의 정보와 QR 코드를 관리하세요.</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-300 border-b border-slate-600">
              <th className="text-left py-3 px-4">이름</th>
              <th className="text-left py-3 px-4">이메일</th>
              <th className="text-left py-3 px-4">마지막 접속</th>
              <th className="text-center py-3 px-4">작업</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b border-slate-600 hover:bg-slate-600/50">
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    <span className="text-white font-medium">{student.name}</span>
                  </div>
                </td>
                
                <td className="py-3 px-4">
                  <div className="flex items-center text-slate-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {student.email}
                  </div>
                </td>
                
                <td className="py-3 px-4">
                  <div className="flex items-center text-slate-300">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {student.lastAccessAt 
                      ? new Date(student.lastAccessAt).toLocaleDateString('ko-KR', { 
                          month: 'numeric', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '없음'
                    }
                  </div>
                </td>
                
                <td className="py-3 px-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onDownloadQR(student)}
                      disabled={isLoading}
                      className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                      title="QR 코드 다운로드"
                    >
                      QR 설정
                    </button>
                    <button
                      onClick={() => onDelete(student.id)}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                      title="학생 삭제"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}