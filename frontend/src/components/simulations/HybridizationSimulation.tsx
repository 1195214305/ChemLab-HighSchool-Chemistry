import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface OrbitalConfig {
  name: string
  hybridization: string
  geometry: string
  angle: string
  orbitals: string
  examples: string
  description: string
}

export default function HybridizationSimulation() {
  const [selectedType, setSelectedType] = useState<'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2'>('sp3')
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  const configs: Record<string, OrbitalConfig> = {
    sp: {
      name: 'sp杂化',
      hybridization: 'sp',
      geometry: '直线形',
      angle: '180°',
      orbitals: '1个s + 1个p → 2个sp',
      examples: 'BeCl₂, C₂H₂ (乙炔), CO₂',
      description: '一个s轨道和一个p轨道杂化，形成两个等价的sp杂化轨道，呈直线形分布'
    },
    sp2: {
      name: 'sp²杂化',
      hybridization: 'sp²',
      geometry: '平面三角形',
      angle: '120°',
      orbitals: '1个s + 2个p → 3个sp²',
      examples: 'BF₃, C₂H₄ (乙烯), 苯',
      description: '一个s轨道和两个p轨道杂化，形成三个等价的sp²杂化轨道，呈平面三角形分布'
    },
    sp3: {
      name: 'sp³杂化',
      hybridization: 'sp³',
      geometry: '正四面体形',
      angle: '109.5°',
      orbitals: '1个s + 3个p → 4个sp³',
      examples: 'CH₄, NH₃, H₂O',
      description: '一个s轨道和三个p轨道杂化，形成四个等价的sp³杂化轨道，呈正四面体形分布'
    },
    sp3d: {
      name: 'sp³d杂化',
      hybridization: 'sp³d',
      geometry: '三角双锥形',
      angle: '90°/120°',
      orbitals: '1个s + 3个p + 1个d → 5个sp³d',
      examples: 'PCl₅, PF₅',
      description: '一个s轨道、三个p轨道和一个d轨道杂化，形成五个sp³d杂化轨道'
    },
    sp3d2: {
      name: 'sp³d²杂化',
      hybridization: 'sp³d²',
      geometry: '正八面体形',
      angle: '90°',
      orbitals: '1个s + 3个p + 2个d → 6个sp³d²',
      examples: 'SF₆, [Fe(CN)₆]³⁻',
      description: '一个s轨道、三个p轨道和两个d轨道杂化，形成六个sp³d²杂化轨道'
    }
  }

  const config = configs[selectedType]

  useEffect(() => {
    if (!showAnimation) {
      setAnimationStep(0)
      return
    }

    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 3) {
          return 3
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showAnimation])

  const handleTypeChange = (type: 'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2') => {
    setSelectedType(type)
    setShowAnimation(false)
    setAnimationStep(0)
  }

  // 获取轨道数量
  const getOrbitalCount = () => {
    switch (selectedType) {
      case 'sp': return { s: 1, p: 1, d: 0, hybrid: 2 }
      case 'sp2': return { s: 1, p: 2, d: 0, hybrid: 3 }
      case 'sp3': return { s: 1, p: 3, d: 0, hybrid: 4 }
      case 'sp3d': return { s: 1, p: 3, d: 1, hybrid: 5 }
      case 'sp3d2': return { s: 1, p: 3, d: 2, hybrid: 6 }
    }
  }

  const orbitalCount = getOrbitalCount()

  // 绘制杂化轨道的空间分布
  const renderHybridOrbitals = () => {
    const cx = 150
    const cy = 130
    const r = 50

    switch (selectedType) {
      case 'sp':
        return (
          <>
            <motion.ellipse
              cx={cx - 40}
              cy={cy}
              rx={35}
              ry={15}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.ellipse
              cx={cx + 40}
              cy={cy}
              rx={35}
              ry={15}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            />
            <motion.line
              x1={cx - 80}
              y1={cy}
              x2={cx + 80}
              y2={cy}
              stroke="rgba(255,255,255,0.3)"
              strokeDasharray="4,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
            <text x={cx} y={cy + 50} textAnchor="middle" fill="white" fontSize="11">180°</text>
          </>
        )
      case 'sp2':
        return (
          <>
            {[0, 120, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const x = cx + Math.cos(rad) * 40
              const y = cy + Math.sin(rad) * 40
              return (
                <motion.g key={i}>
                  <motion.ellipse
                    cx={x}
                    cy={y}
                    rx={30}
                    ry={12}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                    transform={`rotate(${angle}, ${x}, ${y})`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.2 }}
                  />
                  <line
                    x1={cx}
                    y1={cy}
                    x2={x}
                    y2={y}
                    stroke="rgba(255,255,255,0.3)"
                    strokeDasharray="4,4"
                  />
                </motion.g>
              )
            })}
            <text x={cx} y={cy + 70} textAnchor="middle" fill="white" fontSize="11">120°</text>
          </>
        )
      case 'sp3':
        return (
          <>
            {/* 简化的四面体表示 */}
            <motion.circle
              cx={cx}
              cy={cy - 35}
              r={20}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.circle
              cx={cx - 35}
              cy={cy + 25}
              r={20}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            />
            <motion.circle
              cx={cx + 35}
              cy={cy + 25}
              r={20}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            />
            <motion.circle
              cx={cx}
              cy={cy + 10}
              r={15}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeDasharray="4,4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
            />
            {/* 连接线 */}
            <line x1={cx} y1={cy} x2={cx} y2={cy - 35} stroke="rgba(255,255,255,0.3)" strokeDasharray="4,4" />
            <line x1={cx} y1={cy} x2={cx - 35} y2={cy + 25} stroke="rgba(255,255,255,0.3)" strokeDasharray="4,4" />
            <line x1={cx} y1={cy} x2={cx + 35} y2={cy + 25} stroke="rgba(255,255,255,0.3)" strokeDasharray="4,4" />
            <text x={cx} y={cy + 70} textAnchor="middle" fill="white" fontSize="11">109.5°</text>
          </>
        )
      case 'sp3d':
        return (
          <>
            {/* 三角双锥 */}
            <motion.circle cx={cx} cy={cy - 45} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
            <motion.circle cx={cx} cy={cy + 45} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
            {[0, 120, 240].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const x = cx + Math.cos(rad) * 35
              const y = cy + Math.sin(rad) * 20
              return (
                <motion.circle key={i} cx={x} cy={y} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }} />
              )
            })}
            <text x={cx} y={cy + 80} textAnchor="middle" fill="white" fontSize="11">90°/120°</text>
          </>
        )
      case 'sp3d2':
        return (
          <>
            {/* 八面体 */}
            <motion.circle cx={cx} cy={cy - 45} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} />
            <motion.circle cx={cx} cy={cy + 45} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
            <motion.circle cx={cx - 45} cy={cy} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} />
            <motion.circle cx={cx + 45} cy={cy} r={15} fill="none" stroke="#22c55e" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
            <motion.circle cx={cx - 20} cy={cy} r={12} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
            <motion.circle cx={cx + 20} cy={cy} r={12} fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
            <text x={cx} y={cy + 80} textAnchor="middle" fill="white" fontSize="11">90°</text>
          </>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* 杂化类型选择 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(configs).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => handleTypeChange(key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedType === key
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {cfg.hybridization}
          </button>
        ))}
      </div>

      {/* 动画控制 */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAnimation(!showAnimation)}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            showAnimation
              ? 'bg-orange-500 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {showAnimation ? '重置动画' : '播放杂化过程'}
        </button>
      </div>

      {/* 可视化区域 */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden h-[320px] border border-[var(--border-color)]">
        <svg width="100%" height="100%" viewBox="0 0 300 280">
          {/* 标题 */}
          <text x="150" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            {config.name} - {config.geometry}
          </text>

          {/* 杂化前的轨道 */}
          {!showAnimation || animationStep < 2 ? (
            <g transform="translate(0, 50)">
              <text x="150" y="0" textAnchor="middle" fill="#a78bfa" fontSize="11">
                杂化前
              </text>

              {/* s轨道 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <circle cx="60" cy="40" r="18" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <text x="60" y="70" textAnchor="middle" fill="#3b82f6" fontSize="10">s</text>
              </motion.g>

              {/* p轨道 */}
              {Array.from({ length: orbitalCount.p }).map((_, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * (i + 1) }}>
                  <ellipse cx={110 + i * 40} cy="40" rx="25" ry="10" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <text x={110 + i * 40} y="70" textAnchor="middle" fill="#ef4444" fontSize="10">p{['x', 'y', 'z'][i]}</text>
                </motion.g>
              ))}

              {/* d轨道 */}
              {Array.from({ length: orbitalCount.d }).map((_, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * (i + 4) }}>
                  <ellipse cx={230 + i * 35} cy="40" rx="20" ry="12" fill="none" stroke="#f59e0b" strokeWidth="2" transform={`rotate(45, ${230 + i * 35}, 40)`} />
                  <text x={230 + i * 35} y="70" textAnchor="middle" fill="#f59e0b" fontSize="10">d</text>
                </motion.g>
              ))}
            </g>
          ) : null}

          {/* 杂化箭头 */}
          <AnimatePresence>
            {showAnimation && animationStep >= 1 && animationStep < 3 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <text x="150" y="130" textAnchor="middle" fill="#22c55e" fontSize="24">↓</text>
                <text x="150" y="150" textAnchor="middle" fill="#22c55e" fontSize="11">杂化</text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* 杂化后的轨道 */}
          {showAnimation && animationStep >= 2 ? (
            <g transform="translate(0, 40)">
              <text x="150" y="0" textAnchor="middle" fill="#22c55e" fontSize="11">
                杂化后 - {orbitalCount.hybrid}个等价{config.hybridization}杂化轨道
              </text>
              {renderHybridOrbitals()}
            </g>
          ) : (
            <g transform="translate(0, 100)">
              {renderHybridOrbitals()}
            </g>
          )}

          {/* 中心原子 */}
          <circle cx="150" cy={showAnimation && animationStep >= 2 ? 170 : 230} r="8" fill="#3b82f6" />
        </svg>

        {/* 图例 */}
        <div className="absolute bottom-3 left-3 flex gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-blue-500" />
            <span>s轨道</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 rounded border-2 border-red-500" />
            <span>p轨道</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full border-2 border-green-500" />
            <span>杂化轨道</span>
          </div>
        </div>
      </div>

      {/* 信息面板 */}
      <motion.div
        key={selectedType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]"
      >
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{config.name}</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm mb-4">
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-[var(--text-tertiary)] text-xs">轨道组合</p>
            <p className="text-[var(--text-primary)] font-mono">{config.orbitals}</p>
          </div>
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-[var(--text-tertiary)] text-xs">空间构型</p>
            <p className="text-[var(--text-primary)]">{config.geometry}</p>
          </div>
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-[var(--text-tertiary)] text-xs">键角</p>
            <p className="text-[var(--text-primary)]">{config.angle}</p>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] text-sm mb-3">{config.description}</p>

        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
          <p className="text-green-400 font-medium mb-1">典型分子</p>
          <p className="text-[var(--text-secondary)]">{config.examples}</p>
        </div>
      </motion.div>

      {/* 杂化轨道比较表 */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)] overflow-x-auto">
        <h4 className="font-bold text-[var(--text-primary)] mb-3 text-center">杂化轨道比较</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="py-2 px-2 text-left text-[var(--text-secondary)]">杂化类型</th>
              <th className="py-2 px-2 text-center text-[var(--text-secondary)]">杂化轨道数</th>
              <th className="py-2 px-2 text-center text-[var(--text-secondary)]">空间构型</th>
              <th className="py-2 px-2 text-center text-[var(--text-secondary)]">键角</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            {Object.entries(configs).map(([key, cfg]) => (
              <tr
                key={key}
                className={`border-b border-[var(--border-color)]/50 ${selectedType === key ? 'bg-green-500/10' : ''}`}
              >
                <td className={`py-2 px-2 font-mono ${selectedType === key ? 'text-green-400 font-bold' : ''}`}>
                  {cfg.hybridization}
                </td>
                <td className="py-2 px-2 text-center">
                  {key === 'sp' ? 2 : key === 'sp2' ? 3 : key === 'sp3' ? 4 : key === 'sp3d' ? 5 : 6}
                </td>
                <td className="py-2 px-2 text-center">{cfg.geometry}</td>
                <td className="py-2 px-2 text-center">{cfg.angle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
