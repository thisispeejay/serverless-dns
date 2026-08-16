# EXP-001: WoodMart Export Structure Analysis

## Status
📋 **Not Started**

## Goal
Understand how WoodMart stores settings, headers, and layouts in the database to enable programmatic manipulation.

## Hypothesis
WoodMart stores:
- Theme settings in `wp_options` table under `wd_options` key
- Headers as custom post type `wd_header`
- Layouts as custom post type `wd_layout`
- HTML Blocks as custom post type `wd_html_block`

## Method

### Step 1: Setup Test Environment
```bash
# Install fresh WordPress
# Install WoodMart theme
# Activate WoodMart
```

### Step 2: Configure Settings
Document each configuration change:
1. General settings
2. Header configuration (logo, navigation, cart)
3. Color scheme
4. Typography
5. Shop settings

### Step 3: Export
```
WordPress Admin → WoodMart → Import/Export → Export Settings
```

### Step 4: Database Inspection
```sql
-- Get theme options
SELECT * FROM wp_options WHERE option_name = 'wd_options';

-- Get headers
SELECT ID, post_title, post_content FROM wp_posts WHERE post_type = 'wd_header';

-- Get layouts  
SELECT ID, post_title, post_content FROM wp_posts WHERE post_type = 'wd_layout';

-- Get header meta
SELECT * FROM wp_postmeta WHERE post_id IN (SELECT ID FROM wp_posts WHERE post_type = 'wd_header');
```

### Step 5: Compare Export with Database
- Map export JSON keys to database values
- Identify serialization format
- Document any transformations

## Expected Output

### File Structure
```
experiments/exp-001-woodmart-export/
├── exported-settings.json      # WoodMart export file
├── database-dump.sql          # Relevant DB tables
├── analysis.md                # Detailed findings
└── mapping.yaml               # Key-to-database mapping
```

### Analysis Document Should Include
1. Complete data structure for each setting type
2. Relationship between export file and database
3. Identification of critical settings for platform operations
4. Recommendations for API implementation

## Success Criteria
- [ ] Can identify where each major setting is stored
- [ ] Understand the export/import format
- [ ] Can programmatically read settings via REST API
- [ ] Can programmatically update settings via REST API
- [ ] Documentation complete in `analysis.md`

## Timeline
- Setup: 1 hour
- Configuration: 2 hours
- Export & Inspection: 2 hours
- Analysis: 3 hours
- Documentation: 2 hours

**Total: ~10 hours**

## Notes
Run this experiment FIRST as it informs all other experiments.
