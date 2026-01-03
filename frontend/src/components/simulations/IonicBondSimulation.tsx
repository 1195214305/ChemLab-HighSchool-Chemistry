import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function IonicBondSimulation() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    { title: '初始状态', description: '钠原子（Na）有11个电子，最外层1个；氯原子（Cl）有17个电子，最外层7个' },
    { title: '电子转移', description: '钠原子失去最外层1个电子，转移给氯原子' },
    { title: '形成离子', description: '钠原子变成Na⁺（带正电），氯原子变成Cl⁻（带负电）' },
    { title: '离子键形成', description: '正负离子通过静电引力结合，形成离子键' },
  ]

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(timer)
  }, [isPlaying])

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        观察钠和氯形成离子键的过程
      </div>

      {/* 动画区域 */}
      <div className="relative h-64 sm:h-80 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
        <svg viewBox="0 0 300 200" className="w-full h-full">
          {/* 钠原子/离子 */}
          <motion.g
            animate={{
              x: step >= 3 ? 50 : 0
            }}
            transition={{ duration: 0.8 }}
          >
            {/* 原子核 */}
            <circle cx="80" cy="100" r="20" fill="var(--text-primary)" />
            <text x="80" y="105" textAnchor="middle" fill="var(--bg-primary)" fontSize="12" fontWeight="bold">
              Na
            </text>

            {/* 第一层电子 */}
            <circle cx="80" cy="100" r="30" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="80" cy="70" r="4" fill="var(--text-secondary)" />
            <circle cx="80" cy="130" r="4" fill="var(--text-secondary)" />

            {/* 第二层电子 */}
            <circle cx="80" cy="100" r="45" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={`na-e2-${i}`}
                cx={80 + 45 * Math.cos((angle * Math.PI) / 180)}
                cy={100 + 45 * Math.sin((angle * Math.PI) / 180)}
                r="4"
                fill="var(--text-secondary)"
              />
            ))}

            {/* 最外层电子（会转移） */}
            <motion.circle
              cx="80"
              cy="40"
              r="5"
              fill="var(--accent)"
              animate={{
                cx: step >= 1 ? 220 : 80,
                cy: step >= 1 ? 40 : 40,
                opacity: step >= 2 ? 0 : 1
              }}
              transition={{ duration: 0.8 }}
            />
            {step < 1 && (
              <circle cx="80" cy="100" r="60" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 2" />
            )}

            {/* 离子标记 */}
            {step >= 2 && (
              <motion.text
                x="105"
                y="75"
                fill="var(--text-primary)"
                fontSize="14"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                +
              </motion.text>
            )}
          </motion.g>

          {/* 氯原子/离子 */}
          <motion.g
            animate={{
              x: step >= 3 ? -50 : 0
            }}
            transition={{ duration: 0.8 }}
          >
            {/* 原子核 */}
            <circle cx="220" cy="100" r="20" fill="var(--text-primary)" />
            <text x="220" y="105" textAnchor="middle" fill="var(--bg-primary)" fontSize="12" fontWeight="bold">
              Cl
            </text>

            {/* 第一层电子 */}
            <circle cx="220" cy="100" r="30" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="220" cy="70" r="4" fill="var(--text-secondary)" />
            <circle cx="220" cy="130" r="4" fill="var(--text-secondary)" />

            {/* 第二层电子 */}
            <circle cx="220" cy="100" r="45" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 2" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <circle
                key={`cl-e2-${i}`}
                cx={220 + 45 * Math.cos((angle * Math.PI) / 180)}
                cy={100 + 45 * Math.sin((angle * Math.PI) / 180)}
                r="4"
                fill="var(--text-secondary)"
              />
            ))}

            {/* 第三层电子（7个） */}
            <circle cx="220" cy="100" r="60" fill="none" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 2" />
            {[0, 51, 103, 154, 206, 257, 309].map((angle, i) => (
              <circle
                key={`cl-e3-${i}`}
                cx={220 + 60 * Math.cos((angle * Math.PI) / 180)}
                cy={100 + 60 * Math.sin((angle * Math.PI) / 180)}
                r="4"
                fill="var(--text-secondary)"
              />
            ))}

            {/* 获得的电子 */}
            {step >= 2 && (
              <motion.circle
                cx={220 + 60 * Math.cos((360 * Math.PI) / 180)}
                cy={100 + 60 * Math.sin((360 * Math.PI) / 180)}
                r="5"
                fill="var(--accent)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}

            {/* 离子标记 */}
            {step >= 2 && (
              <motion.text
                x="245"
                y="75"
                fill="var(--text-primary)"
                fontSize="14"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                -
              </motion.text>
            )}
          </motion.g>

          {/* 离子键标记 */}
          {step >= 3 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <line x1="135" y1="100" x2="165" y2="100" stroke="var(--text-primary)" strokeWidth="3" />
              <text x="150" y="130" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">
                离子键
              </text>
            </motion.g>
          )}

          {/* 电子转移箭头 */}
          {step === 1 && (
            <motion.path
              d="M 100 50 Q 150 30 200 50"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
          )}

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* 步骤指示器 */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => { setStep(index); setIsPlaying(false) }}
            className={`w-3 h-3 rounded-full transition-colors ${
              step === index ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-color)]'
            }`}
          />
        ))}
      </div>

      {/* 当前步骤说明 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
        <h4 className="font-medium text-[var(--text-primary)] mb-1">
          {steps[step].title}
        </h4>
        <p className="text-sm text-[var(--text-secondary)]">
          {steps[step].description}
        </p>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setStep(prev => (prev - 1 + 4) % 4)}
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
        >
          上一步
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isPlaying
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]'
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
          }`}
        >
          {isPlaying ? '暂停' : '自动播放'}
        </button>
        <button
          onClick={() => setStep(prev => (prev + 1) % 4)}
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
        >
          下一步
        </button>
      </div>

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">离子键的特点：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>由阴阳离子通过静电引力形成</li>
          <li>通常形成于活泼金属与活泼非金属之间</li>
          <li>离子化合物熔沸点高，硬度大</li>
          <li>熔融或溶于水后能导电</li>
        </ul>
      </div>
    </div>
  )
}
