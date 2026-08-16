# NEX WoodMart Platform - Experiment Plan

## Overview

Before deploying the platform for production use, run these experiments to validate the architecture and understand WoodMart's internal structure.

---

## EXP-001: WoodMart Export Structure Analysis

**Goal:** Understand how WoodMart stores settings, headers, and layouts in the database.

**Method:**
1. Install fresh WordPress with WoodMart
2. Configure various settings (header, colors, typography)
3. Export using WoodMart's export feature
4. Inspect the exported JSON
5. Compare with wp_options table

**Expected Findings:**
- Location of theme settings (wd_options)
- Header builder data structure
- Layout configuration format

**Output:** `experiments/exp-001-woodmart-export/analysis.md`

---

## EXP-002: Elementor JSON Structure

**Goal:** Understand Elementor's template JSON structure for programmatic generation.

**Method:**
1. Create a simple page with Elementor
2. Export the template
3. Inspect the JSON structure
4. Identify widget configurations, settings, and styles

**Expected Findings:**
- Template metadata structure
- Widget hierarchy representation
- Style and settings encoding

**Output:** `experiments/exp-002-elementor-json/structure-analysis.md`

---

## EXP-003: Header Builder Reverse Engineering

**Goal:** Map WoodMart Header Builder elements to their database representations.

**Method:**
1. Create multiple headers with different configurations
2. Export each header
3. Compare differences in export files
4. Correlate UI settings with JSON values

**Expected Findings:**
- Element positioning data
- Element-specific settings structure
- Responsive configuration storage

**Output:** `experiments/exp-003-header-builder/header-mapping.md`

---

## EXP-004: WoodMart + Elementor Integration

**Goal:** Understand how WoodMart widgets work within Elementor.

**Method:**
1. Create pages with WoodMart widgets in Elementor
2. Export templates
3. Compare with standard Elementor widgets
4. Test dynamic content tags

**Expected Findings:**
- WoodMart widget registration in Elementor
- Dynamic tag compatibility
- Rendering pipeline

**Output:** `experiments/exp-004-integration/integration-analysis.md`

---

## EXP-005: Demo Import Analysis

**Goal:** Understand WoodMart demo import structure for knowledge base creation.

**Method:**
1. Import a WoodMart demo
2. Track all database changes
3. Analyze imported content types
4. Document dependencies

**Expected Findings:**
- Demo package structure
- Required plugins and settings
- Content relationships

**Output:** `experiments/exp-005-demo-import/demo-structure.md`

---

## EXP-006: Native vs Custom Performance

**Goal:** Quantify performance difference between native WoodMart features and custom solutions.

**Method:**
1. Create identical layouts using:
   - Native WoodMart features
   - Elementor widgets
   - Custom code
2. Run performance tests (Lighthouse, WebPageTest)
3. Compare metrics

**Expected Findings:**
- Load time differences
- DOM size impact
- CSS/JS overhead

**Output:** `experiments/exp-006-performance/benchmark-results.md`

---

## EXP-007: REST API Capabilities

**Goal:** Test WordPress REST API endpoints needed for the platform.

**Method:**
1. Test all planned API endpoints
2. Document authentication requirements
3. Identify limitations
4. Test batch operations

**Expected Findings:**
- Available endpoints
- Permission requirements
- Rate limiting behavior

**Output:** `experiments/exp-007-api-testing/api-documentation.md`

---

## EXP-008: Design Token Mapping

**Goal:** Validate Design System token to WoodMart/Elementor mapping.

**Method:**
1. Define sample design tokens
2. Apply to WoodMart settings
3. Verify visual output
4. Document mapping rules

**Expected Findings:**
- Token to setting correlations
- Conversion formulas
- Edge cases

**Output:** `experiments/exp-008-tokens/token-mapping.md`

---

## Running Experiments

```bash
cd /workspace/nex-woodmart-platform/experiments

# Create experiment directory
mkdir exp-001-woodmart-export

# Run experiment script (if available)
python run_exp_001.py

# Document findings
vim exp-001-woodmart-export/analysis.md
```

---

## Success Criteria

An experiment is successful when:
- [ ] Hypothesis clearly stated
- [ ] Method documented
- [ ] Data collected
- [ ] Findings analyzed
- [ ] Recommendations provided
- [ ] Knowledge base updated (if applicable)

---

## Priority Order

1. **EXP-001** - Foundation for all other experiments
2. **EXP-002** - Critical for template generation
3. **EXP-007** - Needed for platform connectivity
4. **EXP-003** - Important for header editing
5. **EXP-004** - Integration validation
6. **EXP-006** - Performance baseline
7. **EXP-005** - Demo knowledge ingestion
8. **EXP-008** - Design system validation

---

## Timeline

| Week | Experiments |
|------|-------------|
| 1 | EXP-001, EXP-002 |
| 2 | EXP-003, EXP-007 |
| 3 | EXP-004, EXP-006 |
| 4 | EXP-005, EXP-008 |

---

## Notes

- Run experiments on a test WordPress installation, not production
- Keep detailed notes of any unexpected behavior
- Update capability registry based on findings
- Revise rules if new constraints are discovered
