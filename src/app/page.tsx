import { redirect } from 'next/navigation'

/**
 * 홈페이지 컴포넌트
 * 관리자 페이지로 자동 리다이렉트합니다.
 * @returns JSX.Element
 */
export default function Home() {
  // 서버사이드에서 즉시 리다이렉트
  redirect('/admin')
}
