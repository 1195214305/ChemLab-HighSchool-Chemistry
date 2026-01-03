import { useState } from 'react'
import { motion } from 'framer-motion'

const molecules = [
  {
    name: 'H₂',
    fullName: '氢气',
    atoms: [
      { symbol: 'H', x: 80, y: 100, electrons: 1 },
      { symbol: 'H', x: 160, y: 100, electrons: 1 }
    ],
    bonds: [{ type: 'single', x1: 95, y1: 100, x2: 145, y2: 100 }],
    sharedElectrons: [{ x: 120, y: 100 }],
    description: '两个氢原子各提供1个电子，形成1对共用电子对'
  },
  {
    name: 'O₂',
    fullName: '氧气',
    atoms: [
      { symbol: 'O', x: 80, y: 100, electrons: 6 },
      { symbol: 'O', x: 160, y: 100, electrons: 6 }
    ],
    bonds: [
      { type: 'double', x1: 95, y1: 95, x2: 145, y2: 95 },
      { type: 'double', x1: 95, y1: 105, x2: 145, y2: 105 }
    ],
    sharedElectrons: [{ x: 120, y: 95 }, { x: 120, y: 105 }],
    description: '两个氧原子各提供2个电子，形成2对共用电子对（双键）'
  },
  {
    name: 'N₂',
    fullName: '氮气',
    atoms: [
      { symbol: 'N', x: 80, y: 100, electrons: 5 },
      { symbol: 'N', x: 160, y: 100, electrons: 5 }
    ],
    bonds: [
      { type: 'triple', x1: 95, y1: 90, x2: 145, y2: 90 },
      { type: 'triple', x1: 95, y1: 100, x2: 145, y2: 100 },
      { type: 'triple', x1: 95, y1: 110, x2: 145, y2: 110 }
    ],
    sharedElectrons: [{ x: 120, y: 90 }, { x: 120, y: 100 }, { x: 120, y: 110 }],
    description: '两个氮原子各提供3个电子，形成3对共用电子对（三键）'
  },
  {
    name: 'HCl',
    fullName: '氯化氢',
    atoms: [
      { symbol: 'H', x: 80, y: 100, electrons: 1 },
      { symbol: 'Cl', x: 160, y: 100, electrons: 7 }
    ],
    bonds: [{ type: 'single', x1: 95, y1: 100, x2: 135, y2: 100 }],
    sharedElectrons: [{ x: 115, y: 100 }],
    description: '氢原子提供1个电子，氯原子提供1个电子，形成极性共价键',
    polar: true
  },
  {
    name: 'H₂O',
    fullName: '水',
    atoms: [
      { symbol: 'H', x: 60, y: 140, electrons: 1 },
      { symbol: 'O', x: 120, y: 100, electrons: 6 },
      { symbol: 'H', x: 180, y: 140, electrons: 1 }
    ],
    bonds: [
      { type: 'single', x1: 75, y1: 130, x2: 105, y2: 110 },
      { type: 'single', x1: 135, y1: 110, x2: 165, y2: 130 }
    ],
    sharedElectrons: [{ x: 90, y: 120 }, { x: 150, y: 120 }],
    description: '氧原子与两个氢原子各形成1对共用电子对，键角约104.5°',
    polar: true
  }
]

export default function CovalentBondSimulation() {
  const [selectedMolecule, setSelectedMolecule] = useState(0)
  const [showElectrons, setShowElectrons] = useState(true)

  const molecule = molecules[selectedMolecule]

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        选择不同分子，观察共价键的形成
      </div>

      {/* 分子选择 */}
      <div className="flex flex-wrap gap-2">
        {molecules.map((mol, index) => (
          <button
            key={mol.name}
            onClick={() => setSelectedMolecule(index)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedMolecule === index
                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
            }`}
          >
            {mol.name}
          </button>
        ))}
      </div>

      {/* 分子模型 */}
      <div className="relative h-64 sm:h-72 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
        <svg viewBox="0 0 240 200" className="w-full h-full">
          {/* 共价键 */}
          {molecule.bonds.map((bond, index) => (
            <motion.line
              key={`bond-${index}`}
              x1={bond.x1}
              y1={bond.y1}
              x2={bond.x2}
              y2={bond.y2}
              stroke="var(--text-primary)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}

          {/* 共用电子对 */}
          {showElectrons && molecule.sharedElectrons.map((electron, index) => (
            <motion.g
              key={`shared-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <circle cx={electron.x - 5} cy={electron.y} r="4" fill="var(--accent)" />
              <circle cx={electron.x + 5} cy={electron.y} r="4" fill="var(--accent)" />
            </motion.g>
          ))}

          {/* 原子 */}
          {molecule.atoms.map((atom, index) => (
            <motion.g
              key={`atom-${index}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
            >
              <circle
                cx={atom.x}
                cy={atom.y}
                r={atom.symbol === 'H' ? 15 : 25}
                fill="var(--text-primary)"
              />
              <text
                x={atom.x}
                y={atom.y + 5}
                textAnchor="middle"
                fill="var(--bg-primary)"
                fontSize={atom.symbol === 'H' ? '12' : '14'}
                fontWeight="bold"
              >
                {atom.symbol}
              </text>
            </motion.g>
          ))}

          {/* 极性标记 */}
          {molecule.polar && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <text x="60" y="170" fill="var(--text-secondary)" fontSize="12">δ+</text>
              <text x="170" y="80" fill="var(--text-secondary)" fontSize="12">δ-</text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* 控制面板 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowElectrons(!showElectrons)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showElectrons
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)]'
          }`}
        >
          {showElectrons ? '隐藏电子对' : '显示电子对'}
        </button>
      </div>

      {/* 分子信息 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{molecule.name}</div>
          <div className="text-sm text-[var(--text-secondary)]">{molecule.fullName}</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{molecule.bonds.length}</div>
          <div className="text-sm text-[var(--text-secondary)]">共用电子对</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{molecule.polar ? '极性' : '非极性'}</div>
          <div className="text-sm text-[var(--text-secondary)]">分子极性</div>
        </div>
      </div>

      {/* 描述 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
        <p className="text-sm text-[var(--text-secondary)]">{molecule.description}</p>
      </div>

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">共价键的特点：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>原子间通过共用电子对形成</li>
          <li>单键：1对共用电子对；双键：2对；三键：3对</li>
          <li>极性键：共用电子对偏向电负性大的原子</li>
          <li>非极性键：共用电子对不偏移</li>
        </ul>
      </div>
    </div>
  )
}
