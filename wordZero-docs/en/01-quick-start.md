# Quick Start Guide

This guide will help you get started with WordZero quickly. WordZero is a high-performance Go library for creating, reading, and manipulating Microsoft Word documents (.docx).

## Installation

### Requirements

- Go 1.19 or higher

### Install via Go Modules

```bash
go get github.com/zerx-lab/wordZero
```

## Your First Document

Let's create a simple Word document:

```go
package main

import (
    "log"
    "github.com/zerx-lab/wordZero/pkg/document"
)

func main() {
    // Create a new document
    doc := document.New()

    // Add a paragraph
    doc.AddParagraph("Hello, WordZero!")

    // Save the document
    if err := doc.Save("hello.docx"); err != nil {
        log.Fatal(err)
    }
}
```

## Basic Operations

### Creating Documents

```go
// Create a new empty document
doc := document.New()

// Open an existing document
doc, err := document.Open("existing.docx")
if err != nil {
    log.Fatal(err)
}
```

### Adding Content

```go
// Add a simple paragraph
doc.AddParagraph("This is a paragraph.")

// Add a heading
doc.AddHeadingParagraph("Chapter 1: Introduction", 1)

// Add formatted text
format := &document.TextFormat{
    Bold:      true,
    FontSize:  14,
    FontColor: "FF0000", // Red color
}
doc.AddFormattedParagraph("Bold red text", format)
```

### Adding Multiple Formatted Text in One Paragraph

```go
para := doc.AddParagraph("")
para.AddFormattedText("Normal text, ", nil)
para.AddFormattedText("bold text, ", &document.TextFormat{Bold: true})
para.AddFormattedText("italic text.", &document.TextFormat{Italic: true})
```

### Saving Documents

```go
// Save to file
err := doc.Save("output.docx")

// Get as bytes (for HTTP response, etc.)
data, err := doc.ToBytes()
```

## Working with Styles

WordZero includes 18 predefined styles:

```go
import "github.com/zerx-lab/wordZero/pkg/style"

// Apply heading style
para := doc.AddParagraph("My Heading")
para.SetStyle(style.StyleHeading1)

// Available predefined styles:
// - style.StyleHeading1 through style.StyleHeading9
// - style.StyleTitle
// - style.StyleSubtitle
// - style.StyleNormal
// - style.StyleQuote
// - style.StyleListParagraph
// - style.StyleCodeBlock
// - style.StyleEmphasis
// - style.StyleStrong
// - style.StyleCodeChar
```

## Creating Tables

```go
// Create a 3x3 table
table := doc.AddTable(3, 3)

// Set cell content
table.Rows[0].Cells[0].AddParagraph("Header 1")
table.Rows[0].Cells[1].AddParagraph("Header 2")
table.Rows[0].Cells[2].AddParagraph("Header 3")

// Add data rows
table.Rows[1].Cells[0].AddParagraph("Data 1")
table.Rows[1].Cells[1].AddParagraph("Data 2")
table.Rows[1].Cells[2].AddParagraph("Data 3")
```

## Page Settings

```go
// Set page size to A4
doc.SetPageSize(document.PageSizeA4)

// Set page orientation to landscape
doc.SetPageOrientation(document.OrientationLandscape)

// Set custom margins (in twips: 1 inch = 1440 twips)
doc.SetPageMargins(1440, 1440, 1440, 1440) // top, right, bottom, left
```

## Adding Images

```go
// Add image from file
imgConfig := &document.ImageConfig{
    Width:  300, // points
    Height: 200,
}
err := doc.AddImageFromFile("photo.jpg", imgConfig)
```

## Next Steps

- [Core API Documentation](02-core-api.md) - Detailed API reference
- [Style System](03-style-system.md) - Custom styles and formatting
- [Table Operations](04-table-operations.md) - Advanced table features
- [Template Engine](05-template-engine.md) - Dynamic document generation
- [Markdown Conversion](06-markdown-conversion.md) - Markdown to Word conversion
- [Advanced Features](07-advanced-features.md) - Headers, footers, TOC, and more
