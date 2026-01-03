import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ChemicalEquilibriumSimulation() {
  const [temperature, setTemperature] = useState(25)
  const [pressure, setPressure] = useState(1)
  const [concentration, setConcentration] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [data, setData] = useState<{ time: number; forward: number; reverse: number }[]>([])
  const [equilibriumReached, setEquilibriumReached] = useState(false)

  // 模拟反应: N2 + 3H2 ⇌ 2NH3 (放热反应)
  const calculateRates = () => {
    // 正反应速率受温度、压力、浓度影响
    const tempFactor = Math.exp(-0.02 * (temperature - 25))
    const pressureFactor = Math.pow(pressure, 0.5)
    const concFactor = concentration

    const forwardRate = 50 * tempFactor * pressureFactor * concFactor
    const reverseRate = 30 * (1 / tempFactor) * (1 / pressureFactor)

    return { forwardRate, reverseRate }
  }

  useEffect(() => {
    if (!isRunning) return

    let time = data.length > 0 ? data[data.length - 1].time : 0
    const { forwardRate, reverseRate } = calculateRates()

    const interval = setInterval(() => {
      time += 1
      const progress = Math.min(time / 20, 1)

      // 模拟趋向平衡的过程
      const currentForward = forwardRate * (1 - progress * 0.5) + reverseRate * progress * 0.5
      const currentReverse = reverseRate * (1 - progress * 0.3) + forwardRate * progress * 0.3

      setData(prev => {
        const newData = [...prev, {
          time,
          forward: Math.round(currentForward),
          reverse: Math.round(currentReverse)
        }]
        return newData.slice(-30)
      })

      if (progress >= 1 && !equilibriumReached) {
        setEquilibriumReached(true)
      }
    }, 300)

    return () => clearInterval(interval)
  }, [isRunning, temperature, pressure, concentration])

  const reset = () => {
    setIsRunning(false)
    setData([])
    setEquilibriumReached(false)
  }

  const { forwardRate, reverseRate } = calculateRates()

  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="text-sm text-[var(--text-secondary)]">
        模拟合成氨反应的化学平衡：N₂ + 3H₂ ⇌ 2NH₃ (放热反应)
      </div>

      {/* 控制面板 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 温度 */}
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">温度</span>
            <span className="text-sm text-[var(--text-secondary)]">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={temperature}
            onChange={(e) => {
              setTemperature(Number(e.target.value))
              setEquilibriumReached(false)
            }}
            className="w-full accent-[var(--text-primary)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
            <span>低温</span>
            <span>高温</span>
          </div>
        </div>

        {/* 压强 */}
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">压强</span>
            <span className="text-sm text-[var(--text-secondary)]">{pressure} atm</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={pressure}
            onChange={(e) => {
              setPressure(Number(e.target.value))
              setEquilibriumReached(false)
            }}
            className="w-full accent-[var(--text-primary)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
            <span>低压</span>
            <span>高压</span>
          </div>
        </div>

        {/* 浓度 */}
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">N₂浓度</span>
            <span className="text-sm text-[var(--text-secondary)]">{concentration} mol/L</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={concentration}
            onChange={(e) => {
              setConcentration(Number(e.target.value))
              setEquilibriumReached(false)
            }}
            className="w-full accent-[var(--text-primary)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1">
            <span>低</span>
            <span>高</span>
          </div>
        </div>
      </div>

      {/* 反应速率显示 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{Math.round(forwardRate)}</div>
          <div className="text-sm text-[var(--text-secondary)]">正反应速率</div>
        </div>
        <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-center">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{Math.round(reverseRate)}</div>
          <div className="text-sm text-[var(--text-secondary)]">逆反应速率</div>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]'
              : 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
          }`}
        >
          {isRunning ? '暂停' : '开始模拟'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
        >
          重置
        </button>
      </div>

      {/* 平衡状态指示 */}
      {equilibriumReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] text-center"
        >
          已达到化学平衡！正逆反应速率相等
        </motion.div>
      )}

      {/* 图表 */}
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-64"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis
                dataKey="time"
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                label={{ value: '时间', position: 'bottom', fill: 'var(--text-tertiary)' }}
              />
              <YAxis
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                label={{ value: '速率', angle: -90, position: 'insideLeft', fill: 'var(--text-tertiary)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="forward"
                stroke="var(--text-primary)"
                strokeWidth={2}
                dot={false}
                name="正反应速率"
              />
              <Line
                type="monotone"
                dataKey="reverse"
                stroke="var(--text-secondary)"
                strokeWidth={2}
                dot={false}
                name="逆反应速率"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* 平衡移动分析 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
        <h4 className="font-medium text-[var(--text-primary)] mb-2">勒夏特列原理分析：</h4>
        <ul className="text-sm text-[var(--text-secondary)] space-y-1">
          <li>• 升高温度：平衡向吸热方向（逆反应）移动，NH₃产率降低</li>
          <li>• 增大压强：平衡向气体体积减小方向（正反应）移动，NH₃产率提高</li>
          <li>• 增大N₂浓度：平衡向正反应方向移动，NH₃产率提高</li>
        </ul>
      </div>

      {/* 知识点提示 */}
      <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)] mb-2">化学平衡的特点：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>动态平衡：正逆反应仍在进行，但速率相等</li>
          <li>平衡常数K只与温度有关</li>
          <li>改变条件会使平衡移动，但K值不变（温度不变时）</li>
          <li>催化剂不改变平衡位置，只加快达到平衡的速度</li>
        </ul>
      </div>
    </div>
  )
}
