# EXP-002: Elementor JSON Structure Analysis

## Status
📋 **Not Started**

## Goal
Understand Elementor's template JSON structure to enable programmatic page generation.

## Hypothesis
Elementor templates contain:
- Version metadata
- Document type (page, section, widget)
- Hierarchical element structure
- Settings per element (styles, content, advanced)
- Responsive breakpoints data

## Method

### Step 1: Create Test Pages
Create pages with increasing complexity:
1. Simple text heading
2. Heading + Image + Button
3. Multi-column layout
4. Nested containers
5. WoodMart widgets in Elementor

### Step 2: Export Templates
```
WordPress Admin → Templates → Saved Templates → Export
```

### Step 3: Analyze JSON Structure
For each export:
1. Pretty-print the JSON
2. Identify common patterns
3. Map element types to JSON keys
4. Document settings structure

### Step 4: Compare Exports
- Find differences between simple and complex templates
- Identify how nesting is represented
- Understand style inheritance

## Expected Output

### File Structure
```
experiments/exp-002-elementor-json/
├── templates/
│   ├── simple-heading.json
│   ├── multi-element.json
│   ├── nested-containers.json
│   └── woodmart-widgets.json
├── structure-analysis.md
├── element-mapping.yaml
└── generation-rules.md
```

### Key Questions to Answer
1. How are elements hierarchically structured?
2. How are styles encoded (inline vs classes)?
3. How is responsive data stored?
4. What's the minimum valid template structure?
5. How do WoodMart widgets differ from standard Elementor widgets?

## Success Criteria
- [ ] Can parse any Elementor template JSON
- [ ] Understand all required fields for valid template
- [ ] Can programmatically generate valid templates
- [ ] Documentation complete

## Timeline
**~8 hours**
