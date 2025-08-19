'use client'

import {useState} from 'react'
import {Button} from './ui/Button'
import Input from './ui/Input'
import {Card, CardHeader, CardContent, CardTitle, CardDescription} from './ui/Card'
import {Label} from './ui/Label'
import {User} from 'lucide-react'
import {StudentFormData} from '@/types'

interface StudentFormProps {
    onSubmit: (data: StudentFormData) => Promise<void>
    isLoading?: boolean
}

/**
 * 학생 추가 폼 컴포넌트
 * @param onSubmit - 폼 제출 시 호출될 함수
 * @param isLoading - 로딩 상태 여부
 * @returns JSX.Element
 */
export default function StudentForm({onSubmit, isLoading = false}: StudentFormProps) {
    const [formData, setFormData] = useState<StudentFormData>({
        name: '',
        email: '',
    })

    const [errors, setErrors] = useState<Partial<StudentFormData>>({})

    /**
     * 폼 데이터 유효성 검사
     * @returns boolean 유효성 검사 통과 여부
     */
    const validateForm = (): boolean => {
        const newErrors: Partial<StudentFormData> = {}

        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력하세요'
        }

        if (!formData.email.trim()) {
            newErrors.email = '이메일을 입력하세요'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    /**
     * 폼 제출 처리
     * @param e - React form event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await onSubmit(formData)
            // 폼 초기화
            setFormData({
                name: '',
                email: '',
            })
            setErrors({})
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    /**
     * 입력 필드 변경 처리
     * @param field - 변경할 필드명
     * @returns 입력 이벤트 핸들러
     */
    const handleChange = (field: keyof StudentFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }))

        // 에러 클리어
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }))
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center gap-3">
                    <User className="h-5 w-5"/>
                    새 학생 추가
                </CardTitle>
                <CardDescription className="text-blue-100 mt-2">
                    이름과 이메일을 입력하여 새 학생을 등록하세요
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="block">이름</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="홍길동"
                            value={formData.name}
                            onChange={handleChange('name')}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 h-11"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="block">이메일 주소</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="student@example.com"
                            value={formData.email}
                            onChange={handleChange('email')}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 h-11"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-11 mt-4"
                    >
                        {isLoading ? '추가 중...' : '학생 추가'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}