import { useState } from 'react'
import { motion } from 'framer-motion'

const elements = [
  { symbol: 'H', name: '氢', protons: 1, neutrons: 0, electrons: [1] },
  { symbol: 'He', name: '氦', protons: 2, neutrons: 2, electrons: [2] },
  { symbol: 'Li', name: '锂', protons: 3, neutrons: 4, electrons: [2, 1] },
  { symbol: 'Be', name: '铍', protons: 4, neutrons: 5, electrons: [2, 2] },
  { symbol: 'B', name: '硼', protons: 5, neutrons: 6, electrons: [2, 3] },
  { symbol: 'C', name: '碳', protons: 6, neutrons: 6, electrons: [2, 4] },
  { symbol: 'N', name: '氮', protons: 7, neutrons: 7, electrons: [2, 5] },
  { symbol: 'O', name: '氧', protons: 8, neutrons: 8, electrons: [2, 6] },
  { symbol: 'F', name: '氟', protons: 9, neutrons: 10, electrons: [2, 7] },
  { symbol: 'Ne', name: '氖', protons: 10, neutrons: 10, electrons: [2, 8] },
  { symbol: 'Na', name: '钠', protons: 11, neutrons: 12, electrons: [2, 8, 1] },
  { symbol: 'Mg', name: '镁', protons: 12, neutrons: 12, electrons: [2, 8, 2] },
  { symbol: 'Al', name: '铝', protons: 13, neutrons: 14, electrons: [2, 8, 3] },
  { symbol: 'Si', name: '硅', protons: 14, neutrons: 14, electrons: [2, 8, 4] },
  { symbol: 'P', name: '磷', protons: 15, neutrons: 16, electrons: [2, 8, 5] },
  { symbol: 'S', name: '硫', protons: 16, neutrons: 16, electrons: [2, 8, 6] },
  { symbol: 'Cl', name: '氯', protons: 17, neutrons: 18, electrons: [2, 8, 7] },
  { symbol: 'Ar', name: '氩', protons: 18, neutrons: 22, electrons: [2, 8, 8] },
]

export default function AtomStructureSimulation() {
  const [selectedElement, setSelectedElement] = useState(0)
  const [showElectronCloud, setShowElectronCloud] = useState(false)

  const element = elements[selectedElement]
  const shellRadii = [30, 55, 80]

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        选择不同元素，观察原子核外电子排布
      </div>

      {/* 元素选择 */}
      <div className="flex flex-wrap gap-2">
        {elements.map((el, index) => (
          <button
            key={el.symbol}
            onClick={() => setSelectedElement(index)}
            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
              selectedElement === index
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
            }`}
          >
            {el.symbol}
          </button>
        ))}
      </div>

      {/* 原子模型 */}
      <div className="relative h-64 sm:h-80 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-xs">
          {/* 电子云模式 */}
          {showElectronCloud && element.electrons.map((count, shellIndex) => (
            <motion.circle
              key={`cloud-${shellIndex}`}
              cx="100"
              cy="100"
              r={shellRadii[shellIndex]}
              fill="var(--text-tertiary)"
              opacity={0.1 + (count / 8) * 0.2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: shellIndex * 0.1 }}
            />
          ))}

          {/* 电子轨道 */}
          {element.electrons.map((_, shellIndex) => (
            <circle
              key={`orbit-${shellIndex}`}
              cx="100"
              cy="100"
              r={shellRadii[shellIndex]}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
          ))}

          {/* 原子核 */}
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <circle cx="100" cy="100" r="15" fill="var(--text-primary)" />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fill="var(--bg-primary)"
              fontSize="10"
              fontWeight="bold"
            >
              {element.protons}+
            </text>
          </motion.g>

          {/* 电子 */}
          {element.electrons.map((count, shellIndex) => {
            const radius = shellRadii[shellIndex]
            return Array.from({ length: count }).map((_, electronIndex) => {
              const angle = (electronIndex / count) * 2 * Math.PI - Math.PI / 2
              const x = 100 + radius * Math.cos(angle)
              const y = 100 + radius * Math.sin(angle)
              return (
                <motion.g
                  key={`electron-${shellIndex}-${electronIndex}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotate: [0, 360]
                  }}
                  transition={{
                    opacity: { duration: 0.3, delay: shellIndex * 0.1 + electronIndex * 0.05 },
                    scale: { duration: 0.3, delay: shellIndex * 0.1 + electronIndex * 0.05 },
                    rotate: { duration: 3 + shellIndex, repeat: Infinity, ease: 'linear' }
                  }}
                  style={{ transformOrigin: '100px 100px' }}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="var(--text-secondary)"
                  />
                  <text
                    x={x}
                    y={y + 1}
                    textAnchor="middle"
                    fill="var(--bg-primary)"
                    fontSize="6"
                    fontWeight="bold"
                  >
                    -
                  </text>
                </motion.g>
              )
            })
          })}
        </svg>
      </div>

      {/* 控制面板 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowElectronCloud(!showElectronCloud)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showElectronCloud
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
          }`}
        >
          {showElectronCloud ? '隐藏电子云' : '显示电子云'}
        </button>
      </div>

      {/* 元素信息 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{element.symbol}</div>
          <div className="text-sm text-[var(--text-secondary)]">{element.name}</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{element.protons}</div>
          <div className="text-sm text-[var(--text-secondary)]">质子数</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{element.neutrons}</div>
          <div className="text-sm text-[var(--text-secondary)]">中子数</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{element.electrons.join('-')}</div>
          <div className="text-sm text-[var(--text-secondary)]">电子排布</div>
        </div>
      </div>

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">核外电子排布规律：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>第一层最多容纳2个电子</li>
          <li>第二层最多容纳8个电子</li>
          <li>第三层最多容纳18个电子（但作为最外层时最多8个）</li>
          <li>最外层电子数决定元素的化学性质</li>
        </ul>
      </div>
    </div>
  )
}
