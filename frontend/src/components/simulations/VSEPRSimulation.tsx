import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface MoleculeConfig {
  name: string
  formula: string
  centralAtom: string
  bondPairs: number
  lonePairs: number
  geometry: string
  angle: string
  shape: string
  example: string
}

export default function VSEPRSimulation() {
  const [selectedMolecule, setSelectedMolecule] = useState<string>('linear')
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const molecules: Record<string, MoleculeConfig> = {
    linear: {
      name: '直线形',
      formula: 'AX₂',
      centralAtom: 'Be',
      bondPairs: 2,
      lonePairs: 0,
      geometry: '直线形',
      angle: '180°',
      shape: 'linear',
      example: 'BeCl₂, CO₂, HCN'
    },
    trigonalPlanar: {
      name: '平面三角形',
      formula: 'AX₃',
      centralAtom: 'B',
      bondPairs: 3,
      lonePairs: 0,
      geometry: '平面三角形',
      angle: '120°',
      shape: 'trigonal-planar',
      example: 'BF₃, SO₃, NO₃⁻'
    },
    bent2: {
      name: '角形 (V形)',
      formula: 'AX₂E',
      centralAtom: 'S',
      bondPairs: 2,
      lonePairs: 1,
      geometry: '角形',
      angle: '约117°',
      shape: 'bent',
      example: 'SO₂, O₃, NO₂⁻'
    },
    tetrahedral: {
      name: '正四面体形',
      formula: 'AX₄',
      centralAtom: 'C',
      bondPairs: 4,
      lonePairs: 0,
      geometry: '正四面体形',
      angle: '109.5°',
      shape: 'tetrahedral',
      example: 'CH₄, CCl₄, SO₄²⁻'
    },
    trigonalPyramidal: {
      name: '三角锥形',
      formula: 'AX₃E',
      centralAtom: 'N',
      bondPairs: 3,
      lonePairs: 1,
      geometry: '三角锥形',
      angle: '约107°',
      shape: 'trigonal-pyramidal',
      example: 'NH₃, PCl₃, H₃O⁺'
    },
    bent4: {
      name: '角形 (V形)',
      formula: 'AX₂E₂',
      centralAtom: 'O',
      bondPairs: 2,
      lonePairs: 2,
      geometry: '角形',
      angle: '约104.5°',
      shape: 'bent',
      example: 'H₂O, H₂S, OF₂'
    }
  }

  const config = molecules[selectedMolecule]

  // 处理拖拽旋转
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - lastPos.current.x
    const deltaY = e.clientY - lastPos.current.y
    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  // 自动旋转
  useEffect(() => {
    if (isDragging) return
    const interval = setInterval(() => {
      setRotation(prev => ({ ...prev, y: prev.y + 0.5 }))
    }, 50)
    return () => clearInterval(interval)
  }, [isDragging])

  // 根据分子类型生成3D坐标
  const getAtomPositions = () => {
    const scale = 60
    const positions: { x: number; y: number; z: number; type: 'central' | 'bond' | 'lone' }[] = []

    // 中心原子
    positions.push({ x: 0, y: 0, z: 0, type: 'central' })

    switch (selectedMolecule) {
      case 'linear':
        positions.push({ x: -scale, y: 0, z: 0, type: 'bond' })
        positions.push({ x: scale, y: 0, z: 0, type: 'bond' })
        break
      case 'trigonalPlanar':
        positions.push({ x: 0, y: -scale, z: 0, type: 'bond' })
        positions.push({ x: scale * 0.866, y: scale * 0.5, z: 0, type: 'bond' })
        positions.push({ x: -scale * 0.866, y: scale * 0.5, z: 0, type: 'bond' })
        break
      case 'bent2':
        positions.push({ x: -scale * 0.866, y: scale * 0.5, z: 0, type: 'bond' })
        positions.push({ x: scale * 0.866, y: scale * 0.5, z: 0, type: 'bond' })
        positions.push({ x: 0, y: -scale * 0.8, z: 0, type: 'lone' })
        break
      case 'tetrahedral':
        positions.push({ x: 0, y: -scale, z: 0, type: 'bond' })
        positions.push({ x: scale * 0.943, y: scale * 0.333, z: 0, type: 'bond' })
        positions.push({ x: -scale * 0.471, y: scale * 0.333, z: scale * 0.816, type: 'bond' })
        positions.push({ x: -scale * 0.471, y: scale * 0.333, z: -scale * 0.816, type: 'bond' })
        break
      case 'trigonalPyramidal':
        positions.push({ x: 0, y: scale * 0.6, z: scale * 0.8, type: 'bond' })
        positions.push({ x: scale * 0.693, y: scale * 0.6, z: -scale * 0.4, type: 'bond' })
        positions.push({ x: -scale * 0.693, y: scale * 0.6, z: -scale * 0.4, type: 'bond' })
        positions.push({ x: 0, y: -scale * 0.8, z: 0, type: 'lone' })
        break
      case 'bent4':
        positions.push({ x: -scale * 0.6, y: scale * 0.5, z: 0, type: 'bond' })
        positions.push({ x: scale * 0.6, y: scale * 0.5, z: 0, type: 'bond' })
        positions.push({ x: 0, y: -scale * 0.5, z: scale * 0.5, type: 'lone' })
        positions.push({ x: 0, y: -scale * 0.5, z: -scale * 0.5, type: 'lone' })
        break
    }

    return positions
  }

  // 3D旋转变换
  const transform3D = (pos: { x: number; y: number; z: number }) => {
    const radX = (rotation.x * Math.PI) / 180
    const radY = (rotation.y * Math.PI) / 180

    // Y轴旋转
    let x = pos.x * Math.cos(radY) - pos.z * Math.sin(radY)
    let z = pos.x * Math.sin(radY) + pos.z * Math.cos(radY)
    let y = pos.y

    // X轴旋转
    const newY = y * Math.cos(radX) - z * Math.sin(radX)
    const newZ = y * Math.sin(radX) + z * Math.cos(radX)

    return { x, y: newY, z: newZ }
  }

  const positions = getAtomPositions()
  const transformedPositions = positions.map(p => ({
    ...transform3D(p),
    type: p.type
  }))

  // 按z排序以实现正确的遮挡
  const sortedPositions = [...transformedPositions].sort((a, b) => a.z - b.z)

  return (
    <div className="space-y-6">
      {/* 分子选择 */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(molecules).map(([key, mol]) => (
          <button
            key={key}
            onClick={() => setSelectedMolecule(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              selectedMolecule === key
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            }`}
          >
            {mol.name}
          </button>
        ))}
      </div>

      {/* 3D可视化区域 */}
      <div
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden h-[300px] border border-[var(--border-color)] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg width="100%" height="100%" viewBox="0 0 300 250">
          {/* 标题 */}
          <text x="150" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            {config.name} ({config.formula})
          </text>

          {/* 键角标注 */}
          <text x="150" y="45" textAnchor="middle" fill="#a78bfa" fontSize="12">
            键角: {config.angle}
          </text>

          <g transform="translate(150, 140)">
            {/* 绘制化学键 */}
            {sortedPositions.slice(1).map((pos, i) => {
              const central = transformedPositions[0]
              if (pos.type === 'lone') {
                // 孤电子对用虚线表示
                return (
                  <line
                    key={`bond-${i}`}
                    x1={central.x}
                    y1={central.y}
                    x2={pos.x * 0.7}
                    y2={pos.y * 0.7}
                    stroke="#a78bfa"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    opacity={0.6}
                  />
                )
              }
              return (
                <line
                  key={`bond-${i}`}
                  x1={central.x}
                  y1={central.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="white"
                  strokeWidth="3"
                  opacity={0.8 + pos.z / 200}
                />
              )
            })}

            {/* 绘制原子 */}
            {sortedPositions.map((pos, i) => {
              const size = pos.type === 'central' ? 20 : pos.type === 'bond' ? 15 : 12
              const color = pos.type === 'central' ? '#3b82f6' :
                           pos.type === 'bond' ? '#22c55e' : '#a78bfa'
              const scale = 1 + pos.z / 300

              return (
                <motion.g key={i}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size * scale}
                    fill={color}
                    opacity={pos.type === 'lone' ? 0.5 : 0.9}
                    stroke="white"
                    strokeWidth={pos.type === 'central' ? 2 : 1}
                  />
                  {pos.type === 'central' && (
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {config.centralAtom}
                    </text>
                  )}
                  {pos.type === 'lone' && (
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                    >
                      ••
                    </text>
                  )}
                </motion.g>
              )
            })}
          </g>

          {/* 图例 */}
          <g transform="translate(20, 210)">
            <circle cx="0" cy="0" r="8" fill="#3b82f6" />
            <text x="15" y="4" fill="white" fontSize="10">中心原子</text>
            <circle cx="80" cy="0" r="6" fill="#22c55e" />
            <text x="92" y="4" fill="white" fontSize="10">配位原子</text>
            <circle cx="160" cy="0" r="5" fill="#a78bfa" opacity="0.5" />
            <text x="172" y="4" fill="white" fontSize="10">孤电子对</text>
          </g>

          {/* 操作提示 */}
          <text x="150" y="240" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">
            拖拽旋转查看3D结构
          </text>
        </svg>
      </div>

      {/* 分子信息 */}
      <motion.div
        key={selectedMolecule}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]"
      >
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3">{config.name}</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-center">
            <p className="text-[var(--text-tertiary)] text-xs">通式</p>
            <p className="text-[var(--text-primary)] font-mono font-bold">{config.formula}</p>
          </div>
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-center">
            <p className="text-[var(--text-tertiary)] text-xs">成键电子对</p>
            <p className="text-[var(--text-primary)] font-bold">{config.bondPairs}</p>
          </div>
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-center">
            <p className="text-[var(--text-tertiary)] text-xs">孤电子对</p>
            <p className="text-[var(--text-primary)] font-bold">{config.lonePairs}</p>
          </div>
          <div className="p-2 bg-[var(--bg-secondary)] rounded-lg text-center">
            <p className="text-[var(--text-tertiary)] text-xs">键角</p>
            <p className="text-[var(--text-primary)] font-bold">{config.angle}</p>
          </div>
        </div>

        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <p className="text-purple-400 font-medium mb-1">示例分子</p>
          <p className="text-[var(--text-secondary)]">{config.example}</p>
        </div>
      </motion.div>

      {/* VSEPR理论说明 */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 border border-[var(--border-color)]">
        <h4 className="font-bold text-[var(--text-primary)] mb-3">VSEPR理论要点</h4>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>价层电子对互斥理论 (Valence Shell Electron Pair Repulsion)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>电子对（包括成键电子对和孤电子对）相互排斥，使分子采取能量最低的几何构型</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>孤电子对的排斥力 &gt; 成键电子对的排斥力，会压缩键角</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400">•</span>
            <span>分子的空间构型由成键电子对决定，孤电子对影响键角大小</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
