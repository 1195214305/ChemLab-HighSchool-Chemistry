import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
}

export default function DispersionSystemSimulation() {
  const [systemType, setSystemType] = useState<'solution' | 'colloid' | 'suspension'>('solution')
  const [showTyndall, setShowTyndall] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  const systemConfig = {
    solution: {
      name: '溶液',
      particleSize: '< 1nm',
      particleSizeNum: 3,
      count: 50,
      color: '#3b82f6',
      examples: 'NaCl溶液、糖水、酒精',
      characteristics: ['均一、稳定、透明', '不能透过半透膜', '无丁达尔效应'],
      canTyndall: false
    },
    colloid: {
      name: '胶体',
      particleSize: '1-100nm',
      particleSizeNum: 8,
      count: 25,
      color: '#f59e0b',
      examples: 'Fe(OH)₃胶体、豆浆、墨水',
      characteristics: ['较均一、较稳定', '能透过滤纸，不能透过半透膜', '有丁达尔效应'],
      canTyndall: true
    },
    suspension: {
      name: '悬浊液',
      particleSize: '> 100nm',
      particleSizeNum: 15,
      count: 15,
      color: '#ef4444',
      examples: '泥水、石灰乳、血液',
      characteristics: ['不均一、不稳定', '不能透过滤纸', '静置后分层'],
      canTyndall: false
    }
  }

  const config = systemConfig[systemType]

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < config.count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 260 + 20,
        y: Math.random() * 160 + 20,
        size: config.particleSizeNum + Math.random() * 2,
        color: config.color,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      })
    }
    setParticles(newParticles)
  }, [systemType, config.count, config.particleSizeNum, config.color])

  // 布朗运动动画
  useEffect(() => {
    if (systemType === 'suspension') return // 悬浊液沉降

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let newX = p.x + p.vx
        let newY = p.y + p.vy
        let newVx = p.vx + (Math.random() - 0.5) * 0.5
        let newVy = p.vy + (Math.random() - 0.5) * 0.5

        // 边界反弹
        if (newX < 20 || newX > 280) newVx = -newVx
        if (newY < 20 || newY > 180) newVy = -newVy

        newX = Math.max(20, Math.min(280, newX))
        newY = Math.max(20, Math.min(180, newY))

        // 速度限制
        const speed = Math.sqrt(newVx * newVx + newVy * newVy)
        const maxSpeed = systemType === 'solution' ? 3 : 1.5
        if (speed > maxSpeed) {
          newVx = (newVx / speed) * maxSpeed
          newVy = (newVy / speed) * maxSpeed
        }

        return { ...p, x: newX, y: newY, vx: newVx, vy: newVy }
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [systemType])

  // 悬浊液沉降效果
  useEffect(() => {
    if (systemType !== 'suspension') return

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: Math.min(p.y + 0.3, 170),
        x: p.x + (Math.random() - 0.5) * 0.5
      })))
    }, 100)

    return () => clearInterval(interval)
  }, [systemType])

  return (
    <div className="space-y-6">
      {/* 控制面板 */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => { setSystemType('solution'); setShowTyndall(false) }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            systemType === 'solution'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          溶液
        </button>
        <button
          onClick={() => setSystemType('colloid')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            systemType === 'colloid'
              ? 'bg-amber-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          胶体
        </button>
        <button
          onClick={() => { setSystemType('suspension'); setShowTyndall(false) }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            systemType === 'suspension'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          悬浊液
        </button>
      </div>

      {/* 丁达尔效应开关 */}
      {systemType === 'colloid' && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowTyndall(!showTyndall)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              showTyndall
                ? 'bg-yellow-400 text-black shadow-lg'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {showTyndall ? '关闭光束' : '照射光束（丁达尔效应）'}
          </button>
        </div>
      )}

      {/* 可视化区域 */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden h-[250px] border border-[var(--border-color)]">
        <svg width="100%" height="100%" viewBox="0 0 300 200">
          {/* 烧杯 */}
          <path
            d="M 40 30 L 40 170 Q 40 185 55 185 L 245 185 Q 260 185 260 170 L 260 30"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
          />

          {/* 液体背景 */}
          <rect
            x="43"
            y="35"
            width="214"
            height="147"
            fill={systemType === 'solution' ? 'rgba(59, 130, 246, 0.1)' :
                  systemType === 'colloid' ? 'rgba(245, 158, 11, 0.15)' :
                  'rgba(239, 68, 68, 0.1)'}
            rx="3"
          />

          {/* 丁达尔效应光束 */}
          {showTyndall && systemType === 'colloid' && (
            <>
              <defs>
                <linearGradient id="tyndallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,0,0.8)" />
                  <stop offset="50%" stopColor="rgba(255,255,0,0.4)" />
                  <stop offset="100%" stopColor="rgba(255,255,0,0.1)" />
                </linearGradient>
              </defs>
              <motion.polygon
                points="0,90 0,110 260,130 260,70"
                fill="url(#tyndallGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* 光源 */}
              <circle cx="5" cy="100" r="15" fill="#ffff00" opacity="0.8" />
              <circle cx="5" cy="100" r="10" fill="#ffffff" />
            </>
          )}

          {/* 粒子 */}
          {particles.map(particle => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={particle.color}
              opacity={0.8}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: particle.id * 0.01 }}
            />
          ))}

          {/* 标签 */}
          <text x="150" y="20" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            {config.name} (粒子直径: {config.particleSize})
          </text>
        </svg>

        {/* 粒子大小比较图例 */}
        <div className="absolute bottom-3 right-3 flex items-end gap-2 text-xs text-white/80">
          <div className="flex flex-col items-center">
            <div className="w-1 h-1 rounded-full bg-blue-500 mb-1" />
            <span>&lt;1nm</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mb-1" />
            <span>1-100nm</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mb-1" />
            <span>&gt;100nm</span>
          </div>
        </div>
      </div>

      {/* 信息面板 */}
      <motion.div
        key={systemType}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]"
      >
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{config.name}</h3>
        <p className="text-[var(--text-secondary)] mb-1">
          <span className="font-medium">粒子直径：</span>{config.particleSize}
        </p>
        <p className="text-[var(--text-secondary)] mb-3">
          <span className="font-medium">示例：</span>{config.examples}
        </p>
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--text-primary)]">特点：</p>
          <ul className="list-disc list-inside text-sm text-[var(--text-secondary)]">
            {config.characteristics.map((char, i) => (
              <li key={i}>{char}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* 分散系比较表 */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)] overflow-x-auto">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 text-center">分散系比较</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="py-2 px-3 text-left text-[var(--text-secondary)]">特性</th>
              <th className={`py-2 px-3 text-center ${systemType === 'solution' ? 'text-blue-400 font-bold' : 'text-[var(--text-secondary)]'}`}>溶液</th>
              <th className={`py-2 px-3 text-center ${systemType === 'colloid' ? 'text-amber-400 font-bold' : 'text-[var(--text-secondary)]'}`}>胶体</th>
              <th className={`py-2 px-3 text-center ${systemType === 'suspension' ? 'text-red-400 font-bold' : 'text-[var(--text-secondary)]'}`}>悬浊液</th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-secondary)]">
            <tr className="border-b border-[var(--border-color)]/50">
              <td className="py-2 px-3">粒子直径</td>
              <td className="py-2 px-3 text-center">&lt; 1nm</td>
              <td className="py-2 px-3 text-center">1-100nm</td>
              <td className="py-2 px-3 text-center">&gt; 100nm</td>
            </tr>
            <tr className="border-b border-[var(--border-color)]/50">
              <td className="py-2 px-3">稳定性</td>
              <td className="py-2 px-3 text-center">稳定</td>
              <td className="py-2 px-3 text-center">较稳定</td>
              <td className="py-2 px-3 text-center">不稳定</td>
            </tr>
            <tr className="border-b border-[var(--border-color)]/50">
              <td className="py-2 px-3">丁达尔效应</td>
              <td className="py-2 px-3 text-center">无</td>
              <td className="py-2 px-3 text-center">有</td>
              <td className="py-2 px-3 text-center">无</td>
            </tr>
            <tr>
              <td className="py-2 px-3">能否透过滤纸</td>
              <td className="py-2 px-3 text-center">能</td>
              <td className="py-2 px-3 text-center">能</td>
              <td className="py-2 px-3 text-center">不能</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
