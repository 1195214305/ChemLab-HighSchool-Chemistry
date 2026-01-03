/**
 * ChemLab Edge Function - AI 化学辅导
 * 基于阿里云 ESA Pages 边缘计算
 */

export default async function handler(request: Request): Promise<Response> {
  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }

  // 处理 OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(request.url)
  const path = url.pathname

  try {
    // AI 化学辅导接口
    if (path === '/api/ai/tutor' && request.method === 'POST') {
      const body = await request.json()
      const { question, knowledgeId, context, apiKey } = body

      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API Key is required' }),
          { status: 400, headers: corsHeaders }
        )
      }

      // 调用通义千问 API
      const response = await callQwenAPI(question, knowledgeId, context, apiKey)

      return new Response(JSON.stringify(response), { headers: corsHeaders })
    }

    // 获取知识点提示
    if (path === '/api/hints' && request.method === 'GET') {
      const knowledgeId = url.searchParams.get('knowledgeId')

      if (!knowledgeId) {
        return new Response(
          JSON.stringify({ error: 'knowledgeId is required' }),
          { status: 400, headers: corsHeaders }
        )
      }

      const hints = getKnowledgeHints(knowledgeId)

      return new Response(JSON.stringify(hints), { headers: corsHeaders })
    }

    // 健康检查
    if (path === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          service: 'ChemLab Edge Function',
          timestamp: new Date().toISOString(),
          region: 'edge'
        }),
        { headers: corsHeaders }
      )
    }

    // 404
    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: corsHeaders }
    )
  }
}

// 调用通义千问 API
async function callQwenAPI(question: string, knowledgeId: string, context: any, apiKey: string) {
  const systemPrompt = `你是一位专业的高中化学老师，正在辅导学生学习化学知识。
当前知识点：${getKnowledgeName(knowledgeId)}

请根据学生的问题，提供清晰、准确的化学知识解答。
- 使用简洁易懂的语言
- 结合具体例子和化学方程式解释原理
- 适当使用专业术语，但要解释其含义
- 鼓励学生思考和探索
- 如果涉及实验，说明实验原理和注意事项
- 如果涉及计算，给出详细的解题步骤

上下文信息：${JSON.stringify(context)}`

  try {
    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error('API request failed')
    }

    const data = await response.json()
    return {
      success: true,
      answer: data.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。',
      knowledgeId
    }
  } catch (error) {
    // 返回预设回答
    return {
      success: true,
      answer: getPresetAnswer(knowledgeId, question),
      knowledgeId,
      isPreset: true
    }
  }
}

// 获取知识点名称
function getKnowledgeName(knowledgeId: string): string {
  const names: Record<string, string> = {
    'atom-structure': '原子结构',
    'periodic-table': '元素周期表',
    'periodic-law': '元素周期律',
    'ionic-bond': '离子键',
    'covalent-bond': '共价键',
    'metallic-bond': '金属键',
    'galvanic-cell': '原电池',
    'electrolysis': '电解池',
    'chemical-equilibrium': '化学平衡',
    'titration': '酸碱中和滴定',
    'benzene': '苯及其同系物',
    'redox-reaction': '氧化还原反应'
  }
  return names[knowledgeId] || '化学知识'
}

// 预设回答
function getPresetAnswer(knowledgeId: string, question: string): string {
  const answers: Record<string, Record<string, string>> = {
    'atom-structure': {
      default: '原子由原子核（质子和中子）和核外电子组成。电子按能量高低分层排布，第一层最多2个，第二层最多8个，第三层最多18个（作为最外层时最多8个）。',
      '电子': '核外电子排布遵循能量最低原理，电子优先占据能量较低的轨道。',
      '质子': '质子数等于原子序数，决定元素的种类。质子数相同的原子属于同一种元素。'
    },
    'ionic-bond': {
      default: '离子键是由阴阳离子通过静电引力形成的化学键。通常形成于活泼金属与活泼非金属之间，如NaCl中Na⁺和Cl⁻之间的作用力。',
      '形成': '离子键形成过程：活泼金属原子失去电子形成阳离子，活泼非金属原子得到电子形成阴离子，阴阳离子通过静电引力结合。',
      '性质': '离子化合物的特点：熔沸点高、硬度大、熔融或溶于水后能导电。'
    },
    'covalent-bond': {
      default: '共价键是原子间通过共用电子对形成的化学键。根据共用电子对数目分为单键、双键、三键。',
      '极性': '极性共价键：共用电子对偏向电负性大的原子；非极性共价键：共用电子对不偏移。',
      '形成': '共价键形成时，原子轨道重叠，电子云密度增大，体系能量降低。'
    },
    'galvanic-cell': {
      default: '原电池是将化学能转化为电能的装置。负极发生氧化反应（失电子），正极发生还原反应（得电子），电子从负极经外电路流向正极。',
      '条件': '原电池形成条件：①两种活泼性不同的电极 ②电解质溶液 ③形成闭合回路',
      '电极': '负极：较活泼金属，发生氧化反应；正极：较不活泼金属或导体，发生还原反应。'
    },
    'chemical-equilibrium': {
      default: '化学平衡是可逆反应达到的一种动态平衡状态，此时正逆反应速率相等，各物质浓度保持不变。',
      '移动': '勒夏特列原理：改变平衡条件，平衡向减弱这种改变的方向移动。',
      '常数': '平衡常数K只与温度有关，与浓度、压强无关。K值越大，反应进行程度越大。'
    }
  }

  const knowledgeAnswers = answers[knowledgeId] || {}

  // 简单关键词匹配
  for (const [keyword, answer] of Object.entries(knowledgeAnswers)) {
    if (keyword !== 'default' && question.includes(keyword)) {
      return answer
    }
  }

  return knowledgeAnswers.default || '这是一个很好的问题！建议你仔细观察演示动画，结合课本上的知识进行分析。如果还有疑问，可以尝试调整参数，观察结果的变化。'
}

// 获取知识点提示
function getKnowledgeHints(knowledgeId: string) {
  const hints: Record<string, string[]> = {
    'atom-structure': [
      '原子核由质子和中子组成',
      '电子按能量高低分层排布',
      '最外层电子数决定元素的化学性质',
      '同一周期元素原子电子层数相同'
    ],
    'ionic-bond': [
      '离子键由阴阳离子通过静电引力形成',
      '活泼金属与活泼非金属易形成离子键',
      '离子化合物熔融或溶于水后能导电',
      '离子晶体熔沸点高、硬度大'
    ],
    'covalent-bond': [
      '共价键通过共用电子对形成',
      '单键、双键、三键分别有1、2、3对共用电子对',
      '极性键的共用电子对偏向电负性大的原子',
      '共价晶体熔沸点很高'
    ],
    'galvanic-cell': [
      '负极发生氧化反应，正极发生还原反应',
      '电子从负极经外电路流向正极',
      '电流方向与电子流动方向相反',
      '盐桥保持溶液电中性'
    ],
    'chemical-equilibrium': [
      '平衡时正逆反应速率相等',
      '平衡常数K只与温度有关',
      '催化剂不改变平衡位置',
      '勒夏特列原理预测平衡移动方向'
    ]
  }

  return {
    knowledgeId,
    hints: hints[knowledgeId] || ['仔细观察演示动画', '结合课本知识理解', '尝试调整参数观察变化']
  }
}
