# 核心 API 文档

本文档提供 WordZero 核心 Document API 的完整参考。

## 文档生命周期

### 创建新文档

```go
import "github.com/zerx-lab/wordZero/pkg/document"

// 创建一个新的空文档
doc := document.New()
```

`New()` 函数会初始化：
- 带有节属性的空文档正文
- 关系注册表
- 包含 18 种预定义样式的样式管理器
- 内容类型映射

### 打开现有文档

```go
// 从文件路径打开
doc, err := document.Open("existing.docx")
if err != nil {
    log.Fatal(err)
}

// 从 io.ReadCloser 打开（例如 HTTP 请求体）
doc, err := document.OpenFromMemory(readCloser)
```

### 保存文档

```go
// 保存到文件
err := doc.Save("output.docx")

// 获取字节切片
data, err := doc.ToBytes()

// 示例：HTTP 响应
func handler(w http.ResponseWriter, r *http.Request) {
    doc := document.New()
    doc.AddParagraph("生成的文档")

    data, _ := doc.ToBytes()
    w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    w.Header().Set("Content-Disposition", "attachment; filename=document.docx")
    w.Write(data)
}
```

## 段落操作

### 添加段落

```go
// 简单段落
para := doc.AddParagraph("你好，世界！")

// 空段落（稍后添加内容）
para := doc.AddParagraph("")

// 标题段落（级别 1-9）
para := doc.AddHeadingParagraph("章节标题", 1)

// 格式化段落
format := &document.TextFormat{
    Bold:       true,
    Italic:     true,
    FontSize:   16,
    FontColor:  "0066CC",
    FontFamily: "Arial",
}
para := doc.AddFormattedParagraph("格式化文本", format)
```

### TextFormat 结构体

```go
type TextFormat struct {
    Bold          bool    // 加粗
    Italic        bool    // 斜体
    Underline     bool    // 下划线
    Strike        bool    // 删除线
    FontSize      float64 // 字号（单位：磅）
    FontColor     string  // 十六进制颜色代码（如 "FF0000"）
    FontFamily    string  // 字体名称（如 "Arial"）
    Highlight     string  // 高亮颜色
    Superscript   bool    // 上标
    Subscript     bool    // 下标
}
```

### 在段落中添加多个文本块

```go
para := doc.AddParagraph("")

// 添加不同格式的文本
para.AddFormattedText("普通 ", nil)
para.AddFormattedText("加粗 ", &document.TextFormat{Bold: true})
para.AddFormattedText("斜体 ", &document.TextFormat{Italic: true})
para.AddFormattedText("红色", &document.TextFormat{FontColor: "FF0000"})
```

### 段落对齐

```go
para := doc.AddParagraph("居中文本")
para.SetAlignment(document.AlignCenter)

// 可用的对齐方式：
// - document.AlignLeft（左对齐）
// - document.AlignCenter（居中）
// - document.AlignRight（右对齐）
// - document.AlignJustify（两端对齐）
```

### 段落间距

```go
para := doc.AddParagraph("带自定义间距的文本")
para.SetSpacing(&document.SpacingConfig{
    Before:      240,  // 段前间距（twips）
    After:       120,  // 段后间距（twips）
    Line:        360,  // 行间距（twips）
    LineRule:    "auto",
})
```

### 段落缩进

```go
para := doc.AddParagraph("缩进段落")
para.SetIndentation(720, 0, 360) // 左缩进、右缩进、首行缩进（单位：twips）

// 1 英寸 = 1440 twips
// 0.5 英寸 = 720 twips
```

### 段落边框

```go
para := doc.AddParagraph("带边框的段落")
para.SetBorder(&document.BorderConfig{
    Top:    &document.Border{Style: "single", Size: 4, Color: "000000"},
    Bottom: &document.Border{Style: "single", Size: 4, Color: "000000"},
    Left:   &document.Border{Style: "single", Size: 4, Color: "000000"},
    Right:  &document.Border{Style: "single", Size: 4, Color: "000000"},
})
```

### 删除段落

```go
// 通过引用删除
doc.RemoveParagraph(para)

// 通过索引删除
doc.RemoveParagraphAt(0) // 删除第一个段落
```

### 应用样式

```go
import "github.com/zerx-lab/wordZero/pkg/style"

para := doc.AddParagraph("带样式的文本")
para.SetStyle(style.StyleHeading1)
```

## 页面设置

### 页面大小

```go
// 使用预定义大小
doc.SetPageSize(document.PageSizeA4)
doc.SetPageSize(document.PageSizeLetter)
doc.SetPageSize(document.PageSizeLegal)

// 自定义大小（单位：twips）
doc.SetPageSize(&document.PageSize{
    Width:  12240, // 8.5 英寸
    Height: 15840, // 11 英寸
})
```

### 页面方向

```go
doc.SetPageOrientation(document.OrientationPortrait)  // 纵向
doc.SetPageOrientation(document.OrientationLandscape) // 横向
```

### 页面边距

```go
// 设置所有边距（单位：twips）
doc.SetPageMargins(1440, 1440, 1440, 1440) // 上、右、下、左

// 使用预定义边距
doc.SetPageMargins(document.MarginsNormal) // 普通
doc.SetPageMargins(document.MarginsNarrow) // 窄
doc.SetPageMargins(document.MarginsWide)   // 宽
```

### 完整页面设置

```go
doc.SetPageSettings(&document.PageSettings{
    Size:        document.PageSizeA4,
    Orientation: document.OrientationPortrait,
    Margins: &document.Margins{
        Top:    1440,
        Right:  1440,
        Bottom: 1440,
        Left:   1440,
    },
})
```

## 分页符

```go
// 添加分页符
doc.AddPageBreak()

// 在特定段落前分页
para := doc.AddParagraph("新页面内容")
para.SetPageBreakBefore(true)
```

## 文档属性

```go
// 设置文档属性
doc.SetProperties(&document.Properties{
    Title:       "我的文档",
    Subject:     "文档说明",
    Creator:     "WordZero",
    Keywords:    "word, 文档, go",
    Description: "示例文档",
    LastModifiedBy: "作者",
})
```

## 样式管理器

```go
// 获取样式管理器
styleManager := doc.GetStyleManager()

// 检查样式是否存在
exists := styleManager.HasStyle("Heading1")

// 获取样式信息
styleInfo := styleManager.GetStyle("Heading1")
```

## 错误处理

WordZero 使用 Go 标准的错误处理方式：

```go
doc, err := document.Open("file.docx")
if err != nil {
    if errors.Is(err, document.ErrInvalidDocument) {
        log.Println("无效的文档格式")
    } else if errors.Is(err, document.ErrFileNotFound) {
        log.Println("文件未找到")
    } else {
        log.Printf("未知错误: %v", err)
    }
    return
}
```

## 日志系统

WordZero 内置了日志系统：

```go
// 启用调试日志
document.SetLogLevel(document.LogLevelDebug)

// 可用的日志级别：
// - document.LogLevelDebug（调试）
// - document.LogLevelInfo（信息）
// - document.LogLevelWarn（警告）
// - document.LogLevelError（错误）
```

## 线程安全

文档结构本身不是线程安全的。对于并发访问，需要使用适当的同步机制：

```go
var mu sync.Mutex

func addContent(doc *document.Document, text string) {
    mu.Lock()
    defer mu.Unlock()
    doc.AddParagraph(text)
}
```

注意：模板引擎内置了模板缓存的线程安全支持。

## 单位参考

| 单位 | 描述 | 换算 |
|------|------|------|
| Twips | 点的二十分之一 | 1 英寸 = 1440 twips |
| Points（磅） | 标准字号单位 | 1 英寸 = 72 磅 |
| EMUs | 英制公制单位 | 1 英寸 = 914400 EMUs |

常用 twip 值：
- 1 英寸 = 1440 twips
- 0.5 英寸 = 720 twips
- 1 厘米 = 567 twips
- 12 磅字体 = 240 twips（用于间距）
