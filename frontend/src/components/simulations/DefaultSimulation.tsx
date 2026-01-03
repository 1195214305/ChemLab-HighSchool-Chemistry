import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

export default function DefaultSimulation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
        <Info size={32} className="text-[var(--text-secondary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
        演示开发中
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md">
        该知识点的交互式演示正在开发中，敬请期待。
        你可以使用右下角的 AI 辅导功能来学习相关内容。
      </p>
    </motion.div>
  )
}
