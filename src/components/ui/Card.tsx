import React from 'react'
import {cn} from './utils'

/**
 * 재사용 가능한 카드 컴포넌트
 * @param children - 카드 내용
 * @param className - 추가 CSS 클래스
 * @returns JSX.Element
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
                className,
            )}
            {...props}
        />
    );
}

/**
 * 카드 헤더 컴포넌트
 * @param children - 헤더 내용
 * @param className - 추가 CSS 클래스
 * @returns JSX.Element
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
      <div
          data-slot="card-header"
          className={cn(
              "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
              className,
          )}
          {...props}
      />
  );
}
/**
 * 카드 콘텐츠 컴포넌트
 * @param children - 콘텐츠 내용
 * @param className - 추가 CSS 클래스
 * @returns JSX.Element
 */

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn("px-6 [&:last-child]:pb-6", className)}
            {...props}
        />
    );
}



/**
 * 카드 제목 컴포넌트
 * @param className - 추가 CSS 클래스
 * @param props - 기타 HTML 속성
 * @returns JSX.Element
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <h4
            data-slot="card-title"
            className={cn("leading-none", className)}
            {...props}
        />
    );
}

/**
 * 카드 설명 컴포넌트
 * @param className - 추가 CSS 클래스
 * @param props - 기타 HTML 속성
 * @returns JSX.Element
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <p
            data-slot="card-description"
            className={cn("text-muted-foreground", className)}
            {...props}
        />
    );
}

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
};