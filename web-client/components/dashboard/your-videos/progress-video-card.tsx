import React from 'react'
import Loader from '@/components/common/Loader'

interface ProgressVideoCardProps {
  jobId: string
  progress: number
  stage: string
  isConnecting?: boolean
}

const WIDTH_CLASS_BY_STEP: Record<number, string> = {
  0: 'w-0',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-[25%]',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-[40%]',
  45: 'w-[45%]',
  50: 'w-1/2',
  55: 'w-[55%]',
  60: 'w-3/5',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-3/4',
  80: 'w-4/5',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-full',
}

export const ProgressVideoCard = ({ jobId, progress, stage, isConnecting = false }: ProgressVideoCardProps) => {
  const safeProgress = Math.max(0, Math.min(100, Number(progress || 0)))
  const readableStage = (stage || 'queued').replace(/[-_]/g, ' ')
  const roundedProgress = Math.round(safeProgress / 5) * 5
  const progressWidthClass = WIDTH_CLASS_BY_STEP[roundedProgress] ?? 'w-0'

  return (
    <article
      key={jobId}
      className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_45%)]" />

      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Rendering
          </p>
          <h3 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Video In Progress
          </h3>
        </div>
        {isConnecting ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:border-blue-900/80 dark:bg-blue-950/50 dark:text-blue-300">
            <Loader size={14} />
            connecting
          </span>
        ) : (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:border-blue-900/80 dark:bg-blue-950/50 dark:text-blue-300">
            {safeProgress}%
          </span>
        )}
      </div>

      <div className="relative mb-4 rounded-xl border border-zinc-200/80 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="absolute inset-0 animate-pulse rounded-xl bg-gradient-to-r from-transparent via-blue-400/10 to-transparent" />
        <div className="relative flex items-center justify-between text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Current stage</span>
          <span className="rounded-md bg-zinc-200 px-2 py-1 text-xs font-semibold capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {isConnecting ? 'connecting' : readableStage}
          </span>
        </div>
      </div>

      <div className="mb-2">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Progress</span>
          <span>{safeProgress}/100</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ${progressWidthClass}`}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Job ID: <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{jobId}</span>
      </p>

      <div className="mt-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {isConnecting ? 'Connecting to the video job stream...' : 'Generating your video. You can keep using the dashboard while this runs.'}
      </div>
    </article>
  )
}
