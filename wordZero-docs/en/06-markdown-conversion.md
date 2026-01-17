# Markdown Conversion

WordZero provides bidirectional conversion between Markdown and Word documents. This document covers converting Markdown to Word and exporting Word documents to Markdown.

## Overview

The markdown package provides:
- **Markdown to Word**: Convert Markdown text to Word documents
- **Word to Markdown**: Export Word documents as Markdown files
- **Full GFM Support**: GitHub Flavored Markdown compatibility
- **Math Formula Support**: LaTeX/MathJax formulas

## Markdown to Word Conversion

### Basic Conversion

```go
import (
    "github.com/zerx-lab/wordZero/pkg/markdown"
)

// Create a converter with default options
converter := markdown.NewConverter(markdown.DefaultOptions())

// Convert Markdown string to Word document
markdownText := `
# Hello World

This is a **bold** and *italic* text.

## Features

- Item 1
- Item 2
- Item 3

Here is some \`inline code\` and a code block:

\`\`\`go
func main() {
    fmt.Println("Hello, World!")
}
\`\`\`
`

doc, err := converter.ConvertString(markdownText, nil)
if err != nil {
    log.Fatal(err)
}

doc.Save("output.docx")
```

### Converting from File

```go
// Convert Markdown file to Word document
doc, err := converter.ConvertFile("document.md", nil)
if err != nil {
    log.Fatal(err)
}
doc.Save("document.docx")
```

## Conversion Options

### ConvertOptions Structure

```go
type ConvertOptions struct {
    EnableGFM          bool    // GitHub Flavored Markdown
    EnableFootnotes    bool    // Footnote support
    EnableTables       bool    // Table support
    EnableTaskList     bool    // Task list support
    EnableMath         bool    // LaTeX math formula support
    DefaultFontFamily  string  // Default font for output
    DefaultFontSize    float64 // Default size in points
    ImageBasePath      string  // Base path for images
    GenerateTOC        bool    // Auto-generate table of contents
    StrictMode         bool    // Strict validation
    IgnoreErrors       bool    // Error tolerance
}
```

### Creating Custom Options

```go
options := &markdown.ConvertOptions{
    EnableGFM:         true,
    EnableFootnotes:   true,
    EnableTables:      true,
    EnableTaskList:    true,
    EnableMath:        true,
    DefaultFontFamily: "Calibri",
    DefaultFontSize:   11,
    ImageBasePath:     "./images",
    GenerateTOC:       false,
    StrictMode:        false,
    IgnoreErrors:      true,
}

converter := markdown.NewConverter(options)
```

### Default Options

```go
// Get default options
options := markdown.DefaultOptions()

// Default values:
// - EnableGFM: true
// - EnableFootnotes: true
// - EnableTables: true
// - EnableTaskList: true
// - EnableMath: false
// - DefaultFontFamily: "Calibri"
// - DefaultFontSize: 11
```

## Supported Markdown Elements

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

Headings are converted to Word styles (Heading1 through Heading6).

### Text Formatting

```markdown
**Bold text**
*Italic text*
***Bold and italic***
~~Strikethrough~~
`Inline code`
```

### Links and Images

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")

![Alt text](image.png)
![Image with title](image.png "Image title")
```

### Lists

```markdown
Unordered list:
- Item 1
- Item 2
  - Nested item
  - Another nested

Ordered list:
1. First
2. Second
3. Third

Task list:
- [x] Completed task
- [ ] Pending task
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.
```

### Code Blocks

````markdown
```python
def hello():
    print("Hello, World!")
```

```javascript
console.log("Hello, World!");
```
````

Code blocks are converted using the CodeBlock style with monospace font.

### Tables (GFM)

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Horizontal Rules

```markdown
---
***
___
```

### Footnotes

```markdown
Here is a sentence with a footnote.[^1]

[^1]: This is the footnote content.
```

## Math Formula Support

WordZero supports LaTeX math formulas when `EnableMath` is set to `true`.

### Inline Math

```markdown
The equation $E = mc^2$ is famous.
```

### Block Math

```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

### Enabling Math Support

```go
options := markdown.DefaultOptions()
options.EnableMath = true

converter := markdown.NewConverter(options)

markdown := `
# Math Examples

Inline: The quadratic formula is $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$.

Block equation:

$$
\int_{a}^{b} f(x) \, dx = F(b) - F(a)
$$
`

doc, _ := converter.ConvertString(markdown, nil)
doc.Save("math-document.docx")
```

Math formulas are rendered using Cambria Math font with proper symbol conversion.

## Word to Markdown Export

### Basic Export

```go
import "github.com/zerx-lab/wordZero/pkg/markdown"

// Create exporter with default options
exporter := markdown.NewExporter(markdown.DefaultExportOptions())

// Export Word document to Markdown file
err := exporter.ExportToFile("document.docx", "output.md", nil)
if err != nil {
    log.Fatal(err)
}
```

### Export to String

```go
// Export to string
markdownContent, err := exporter.ExportToString("document.docx", nil)
if err != nil {
    log.Fatal(err)
}
fmt.Println(markdownContent)
```

### Export Options

```go
type ExportOptions struct {
    ExtractImages     bool   // Extract embedded images
    ImageOutputDir    string // Directory for extracted images
    ImagePrefix       string // Prefix for image filenames
    PreserveFormatting bool  // Preserve text formatting
    TableStyle        string // Table formatting style
}

options := &markdown.ExportOptions{
    ExtractImages:      true,
    ImageOutputDir:     "./images",
    ImagePrefix:        "img_",
    PreserveFormatting: true,
    TableStyle:         "github", // GFM table style
}

exporter := markdown.NewExporter(options)
```

## Complete Example

```go
package main

import (
    "log"
    "github.com/zerx-lab/wordZero/pkg/markdown"
)

func main() {
    // Markdown to Word
    options := &markdown.ConvertOptions{
        EnableGFM:         true,
        EnableTables:      true,
        EnableMath:        true,
        DefaultFontFamily: "Times New Roman",
        DefaultFontSize:   12,
    }

    converter := markdown.NewConverter(options)

    content := `
# Technical Report

## Introduction

This report discusses the **importance** of documentation.

## Key Points

1. Clear documentation improves maintainability
2. Examples help users understand quickly
3. Keep documentation up to date

## Code Example

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Documentation!")
}
\`\`\`

## Data Table

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| Sales  | 100| 150| 200| 250|
| Users  | 50 | 75 | 100| 125|

## Conclusion

Good documentation is essential for project success.

---

*Last updated: January 2024*
`

    doc, err := converter.ConvertString(content, nil)
    if err != nil {
        log.Fatal(err)
    }

    if err := doc.Save("technical-report.docx"); err != nil {
        log.Fatal(err)
    }

    // Word to Markdown
    exporter := markdown.NewExporter(&markdown.ExportOptions{
        ExtractImages:      true,
        ImageOutputDir:     "./exported-images",
        PreserveFormatting: true,
    })

    md, err := exporter.ExportToString("technical-report.docx", nil)
    if err != nil {
        log.Fatal(err)
    }

    log.Println("Exported Markdown:")
    log.Println(md)
}
```

## Style Mapping

When converting Markdown to Word, elements are mapped to WordZero styles:

| Markdown Element | Word Style |
|-----------------|------------|
| `# Heading 1` | Heading1 |
| `## Heading 2` | Heading2 |
| `### Heading 3` | Heading3 |
| `#### Heading 4` | Heading4 |
| `##### Heading 5` | Heading5 |
| `###### Heading 6` | Heading6 |
| `**bold**` | Strong |
| `*italic*` | Emphasis |
| `` `code` `` | CodeChar |
| Code block | CodeBlock |
| `> quote` | Quote |
| List items | ListParagraph |

## Error Handling

```go
// Strict mode - fail on any error
options := markdown.DefaultOptions()
options.StrictMode = true
options.IgnoreErrors = false

converter := markdown.NewConverter(options)
doc, err := converter.ConvertString(markdown, nil)
if err != nil {
    // Handle conversion error
    log.Printf("Conversion failed: %v", err)
}

// Lenient mode - continue on errors
options.StrictMode = false
options.IgnoreErrors = true

converter = markdown.NewConverter(options)
doc, err = converter.ConvertString(markdown, nil)
// Will succeed even with minor issues
```

## Best Practices

1. **Use GFM for tables** - Standard Markdown tables work best with `EnableGFM: true`.

2. **Set image base path** - When using images, set `ImageBasePath` to locate them correctly.

3. **Test math formulas** - Complex LaTeX may require adjustment for Word compatibility.

4. **Handle large documents** - For very large Markdown files, consider chunking.

5. **Verify output** - Always verify the converted document in Microsoft Word.
