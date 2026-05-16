import clsx from 'clsx'

export default function Waveform({ bars = 18, color = '#e8365d', className = '', active = true }) {
  return (
    <div className={clsx('flex items-center gap-[3px]', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{
            '--wc': color,
            animationPlayState: active ? 'running' : 'paused',
            opacity: active ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
