const SECTION_KEYWORDS = [
  { title: '基本信息', keys: ['基本信息', '个人信息', '个人资料', '联系方式'] },
  { title: '求职意向', keys: ['求职意向', '期望职位', '意向岗位'] },
  { title: '教育背景', keys: ['教育背景', '教育经历', '学历', '学习经历'] },
  { title: '工作经历', keys: ['工作经历', '工作经验', '实习经历', '职业经历'] },
  { title: '项目经历', keys: ['项目经历', '项目经验', '项目描述'] },
  { title: '技能特长', keys: ['技能特长', '专业技能', '技能', '技术栈', '掌握技能'] },
  { title: '自我评价', keys: ['自我评价', '个人评价', '自我介绍', 'About Me'] }
]

function extractContactInfo(text) {
  const phone = text.match(/1[3-9]\d{9}/)?.[0] || ''
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || ''
  return { phone, email }
}

function splitSections(rawText) {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const sections = []
  let current = { title: '其他', items: [] }

  for (const line of lines) {
    const matched = SECTION_KEYWORDS.find(kw =>
      kw.keys.some(key => line.includes(key) && line.length < 20)
    )

    if (matched) {
      if (current.items.length > 0 || current.content) {
        sections.push(current)
      }
      current = { title: matched.title, items: [] }
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('·') || /^\d+[.)]/.test(line)) {
      current.items = current.items || []
      current.items.push(line.replace(/^[•\-·]\s*/, ''))
    } else {
      if (current.items && current.items.length === 0 && !current.content) {
        current.content = line
      } else {
        current.items = current.items || []
        current.items.push(line)
      }
    }
  }

  if (current.items?.length > 0 || current.content) {
    sections.push(current)
  }

  if (sections.length === 0 && rawText.trim()) {
    sections.push({ title: '简历内容', content: rawText.trim() })
  }

  return sections
}

function extractName(rawText) {
  const firstLine = rawText.split(/\r?\n/).map(l => l.trim()).find(Boolean) || ''
  if (firstLine.length <= 10 && !firstLine.includes('@') && !/\d{7,}/.test(firstLine)) {
    return firstLine
  }
  const nameMatch = rawText.match(/姓\s*名[：:]\s*(\S+)/)
  return nameMatch?.[1] || firstLine.slice(0, 10)
}

function formatResume(rawText, fileName) {
  const contact = extractContactInfo(rawText)
  const name = extractName(rawText)
  const sections = splitSections(rawText)

  const basicSection = sections.find(s => s.title === '基本信息')
  if (!basicSection && (contact.phone || contact.email || name)) {
    sections.unshift({
      title: '基本信息',
      content: [name, contact.phone, contact.email].filter(Boolean).join('  |  ')
    })
  }

  return {
    rawText,
    name,
    contact,
    sections,
    updatedAt: new Date().toISOString(),
    fileName
  }
}

module.exports = { formatResume }
