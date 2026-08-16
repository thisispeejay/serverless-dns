# NEX WoodMart Platform - MVP Implementation Plan

## 🎯 MVP Goal

Build a **minimal but functional** web platform that allows you to:
1. Connect to a WordPress site with WoodMart
2. View current site configuration
3. Make simple edits via natural language
4. Approve changes before deployment

**Success Metric:** Can change header logo position from left to center with one chat command.

---

## Phase 1: Foundation (Week 1)

### Day 1-2: WordPress Plugin Setup

**Tasks:**
- [ ] Install NEX Bridge plugin on test WordPress
- [ ] Verify API key generation
- [ ] Test REST API endpoints manually with curl/Postman
- [ ] Document working endpoints

**Test Commands:**
```bash
# Test site info
curl -H "X-NEX-API-Key: YOUR_KEY" http://yoursite.local/wp-json/nex/v1/site-info

# Test WoodMart settings
curl -H "X-NEX-API-Key: YOUR_KEY" http://yoursite.local/wp-json/nex/v1/woodmart/settings

# Test headers list
curl -H "X-NEX-API-Key: YOUR_KEY" http://yoursite.local/wp-json/nex/v1/headers
```

**Deliverable:** Working WordPress plugin with verified API endpoints

---

### Day 3-4: Backend Core

**Tasks:**
- [ ] Set up FastAPI project structure
- [ ] Implement WordPress API client
- [ ] Create project management endpoints
- [ ] Add environment configuration

**Files to Create:**
```
core/
├── main.py              # Already exists
├── config.py            # Configuration management
├── wordpress_client.py  # WordPress API wrapper
├── models.py            # Pydantic models
└── .env                 # Environment variables
```

**Key Endpoints:**
- `POST /projects` - Create new project
- `GET /projects` - List projects
- `GET /projects/{id}` - Get project details
- `GET /wordpress/status` - Check connection

**Deliverable:** Backend API running locally, can connect to WordPress

---

### Day 5-7: Frontend Shell

**Tasks:**
- [ ] Initialize Next.js project
- [ ] Create basic layout (sidebar, header, content area)
- [ ] Build project list page
- [ ] Build project detail page
- [ ] Add WordPress connection settings page

**Pages:**
```
web-platform/
├── app/
│   ├── page.tsx                    # Dashboard
│   ├── projects/
│   │   ├── page.tsx                # Project list
│   │   └── [id]/
│   │       └── page.tsx            # Project detail
│   └── settings/
│       └── page.tsx                # WordPress connection
```

**Deliverable:** Basic UI to view projects and settings

---

## Phase 2: Core Features (Week 2)

### Day 8-9: Chat Interface

**Tasks:**
- [ ] Build chat component
- [ ] Add message history display
- [ ] Implement text input with send button
- [ ] Add loading states

**Features:**
- Real-time message display
- User messages vs AI responses
- Typing indicators
- Error handling

**Deliverable:** Working chat interface

---

### Day 10-12: Edit Workflow

**Tasks:**
- [ ] Implement edit request handler in backend
- [ ] Create planning logic (simplified for MVP)
- [ ] Add approval mechanism
- [ ] Execute approved changes

**Workflow:**
```
User Input → Parse Intent → Generate Plan → Show Preview → Wait Approval → Execute
```

**Backend Flow:**
```python
1. Receive edit instruction
2. Fetch current state from WordPress
3. Generate simple plan (hardcoded for MVP)
4. Return plan to frontend
5. On approval, call WordPress API to update
6. Return result
```

**Deliverable:** Can execute simple header changes

---

### Day 13-14: Testing & Polish

**Tasks:**
- [ ] Test complete workflow end-to-end
- [ ] Fix bugs
- [ ] Add error messages
- [ ] Improve UI feedback
- [ ] Write basic documentation

**Test Scenarios:**
1. Change logo position
2. Modify header layout
3. Update color scheme
4. Invalid command handling

**Deliverable:** Stable MVP ready for demonstration

---

## MVP Feature Scope

### ✅ Included in MVP

| Feature | Description |
|---------|-------------|
| WordPress Connection | Connect to single WordPress site |
| Project Management | Create/view projects |
| Chat Interface | Natural language input |
| Header Editing | Modify header builder settings |
| Approval Flow | Review before changes applied |
| Basic Logging | Console logs for debugging |

### ❌ NOT in MVP (Future Phases)

| Feature | Reason for Exclusion |
|---------|---------------------|
| Multi-site support | Adds complexity |
| Site analysis from URL | Requires scraping infrastructure |
| Design System upload | Not critical for first test |
| Screenshot/preview | Complex, can use WordPress preview |
| AI integration | Use hardcoded rules for MVP |
| Elementor editing | Focus on WoodMart native first |
| WooCommerce changes | Out of scope for initial test |
| Mobile responsiveness check | Manual for now |
| Backup/restore | WordPress plugin has basic backup |

---

## Technical Specifications

### Backend Stack
```yaml
Framework: FastAPI
Python: 3.10+
Database: None (file-based for MVP)
WordPress Client: httpx (async)
AI Provider: None (hardcoded rules for MVP)
```

### Frontend Stack
```yaml
Framework: Next.js 14 (App Router)
React: 18+
Styling: Tailwind CSS
State: React hooks (no Redux for MVP)
HTTP Client: fetch API
```

### WordPress Requirements
```yaml
WordPress: 6.0+
WoodMart: 7.x
PHP: 8.0+
Plugins: NEX Bridge (custom)
```

---

## Environment Setup

### Backend (.env)
```bash
WORDPRESS_URL=http://yoursite.local
WORDPRESS_API_USER=admin
WORDPRESS_API_PASSWORD=your-app-password
NEX_API_KEY=from-wordpress-admin
AI_PROVIDER=none  # MVP uses hardcoded rules
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Endpoints for MVP

### Projects
```
POST   /projects           - Create project
GET    /projects           - List projects
GET    /projects/{id}      - Get project
DELETE /projects/{id}      - Delete project
```

### Edit Workflow
```
POST   /edit               - Start edit request
GET    /tasks/{id}         - Get task status
POST   /tasks/{id}/approve - Approve/reject task
```

### WordPress Info
```
GET    /wordpress/status   - Connection status
GET    /wordpress/site     - Site information
GET    /headers            - List headers
GET    /headers/{id}       - Get header details
```

---

## Success Criteria

MVP is successful when:

1. ✅ Can connect to WordPress site
2. ✅ Can create a project
3. ✅ Can type "move logo to center" in chat
4. ✅ System shows a plan: "Change logo alignment from left to center"
5. ✅ User clicks "Approve"
6. ✅ Change is applied to WordPress
7. ✅ User can verify in WordPress admin

**Time to complete:** 2 weeks

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| WordPress API issues | Test endpoints manually first |
| WoodMart settings complexity | Start with single setting (logo) |
| CORS problems | Proper CORS middleware in FastAPI |
| Authentication failures | Clear error messages, logging |
| Scope creep | Strict adherence to MVP features |

---

## Next Steps After MVP

Once MVP is working:

1. **Add AI Integration** - Replace hardcoded rules with LLM
2. **Expand Capabilities** - More WoodMart settings
3. **Elementor Support** - Template generation
4. **Site Analysis** - URL-based analysis
5. **Design Systems** - Token management
6. **Visual Previews** - Screenshot generation
7. **Multi-site** - Project switching

---

## Development Commands

### Backend
```bash
cd core
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd web-platform
npm run dev
```

### Testing
```bash
# Test WordPress connection
curl http://localhost:8000/wordpress/status

# Create project
curl -X POST http://localhost:8000/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","wordpress_url":"http://yoursite.local"}'
```

---

## Questions?

Review these files for more details:
- `README.md` - Project overview
- `QUICKSTART.md` - Setup instructions
- `../capabilities/woodmart.yaml` - Available capabilities
- `../rules/global-rules.yaml` - Rules to enforce

Let's build! 🚀
