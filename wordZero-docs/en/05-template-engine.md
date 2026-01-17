# Template Engine

WordZero includes a powerful template engine for generating dynamic Word documents. It supports variables, conditionals, loops, and template inheritance.

## Overview

The template engine allows you to:
- Define document templates with placeholders
- Substitute variables at runtime
- Use conditional logic to include/exclude content
- Iterate over collections
- Inherit from base templates and override blocks

## Basic Usage

### Creating a Template Engine

```go
import "github.com/zerx-lab/wordZero/pkg/document"

// Create a new template engine
engine := document.NewTemplateEngine()
```

### Loading Templates

```go
// Load template from string
templateContent := `
Dear {{customerName}},

Thank you for your order #{{orderNumber}}.

Best regards,
{{companyName}}
`

err := engine.LoadTemplate("order-confirmation", templateContent)
if err != nil {
    log.Fatal(err)
}

// Load template from file
err = engine.LoadTemplateFromFile("invoice", "templates/invoice.txt")
```

### Rendering Templates

```go
// Create template data
data := document.NewTemplateData()
data.SetVariable("customerName", "John Doe")
data.SetVariable("orderNumber", "ORD-12345")
data.SetVariable("companyName", "Acme Corp")

// Render to document
doc, err := engine.RenderTemplateToDocument("order-confirmation", data)
if err != nil {
    log.Fatal(err)
}

doc.Save("order-confirmation.docx")
```

## Template Syntax

### Variables

Use double curly braces for variable substitution:

```
Hello, {{name}}!
Your order total is {{total}}.
```

```go
data := document.NewTemplateData()
data.SetVariable("name", "Alice")
data.SetVariable("total", "$99.99")
```

### Conditionals

Use `{{#if}}` for conditional content:

```
{{#if isPremiumMember}}
Thank you for being a premium member!
You get 20% off on all orders.
{{/if}}

{{#if hasDiscount}}
Discount applied: {{discountAmount}}
{{/if}}
```

```go
data := document.NewTemplateData()
data.SetVariable("isPremiumMember", true)
data.SetVariable("hasDiscount", true)
data.SetVariable("discountAmount", "$10.00")
```

### Else Conditions

```
{{#if inStock}}
Item is available for immediate shipping.
{{#else}}
Item is currently out of stock.
{{/if}}
```

### Loops

Use `{{#each}}` to iterate over lists:

```
Order Items:
{{#each items}}
- {{name}}: {{quantity}} x {{price}}
{{/each}}

Total: {{total}}
```

```go
data := document.NewTemplateData()

// Add list items
items := []map[string]interface{}{
    {"name": "Widget A", "quantity": "2", "price": "$10.00"},
    {"name": "Widget B", "quantity": "1", "price": "$25.00"},
    {"name": "Widget C", "quantity": "3", "price": "$5.00"},
}
data.SetList("items", items)
data.SetVariable("total", "$60.00")
```

### Nested Loops

```
Departments:
{{#each departments}}
Department: {{name}}
  Employees:
  {{#each employees}}
    - {{firstName}} {{lastName}}
  {{/each}}
{{/each}}
```

## Template Inheritance

Template inheritance allows you to define base templates with overridable blocks.

### Defining a Base Template

```go
baseTemplate := `
{{companyName}} - Official Document

{{#block "header"}}
Default Header
{{/block}}

{{#block "content"}}
Default Content
{{/block}}

{{#block "footer"}}
© {{year}} {{companyName}}. All rights reserved.
{{/block}}
`

engine.LoadTemplate("base", baseTemplate)
```

### Extending a Template

```go
reportTemplate := `
{{extends "base"}}

{{#block "header"}}
Monthly Sales Report - {{month}} {{year}}
{{/block}}

{{#block "content"}}
Sales Summary:
{{#each salesData}}
- {{region}}: {{amount}}
{{/each}}

Total Sales: {{totalSales}}
{{/block}}
`

engine.LoadTemplate("monthly-report", reportTemplate)
```

### Rendering Extended Templates

```go
data := document.NewTemplateData()
data.SetVariable("companyName", "Acme Corp")
data.SetVariable("month", "January")
data.SetVariable("year", "2024")
data.SetVariable("totalSales", "$150,000")

salesData := []map[string]interface{}{
    {"region": "North", "amount": "$50,000"},
    {"region": "South", "amount": "$45,000"},
    {"region": "East", "amount": "$30,000"},
    {"region": "West", "amount": "$25,000"},
}
data.SetList("salesData", salesData)

doc, _ := engine.RenderTemplateToDocument("monthly-report", data)
doc.Save("monthly-report.docx")
```

## Image Placeholders

Templates can include image placeholders:

```
Company Report

{{#image companyLogo}}

{{#block "content"}}
Report content here...
{{/block}}
```

```go
data := document.NewTemplateData()
data.SetImage("companyLogo", &document.ImageData{
    Path:   "images/logo.png",
    Width:  200,
    Height: 100,
})
```

## Table Templates

Create dynamic tables within templates:

```
Invoice Items:

| Product | Quantity | Price | Total |
{{#each items}}
| {{product}} | {{qty}} | {{price}} | {{lineTotal}} |
{{/each}}
| | | Total: | {{grandTotal}} |
```

## Advanced Features

### Template Caching

The template engine automatically caches parsed templates:

```go
// Templates are cached after first load
engine.LoadTemplate("report", templateContent)

// Subsequent renders use cached template
doc1, _ := engine.RenderTemplateToDocument("report", data1)
doc2, _ := engine.RenderTemplateToDocument("report", data2)

// Clear cache if needed
engine.ClearCache()
```

### Thread Safety

The template engine is thread-safe for concurrent rendering:

```go
// Safe to use from multiple goroutines
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func(id int) {
        defer wg.Done()
        data := document.NewTemplateData()
        data.SetVariable("id", fmt.Sprintf("%d", id))
        doc, _ := engine.RenderTemplateToDocument("report", data)
        doc.Save(fmt.Sprintf("report-%d.docx", id))
    }(i)
}
wg.Wait()
```

### Custom Template Functions

```go
// Register custom function
engine.RegisterFunction("formatCurrency", func(value interface{}) string {
    if v, ok := value.(float64); ok {
        return fmt.Sprintf("$%.2f", v)
    }
    return fmt.Sprintf("%v", value)
})

// Use in template
// Total: {{formatCurrency total}}
```

## Complete Example

```go
package main

import (
    "log"
    "github.com/zerx-lab/wordZero/pkg/document"
)

func main() {
    engine := document.NewTemplateEngine()

    // Define invoice template
    invoiceTemplate := `
INVOICE

{{companyName}}
{{companyAddress}}

Bill To:
{{customerName}}
{{customerAddress}}

Invoice Number: {{invoiceNumber}}
Date: {{invoiceDate}}
Due Date: {{dueDate}}

Items:
{{#each items}}
{{description}}
  Quantity: {{quantity}} x {{unitPrice}} = {{lineTotal}}
{{/each}}

Subtotal: {{subtotal}}
{{#if hasTax}}
Tax ({{taxRate}}%): {{taxAmount}}
{{/if}}
{{#if hasDiscount}}
Discount: -{{discountAmount}}
{{/if}}

TOTAL DUE: {{grandTotal}}

{{#if notes}}
Notes: {{notes}}
{{/if}}

Thank you for your business!
`

    engine.LoadTemplate("invoice", invoiceTemplate)

    // Prepare data
    data := document.NewTemplateData()
    data.SetVariable("companyName", "Acme Corporation")
    data.SetVariable("companyAddress", "123 Business Ave, City, State 12345")
    data.SetVariable("customerName", "John Smith")
    data.SetVariable("customerAddress", "456 Customer St, Town, State 67890")
    data.SetVariable("invoiceNumber", "INV-2024-001")
    data.SetVariable("invoiceDate", "January 15, 2024")
    data.SetVariable("dueDate", "February 15, 2024")

    items := []map[string]interface{}{
        {
            "description": "Professional Services",
            "quantity":    "10 hours",
            "unitPrice":   "$150.00",
            "lineTotal":   "$1,500.00",
        },
        {
            "description": "Software License",
            "quantity":    "1",
            "unitPrice":   "$500.00",
            "lineTotal":   "$500.00",
        },
    }
    data.SetList("items", items)

    data.SetVariable("subtotal", "$2,000.00")
    data.SetVariable("hasTax", true)
    data.SetVariable("taxRate", "10")
    data.SetVariable("taxAmount", "$200.00")
    data.SetVariable("hasDiscount", false)
    data.SetVariable("grandTotal", "$2,200.00")
    data.SetVariable("notes", "Payment is due within 30 days.")

    // Render and save
    doc, err := engine.RenderTemplateToDocument("invoice", data)
    if err != nil {
        log.Fatal(err)
    }

    if err := doc.Save("invoice.docx"); err != nil {
        log.Fatal(err)
    }
}
```

## Best Practices

1. **Keep templates simple** - Complex logic should be in Go code, not templates.

2. **Use meaningful variable names** - `{{customerFirstName}}` is better than `{{n1}}`.

3. **Validate data before rendering** - Ensure all required variables are set.

4. **Use template inheritance** - Create base templates for consistent branding.

5. **Cache templates** - Load templates once and reuse for multiple renders.

6. **Handle missing variables gracefully** - Provide defaults where appropriate.

```go
// Good: Set default values
if customer.Name == "" {
    data.SetVariable("customerName", "Valued Customer")
} else {
    data.SetVariable("customerName", customer.Name)
}
```
