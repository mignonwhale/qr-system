'use client'

import { useState } from 'react'
import Button from './ui/Button'
import Input from './ui/Input'
import Card, { CardHeader, CardContent } from './ui/Card'
import { StudentFormData } from '@/types'

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
export default function StudentForm({ onSubmit, isLoading = false }: StudentFormProps) {
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
    <div className="bg-blue-600 text-white rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="bg-blue-500 rounded-full p-2 mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold">새 학생 추가</h2>
          <p className="text-blue-100 text-sm">이름과 이메일을 입력하여 새 학생을 등록하세요.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">이름</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange('name')}
            required
            disabled={isLoading}
            placeholder="홍길동"
            className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
          />
          {errors.name && (
            <p className="text-red-200 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">이메일 주소</label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            required
            disabled={isLoading}
            placeholder="student@example.com"
            className="w-full px-3 py-2 bg-white text-gray-900 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
          />
          {errors.email && (
            <p className="text-red-200 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {isLoading ? '추가 중...' : '학생 추가'}
        </button>
      </form>
    </div>
  )
}