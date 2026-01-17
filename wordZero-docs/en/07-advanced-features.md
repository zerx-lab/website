# Advanced Features

This document covers advanced WordZero features including headers/footers, table of contents, footnotes, images, and lists.

## Headers and Footers

### Adding Headers

```go
import "github.com/zerx-lab/wordZero/pkg/document"

doc := document.New()

// Add a simple header
header := doc.AddHeader(document.HeaderTypeDefault)
header.AddParagraph("Company Name - Confidential")

// Add header with formatting
headerPara := header.AddFormattedParagraph("Document Title", &document.TextFormat{
    Bold:     true,
    FontSize: 14,
})
headerPara.SetAlignment(document.AlignCenter)
```

### Header Types

```go
// Default header (appears on all pages)
doc.AddHeader(document.HeaderTypeDefault)

// First page header (different header for first page)
doc.AddHeader(document.HeaderTypeFirst)

// Odd pages header
doc.AddHeader(document.HeaderTypeOdd)

// Even pages header
doc.AddHeader(document.HeaderTypeEven)
```

### Adding Footers

```go
// Add a simple footer
footer := doc.AddFooter(document.FooterTypeDefault)
footer.AddParagraph("Page 1 of 10")

// Add footer with page number
footer := doc.AddFooterWithPageNumber(document.FooterTypeDefault)
```

### Footer with Custom Page Numbers

```go
footer := doc.AddFooter(document.FooterTypeDefault)

// Create paragraph with page number field
para := footer.AddParagraph("")
para.AddPageNumberField()
para.AddFormattedText(" of ", nil)
para.AddTotalPagesField()
para.SetAlignment(document.AlignCenter)
```

### Different First Page Header/Footer

```go
// Enable different first page
doc.SetDifferentFirstPageHeaderFooter(true)

// Add first page header
firstHeader := doc.AddHeader(document.HeaderTypeFirst)
firstHeader.AddParagraph("Cover Page Header")

// Add default header for other pages
defaultHeader := doc.AddHeader(document.HeaderTypeDefault)
defaultHeader.AddParagraph("Regular Page Header")
```

### Odd/Even Page Headers

```go
// Enable different odd/even pages
doc.SetDifferentOddEvenPages(true)

// Add odd page header
oddHeader := doc.AddHeader(document.HeaderTypeOdd)
oddHeader.AddParagraph("Odd Page Header")

// Add even page header
evenHeader := doc.AddHeader(document.HeaderTypeEven)
evenHeader.AddParagraph("Even Page Header")
```

## Table of Contents

### Generating TOC

```go
doc := document.New()

// Add TOC placeholder
doc.GenerateTOC(&document.TOCConfig{
    Title:      "Table of Contents",
    MaxLevel:   3,  // Include headings up to level 3
    ShowPageNumbers: true,
    RightAlignPageNumbers: true,
    UseHyperlinks: true,
})

// Add content with headings
doc.AddHeadingParagraph("Chapter 1: Introduction", 1)
doc.AddParagraph("Introduction content...")

doc.AddHeadingParagraph("Section 1.1: Background", 2)
doc.AddParagraph("Background content...")

doc.AddHeadingParagraph("Chapter 2: Methods", 1)
doc.AddParagraph("Methods content...")

doc.Save("document-with-toc.docx")
```

### TOC Configuration

```go
type TOCConfig struct {
    Title                 string // TOC title text
    MaxLevel              int    // Maximum heading level (1-9)
    ShowPageNumbers       bool   // Display page numbers
    RightAlignPageNumbers bool   // Right-align page numbers
    UseHyperlinks         bool   // Make entries clickable
    TabLeader             string // Leader character ("dot", "hyphen", "underscore", "none")
    StylePrefix           string // Custom style prefix for TOC entries
}
```

### Updating TOC

After adding content with headings, the TOC updates automatically when the document is opened in Word. To programmatically trigger an update:

```go
doc.UpdateTOC()
```

## Footnotes and Endnotes

### Adding Footnotes

```go
doc := document.New()

para := doc.AddParagraph("This is a statement that needs a citation")
doc.AddFootnote(para, "Source: Smith, J. (2024). Book Title. Publisher.")

// Add another footnote
para2 := doc.AddParagraph("Another important fact")
doc.AddFootnote(para2, "See: Johnson, A. (2023). Research Paper.")
```

### Adding Endnotes

```go
para := doc.AddParagraph("A statement with an endnote reference")
doc.AddEndnote(para, "This endnote appears at the end of the document.")
```

### Footnote Configuration

```go
doc.SetFootnoteConfig(&document.FootnoteConfig{
    NumberFormat:    "decimal",     // "decimal", "lowerRoman", "upperRoman", "lowerLetter", "upperLetter"
    StartNumber:     1,             // Starting number
    RestartEachPage: false,         // Restart numbering on each page
    Position:        "pageBottom",  // "pageBottom" or "beneathText"
})
```

### Endnote Configuration

```go
doc.SetEndnoteConfig(&document.EndnoteConfig{
    NumberFormat: "lowerRoman",
    StartNumber:  1,
    Position:     "docEnd",  // "docEnd" or "sectEnd"
})
```

## Images

### Adding Images from File

```go
doc := document.New()

// Add image with default settings
err := doc.AddImageFromFile("photo.jpg", nil)
if err != nil {
    log.Fatal(err)
}

// Add image with custom size
err = doc.AddImageFromFile("logo.png", &document.ImageConfig{
    Width:  200,  // points
    Height: 100,
})
```

### Image Configuration

```go
type ImageConfig struct {
    Width       float64 // Width in points
    Height      float64 // Height in points
    Alignment   string  // "left", "center", "right"
    AltText     string  // Alternative text for accessibility
    Title       string  // Image title
}

config := &document.ImageConfig{
    Width:     300,
    Height:    200,
    Alignment: "center",
    AltText:   "Company Logo",
    Title:     "Logo Image",
}

doc.AddImageFromFile("logo.png", config)
```

### Adding Images from Bytes

```go
// Read image data
imageData, _ := os.ReadFile("image.jpg")

// Add to document
err := doc.AddImage(imageData, "image/jpeg", &document.ImageConfig{
    Width:  400,
    Height: 300,
})
```

### Floating Images

```go
// Add floating (positioned) image
config := &document.FloatingImageConfig{
    Width:           200,
    Height:          150,
    HorizontalPos:   "right",      // "left", "center", "right"
    VerticalPos:     "top",        // "top", "center", "bottom"
    WrapType:        "square",     // "inline", "square", "tight", "behind", "inFront"
    HorizontalOffset: 0,           // Points from anchor
    VerticalOffset:   0,
    AllowOverlap:    false,
}

doc.AddFloatingImage("image.jpg", config)
```

### Image Formats

Supported image formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- TIFF (.tif, .tiff)

## Lists and Numbering

### Bullet Lists

```go
doc := document.New()

// Add bullet list
items := []string{
    "First item",
    "Second item",
    "Third item",
}
doc.AddBulletList(items)
```

### Numbered Lists

```go
// Add numbered list
items := []string{
    "Step one",
    "Step two",
    "Step three",
}
doc.AddNumberedList(items)
```

### Multi-Level Lists

```go
// Create multi-level list
list := doc.CreateMultiLevelList()

// Level 0 (top level)
list.AddItem("Chapter 1", 0)
    list.AddItem("Section 1.1", 1)
        list.AddItem("Topic 1.1.1", 2)
        list.AddItem("Topic 1.1.2", 2)
    list.AddItem("Section 1.2", 1)
list.AddItem("Chapter 2", 0)
    list.AddItem("Section 2.1", 1)
```

### Custom Numbering

```go
// Create custom numbered list
list := doc.CreateNumberedList(&document.NumberingConfig{
    Format:     "decimal",     // "decimal", "lowerLetter", "upperLetter", "lowerRoman", "upperRoman"
    Start:      1,             // Starting number
    Suffix:     ".",           // Text after number
    Indent:     720,           // Indentation in twips
})

list.AddItem("First item")
list.AddItem("Second item")
list.AddItem("Third item")
```

### Nested Lists Example

```go
doc := document.New()

// Create main list
doc.AddParagraph("Project Requirements:")

mainList := doc.CreateMultiLevelList()
mainList.SetBulletStyle(0, "bullet")
mainList.SetBulletStyle(1, "circle")
mainList.SetBulletStyle(2, "square")

mainList.AddItem("Backend Development", 0)
    mainList.AddItem("API Design", 1)
        mainList.AddItem("REST endpoints", 2)
        mainList.AddItem("Authentication", 2)
    mainList.AddItem("Database", 1)
        mainList.AddItem("Schema design", 2)
        mainList.AddItem("Migrations", 2)
mainList.AddItem("Frontend Development", 0)
    mainList.AddItem("UI Components", 1)
    mainList.AddItem("State Management", 1)
```

## Document Properties

### Setting Properties

```go
doc := document.New()

doc.SetProperties(&document.Properties{
    Title:          "Annual Report 2024",
    Subject:        "Company Performance",
    Creator:        "John Smith",
    Keywords:       "annual, report, 2024, performance",
    Description:    "Annual performance report for fiscal year 2024",
    LastModifiedBy: "Jane Doe",
    Category:       "Business",
    Version:        "1.0",
})

doc.Save("report.docx")
```

### Reading Properties

```go
doc, _ := document.Open("report.docx")

props := doc.GetProperties()
fmt.Printf("Title: %s\n", props.Title)
fmt.Printf("Creator: %s\n", props.Creator)
fmt.Printf("Created: %s\n", props.Created)
fmt.Printf("Modified: %s\n", props.Modified)
```

## Bookmarks and Hyperlinks

### Adding Bookmarks

```go
// Create a bookmark
para := doc.AddParagraph("Important Section")
doc.AddBookmark(para, "important-section")

// Later, reference the bookmark
doc.AddParagraph("See the ")
doc.AddInternalHyperlink("important-section", "Important Section")
doc.AddParagraph(" above.")
```

### Adding Hyperlinks

```go
// Add external hyperlink
para := doc.AddParagraph("Visit our website: ")
para.AddHyperlink("https://example.com", "Example.com")

// Add email link
para2 := doc.AddParagraph("Contact us: ")
para2.AddHyperlink("mailto:info@example.com", "info@example.com")
```

## Section Breaks

### Adding Section Breaks

```go
doc := document.New()

// Add content for first section
doc.AddParagraph("First section content")

// Add section break
doc.AddSectionBreak(document.SectionBreakNextPage)

// Add content for second section with different settings
doc.SetPageOrientation(document.OrientationLandscape)
doc.AddParagraph("Second section in landscape")

// Add continuous section break
doc.AddSectionBreak(document.SectionBreakContinuous)
doc.AddParagraph("Back to normal flow")
```

### Section Break Types

```go
const (
    SectionBreakNextPage    = "nextPage"    // Start on new page
    SectionBreakContinuous  = "continuous"  // Continue on same page
    SectionBreakEvenPage    = "evenPage"    // Start on next even page
    SectionBreakOddPage     = "oddPage"     // Start on next odd page
)
```

## Fields

### Common Fields

```go
para := doc.AddParagraph("")

// Add date field
para.AddDateField("MMMM d, yyyy")  // "January 15, 2024"

// Add time field
para.AddTimeField("h:mm AM/PM")    // "3:30 PM"

// Add page number field
para.AddPageNumberField()

// Add total pages field
para.AddTotalPagesField()

// Add file name field
para.AddFileNameField()
```

## Complete Example

```go
package main

import (
    "log"
    "github.com/zerx-lab/wordZero/pkg/document"
)

func main() {
    doc := document.New()

    // Set document properties
    doc.SetProperties(&document.Properties{
        Title:   "Complete Document Example",
        Creator: "WordZero",
    })

    // Set page settings
    doc.SetPageSize(document.PageSizeA4)
    doc.SetPageMargins(1440, 1440, 1440, 1440)

    // Add header
    header := doc.AddHeader(document.HeaderTypeDefault)
    header.AddFormattedParagraph("Complete Example", &document.TextFormat{Bold: true})

    // Add footer with page numbers
    footer := doc.AddFooter(document.FooterTypeDefault)
    footerPara := footer.AddParagraph("Page ")
    footerPara.AddPageNumberField()
    footerPara.SetAlignment(document.AlignCenter)

    // Add title
    title := doc.AddParagraph("Complete Document Example")
    title.SetStyle("Title")

    // Add TOC
    doc.GenerateTOC(&document.TOCConfig{
        Title:    "Contents",
        MaxLevel: 2,
    })

    doc.AddPageBreak()

    // Chapter 1
    doc.AddHeadingParagraph("Chapter 1: Introduction", 1)
    doc.AddParagraph("This chapter introduces the main concepts.")

    para := doc.AddParagraph("An important fact")
    doc.AddFootnote(para, "Citation for this fact.")

    // Add image
    doc.AddImageFromFile("diagram.png", &document.ImageConfig{
        Width:     400,
        Height:    200,
        Alignment: "center",
    })

    // Chapter 2 with table
    doc.AddHeadingParagraph("Chapter 2: Data", 1)

    table := doc.AddTable(3, 3)
    table.Rows[0].Cells[0].AddParagraph("Item")
    table.Rows[0].Cells[1].AddParagraph("Quantity")
    table.Rows[0].Cells[2].AddParagraph("Price")
    // ... add more data

    // Chapter 3 with list
    doc.AddHeadingParagraph("Chapter 3: Summary", 1)
    doc.AddBulletList([]string{
        "Key finding 1",
        "Key finding 2",
        "Key finding 3",
    })

    // Save
    if err := doc.Save("complete-example.docx"); err != nil {
        log.Fatal(err)
    }
}
```
