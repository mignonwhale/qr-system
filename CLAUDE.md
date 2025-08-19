# QR System Project

## 프로젝트 개요
Next.js 15 + TypeScript + Tailwind CSS로 구성된 QR 코드 시스템 프로젝트입니다.

## 기술 스택
- **Frontend**: Next.js 15, React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Yarn
- **Linting**: ESLint

## 개발 환경 설정
```bash
# 의존성 설치
yarn install

# 개발 서버 시작
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 시작
yarn start

# 린팅 실행
yarn lint
```

## 프로젝트 구조
```
src/
├── app/           # Next.js App Router
│   ├── layout.tsx # 루트 레이아웃
│   └── page.tsx   # 홈페이지
└── ...

public/            # 정적 파일
docs/              # 문서
```

## 코딩 컨벤션
- TypeScript strict 모드 사용
- ESLint 규칙 준수
- Tailwind CSS 클래스명 사용
- 컴포넌트는 PascalCase로 명명
- 파일명은 kebab-case 또는 camelCase 사용

## 주의사항
- 새로운 패키지 설치 시 yarn 사용
- 타입 정의 누락 방지
- 반응형 디자인 고려

## api key는 절대 외부에 노출하면 안된다.
