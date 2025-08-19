import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/**
 * 재사용 가능한 카드 컴포넌트
 * @param children - 카드 내용
 * @param className - 추가 CSS 클래스
 * @returns JSX.Element
 */
export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

/**
 * 카드 헤더 컴포넌트
 * @param children - 헤더 내용
 * @param className - 추가 CSS 클래스
 * @returns JSX.Element
 */
export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

/**
 * 카드 콘텐츠 컴포넌트
 * @param children - 콘텐츠 내용
 * @param className - 추가 CSS 클래스
 * @returns JSX.Element
 */
export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}