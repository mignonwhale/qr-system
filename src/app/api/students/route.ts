import { NextRequest, NextResponse } from 'next/server'
import { getStudents, addStudent } from '@/lib/storage'
import { generateQRCode } from '@/lib/qr'
import { StudentInput, ApiResponse } from '@/types'

export async function GET() {
  try {
    const students = await getStudents()
    return NextResponse.json<ApiResponse>({
      success: true,
      data: students,
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: '학생 목록을 불러오는데 실패했습니다.',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const studentInput: StudentInput = {
      name: body.name?.trim(),
      email: body.email?.trim(),
    }

    // 유효성 검사
    if (!studentInput.name || !studentInput.email) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: '이름과 이메일은 필수 입력 항목입니다.',
        },
        { status: 400 }
      )
    }

    // 학생 추가
    const newStudent = await addStudent(studentInput)
    
    // QR 코드 생성
    try {
      await generateQRCode(newStudent)
    } catch (qrError) {
      console.error('QR generation failed:', qrError)
      // QR 생성 실패해도 학생은 이미 추가됨
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: newStudent,
        message: '학생이 성공적으로 추가되었습니다.',
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Error adding student:', error)
    
    if (error instanceof Error && error.message && error.message.includes('이미 존재합니다')) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        },
        { status: 409 }
      )
    }

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: '학생 추가에 실패했습니다.',
      },
      { status: 500 }
    )
  }
}