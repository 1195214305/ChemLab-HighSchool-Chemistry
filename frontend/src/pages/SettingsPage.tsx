import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../store/settings'
import { useTheme } from '../store/theme'
import { Key, Sun, Moon, Save, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const { apiKey, setApiKey, clearApiKey } = useSettings()
  const { theme, setTheme } = useTheme()
  const [inputKey, setInputKey] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setApiKey(inputKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    setInputKey('')
    clearApiKey()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            设置
          </h1>
          <p className="text-[var(--text-secondary)] mb-8">
            配置 AI 辅导和界面偏好
          </p>
        </motion.div>

        {/* AI API Key Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
              <Key size={20} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                通义千问 API Key
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                配置后可使用 AI 智能辅导功能
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="输入你的 API Key (sk-...)"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-secondary)]"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={!inputKey}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {saved ? (
                  <>
                    <CheckCircle size={20} />
                    已保存
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    保存
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-3 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[var(--bg-tertiary)]">
              <p className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">获取 API Key：</strong>
                <br />
                1. 访问{' '}
                <a
                  href="https://dashscope.console.aliyun.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[var(--text-primary)]"
                >
                  阿里云百炼平台
                </a>
                <br />
                2. 登录后在「API-KEY管理」中创建 Key
                <br />
                3. 复制 Key 粘贴到上方输入框
              </p>
            </div>
          </div>
        </motion.section>

        {/* Theme Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            主题设置
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-[var(--text-primary)] bg-[var(--bg-tertiary)]'
                  : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Sun size={24} className="text-[var(--text-primary)]" />
                <span className="font-medium text-[var(--text-primary)]">浅色</span>
              </div>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-[var(--text-primary)] bg-[var(--bg-tertiary)]'
                  : 'border-[var(--border-color)] hover:border-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Moon size={24} className="text-[var(--text-primary)]" />
                <span className="font-medium text-[var(--text-primary)]">深色</span>
              </div>
            </button>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
        >
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            关于
          </h2>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <p>ChemLab - 高中化学知识学习系统</p>
            <p>版本：1.0.0</p>
            <p>涵盖人教版高中化学必修一、必修二及选修内容</p>
            <p className="pt-2 border-t border-[var(--border-color)]">
              由阿里云 ESA Pages 提供加速、计算和保护
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
