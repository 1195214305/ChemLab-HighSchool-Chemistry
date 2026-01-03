import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function TitrationSimulation() {
  const [volume, setVolume] = useState(0)
  const [isDropping, setIsDropping] = useState(false)
  const [data, setData] = useState<{ volume: number; pH: number }[]>([])
  const [indicator, setIndicator] = useState<'phenolphthalein' | 'methyl-orange'>('phenolphthalein')

  // 计算pH值（模拟强酸滴定强碱）
  const calculatePH = (v: number) => {
    // 假设：25mL 0.1M NaOH 被 0.1M HCl 滴定
    const naohMoles = 0.025 * 0.1 // 2.5 mmol
    const hclMoles = v * 0.001 * 0.1 // v mL * 0.1 M

    if (hclMoles < naohMoles) {
      // 碱过量
      const excessOH = (naohMoles - hclMoles) / ((25 + v) / 1000)
      const pOH = -Math.log10(excessOH)
      return Math.min(14, 14 - pOH)
    } else if (hclMoles > naohMoles) {
      // 酸过量
      const excessH = (hclMoles - naohMoles) / ((25 + v) / 1000)
      return Math.max(0, -Math.log10(excessH))
    } else {
      // 等当点
      return 7
    }
  }

  // 获取溶液颜色
  const getSolutionColor = (pH: number) => {
    if (indicator === 'phenolphthalein') {
      // 酚酞：pH < 8.2 无色，pH > 10 红色
      if (pH < 8.2) return 'transparent'
      if (pH > 10) return 'rgba(255, 105, 180, 0.6)'
      return `rgba(255, 105, 180, ${(pH - 8.2) / 1.8 * 0.6})`
    } else {
      // 甲基橙：pH < 3.1 红色，pH > 4.4 黄色
      if (pH < 3.1) return 'rgba(255, 69, 0, 0.6)'
      if (pH > 4.4) return 'rgba(255, 215, 0, 0.6)'
      return 'rgba(255, 140, 0, 0.6)'
    }
  }

  useEffect(() => {
    if (!isDropping) return

    const interval = setInterval(() => {
      setVolume(prev => {
        if (prev >= 50) {
          setIsDropping(false)
          return prev
        }
        const newVolume = prev + 0.5
        const pH = calculatePH(newVolume)
        setData(d => [...d, { volume: newVolume, pH: Math.round(pH * 100) / 100 }])
        return newVolume
      })
    }, 200)

    return () => clearInterval(interval)
  }, [isDropping])

  const reset = () => {
    setVolume(0)
    setData([])
    setIsDropping(false)
  }

  const currentPH = calculatePH(volume)
  const solutionColor = getSolutionColor(currentPH)
  const equivalencePoint = 25 // mL

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        模拟酸碱中和滴定：用0.1M HCl滴定25mL 0.1M NaOH
      </div>

      {/* 指示剂选择 */}
      <div className="flex gap-2">
        <button
          onClick={() => { setIndicator('phenolphthalein'); reset() }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            indicator === 'phenolphthalein'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          酚酞
        </button>
        <button
          onClick={() => { setIndicator('methyl-orange'); reset() }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            indicator === 'methyl-orange'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          甲基橙
        </button>
      </div>

      {/* 滴定装置 */}
      <div className="relative h-72 sm:h-80 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
        <svg viewBox="0 0 200 220" className="w-full h-full">
          {/* 滴定管 */}
          <rect x="90" y="10" width="20" height="80" fill="none" stroke="var(--text-secondary)" strokeWidth="2" />
          <rect x="92" y="12" width="16" height={76 * (1 - volume / 50)} fill="var(--text-tertiary)" opacity="0.5" />
          <text x="100" y="100" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">HCl</text>

          {/* 滴定管刻度 */}
          {[0, 10, 20, 30, 40, 50].map(v => (
            <g key={v}>
              <line x1="110" y1={12 + (v / 50) * 76} x2="115" y2={12 + (v / 50) * 76} stroke="var(--text-tertiary)" strokeWidth="1" />
              <text x="118" y={15 + (v / 50) * 76} fill="var(--text-tertiary)" fontSize="6">{v}</text>
            </g>
          ))}

          {/* 滴管尖端 */}
          <path d="M 95 90 L 100 100 L 105 90" fill="var(--text-secondary)" />

          {/* 液滴动画 */}
          {isDropping && (
            <motion.circle
              cx="100"
              cy="100"
              r="3"
              fill="var(--text-tertiary)"
              animate={{ cy: [100, 140] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          )}

          {/* 锥形瓶 */}
          <path
            d="M 60 200 L 80 150 L 80 140 L 120 140 L 120 150 L 140 200 Z"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="2"
          />

          {/* 溶液 */}
          <motion.path
            d="M 65 195 L 82 155 L 82 145 L 118 145 L 118 155 L 135 195 Z"
            fill={solutionColor}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* 瓶口 */}
          <rect x="85" y="135" width="30" height="5" fill="none" stroke="var(--text-secondary)" strokeWidth="2" />

          {/* 标签 */}
          <text x="100" y="210" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">NaOH溶液</text>
        </svg>
      </div>

      {/* 数据显示 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{volume.toFixed(1)}</div>
          <div className="text-sm text-[var(--text-secondary)]">滴定体积 (mL)</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{currentPH.toFixed(2)}</div>
          <div className="text-sm text-[var(--text-secondary)]">pH值</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            {Math.abs(volume - equivalencePoint) < 0.5 ? '是' : '否'}
          </div>
          <div className="text-sm text-[var(--text-secondary)]">等当点</div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsDropping(!isDropping)}
          disabled={volume >= 50}
          className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
            isDropping
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]'
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
          }`}
        >
          {isDropping ? '停止滴定' : '开始滴定'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
        >
          重置
        </button>
      </div>

      {/* 滴定曲线 */}
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis
                dataKey="volume"
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                label={{ value: '体积 (mL)', position: 'bottom', fill: 'var(--text-tertiary)' }}
              />
              <YAxis
                domain={[0, 14]}
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                label={{ value: 'pH', angle: -90, position: 'insideLeft', fill: 'var(--text-tertiary)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              />
              <ReferenceLine x={equivalencePoint} stroke="var(--accent)" strokeDasharray="5 5" label="等当点" />
              <ReferenceLine y={7} stroke="var(--text-tertiary)" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="pH"
                stroke="var(--text-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">酸碱滴定要点：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>等当点：酸碱恰好完全反应的点</li>
          <li>强酸滴定强碱：等当点pH=7</li>
          <li>酚酞变色范围：pH 8.2-10（无色→红色）</li>
          <li>甲基橙变色范围：pH 3.1-4.4（红色→黄色）</li>
          <li>滴定突跃：等当点附近pH急剧变化</li>
        </ul>
      </div>
    </div>
  )
}
