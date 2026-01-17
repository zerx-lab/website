# Table Operations

WordZero provides comprehensive table creation and manipulation capabilities. This document covers everything from basic table creation to advanced formatting.

## Creating Tables

### Basic Table Creation

```go
import "github.com/zerx-lab/wordZero/pkg/document"

doc := document.New()

// Create a table with 3 rows and 4 columns
table := doc.AddTable(3, 4)

// Access cells and add content
table.Rows[0].Cells[0].AddParagraph("Header 1")
table.Rows[0].Cells[1].AddParagraph("Header 2")
table.Rows[0].Cells[2].AddParagraph("Header 3")
table.Rows[0].Cells[3].AddParagraph("Header 4")

// Add data rows
table.Rows[1].Cells[0].AddParagraph("Row 1, Col 1")
table.Rows[1].Cells[1].AddParagraph("Row 1, Col 2")
// ... continue adding content
```

### Using CreateTable

```go
// CreateTable provides more control over table structure
table := doc.CreateTable(&document.TableConfig{
    Rows:    5,
    Columns: 3,
    Width:   9000, // Table width in twips
})
```

## Table Structure

### Understanding the Table Hierarchy

```
Table
├── TableProperties (borders, width, alignment)
├── TableGrid (column definitions)
└── Rows[]
    └── TableRow
        ├── RowProperties (height, header row)
        └── Cells[]
            └── TableCell
                ├── CellProperties (width, borders, shading)
                └── Paragraphs[]
```

### Accessing Table Elements

```go
// Access specific row
row := table.Rows[0]

// Access specific cell
cell := table.Rows[0].Cells[1]

// Add paragraph to cell
para := cell.AddParagraph("Cell content")

// Add formatted paragraph to cell
para := cell.AddFormattedParagraph("Bold text", &document.TextFormat{Bold: true})
```

## Table Styling

### Table Borders

```go
// Set table borders
table.SetBorders(&document.TableBorderConfig{
    Top:     &document.Border{Style: "single", Size: 4, Color: "000000"},
    Bottom:  &document.Border{Style: "single", Size: 4, Color: "000000"},
    Left:    &document.Border{Style: "single", Size: 4, Color: "000000"},
    Right:   &document.Border{Style: "single", Size: 4, Color: "000000"},
    InsideH: &document.Border{Style: "single", Size: 4, Color: "CCCCCC"},
    InsideV: &document.Border{Style: "single", Size: 4, Color: "CCCCCC"},
})
```

### Border Styles

Available border styles:
- `single` - Single line
- `double` - Double line
- `dashed` - Dashed line
- `dotted` - Dotted line
- `thick` - Thick line
- `nil` - No border

### Table Width

```go
// Set table width (in twips)
table.SetWidth(9000) // About 6.25 inches

// Set width as percentage
table.SetWidthPercent(100) // Full page width
```

### Table Alignment

```go
// Align table in document
table.SetAlignment("center") // "left", "center", "right"
```

## Cell Operations

### Cell Content

```go
cell := table.Rows[0].Cells[0]

// Add simple text
cell.AddParagraph("Simple text")

// Add multiple paragraphs
cell.AddParagraph("First paragraph")
cell.AddParagraph("Second paragraph")

// Add formatted text
cell.AddFormattedParagraph("Formatted", &document.TextFormat{
    Bold:      true,
    FontColor: "FF0000",
})
```

### Cell Width

```go
// Set individual cell width (in twips)
cell.SetWidth(2000)

// Set width type
cell.SetWidthType("dxa")  // Fixed width in twips
cell.SetWidthType("pct")  // Percentage
cell.SetWidthType("auto") // Automatic
```

### Cell Shading (Background Color)

```go
// Set cell background color
cell.SetShading("E6F2FF") // Light blue

// Set header row with shading
for _, cell := range table.Rows[0].Cells {
    cell.SetShading("4472C4") // Blue header
    cell.AddFormattedParagraph("Header", &document.TextFormat{
        Bold:      true,
        FontColor: "FFFFFF", // White text
    })
}
```

### Cell Vertical Alignment

```go
// Align content vertically within cell
cell.SetVerticalAlignment("top")    // Top
cell.SetVerticalAlignment("center") // Center
cell.SetVerticalAlignment("bottom") // Bottom
```

### Cell Margins (Padding)

```go
cell.SetMargins(&document.CellMargins{
    Top:    100, // twips
    Right:  100,
    Bottom: 100,
    Left:   100,
})
```

## Merging Cells

### Horizontal Merge (Spanning Columns)

```go
// Merge cells horizontally (span 3 columns)
table.Rows[0].Cells[0].SetHorizontalMerge("restart") // Start of merge
table.Rows[0].Cells[1].SetHorizontalMerge("continue")
table.Rows[0].Cells[2].SetHorizontalMerge("continue")

// Only add content to the first cell
table.Rows[0].Cells[0].AddParagraph("Merged Header")
```

### Vertical Merge (Spanning Rows)

```go
// Merge cells vertically (span 3 rows)
table.Rows[0].Cells[0].SetVerticalMerge("restart") // Start of merge
table.Rows[1].Cells[0].SetVerticalMerge("continue")
table.Rows[2].Cells[0].SetVerticalMerge("continue")

// Only add content to the first cell
table.Rows[0].Cells[0].AddParagraph("Merged Cell")
```

### Complex Merge Example

```go
// Create a table with merged cells
table := doc.AddTable(4, 4)

// Merge top-left 2x2 area
table.Rows[0].Cells[0].SetHorizontalMerge("restart")
table.Rows[0].Cells[1].SetHorizontalMerge("continue")
table.Rows[0].Cells[0].SetVerticalMerge("restart")
table.Rows[1].Cells[0].SetVerticalMerge("continue")
table.Rows[1].Cells[0].SetHorizontalMerge("restart")
table.Rows[1].Cells[1].SetHorizontalMerge("continue")

table.Rows[0].Cells[0].AddParagraph("2x2 Merged Area")
```

## Row Operations

### Row Height

```go
// Set row height (in twips)
table.Rows[0].SetHeight(500)

// Set height rule
table.Rows[0].SetHeightRule("exact")   // Exact height
table.Rows[0].SetHeightRule("atLeast") // Minimum height
table.Rows[0].SetHeightRule("auto")    // Automatic
```

### Header Row

```go
// Mark row as header (repeats on each page)
table.Rows[0].SetHeader(true)
```

### Prevent Row Breaking Across Pages

```go
table.Rows[0].SetCantSplit(true)
```

## Nested Tables

WordZero supports tables within table cells:

```go
// Create outer table
outerTable := doc.AddTable(2, 2)

// Add nested table to a cell
outerTable.Rows[0].Cells[0].AddParagraph("Cell with nested table:")
nestedTable := outerTable.Rows[0].Cells[0].AddTable(2, 2)

nestedTable.Rows[0].Cells[0].AddParagraph("Nested 1")
nestedTable.Rows[0].Cells[1].AddParagraph("Nested 2")
nestedTable.Rows[1].Cells[0].AddParagraph("Nested 3")
nestedTable.Rows[1].Cells[1].AddParagraph("Nested 4")
```

## Table Banding (Alternating Row Colors)

```go
// Apply alternating row colors
for i, row := range table.Rows {
    color := "FFFFFF" // White
    if i%2 == 1 {
        color = "F2F2F2" // Light gray
    }
    for _, cell := range row.Cells {
        cell.SetShading(color)
    }
}
```

## Complete Table Example

```go
func createStyledTable(doc *document.Document) {
    // Create table
    table := doc.AddTable(5, 4)

    // Style header row
    headers := []string{"Product", "Quantity", "Price", "Total"}
    for i, header := range headers {
        cell := table.Rows[0].Cells[i]
        cell.SetShading("4472C4")
        cell.AddFormattedParagraph(header, &document.TextFormat{
            Bold:      true,
            FontColor: "FFFFFF",
        })
    }
    table.Rows[0].SetHeader(true)

    // Add data with alternating colors
    data := [][]string{
        {"Widget A", "10", "$5.00", "$50.00"},
        {"Widget B", "5", "$10.00", "$50.00"},
        {"Widget C", "20", "$2.50", "$50.00"},
        {"Total", "", "", "$150.00"},
    }

    for i, rowData := range data {
        row := table.Rows[i+1]
        bgColor := "FFFFFF"
        if i%2 == 1 {
            bgColor = "F2F2F2"
        }

        for j, cellData := range rowData {
            cell := row.Cells[j]
            cell.SetShading(bgColor)
            cell.AddParagraph(cellData)
        }
    }

    // Merge "Total" row first 3 cells
    table.Rows[4].Cells[0].SetHorizontalMerge("restart")
    table.Rows[4].Cells[1].SetHorizontalMerge("continue")
    table.Rows[4].Cells[2].SetHorizontalMerge("continue")

    // Set table borders
    table.SetBorders(&document.TableBorderConfig{
        Top:     &document.Border{Style: "single", Size: 4, Color: "4472C4"},
        Bottom:  &document.Border{Style: "single", Size: 4, Color: "4472C4"},
        Left:    &document.Border{Style: "single", Size: 4, Color: "4472C4"},
        Right:   &document.Border{Style: "single", Size: 4, Color: "4472C4"},
        InsideH: &document.Border{Style: "single", Size: 4, Color: "CCCCCC"},
        InsideV: &document.Border{Style: "single", Size: 4, Color: "CCCCCC"},
    })

    // Set table width to 100%
    table.SetWidthPercent(100)
}
```

## Reading Tables from Existing Documents

```go
doc, _ := document.Open("existing.docx")

// Iterate through document elements
for _, element := range doc.Body.Elements {
    if table, ok := element.(*document.Table); ok {
        // Process table
        for rowIndex, row := range table.Rows {
            for cellIndex, cell := range row.Cells {
                // Get cell text
                text := cell.GetText()
                fmt.Printf("Row %d, Cell %d: %s\n", rowIndex, cellIndex, text)
            }
        }
    }
}
```
