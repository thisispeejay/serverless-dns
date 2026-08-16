# NEX WoodMart Platform

AI-powered web platform for building and managing WordPress/WooCommerce sites with WoodMart + Elementor.

## 🎯 Purpose

A local-first web application that enables you to:
- Build new WoodMart sites from text descriptions
- Edit existing sites with natural language commands
- Analyze competitor sites from URLs
- Apply custom Design Systems
- Maintain full control with human-in-the-loop workflow

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Web Platform  │────▶│  Python Backend  │────▶│  WordPress API  │
│   (Next.js)     │◀────│  (FastAPI)       │◀────│  (NEX Plugin)   │
└─────────────────┘     └────────┬─────────┘     └─────────────────┘
                                 │
                          ┌──────▼──────┐
                          │ AI Provider │
                          │ (Claude/    │
                          │  GPT/       │
                          │  Gemini)    │
                          └─────────────┘
```

## 📁 Project Structure

```
nex-woodmart-platform/
├── core/                    # Python backend (FastAPI)
│   ├── main.py             # API entry point
│   ├── orchestrator.py     # Workflow management
│   └── config.py           # Configuration
├── web-platform/           # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   └── lib/               # Utilities
├── wordpress-bridge/       # WordPress plugin
│   ├── nex-bridge.php     # Main plugin file
│   └── includes/          # Plugin classes
├── agents/                # AI agent definitions
│   ├── planner.py         # Planning agent
│   ├── builder.py         # Implementation agent
│   └── auditor.py         # QA agent
├── capabilities/          # Capability registry
│   └── woodmart.yaml      # WoodMart capabilities
├── rules/                 # Business rules
│   └── global-rules.yaml  # Global policies
├── knowledge/             # Knowledge base
│   ├── woodmart/         # WoodMart documentation
│   ├── elementor/        # Elementor knowledge
│   └── ux/               # UX guidelines
├── design-systems/        # Design system definitions
├── references/           # Reference library
├── projects/             # Active projects
└── experiments/          # Research experiments
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- WordPress site with WoodMart theme
- AI Provider API key (Claude/OpenAI/Gemini)

### 1. Setup WordPress
```bash
# Install WordPress plugin
cp -r wordpress-bridge/nex-bridge /path/to/wp-content/plugins/
wp plugin activate nex-bridge
```

### 2. Setup Backend
```bash
cd core
pip install -r requirements.txt
python main.py
```

### 3. Setup Frontend
```bash
cd web-platform
npm install
npm run dev
```

### 4. Access Platform
Open http://localhost:3000 in your browser

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md) - Complete system architecture
- [MVP Plan](docs/MVP_PLAN.md) - Step-by-step implementation guide
- [Quick Start](docs/QUICKSTART.md) - Detailed setup instructions

## 🔑 Key Features

### Natural Language Editing
```
User: "Move logo to center, make header sticky"
AI: Analyzes → Plans → Executes → Shows preview → Waits for approval
```

### Site Analysis from URL
```
User: "https://competitor-site.com"
AI: Extracts layout patterns, colors, typography, components
Output: Structured analysis + reusable patterns
```

### Design System Integration
Upload your design tokens (colors, typography, spacing) and the AI enforces them across all changes.

### Human-in-the-Loop
Every change requires your approval before deployment. See before/after screenshots side-by-side.

## 🛡️ Security

- Local-only deployment (no external access)
- API key authentication between components
- WordPress nonce verification
- Backup before any changes
- Read-only mode available

## 📋 Capabilities

The system understands 280+ WoodMart capabilities including:
- Header Builder elements
- Layout configurations
- Product grid settings
- Shop filters
- AJAX features
- Mobile responsiveness

See `capabilities/woodmart.yaml` for complete list.

## 📜 Rules Engine

Enforce best practices automatically:
- Performance rules (avoid nested containers)
- UX rules (touch targets, hierarchy)
- SEO rules (semantic HTML, headings)
- Accessibility rules (ARIA, contrast)

See `rules/global-rules.yaml` for complete list.

## 🧪 Experiments

Before full deployment, run these experiments:
- EXP-001: WoodMart export structure analysis
- EXP-002: Elementor JSON inspection
- EXP-003: Header Builder reverse engineering

See `experiments/` directory for details.

## 🤝 Contributing

This is a private project for internal use.

## 📄 License

Proprietary - All rights reserved
