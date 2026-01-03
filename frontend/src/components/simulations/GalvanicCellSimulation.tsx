import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function GalvanicCellSimulation() {
  const [isRunning, setIsRunning] = useState(false)
  const [electrons, setElectrons] = useState<{ id: number; progress: number }[]>([])
  const [zincMass, setZincMass] = useState(100)
  const [copperMass, setCopperMass] = useState(100)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // 添加新电子
      setElectrons(prev => {
        const newElectrons = [...prev, { id: Date.now(), progress: 0 }]
        return newElectrons.slice(-10) // 最多保留10个电子
      })

      // 更新质量
      setZincMass(prev => Math.max(0, prev - 0.5))
      setCopperMass(prev => Math.min(200, prev + 0.3))
    }, 500)

    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning) return

    const moveInterval = setInterval(() => {
      setElectrons(prev =>
        prev
          .map(e => ({ ...e, progress: e.progress + 0.1 }))
          .filter(e => e.progress < 1)
      )
    }, 50)

    return () => clearInterval(moveInterval)
  }, [isRunning])

  const reset = () => {
    setIsRunning(false)
    setElectrons([])
    setZincMass(100)
    setCopperMass(100)
  }

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        观察锌-铜原电池的工作原理
      </div>

      {/* 原电池模型 */}
      <div className="relative h-72 sm:h-80 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
        <svg viewBox="0 0 300 220" className="w-full h-full">
          {/* 电解质溶液容器 */}
          <rect x="30" y="80" width="100" height="120" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="5" />
          <rect x="170" y="80" width="100" height="120" fill="none" stroke="var(--border-color)" strokeWidth="2" rx="5" />

          {/* 溶液 */}
          <rect x="32" y="100" width="96" height="98" fill="var(--text-tertiary)" opacity="0.2" rx="3" />
          <rect x="172" y="100" width="96" height="98" fill="var(--text-tertiary)" opacity="0.3" rx="3" />

          {/* 盐桥 */}
          <path
            d="M 130 120 Q 150 80 170 120"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <text x="150" y="75" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">盐桥</text>

          {/* 锌电极 */}
          <motion.rect
            x="60"
            y="90"
            width="20"
            height={60 + zincMass * 0.3}
            fill="var(--text-secondary)"
            rx="2"
            animate={{ height: 60 + zincMass * 0.3 }}
          />
          <text x="70" y="85" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="bold">Zn</text>
          <text x="70" y="210" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">负极</text>

          {/* 铜电极 */}
          <motion.rect
            x="220"
            y="90"
            width="20"
            height={60 + copperMass * 0.3}
            fill="var(--text-primary)"
            rx="2"
            animate={{ height: 60 + copperMass * 0.3 }}
          />
          <text x="230" y="85" textAnchor="middle" fill="var(--text-primary)" fontSize="12" fontWeight="bold">Cu</text>
          <text x="230" y="210" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">正极</text>

          {/* 导线 */}
          <path
            d="M 70 90 L 70 40 L 230 40 L 230 90"
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="3"
          />

          {/* 灯泡 */}
          <circle cx="150" cy="40" r="15" fill="none" stroke="var(--text-primary)" strokeWidth="2" />
          {isRunning && (
            <motion.circle
              cx="150"
              cy="40"
              r="10"
              fill="var(--accent)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}

          {/* 电子流动 */}
          {electrons.map(electron => {
            const x = 70 + electron.progress * 160
            const y = electron.progress < 0.3 ? 90 - electron.progress * 166 :
                      electron.progress < 0.7 ? 40 :
                      40 + (electron.progress - 0.7) * 166
            return (
              <motion.circle
                key={electron.id}
                cx={x}
                cy={y}
                r="4"
                fill="var(--accent)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )
          })}

          {/* 离子标记 */}
          {isRunning && (
            <>
              <motion.text
                x="80"
                y="150"
                fill="var(--text-secondary)"
                fontSize="10"
                animate={{ y: [150, 140, 150] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Zn²⁺
              </motion.text>
              <motion.text
                x="200"
                y="150"
                fill="var(--text-secondary)"
                fontSize="10"
                animate={{ y: [150, 160, 150] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Cu²⁺
              </motion.text>
            </>
          )}

          {/* 溶液标签 */}
          <text x="80" y="195" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9">ZnSO₄溶液</text>
          <text x="220" y="195" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9">CuSO₄溶液</text>

          {/* 电子流向箭头 */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
            </marker>
          </defs>
          {isRunning && (
            <path
              d="M 100 35 L 130 35"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          )}
        </svg>
      </div>

      {/* 控制面板 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]'
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
          }`}
        >
          {isRunning ? '停止' : '开始'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
        >
          重置
        </button>
      </div>

      {/* 电极反应 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <h4 className="font-medium text-[var(--text-primary)] mb-2">负极（锌）- 氧化反应</h4>
          <p className="text-sm text-[var(--text-secondary)] font-mono">
            Zn - 2e⁻ → Zn²⁺
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">锌失去电子，溶解进入溶液</p>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <h4 className="font-medium text-[var(--text-primary)] mb-2">正极（铜）- 还原反应</h4>
          <p className="text-sm text-[var(--text-secondary)] font-mono">
            Cu²⁺ + 2e⁻ → Cu
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">铜离子得到电子，沉积在电极上</p>
        </div>
      </div>

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">原电池工作原理：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>负极：较活泼金属，发生氧化反应，失去电子</li>
          <li>正极：较不活泼金属，发生还原反应，得到电子</li>
          <li>电子从负极经外电路流向正极</li>
          <li>盐桥：保持溶液电中性，使电路闭合</li>
          <li>化学能转化为电能</li>
        </ul>
      </div>
    </div>
  )
}
