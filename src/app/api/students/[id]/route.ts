import { NextRequest, NextResponse } from 'next/server'
import { deleteStudent, getStudentById, updateStudentAccess } from '@/lib/storage'
import { deleteQRCode } from '@/lib/qr'
import { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const student = await getStudentById(resolvedParams.id)
    
    if (!student) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '학생을 찾을 수 없습니다.',
        },
        { status: 404 }
      )
    }

    // 접속 시간 업데이트
    const updatedStudent = await updateStudentAccess(resolvedParams.id)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedStudent || student,
    })
  } catch (error) {
    console.error('Error fetching student:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: '학생 정보를 불러오는데 실패했습니다.',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const success = await deleteStudent(resolvedParams.id)
    
    if (!success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '삭제할 학생을 찾을 수 없습니다.',
        },
        { status: 404 }
      )
    }

    // QR 코드 파일도 삭제
    try {
      await deleteQRCode(resolvedParams.id)
    } catch (error) {
      console.warn('Failed to delete QR file:', error)
      // QR 파일 삭제 실패는 무시
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: '학생이 성공적으로 삭제되었습니다.',
    })
  } catch (error) {
    console.error('Error deleting student:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: '학생 삭제에 실패했습니다.',
      },
      { status: 500 }
    )
  }
}