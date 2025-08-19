'use client'

import { Student } from '@/types'
import {Card,  CardHeader, CardContent } from './ui/Card'
import {Button} from './ui/Button'

interface QRDisplayProps {
  student: Student
  onDownload?: () => void
}

/**
 * QR 코드 표시 컴포넌트
 * @param student - QR 코드를 표시할 학생 정보
 * @param onDownload - QR 코드 다운로드 핸들러
 * @returns JSX.Element
 */
export default function QRDisplay({ student, onDownload }: QRDisplayProps) {
  const studentPageUrl = `${window.location.origin}/student/${student.id}`

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">
          {student.name}님의 QR 코드
        </h2>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {student.qrCodePath ? (
            <div className="flex flex-col items-center space-y-4">
              <img
                src={student.qrCodePath}
                alt={`${student.name} QR 코드`}
                className="w-64 h-64 border border-gray-300 rounded-lg"
              />
              
              <div className="text-sm text-gray-600">
                <p className="mt-2 text-xs break-all">
                  <strong>링크:</strong> {studentPageUrl}
                </p>
              </div>
              
              {onDownload && (
                <Button onClick={onDownload} variant="secondary">
                  QR 코드 다운로드
                </Button>
              )}
            </div>
          ) : (
            <div className="py-8 text-gray-500">
              <p>QR 코드를 생성하고 있습니다...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}