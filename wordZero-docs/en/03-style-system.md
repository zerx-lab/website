# Style System

WordZero provides a comprehensive style management system that follows the OOXML specification. This document covers predefined styles, custom style creation, and the QuickStyleAPI.

## Overview

The style system consists of three main components:

1. **StyleManager** - Core style management and registry
2. **QuickStyleAPI** - High-level convenience interface
3. **Predefined Styles** - 18 built-in styles ready to use

## Predefined Styles

WordZero includes 18 predefined styles:

### Paragraph Styles

| Style ID | Constant | Description |
|----------|----------|-------------|
| Heading1 | `style.StyleHeading1` | Primary heading (largest) |
| Heading2 | `style.StyleHeading2` | Secondary heading |
| Heading3 | `style.StyleHeading3` | Tertiary heading |
| Heading4 | `style.StyleHeading4` | Fourth level heading |
| Heading5 | `style.StyleHeading5` | Fifth level heading |
| Heading6 | `style.StyleHeading6` | Sixth level heading |
| Heading7 | `style.StyleHeading7` | Seventh level heading |
| Heading8 | `style.StyleHeading8` | Eighth level heading |
| Heading9 | `style.StyleHeading9` | Ninth level heading |
| Title | `style.StyleTitle` | Document title |
| Subtitle | `style.StyleSubtitle` | Document subtitle |
| Normal | `style.StyleNormal` | Default body text |
| Quote | `style.StyleQuote` | Block quotation |
| ListParagraph | `style.StyleListParagraph` | List item |
| CodeBlock | `style.StyleCodeBlock` | Code block |

### Character Styles

| Style ID | Constant | Description |
|----------|----------|-------------|
| Emphasis | `style.StyleEmphasis` | Italic emphasis |
| Strong | `style.StyleStrong` | Bold emphasis |
| CodeChar | `style.StyleCodeChar` | Inline code |

## Using Predefined Styles

```go
import (
    "github.com/zerx-lab/wordZero/pkg/document"
    "github.com/zerx-lab/wordZero/pkg/style"
)

func main() {
    doc := document.New()

    // Apply heading styles
    h1 := doc.AddParagraph("Main Title")
    h1.SetStyle(style.StyleHeading1)

    h2 := doc.AddParagraph("Section Title")
    h2.SetStyle(style.StyleHeading2)

    // Apply body text style
    body := doc.AddParagraph("This is normal body text.")
    body.SetStyle(style.StyleNormal)

    // Apply quote style
    quote := doc.AddParagraph("This is a quotation.")
    quote.SetStyle(style.StyleQuote)

    // Apply code block style
    code := doc.AddParagraph("func main() { }")
    code.SetStyle(style.StyleCodeBlock)

    doc.Save("styled-document.docx")
}
```

## StyleManager

The StyleManager is the core component for managing styles:

```go
// Get the style manager from a document
styleManager := doc.GetStyleManager()

// Check if a style exists
if styleManager.HasStyle("Heading1") {
    fmt.Println("Heading1 style is available")
}

// Get style information
styleInfo := styleManager.GetStyle("Heading1")

// List all available styles
styles := styleManager.ListStyles()
for _, s := range styles {
    fmt.Printf("Style: %s, Type: %s\n", s.ID, s.Type)
}
```

## QuickStyleAPI

The QuickStyleAPI provides a high-level interface for working with styles:

```go
import "github.com/zerx-lab/wordZero/pkg/style"

// Create QuickStyleAPI from StyleManager
styleManager := doc.GetStyleManager()
quickAPI := style.NewQuickStyleAPI(styleManager)

// Get style information
info, err := quickAPI.GetStyleInfo("Heading1")
if err == nil {
    fmt.Printf("Name: %s\n", info.Name)
    fmt.Printf("Type: %s\n", info.Type)
    fmt.Printf("Based On: %s\n", info.BasedOn)
}
```

## Creating Custom Styles

### Using QuickStyleConfig

```go
import "github.com/zerx-lab/wordZero/pkg/style"

styleManager := doc.GetStyleManager()
quickAPI := style.NewQuickStyleAPI(styleManager)

// Create a custom paragraph style
config := style.QuickStyleConfig{
    ID:      "MyCustomStyle",
    Name:    "My Custom Style",
    Type:    style.StyleTypeParagraph,
    BasedOn: "Normal", // Inherit from Normal style

    // Paragraph properties
    ParagraphConfig: &style.QuickParagraphConfig{
        Alignment:   "center",
        SpaceBefore: 240,  // 12pt before
        SpaceAfter:  120,  // 6pt after
        LineSpacing: 360,  // 1.5 line spacing
    },

    // Text properties
    RunConfig: &style.QuickRunConfig{
        FontFamily: "Georgia",
        FontSize:   14,
        Bold:       true,
        FontColor:  "2E74B5", // Blue color
    },
}

customStyle, err := quickAPI.CreateQuickStyle(config)
if err != nil {
    log.Fatal(err)
}

// Use the custom style
para := doc.AddParagraph("Text with custom style")
para.SetStyle("MyCustomStyle")
```

### QuickParagraphConfig Options

```go
type QuickParagraphConfig struct {
    Alignment       string  // "left", "center", "right", "justify"
    SpaceBefore     int     // Space before paragraph (twips)
    SpaceAfter      int     // Space after paragraph (twips)
    LineSpacing     int     // Line spacing (twips)
    LineSpacingRule string  // "auto", "exact", "atLeast"
    FirstLineIndent int     // First line indent (twips)
    LeftIndent      int     // Left indent (twips)
    RightIndent     int     // Right indent (twips)
    KeepWithNext    bool    // Keep with next paragraph
    KeepLines       bool    // Keep lines together
    PageBreakBefore bool    // Page break before paragraph
    OutlineLevel    int     // Outline level (0-9)
}
```

### QuickRunConfig Options

```go
type QuickRunConfig struct {
    FontFamily    string  // Font name (e.g., "Arial")
    FontSize      float64 // Font size in points
    Bold          bool    // Bold text
    Italic        bool    // Italic text
    Underline     bool    // Underlined text
    Strike        bool    // Strikethrough
    FontColor     string  // Hex color code
    Highlight     string  // Highlight color
    AllCaps       bool    // All uppercase
    SmallCaps     bool    // Small capitals
    Superscript   bool    // Superscript
    Subscript     bool    // Subscript
}
```

## Style Inheritance

Styles in WordZero support inheritance through the `BasedOn` property:

```go
// Create a base style
baseConfig := style.QuickStyleConfig{
    ID:      "BaseStyle",
    Name:    "Base Style",
    Type:    style.StyleTypeParagraph,
    RunConfig: &style.QuickRunConfig{
        FontFamily: "Arial",
        FontSize:   12,
    },
}
quickAPI.CreateQuickStyle(baseConfig)

// Create a derived style
derivedConfig := style.QuickStyleConfig{
    ID:      "DerivedStyle",
    Name:    "Derived Style",
    Type:    style.StyleTypeParagraph,
    BasedOn: "BaseStyle", // Inherits from BaseStyle

    // Override only specific properties
    RunConfig: &style.QuickRunConfig{
        Bold: true, // Add bold, inherit font family and size
    },
}
quickAPI.CreateQuickStyle(derivedConfig)
```

## Style Types

WordZero supports four style types:

```go
const (
    StyleTypeParagraph = "paragraph" // Paragraph styles
    StyleTypeCharacter = "character" // Character (run) styles
    StyleTypeTable     = "table"     // Table styles
    StyleTypeNumbering = "numbering" // Numbering styles
)
```

## Creating Character Styles

Character styles only affect text formatting, not paragraph formatting:

```go
charConfig := style.QuickStyleConfig{
    ID:   "HighlightedCode",
    Name: "Highlighted Code",
    Type: style.StyleTypeCharacter,

    RunConfig: &style.QuickRunConfig{
        FontFamily: "Consolas",
        FontSize:   10,
        FontColor:  "C7254E",
        Highlight:  "yellow",
    },
}
quickAPI.CreateQuickStyle(charConfig)
```

## Best Practices

1. **Use predefined styles when possible** - They are optimized and well-tested.

2. **Use meaningful style names** - Choose descriptive IDs that reflect the purpose.

3. **Leverage inheritance** - Create base styles and derive specific styles to maintain consistency.

4. **Limit custom styles** - Too many styles can make documents hard to maintain.

5. **Test across Word versions** - Verify your custom styles render correctly in different versions of Microsoft Word.

```go
// Good: Create a consistent style hierarchy
baseConfig := style.QuickStyleConfig{
    ID:      "CompanyBase",
    Name:    "Company Base",
    Type:    style.StyleTypeParagraph,
    RunConfig: &style.QuickRunConfig{
        FontFamily: "Calibri",
        FontSize:   11,
    },
}

headingConfig := style.QuickStyleConfig{
    ID:      "CompanyHeading",
    Name:    "Company Heading",
    Type:    style.StyleTypeParagraph,
    BasedOn: "CompanyBase",
    RunConfig: &style.QuickRunConfig{
        Bold:     true,
        FontSize: 16,
    },
}
```
