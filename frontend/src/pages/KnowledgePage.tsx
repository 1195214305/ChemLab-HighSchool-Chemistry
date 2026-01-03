import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { getKnowledgePointById, getCategoryById } from '../data/knowledge'
import { ChevronRight, ArrowLeft, MessageCircle, Send, X } from 'lucide-react'
import { useSettings } from '../store/settings'

// 导入模拟组件
import AtomStructureSimulation from '../components/simulations/AtomStructureSimulation'
import IonicBondSimulation from '../components/simulations/IonicBondSimulation'
import CovalentBondSimulation from '../components/simulations/CovalentBondSimulation'
import GalvanicCellSimulation from '../components/simulations/GalvanicCellSimulation'
import ChemicalEquilibriumSimulation from '../components/simulations/ChemicalEquilibriumSimulation'
import TitrationSimulation from '../components/simulations/TitrationSimulation'
import BenzeneSimulation from '../components/simulations/BenzeneSimulation'
import DefaultSimulation from '../components/simulations/DefaultSimulation'

const simulationMap: Record<string, React.ComponentType> = {
  'atom-structure': AtomStructureSimulation,
  'periodic-table': AtomStructureSimulation,
  'periodic-law': AtomStructureSimulation,
  'ionic-bond': IonicBondSimulation,
  'ionic-reaction': IonicBondSimulation,
  'covalent-bond': CovalentBondSimulation,
  'metallic-bond': CovalentBondSimulation,
  'intermolecular-force': CovalentBondSimulation,
  'galvanic-cell': GalvanicCellSimulation,
  'electrolysis': GalvanicCellSimulation,
  'metal-corrosion': GalvanicCellSimulation,
  'chemical-equilibrium': ChemicalEquilibriumSimulation,
  'reaction-rate-factors': ChemicalEquilibriumSimulation,
  'equilibrium-calculation': ChemicalEquilibriumSimulation,
  'titration': TitrationSimulation,
  'water-ionization': TitrationSimulation,
  'salt-hydrolysis': TitrationSimulation,
  'benzene': BenzeneSimulation,
  'alkane': BenzeneSimulation,
  'alkene': BenzeneSimulation,
  'alkyne': BenzeneSimulation,
}

export default function KnowledgePage() {
  const { knowledgeId } = useParams<{ knowledgeId: string }>()
  const point = getKnowledgePointById(knowledgeId || '')
  const category = point ? getCategoryById(point.category) : null
  const { apiKey } = useSettings()

  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!point) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            未找到该知识点
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  const SimulationComponent = simulationMap[point.id] || DefaultSimulation

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      if (!apiKey) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '请先在设置页面配置通义千问 API Key 才能使用 AI 辅导功能。'
        }])
        setLoading(false)
        return
      }

      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-turbo',
          messages: [
            {
              role: 'system',
              content: `你是一位专业的高中化学老师，正在辅导学生学习"${point.title}"这个知识点。
知识点描述：${point.description}
关键词：${point.keywords.join('、')}

请根据学生的问题，提供清晰、准确的化学知识解答。
- 使用简洁易懂的语言
- 结合具体例子和化学方程式解释原理
- 适当使用专业术语，但要解释其含义
- 鼓励学生思考和探索
- 如果涉及实验，说明实验原理和注意事项`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      const assistantMessage = data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。'

      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，请求失败。请检查你的 API Key 是否正确，或稍后重试。'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8 flex-wrap">
          <Link to="/" className="hover:text-[var(--text-primary)]">首页</Link>
          <ChevronRight size={16} />
          {category && (
            <>
              <Link to={`/category/${category.id}`} className="hover:text-[var(--text-primary)]">
                {category.name}
              </Link>
              <ChevronRight size={16} />
            </>
          )}
          <span className="text-[var(--text-primary)]">{point.title}</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {point.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-4">
            {point.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {point.keywords.map(keyword => (
              <span
                key={keyword}
                className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--text-secondary)]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Simulation Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                交互式演示
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <SimulationComponent />
            </div>
          </div>
        </motion.div>

        {/* AI Chat Button */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-40"
        >
          <MessageCircle size={24} />
        </button>

        {/* AI Chat Panel */}
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 w-[calc(100%-3rem)] sm:w-96 h-[500px] max-h-[70vh] rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl flex flex-col z-50"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">AI 辅导</h3>
                <p className="text-xs text-[var(--text-tertiary)]">通义千问</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-[var(--text-tertiary)] py-8">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">有问题就问我吧！</p>
                  <p className="text-xs mt-1">关于「{point.title}」的任何问题</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg-secondary)] px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[var(--border-color)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="输入你的问题..."
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-secondary)]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  className="px-4 py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
