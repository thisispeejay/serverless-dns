# NEX WoodMart Platform - Rules

This directory contains the rules that govern AI behavior and ensure quality output.

## Rule Files

### global-rules.yaml
Global rules that apply to all projects. Categories include:

- **Performance** - Critical performance rules
- **UX** - User experience guidelines  
- **SEO** - Search engine optimization rules
- **Accessibility** - WCAG compliance rules
- **WoodMart Best Practices** - Theme-specific guidelines
- **Elementor Best Practices** - Page builder guidelines
- **WooCommerce** - E-commerce specific rules

## Rule Structure

```yaml
category:
  priority: critical|high|medium|low
  
  rules:
    - id: "unique-rule-id"
      severity: error|warning|recommendation
      message: "Human-readable explanation"
      check: "validation logic"
```

## Priority Levels

- **critical** - Must never violate (e.g., accessibility)
- **high** - Should rarely violate (e.g., SEO, UX)
- **medium** - Good practices (e.g., code organization)
- **low** - Nice to have (e.g., naming conventions)

## Severity Levels

- **error** - Blocks approval, must fix
- **warning** - Allows approval but flags issue
- **recommendation** - Suggestion for improvement

## Adding Project-Specific Rules

Create a new YAML file in this directory:

```yaml
# project-name-rules.yaml
project_specific:
  priority: high
  
  rules:
    - id: "custom-brand-rule"
      severity: warning
      message: "Use brand colors only"
```

## Enforcement Points

Rules are checked at three stages:

1. **Planning** - Warn about potential violations
2. **Building** - Prevent rule-breaking changes
3. **Auditing** - Flag any missed violations

## Updating Rules

When updating rules:
1. Test against known good configurations
2. Document the change in rule comments
3. Consider impact on existing projects
4. Update version number in file header
