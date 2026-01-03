import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BenzeneSimulation() {
  const [viewMode, setViewMode] = useState<'kekule' | 'delocalized' | '3d'>('kekule')
  const [showHydrogen, setShowHydrogen] = useState(true)
  const [rotation, setRotation] = useState(0)

  // 苯环顶点坐标
  const hexagonPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180)
    return {
      x: 100 + 40 * Math.cos(angle),
      y: 100 + 40 * Math.sin(angle)
    }
  })

  // 氢原子位置
  const hydrogenPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180)
    return {
      x: 100 + 65 * Math.cos(angle),
      y: 100 + 65 * Math.sin(angle)
    }
  })

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        探索苯分子的结构特点
      </div>

      {/* 视图模式选择 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setViewMode('kekule')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'kekule'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          凯库勒式
        </button>
        <button
          onClick={() => setViewMode('delocalized')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === 'delocalized'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          离域π键
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === '3d'
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          3D视图
        </button>
      </div>

      {/* 分子模型 */}
      <div className="relative h-64 sm:h-72 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {viewMode === 'kekule' && (
            <g>
              {/* 单键 */}
              {[0, 2, 4].map(i => (
                <line
                  key={`single-${i}`}
                  x1={hexagonPoints[i].x}
                  y1={hexagonPoints[i].y}
                  x2={hexagonPoints[(i + 1) % 6].x}
                  y2={hexagonPoints[(i + 1) % 6].y}
                  stroke="var(--text-primary)"
                  strokeWidth="3"
                />
              ))}

              {/* 双键 */}
              {[1, 3, 5].map(i => {
                const p1 = hexagonPoints[i]
                const p2 = hexagonPoints[(i + 1) % 6]
                const dx = (p2.x - p1.x) * 0.1
                const dy = (p2.y - p1.y) * 0.1
                const nx = -dy * 0.5
                const ny = dx * 0.5
                return (
                  <g key={`double-${i}`}>
                    <line
                      x1={p1.x + nx}
                      y1={p1.y + ny}
                      x2={p2.x + nx}
                      y2={p2.y + ny}
                      stroke="var(--text-primary)"
                      strokeWidth="3"
                    />
                    <line
                      x1={p1.x - nx + dx}
                      y1={p1.y - ny + dy}
                      x2={p2.x - nx - dx}
                      y2={p2.y - ny - dy}
                      stroke="var(--text-primary)"
                      strokeWidth="3"
                    />
                  </g>
                )
              })}
            </g>
          )}

          {viewMode === 'delocalized' && (
            <g>
              {/* 六边形骨架 */}
              <polygon
                points={hexagonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="3"
              />

              {/* 内圆表示离域π键 */}
              <motion.circle
                cx="100"
                cy="100"
                r="25"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
              />
            </g>
          )}

          {viewMode === '3d' && (
            <motion.g
              animate={{ rotate: rotation }}
              style={{ transformOrigin: '100px 100px' }}
            >
              {/* 六边形骨架 */}
              <polygon
                points={hexagonPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="3"
              />

              {/* π电子云（上下） */}
              <ellipse
                cx="100"
                cy="100"
                rx="45"
                ry="15"
                fill="var(--accent)"
                opacity="0.3"
                transform="translate(0, -20)"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="45"
                ry="15"
                fill="var(--accent)"
                opacity="0.3"
                transform="translate(0, 20)"
              />
            </motion.g>
          )}

          {/* 碳原子 */}
          {hexagonPoints.map((point, i) => (
            <motion.g
              key={`carbon-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="var(--text-primary)"
              />
              <text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                fill="var(--bg-primary)"
                fontSize="10"
                fontWeight="bold"
              >
                C
              </text>
            </motion.g>
          ))}

          {/* 氢原子和C-H键 */}
          {showHydrogen && hexagonPoints.map((cPoint, i) => {
            const hPoint = hydrogenPoints[i]
            return (
              <motion.g
                key={`hydrogen-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <line
                  x1={cPoint.x}
                  y1={cPoint.y}
                  x2={hPoint.x}
                  y2={hPoint.y}
                  stroke="var(--text-secondary)"
                  strokeWidth="2"
                />
                <circle
                  cx={hPoint.x}
                  cy={hPoint.y}
                  r="8"
                  fill="var(--text-secondary)"
                />
                <text
                  x={hPoint.x}
                  y={hPoint.y + 3}
                  textAnchor="middle"
                  fill="var(--bg-primary)"
                  fontSize="8"
                  fontWeight="bold"
                >
                  H
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* 控制面板 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowHydrogen(!showHydrogen)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            showHydrogen
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
          }`}
        >
          {showHydrogen ? '隐藏氢原子' : '显示氢原子'}
        </button>
        {viewMode === '3d' && (
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="flex-1 accent-[var(--text-primary)]"
          />
        )}
      </div>

      {/* 分子信息 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-xl font-bold text-[var(--text-primary)]">C₆H₆</div>
          <div className="text-sm text-[var(--text-secondary)]">分子式</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-xl font-bold text-[var(--text-primary)]">78</div>
          <div className="text-sm text-[var(--text-secondary)]">相对分子质量</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-xl font-bold text-[var(--text-primary)]">平面</div>
          <div className="text-sm text-[var(--text-secondary)]">分子构型</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="text-xl font-bold text-[var(--text-primary)]">120°</div>
          <div className="text-sm text-[var(--text-secondary)]">键角</div>
        </div>
      </div>

      {/* 结构说明 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
        <h4 className="font-medium text-[var(--text-primary)] mb-2">
          {viewMode === 'kekule' && '凯库勒式'}
          {viewMode === 'delocalized' && '离域π键模型'}
          {viewMode === '3d' && '3D电子云模型'}
        </h4>
        <p className="text-sm text-[var(--text-secondary)]">
          {viewMode === 'kekule' && '凯库勒提出的苯结构式，用单双键交替表示。但实际上苯环中不存在定域的单双键。'}
          {viewMode === 'delocalized' && '现代结构理论认为，苯环中6个碳原子的p轨道相互重叠，形成离域π键，电子在整个环上均匀分布。'}
          {viewMode === '3d' && '苯分子是平面正六边形结构，6个碳原子都是sp²杂化，π电子云分布在苯环平面的上下两侧。'}
        </p>
      </div>

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">苯的结构特点：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>6个碳原子构成平面正六边形</li>
          <li>所有C-C键等长（0.140nm），介于单键和双键之间</li>
          <li>具有特殊的稳定性（芳香性）</li>
          <li>易发生取代反应，难发生加成反应</li>
          <li>能使溴水褪色（萃取），但不能使酸性KMnO₄褪色</li>
        </ul>
      </div>
    </div>
  )
}
