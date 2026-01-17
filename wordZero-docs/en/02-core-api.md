# Core API Documentation

This document provides a comprehensive reference for the core Document API in WordZero.

## Document Lifecycle

### Creating a New Document

```go
import "github.com/zerx-lab/wordZero/pkg/document"

// Create a new blank document
doc := document.New()
```

The `New()` function initializes:
- Empty document body with section properties
- Relationships registry
- Style manager with 18 predefined styles
- Content types mapping

### Opening an Existing Document

```go
// Open from file path
doc, err := document.Open("existing.docx")
if err != nil {
    log.Fatal(err)
}

// Open from io.ReadCloser (e.g., HTTP request body)
doc, err := document.OpenFromMemory(readCloser)
```

### Saving Documents

```go
// Save to file
err := doc.Save("output.docx")

// Get as byte slice
data, err := doc.ToBytes()

// Example: HTTP response
func handler(w http.ResponseWriter, r *http.Request) {
    doc := document.New()
    doc.AddParagraph("Generated document")

    data, _ := doc.ToBytes()
    w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    w.Header().Set("Content-Disposition", "attachment; filename=document.docx")
    w.Write(data)
}
```

## Paragraph Operations

### Adding Paragraphs

```go
// Simple paragraph
para := doc.AddParagraph("Hello, World!")

// Empty paragraph (for later content)
para := doc.AddParagraph("")

// Heading paragraph (level 1-9)
para := doc.AddHeadingParagraph("Chapter Title", 1)

// Formatted paragraph
format := &document.TextFormat{
    Bold:       true,
    Italic:     true,
    FontSize:   16,
    FontColor:  "0066CC",
    FontFamily: "Arial",
}
para := doc.AddFormattedParagraph("Formatted text", format)
```

### TextFormat Structure

```go
type TextFormat struct {
    Bold          bool    // Bold text
    Italic        bool    // Italic text
    Underline     bool    // Underlined text
    Strike        bool    // Strikethrough text
    FontSize      float64 // Font size in points
    FontColor     string  // Hex color code (e.g., "FF0000")
    FontFamily    string  // Font name (e.g., "Arial")
    Highlight     string  // Highlight color
    Superscript   bool    // Superscript text
    Subscript     bool    // Subscript text
}
```

### Adding Multiple Runs to a Paragraph

```go
para := doc.AddParagraph("")

// Add text with different formatting
para.AddFormattedText("Normal ", nil)
para.AddFormattedText("Bold ", &document.TextFormat{Bold: true})
para.AddFormattedText("Italic ", &document.TextFormat{Italic: true})
para.AddFormattedText("Red", &document.TextFormat{FontColor: "FF0000"})
```

### Paragraph Alignment

```go
para := doc.AddParagraph("Centered text")
para.SetAlignment(document.AlignCenter)

// Available alignments:
// - document.AlignLeft
// - document.AlignCenter
// - document.AlignRight
// - document.AlignJustify
```

### Paragraph Spacing

```go
para := doc.AddParagraph("Text with custom spacing")
para.SetSpacing(&document.SpacingConfig{
    Before:      240,  // Space before paragraph (twips)
    After:       120,  // Space after paragraph (twips)
    Line:        360,  // Line spacing (twips)
    LineRule:    "auto",
})
```

### Paragraph Indentation

```go
para := doc.AddParagraph("Indented paragraph")
para.SetIndentation(720, 0, 360) // left, right, firstLine (in twips)

// 1 inch = 1440 twips
// 0.5 inch = 720 twips
```

### Paragraph Borders

```go
para := doc.AddParagraph("Bordered paragraph")
para.SetBorder(&document.BorderConfig{
    Top:    &document.Border{Style: "single", Size: 4, Color: "000000"},
    Bottom: &document.Border{Style: "single", Size: 4, Color: "000000"},
    Left:   &document.Border{Style: "single", Size: 4, Color: "000000"},
    Right:  &document.Border{Style: "single", Size: 4, Color: "000000"},
})
```

### Removing Paragraphs

```go
// Remove by reference
doc.RemoveParagraph(para)

// Remove by index
doc.RemoveParagraphAt(0) // Remove first paragraph
```

### Applying Styles

```go
import "github.com/zerx-lab/wordZero/pkg/style"

para := doc.AddParagraph("Styled text")
para.SetStyle(style.StyleHeading1)
```

## Page Settings

### Page Size

```go
// Use predefined sizes
doc.SetPageSize(document.PageSizeA4)
doc.SetPageSize(document.PageSizeLetter)
doc.SetPageSize(document.PageSizeLegal)

// Custom size (in twips)
doc.SetPageSize(&document.PageSize{
    Width:  12240, // 8.5 inches
    Height: 15840, // 11 inches
})
```

### Page Orientation

```go
doc.SetPageOrientation(document.OrientationPortrait)
doc.SetPageOrientation(document.OrientationLandscape)
```

### Page Margins

```go
// Set all margins (in twips)
doc.SetPageMargins(1440, 1440, 1440, 1440) // top, right, bottom, left

// Use predefined margins
doc.SetPageMargins(document.MarginsNormal)
doc.SetPageMargins(document.MarginsNarrow)
doc.SetPageMargins(document.MarginsWide)
```

### Complete Page Settings

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

## Page Breaks

```go
// Add a page break
doc.AddPageBreak()

// Page break before a specific paragraph
para := doc.AddParagraph("New page content")
para.SetPageBreakBefore(true)
```

## Document Properties

```go
// Set document properties
doc.SetProperties(&document.Properties{
    Title:       "My Document",
    Subject:     "Documentation",
    Creator:     "WordZero",
    Keywords:    "word, document, go",
    Description: "A sample document",
    LastModifiedBy: "Author",
})
```

## Style Manager

```go
// Get style manager
styleManager := doc.GetStyleManager()

// Check if style exists
exists := styleManager.HasStyle("Heading1")

// Get style information
styleInfo := styleManager.GetStyle("Heading1")
```

## Error Handling

WordZero uses Go's standard error handling:

```go
doc, err := document.Open("file.docx")
if err != nil {
    if errors.Is(err, document.ErrInvalidDocument) {
        log.Println("Invalid document format")
    } else if errors.Is(err, document.ErrFileNotFound) {
        log.Println("File not found")
    } else {
        log.Printf("Unknown error: %v", err)
    }
    return
}
```

## Logging

WordZero includes a built-in logging system:

```go
// Enable debug logging
document.SetLogLevel(document.LogLevelDebug)

// Available log levels:
// - document.LogLevelDebug
// - document.LogLevelInfo
// - document.LogLevelWarn
// - document.LogLevelError
```

## Thread Safety

The document structure itself is not thread-safe. For concurrent access, use appropriate synchronization:

```go
var mu sync.Mutex

func addContent(doc *document.Document, text string) {
    mu.Lock()
    defer mu.Unlock()
    doc.AddParagraph(text)
}
```

Note: The Template Engine has built-in thread safety for template caching.

## Units Reference

| Unit | Description | Conversion |
|------|-------------|------------|
| Twips | Twentieth of a point | 1 inch = 1440 twips |
| Points | Standard font size unit | 1 inch = 72 points |
| EMUs | English Metric Units | 1 inch = 914400 EMUs |

Common twip values:
- 1 inch = 1440 twips
- 0.5 inch = 720 twips
- 1 cm = 567 twips
- 12pt font = 240 twips (for spacing)
