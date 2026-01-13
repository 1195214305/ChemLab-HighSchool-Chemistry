import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  type: 'A' | 'B'
  color: string
}

export default function MatterTypesSimulation() {
  const [matterType, setMatterType] = useState<'pure-element' | 'pure-compound' | 'mixture'>('pure-element')
  const [isAnimating, setIsAnimating] = useState(true)

  const generateParticles = (): Particle[] => {
    const particles: Particle[] = []
    const count = 30

    if (matterType === 'pure-element') {
      // 纯净物-单质：只有一种原子
      for (let i = 0; i < count; i++) {
        particles.push({
          id: i,
          x: Math.random() * 280 + 10,
          y: Math.random() * 180 + 10,
          type: 'A',
          color: '#3b82f6'
        })
      }
    } else if (matterType === 'pure-compound') {
      // 纯净物-化合物：分子由不同原子组成，但所有分子相同
      for (let i = 0; i < count / 2; i++) {
        const baseX = Math.random() * 260 + 20
        const baseY = Math.random() * 160 + 20
        particles.push({
          id: i * 2,
          x: baseX,
          y: baseY,
          type: 'A',
          color: '#ef4444'
        })
        particles.push({
          id: i * 2 + 1,
          x: baseX + 15,
          y: baseY,
          type: 'B',
          color: '#22c55e'
        })
      }
    } else {
      // 混合物：不同种类的分子混合
      for (let i = 0; i < count / 3; i++) {
        // 类型1分子
        particles.push({
          id: i,
          x: Math.random() * 280 + 10,
          y: Math.random() * 180 + 10,
          type: 'A',
          color: '#3b82f6'
        })
      }
      for (let i = 0; i < count / 3; i++) {
        // 类型2分子
        const baseX = Math.random() * 260 + 20
        const baseY = Math.random() * 160 + 20
        particles.push({
          id: count / 3 + i * 2,
          x: baseX,
          y: baseY,
          type: 'A',
          color: '#ef4444'
        })
        particles.push({
          id: count / 3 + i * 2 + 1,
          x: baseX + 12,
          y: baseY,
          type: 'B',
          color: '#f59e0b'
        })
      }
    }
    return particles
  }

  const particles = generateParticles()

  const matterInfo = {
    'pure-element': {
      name: '纯净物 - 单质',
      formula: '如 O₂、Fe、Cu',
      description: '由同种元素组成的纯净物，所有粒子完全相同',
      characteristics: ['只含一种元素', '化学性质均一', '有固定的物理性质']
    },
    'pure-compound': {
      name: '纯净物 - 化合物',
      formula: '如 H₂O、NaCl、CO₂',
      description: '由不同元素组成的纯净物，分子结构相同',
      characteristics: ['含两种或以上元素', '有固定的化学式', '可通过化学反应分解']
    },
    'mixture': {
      name: '混合物',
      formula: '如空气、海水、合金',
      description: '由多种物质混合而成，各成分保持原有性质',
      characteristics: ['无固定组成', '各成分保持原性质', '可用物理方法分离']
    }
  }

  const info = matterInfo[matterType]

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setMatterType('pure-element')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            matterType === 'pure-element'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          单质
        </button>
        <button
          onClick={() => setMatterType('pure-compound')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            matterType === 'pure-compound'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          化合物
        </button>
        <button
          onClick={() => setMatterType('mixture')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            matterType === 'mixture'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          混合物
        </button>
      </div>

      {/* 动画控制 */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all"
        >
          {isAnimating ? '暂停动画' : '开始动画'}
        </button>
      </div>

      {/* 可视化区域 */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden h-[250px] border border-[var(--border-color)]">
        <svg width="100%" height="100%" viewBox="0 0 300 200">
          {/* 容器边框 */}
          <rect
            x="5"
            y="5"
            width="290"
            height="190"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            rx="10"
          />

          {/* 粒子 */}
          <AnimatePresence mode="wait">
            {particles.map((particle, index) => (
              <motion.circle
                key={`${matterType}-${particle.id}`}
                cx={particle.x}
                cy={particle.y}
                r={8}
                fill={particle.color}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 0.9,
                  x: isAnimating ? [0, Math.random() * 10 - 5, 0] : 0,
                  y: isAnimating ? [0, Math.random() * 10 - 5, 0] : 0
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  scale: { duration: 0.3, delay: index * 0.02 },
                  opacity: { duration: 0.3, delay: index * 0.02 },
                  x: { duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut' },
                  y: { duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut' }
                }}
              />
            ))}
          </AnimatePresence>

          {/* 标签 */}
          <text x="150" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            {info.name}
          </text>
        </svg>

        {/* 图例 */}
        <div className="absolute bottom-3 left-3 flex gap-4 text-xs text-white/80">
          {matterType === 'pure-element' && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>同种原子</span>
            </div>
          )}
          {matterType === 'pure-compound' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>原子A</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>原子B</span>
              </div>
            </>
          )}
          {matterType === 'mixture' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>物质1</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500 -ml-1" />
                <span>物质2</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 信息面板 */}
      <motion.div
        key={matterType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]"
      >
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{info.name}</h3>
        <p className="text-[var(--text-secondary)] mb-1">示例：{info.formula}</p>
        <p className="text-[var(--text-secondary)] mb-3">{info.description}</p>
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">特点：</p>
          <ul className="list-disc list-inside text-sm text-[var(--text-secondary)]">
            {info.characteristics.map((char, i) => (
              <li key={i}>{char}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* 分类图 */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 text-center">物质分类体系</h3>
        <div className="flex justify-center">
          <div className="text-sm">
            <div className="text-center mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg font-medium">物质</span>
            </div>
            <div className="flex gap-8 justify-center">
              <div className="text-center">
                <div className="w-px h-4 bg-[var(--border-color)] mx-auto" />
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-medium">纯净物</span>
                <div className="flex gap-4 mt-2">
                  <div className="text-center">
                    <div className="w-px h-4 bg-[var(--border-color)] mx-auto" />
                    <span className={`px-2 py-1 rounded text-xs ${matterType === 'pure-element' ? 'bg-blue-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                      单质
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="w-px h-4 bg-[var(--border-color)] mx-auto" />
                    <span className={`px-2 py-1 rounded text-xs ${matterType === 'pure-compound' ? 'bg-green-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                      化合物
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-px h-4 bg-[var(--border-color)] mx-auto" />
                <span className={`px-3 py-1 rounded-lg font-medium ${matterType === 'mixture' ? 'bg-orange-500 text-white' : 'bg-orange-500/20 text-orange-400'}`}>
                  混合物
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
