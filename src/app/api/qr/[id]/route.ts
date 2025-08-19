import { NextRequest, NextResponse } from 'next/server'
import { getStudentById } from '@/lib/storage'
import { getQRCodeBuffer } from '@/lib/qr'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 학생 존재 확인
    const resolvedParams = await params
    const student = await getStudentById(resolvedParams.id)
    if (!student) {
      return NextResponse.json(
        { error: '학생을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // QR 코드 파일 읽기
    const qrBuffer = await getQRCodeBuffer(resolvedParams.id)
    if (!qrBuffer) {
      return NextResponse.json(
        { error: 'QR 코드 파일을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 한글 파일명 인코딩
    const fileName = `QR_${student.name}.png`
    const encodedFileName = encodeURIComponent(fileName)

    return new NextResponse(qrBuffer as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFileName}`,
        'Content-Length': qrBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading QR code:', error)
    return NextResponse.json(
      { error: 'QR 코드 다운로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}