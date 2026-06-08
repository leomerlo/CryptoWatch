import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

export type ErrorStateProps = {
  title: string
  description: string
  /** Shown in a monospace pill; omitted when empty. */
  errorDetail?: string
  onRetry?: () => void
  onLearnMore?: () => void
  learnMoreHref?: string
  retryLabel?: string
  learnMoreLabel?: string
  isRetrying?: boolean
  /** Replaces the default retry / learn-more buttons when provided. */
  actions?: ReactNode
  className?: string
}

export function ErrorState({
  title,
  description,
  errorDetail,
  onRetry,
  onLearnMore,
  learnMoreHref,
  retryLabel = 'Retry',
  learnMoreLabel = 'Learn more',
  isRetrying = false,
  actions,
  className,
}: ErrorStateProps) {
  const showRetry = Boolean(onRetry)
  const showLearnMore = Boolean(onLearnMore || learnMoreHref)
  const showDefaultActions = !actions && (showRetry || showLearnMore)

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-5 px-6 py-12 text-center',
        className
      )}
    >
      <div
        className="flex size-14 items-center justify-center rounded-xl bg-destructive/15"
        aria-hidden
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/25">
          <AlertCircleIcon className="size-6 text-destructive" strokeWidth={2.25} />
        </div>
      </div>

      <div className="flex max-w-md flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {actions}

      {showDefaultActions && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {showRetry && (
            <Button onClick={onRetry} disabled={isRetrying} data-icon="inline-start">
              <RefreshCwIcon className={cn(isRetrying && 'animate-spin')} />
              {retryLabel}
            </Button>
          )}
          {showLearnMore &&
            (learnMoreHref ? (
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={learnMoreHref} target="_blank" rel="noopener noreferrer" />}
              >
                {learnMoreLabel}
              </Button>
            ) : (
              <Button variant="outline" onClick={onLearnMore}>
                {learnMoreLabel}
              </Button>
            ))}
        </div>
      )}

      {errorDetail ? (
        <p className="max-w-full rounded-full bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
          {errorDetail}
        </p>
      ) : null}
    </div>
  )
}
