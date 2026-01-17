# Markdown 转换

WordZero 提供 Markdown 和 Word 文档之间的双向转换。本文档涵盖将 Markdown 转换为 Word 以及将 Word 文档导出为 Markdown。

## 概述

markdown 包提供：
- **Markdown 转 Word**：将 Markdown 文本转换为 Word 文档
- **Word 转 Markdown**：将 Word 文档导出为 Markdown 文件
- **完整 GFM 支持**：GitHub Flavored Markdown 兼容
- **数学公式支持**：LaTeX/MathJax 公式

## Markdown 转 Word 转换

### 基本转换

```go
import (
    "github.com/zerx-lab/wordZero/pkg/markdown"
)

// 使用默认选项创建转换器
converter := markdown.NewConverter(markdown.DefaultOptions())

// 将 Markdown 字符串转换为 Word 文档
markdownText := `
# 你好世界

这是 **加粗** 和 *斜体* 文本。

## 功能特性

- 项目 1
- 项目 2
- 项目 3

这是一些 \`行内代码\` 和代码块：

\`\`\`go
func main() {
    fmt.Println("你好，世界！")
}
\`\`\`
`

doc, err := converter.ConvertString(markdownText, nil)
if err != nil {
    log.Fatal(err)
}

doc.Save("output.docx")
```

### 从文件转换

```go
// 将 Markdown 文件转换为 Word 文档
doc, err := converter.ConvertFile("document.md", nil)
if err != nil {
    log.Fatal(err)
}
doc.Save("document.docx")
```

## 转换选项

### ConvertOptions 结构体

```go
type ConvertOptions struct {
    EnableGFM          bool    // GitHub Flavored Markdown
    EnableFootnotes    bool    // 脚注支持
    EnableTables       bool    // 表格支持
    EnableTaskList     bool    // 任务列表支持
    EnableMath         bool    // LaTeX 数学公式支持
    DefaultFontFamily  string  // 默认输出字体
    DefaultFontSize    float64 // 默认字号（磅）
    ImageBasePath      string  // 图片基础路径
    GenerateTOC        bool    // 自动生成目录
    StrictMode         bool    // 严格验证模式
    IgnoreErrors       bool    // 错误容忍
}
```

### 创建自定义选项

```go
options := &markdown.ConvertOptions{
    EnableGFM:         true,
    EnableFootnotes:   true,
    EnableTables:      true,
    EnableTaskList:    true,
    EnableMath:        true,
    DefaultFontFamily: "微软雅黑",
    DefaultFontSize:   11,
    ImageBasePath:     "./images",
    GenerateTOC:       false,
    StrictMode:        false,
    IgnoreErrors:      true,
}

converter := markdown.NewConverter(options)
```

### 默认选项

```go
// 获取默认选项
options := markdown.DefaultOptions()

// 默认值：
// - EnableGFM: true
// - EnableFootnotes: true
// - EnableTables: true
// - EnableTaskList: true
// - EnableMath: false
// - DefaultFontFamily: "Calibri"
// - DefaultFontSize: 11
```

## 支持的 Markdown 元素

### 标题

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

标题会转换为 Word 样式（Heading1 到 Heading6）。

### 文本格式

```markdown
**加粗文本**
*斜体文本*
***加粗和斜体***
~~删除线~~
`行内代码`
```

### 链接和图片

```markdown
[链接文本](https://example.com)
[带标题的链接](https://example.com "标题")

![替代文本](image.png)
![带标题的图片](image.png "图片标题")
```

### 列表

```markdown
无序列表：
- 项目 1
- 项目 2
  - 嵌套项目
  - 另一个嵌套

有序列表：
1. 第一
2. 第二
3. 第三

任务列表：
- [x] 已完成任务
- [ ] 待完成任务
```

### 块引用

```markdown
> 这是一段引用。
> 可以跨越多行。
>
> 也可以有多个段落。
```

### 代码块

````markdown
```python
def hello():
    print("你好，世界！")
```

```javascript
console.log("你好，世界！");
```
````

代码块使用 CodeBlock 样式和等宽字体转换。

### 表格（GFM）

```markdown
| 表头 1 | 表头 2 | 表头 3 |
|--------|--------|--------|
| 单元格 1 | 单元格 2 | 单元格 3 |
| 单元格 4 | 单元格 5 | 单元格 6 |
```

### 水平线

```markdown
---
***
___
```

### 脚注

```markdown
这是一个带脚注的句子。[^1]

[^1]: 这是脚注内容。
```

## 数学公式支持

当 `EnableMath` 设置为 `true` 时，WordZero 支持 LaTeX 数学公式。

### 行内公式

```markdown
著名的方程 $E = mc^2$。
```

### 块级公式

```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### 启用数学公式支持

```go
options := markdown.DefaultOptions()
options.EnableMath = true

converter := markdown.NewConverter(options)

markdown := `
# 数学示例

行内公式：一元二次方程的求根公式是 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$。

块级方程：

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$
`

doc, _ := converter.ConvertString(markdown, nil)
doc.Save("math-document.docx")
```

数学公式使用 Cambria Math 字体渲染，并进行适当的符号转换。

## Word 转 Markdown 导出

### 基本导出

```go
import "github.com/zerx-lab/wordZero/pkg/markdown"

// 使用默认选项创建导出器
exporter := markdown.NewExporter(markdown.DefaultExportOptions())

// 将 Word 文档导出为 Markdown 文件
err := exporter.ExportToFile("document.docx", "output.md", nil)
if err != nil {
    log.Fatal(err)
}
```

### 导出为字符串

```go
// 导出为字符串
markdownContent, err := exporter.ExportToString("document.docx", nil)
if err != nil {
    log.Fatal(err)
}
fmt.Println(markdownContent)
```

### 导出选项

```go
type ExportOptions struct {
    ExtractImages      bool   // 提取嵌入图片
    ImageOutputDir     string // 图片输出目录
    ImagePrefix        string // 图片文件名前缀
    PreserveFormatting bool   // 保留文本格式
    TableStyle         string // 表格格式样式
}

options := &markdown.ExportOptions{
    ExtractImages:      true,
    ImageOutputDir:     "./images",
    ImagePrefix:        "img_",
    PreserveFormatting: true,
    TableStyle:         "github", // GFM 表格样式
}

exporter := markdown.NewExporter(options)
```

## 完整示例

```go
package main

import (
    "log"
    "github.com/zerx-lab/wordZero/pkg/markdown"
)

func main() {
    // Markdown 转 Word
    options := &markdown.ConvertOptions{
        EnableGFM:         true,
        EnableTables:      true,
        EnableMath:        true,
        DefaultFontFamily: "宋体",
        DefaultFontSize:   12,
    }

    converter := markdown.NewConverter(options)

    content := `
# 技术报告

## 简介

本报告讨论了**文档**的重要性。

## 关键点

1. 清晰的文档提高可维护性
2. 示例帮助用户快速理解
3. 保持文档更新

## 代码示例

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("你好，文档！")
}
\`\`\`

## 数据表格

| 指标 | Q1 | Q2 | Q3 | Q4 |
|------|----|----|----|----|
| 销售 | 100| 150| 200| 250|
| 用户 | 50 | 75 | 100| 125|

## 结论

良好的文档对项目成功至关重要。

---

*最后更新：2024年1月*
`

    doc, err := converter.ConvertString(content, nil)
    if err != nil {
        log.Fatal(err)
    }

    if err := doc.Save("technical-report.docx"); err != nil {
        log.Fatal(err)
    }

    // Word 转 Markdown
    exporter := markdown.NewExporter(&markdown.ExportOptions{
        ExtractImages:      true,
        ImageOutputDir:     "./exported-images",
        PreserveFormatting: true,
    })

    md, err := exporter.ExportToString("technical-report.docx", nil)
    if err != nil {
        log.Fatal(err)
    }

    log.Println("导出的 Markdown：")
    log.Println(md)
}
```

## 样式映射

将 Markdown 转换为 Word 时，元素会映射到 WordZero 样式：

| Markdown 元素 | Word 样式 |
|---------------|-----------|
| `# 一级标题` | Heading1 |
| `## 二级标题` | Heading2 |
| `### 三级标题` | Heading3 |
| `#### 四级标题` | Heading4 |
| `##### 五级标题` | Heading5 |
| `###### 六级标题` | Heading6 |
| `**加粗**` | Strong |
| `*斜体*` | Emphasis |
| `` `代码` `` | CodeChar |
| 代码块 | CodeBlock |
| `> 引用` | Quote |
| 列表项 | ListParagraph |

## 错误处理

```go
// 严格模式 - 遇到任何错误都失败
options := markdown.DefaultOptions()
options.StrictMode = true
options.IgnoreErrors = false

converter := markdown.NewConverter(options)
doc, err := converter.ConvertString(markdown, nil)
if err != nil {
    // 处理转换错误
    log.Printf("转换失败: %v", err)
}

// 宽松模式 - 遇到错误继续
options.StrictMode = false
options.IgnoreErrors = true

converter = markdown.NewConverter(options)
doc, err = converter.ConvertString(markdown, nil)
// 即使有小问题也会成功
```

## 最佳实践

1. **使用 GFM 处理表格** - 标准 Markdown 表格在 `EnableGFM: true` 时效果最好。

2. **设置图片基础路径** - 使用图片时，设置 `ImageBasePath` 以正确定位它们。

3. **测试数学公式** - 复杂的 LaTeX 可能需要调整以兼容 Word。

4. **处理大型文档** - 对于非常大的 Markdown 文件，考虑分块处理。

5. **验证输出** - 始终在 Microsoft Word 中验证转换后的文档。
