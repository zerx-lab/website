---
name: daily-tech-news
description: "每日技术资讯搜集。搜索 AI、GitHub、前端、后端、开源项目等技术领域的最新资讯，生成中文摘要博客文章。关键词：资讯、新闻、daily news、tech news、AI news、GitHub trending。"
---

# Daily Tech News - 每日技术资讯搜集

自动搜索并汇总当日技术资讯，生成 Markdown 博客文章。

## 执行流程

当用户调用 `/daily-tech-news` 或请求搜集技术资讯时，按以下步骤执行：

### Step 1: 确定搜索日期

默认搜索**昨天**的资讯（因为当天资讯可能不完整）。

```
搜索日期 = 执行日期 - 1天
格式示例: 2026-02-02
```

### Step 2: 使用 WebSearch 搜索各领域资讯

依次搜索以下领域，每个领域提取 3-5 条重要资讯：

#### 2.1 AI / LLM 领域
```
搜索关键词示例:
- "AI news {date}"
- "LLM updates {date}"
- "ChatGPT Claude Gemini news {date}"
- "machine learning breakthrough {date}"
```

#### 2.2 GitHub / 开源领域
```
搜索关键词示例:
- "GitHub trending {date}"
- "open source project release {date}"
- "new GitHub repository popular {date}"
```

#### 2.3 前端开发
```
搜索关键词示例:
- "React Vue Next.js news {date}"
- "frontend development news {date}"
- "JavaScript TypeScript update {date}"
```

#### 2.4 后端 / 基础设施
```
搜索关键词示例:
- "backend development news {date}"
- "Rust Go programming news {date}"
- "cloud infrastructure Kubernetes Docker {date}"
```

#### 2.5 科技行业动态
```
搜索关键词示例:
- "tech industry news {date}"
- "startup funding announcement {date}"
- "developer tools announcement {date}"
```

### Step 3: 可选 - 使用 WebFetch 获取详情

对于重要资讯，可以使用 WebFetch 工具获取更多详细内容。

### Step 4: 生成博客文章

在 `content/blog/` 目录创建 MDX 文件，格式如下：

**文件名**: `daily-tech-news-{YYYY-MM-DD}.mdx`

**内容模板**:

```mdx
---
title: 每日技术资讯 - {YYYY年MM月DD日}
description: {当日资讯亮点摘要，50-100字}
date: {YYYY-MM-DD}
---

# 每日技术资讯 - {YYYY年MM月DD日}

## AI / 人工智能

### {标题1}
{摘要内容，2-3句话}
- 来源: [{来源名称}]({URL})

### {标题2}
...

## GitHub / 开源

### {标题1}
{摘要内容}
- 来源: [{来源名称}]({URL})

...

## 前端开发

...

## 后端 / 基础设施

...

## 科技动态

...

---

> 本文由 Claude 自动生成，资讯来源于公开网络搜索。
```

### Step 5: 提交更改

创建文件后，使用 git 提交更改：

```bash
git add content/blog/daily-tech-news-{date}.mdx
git commit -m "docs: add daily tech news for {date}"
```

## 输出要求

1. **语言**: 全部使用中文
2. **格式**: MDX 文件，兼容 Next.js 博客
3. **长度**: 每条资讯 50-150 字摘要
4. **来源**: 必须标注原文链接
5. **分类**: 至少包含 3 个以上分类
6. **数量**: 总共 10-20 条资讯

## 注意事项

- 优先选择**有实质内容**的资讯，避免标题党
- 资讯应当**与开发者相关**
- 避免重复内容
- 如果某个领域当天没有重要资讯，可以跳过该分类
- 搜索时使用英文关键词效果更好，但输出为中文

## 示例调用

```
用户: /daily-tech-news
用户: 搜集今天的技术资讯
用户: 生成每日技术新闻
```
