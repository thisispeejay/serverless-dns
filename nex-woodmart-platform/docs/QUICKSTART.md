# NEX WoodMart Platform - Quick Start Guide

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Python 3.10+** installed
2. **Node.js 18+** installed  
3. **WordPress site** with WoodMart theme activated
4. **AI Provider API Key** (Claude/OpenAI/Gemini)

---

## 🚀 Step 1: Install WordPress Plugin

### Copy Plugin to WordPress

```bash
# Copy the plugin to your WordPress installation
cp -r /workspace/nex-woodmart-platform/wordpress-bridge/nex-bridge /path/to/wordpress/wp-content/plugins/

# Activate via WP-CLI
wp plugin activate nex-bridge
```

### Get Your API Key

After activation:
1. Go to WordPress Admin → NEX Bridge
2. Copy the generated API Key
3. You'll need this for the backend configuration

---

## 🐍 Step 2: Setup Python Backend

```bash
cd /workspace/nex-woodmart-platform/core

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers (for screenshots)
playwright install
```

### Configure Environment

Create a `.env` file in the `core/` directory:

```bash
# WordPress Configuration
WORDPRESS_URL=http://your-wordpress-site.local
WORDPRESS_API_USER=admin
WORDPRESS_API_PASSWORD=your-application-password

# AI Provider Configuration  
AI_PROVIDER=claude  # Options: claude, openai, gemini
AI_API_KEY=your-ai-api-key

# NEX Bridge API Key (from WordPress admin)
NEX_API_KEY=your-nex-api-key-from-wordpress
```

### Generate WordPress Application Password

1. Go to WordPress Admin → Users → Profile
2. Scroll to "Application Passwords"
3. Enter a name (e.g., "NEX Platform")
4. Click "Add New Application Password"
5. Copy the generated password

### Run the Backend

```bash
python main.py
```

The API will start on `http://localhost:8000`

---

## ⚛️ Step 3: Setup Next.js Frontend

```bash
cd /workspace/nex-woodmart-platform/web-platform

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## 🎯 Step 4: First Test

### Test WordPress Connection

1. Open http://localhost:3000 in your browser
2. Go to Settings → WordPress Connection  
3. Enter your WordPress URL and API credentials
4. Click "Test Connection"

### Try Your First Edit

In the chat box, type:
```
Show me the current header configuration
```

Then try an edit:
```
Change the logo position to center
```

The system will analyze, create a plan, show preview, and wait for your approval.

---

## ✅ Success Checklist

- [ ] WordPress plugin installed and activated
- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] WordPress connection tested successfully
- [ ] First project created

🎉 **You're ready to start building with AI!**
