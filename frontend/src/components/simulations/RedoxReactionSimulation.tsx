import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Electron {
  id: number
  fromX: number
  fromY: number
  toX: number
  toY: number
  progress: number
}

export default function RedoxReactionSimulation() {
  const [reactionType, setReactionType] = useState<'zn-cu' | 'na-cl' | 'fe-o2'>('zn-cu')
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [electrons, setElectrons] = useState<Electron[]>([])

  const reactions = {
    'zn-cu': {
      name: '锌与硫酸铜反应',
      equation: 'Zn + CuSO₄ → ZnSO₄ + Cu',
      oxidation: 'Zn → Zn²⁺ + 2e⁻ (氧化反应，失电子)',
      reduction: 'Cu²⁺ + 2e⁻ → Cu (还原反应，得电子)',
      oxidizer: 'Cu²⁺ (氧化剂)',
      reducer: 'Zn (还原剂)',
      description: '锌比铜活泼，锌失去电子被氧化，铜离子得到电子被还原',
      colors: { left: '#a1a1aa', right: '#f97316', product: '#c2410c' }
    },
    'na-cl': {
      name: '钠与氯气反应',
      equation: '2Na + Cl₂ → 2NaCl',
      oxidation: 'Na → Na⁺ + e⁻ (氧化反应，失电子)',
      reduction: 'Cl₂ + 2e⁻ → 2Cl⁻ (还原反应，得电子)',
      oxidizer: 'Cl₂ (氧化剂)',
      reducer: 'Na (还原剂)',
      description: '钠是活泼金属，容易失去电子；氯气是活泼非金属，容易得到电子',
      colors: { left: '#fbbf24', right: '#22c55e', product: '#ffffff' }
    },
    'fe-o2': {
      name: '铁在氧气中燃烧',
      equation: '3Fe + 2O₂ → Fe₃O₄',
      oxidation: 'Fe → Fe²⁺/Fe³⁺ + 2e⁻/3e⁻ (氧化反应)',
      reduction: 'O₂ + 4e⁻ → 2O²⁻ (还原反应)',
      oxidizer: 'O₂ (氧化剂)',
      reducer: 'Fe (还原剂)',
      description: '铁在高温下与氧气反应，铁被氧化，氧气被还原',
      colors: { left: '#71717a', right: '#ef4444', product: '#1f2937' }
    }
  }

  const reaction = reactions[reactionType]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setStep(prev => {
        if (prev >= 100) {
          setIsPlaying(false)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    if (step > 20 && step < 80) {
      // 生成电子转移动画
      if (step % 10 === 0) {
        const newElectron: Electron = {
          id: Date.now(),
          fromX: 100,
          fromY: 100,
          toX: 200,
          toY: 100,
          progress: 0
        }
        setElectrons(prev => [...prev, newElectron])
      }
    }

    // 更新电子位置
    const electronInterval = setInterval(() => {
      setElectrons(prev =>
        prev
          .map(e => ({ ...e, progress: e.progress + 5 }))
          .filter(e => e.progress <= 100)
      )
    }, 50)

    return () => clearInterval(electronInterval)
  }, [step])

  const reset = () => {
    setStep(0)
    setIsPlaying(false)
    setElectrons([])
  }

  const handleReactionChange = (type: 'zn-cu' | 'na-cl' | 'fe-o2') => {
    setReactionType(type)
    reset()
  }

  return (
    <div className="space-y-6">
      {/* 反应选择 */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => handleReactionChange('zn-cu')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            reactionType === 'zn-cu'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          Zn + CuSO₄
        </button>
        <button
          onClick={() => handleReactionChange('na-cl')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            reactionType === 'na-cl'
              ? 'bg-yellow-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          Na + Cl₂
        </button>
        <button
          onClick={() => handleReactionChange('fe-o2')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            reactionType === 'fe-o2'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          Fe + O₂
        </button>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={step >= 100}
          className="px-6 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPlaying ? '暂停' : step > 0 ? '继续' : '开始反应'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-secondary)] transition-all"
        >
          重置
        </button>
      </div>

      {/* 可视化区域 */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden h-[280px] border border-[var(--border-color)]">
        <svg width="100%" height="100%" viewBox="0 0 300 220">
          {/* 标题 */}
          <text x="150" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
            {reaction.name}
          </text>

          {/* 还原剂（左侧） */}
          <g transform="translate(60, 100)">
            <motion.circle
              r={step < 50 ? 30 : 30 - step * 0.2}
              fill={reaction.colors.left}
              animate={{
                opacity: step > 80 ? 0.3 : 1,
                scale: step > 50 ? 0.7 : 1
              }}
            />
            <text y={50} textAnchor="middle" fill="white" fontSize="11">
              {reactionType === 'zn-cu' ? 'Zn' : reactionType === 'na-cl' ? 'Na' : 'Fe'}
            </text>
            <text y={65} textAnchor="middle" fill="#22c55e" fontSize="9">
              还原剂
            </text>
            {step > 20 && step < 80 && (
              <motion.text
                y={-40}
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                失去电子 ↗
              </motion.text>
            )}
          </g>

          {/* 氧化剂（右侧） */}
          <g transform="translate(240, 100)">
            <motion.circle
              r={30}
              fill={step > 80 ? reaction.colors.product : reaction.colors.right}
              animate={{
                scale: step > 50 ? 1.2 : 1
              }}
            />
            <text y={50} textAnchor="middle" fill="white" fontSize="11">
              {reactionType === 'zn-cu' ? 'Cu²⁺' : reactionType === 'na-cl' ? 'Cl₂' : 'O₂'}
            </text>
            <text y={65} textAnchor="middle" fill="#ef4444" fontSize="9">
              氧化剂
            </text>
            {step > 20 && step < 80 && (
              <motion.text
                y={-40}
                textAnchor="middle"
                fill="#3b82f6"
                fontSize="10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ↘ 得到电子
              </motion.text>
            )}
          </g>

          {/* 电子转移箭头 */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
            </marker>
          </defs>

          {step > 10 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <path
                d="M 95 85 Q 150 50 205 85"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeDasharray="5,3"
                markerEnd="url(#arrowhead)"
              />
              <text x="150" y="45" textAnchor="middle" fill="#fbbf24" fontSize="10">
                e⁻ 转移
              </text>
            </motion.g>
          )}

          {/* 电子动画 */}
          <AnimatePresence>
            {electrons.map(electron => (
              <motion.circle
                key={electron.id}
                cx={electron.fromX + (electron.toX - electron.fromX) * (electron.progress / 100)}
                cy={70 - Math.sin(electron.progress * Math.PI / 100) * 30}
                r={4}
                fill="#fbbf24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            ))}
          </AnimatePresence>

          {/* 产物显示 */}
          {step >= 100 && (
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <text x="150" y="180" textAnchor="middle" fill="#22c55e" fontSize="14" fontWeight="bold">
                反应完成！
              </text>
              <text x="150" y="200" textAnchor="middle" fill="white" fontSize="11">
                {reaction.equation}
              </text>
            </motion.g>
          )}

          {/* 进度条 */}
          <rect x="50" y="210" width="200" height="4" fill="rgba(255,255,255,0.2)" rx="2" />
          <motion.rect
            x="50"
            y="210"
            width={step * 2}
            height="4"
            fill="#22c55e"
            rx="2"
          />
        </svg>

        {/* 化合价变化标注 */}
        {step > 30 && (
          <div className="absolute top-12 left-4 right-4 flex justify-between text-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 text-green-400 px-2 py-1 rounded"
            >
              化合价升高 (氧化)
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 text-red-400 px-2 py-1 rounded"
            >
              化合价降低 (还原)
            </motion.div>
          </div>
        )}
      </div>

      {/* 反应信息 */}
      <motion.div
        key={reactionType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]"
      >
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{reaction.name}</h3>

        <div className="space-y-2 text-sm">
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">
            <span className="text-[var(--text-secondary)]">总反应：</span>
            <span className="text-[var(--text-primary)] font-mono ml-2">{reaction.equation}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-medium mb-1">氧化反应（失电子）</p>
              <p className="text-[var(--text-secondary)] text-xs">{reaction.oxidation}</p>
              <p className="text-[var(--text-tertiary)] text-xs mt-1">还原剂：{reaction.reducer}</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/30">
              <p className="text-red-400 font-medium mb-1">还原反应（得电子）</p>
              <p className="text-[var(--text-secondary)] text-xs">{reaction.reduction}</p>
              <p className="text-[var(--text-tertiary)] text-xs mt-1">氧化剂：{reaction.oxidizer}</p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] mt-2">{reaction.description}</p>
        </div>
      </motion.div>

      {/* 口诀提示 */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]">
        <h4 className="font-bold text-[var(--text-primary)] mb-2">记忆口诀</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <p className="text-green-400 font-medium">升失氧还原剂</p>
            <p className="text-[var(--text-tertiary)] text-xs mt-1">化合价升高 → 失去电子 → 被氧化 → 是还原剂</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg">
            <p className="text-red-400 font-medium">降得还氧化剂</p>
            <p className="text-[var(--text-tertiary)] text-xs mt-1">化合价降低 → 得到电子 → 被还原 → 是氧化剂</p>
          </div>
        </div>
      </div>
    </div>
  )
}
