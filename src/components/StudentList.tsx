'use client'

import {Student} from '@/types'
import {Button} from './ui/Button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/Card'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from './ui/Table'
import {Calendar, Mail, QrCode, Trash2} from 'lucide-react'
import {Badge} from "@/components/ui/Badge";

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
      <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg px-6 py-8">
              <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <QrCode className="h-5 w-5" />
                      학생 목록
                  </div>
                  <Badge variant="secondary" className="bg-white text-slate-800 px-3 py-1">
                      {students.length}명
                  </Badge>
              </CardTitle>
              <CardDescription className="text-slate-200 mt-2">
                  등록된 학생들의 정보와 QR 코드를 관리하세요
              </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
              <div className="overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow className="bg-slate-50">
                              <TableHead className="py-3 px-6">이름</TableHead>
                              <TableHead className="py-3 px-6">이메일</TableHead>
                              <TableHead className="py-3 px-6">마지막 체크인</TableHead>
                              <TableHead className="text-center py-3 px-6">작업</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {students.map((student) => (
                              <TableRow key={student.id} className="hover:bg-slate-50/50">
                                  <TableCell className="font-medium py-3 px-6">
                                      <div className="flex items-center gap-3">
                                          <span>{student.name}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="py-3 px-6">
                                      <div className="flex items-center gap-2 text-slate-600">
                                          <Mail className="h-4 w-4" />
                                          <span>{student.email}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="py-3 px-6">
                                      <div className="flex items-center gap-2 text-slate-600">
                                          <Calendar className="h-4 w-4" />
                                          <span>{student.createdAt}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="py-3 px-6">
                                      <div className="flex items-center justify-center gap-3">
                                          <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => onDownloadQR(student)}
                                              className="h-9 px-4"
                                          >
                                              <QrCode className="h-4 w-4 mr-2" />
                                              QR 생성
                                          </Button>
                                          <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => onDelete(student.id)}
                                              className="h-9 px-3 text-red-600 hover:bg-red-50"
                                          >
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </div>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
      </Card>

  )
}