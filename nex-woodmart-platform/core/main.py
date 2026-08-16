"""
NEX WoodMart Platform - Core Backend
FastAPI-based backend for AI-powered WordPress management
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import yaml
import httpx
from pathlib import Path

app = FastAPI(
    title="NEX WoodMart Platform API",
    description="Backend for AI-powered WordPress/WoodMart management",
    version="0.1.0"
)

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
class Config:
    WORDPRESS_URL = os.getenv("WORDPRESS_URL", "http://localhost:8080")
    WORDPRESS_API_USER = os.getenv("WORDPRESS_API_USER", "admin")
    WORDPRESS_API_PASSWORD = os.getenv("WORDPRESS_API_PASSWORD", "")
    AI_PROVIDER = os.getenv("AI_PROVIDER", "claude")  # claude, openai, gemini
    AI_API_KEY = os.getenv("AI_API_KEY", "")
    PROJECTS_DIR = Path(__file__).parent.parent / "projects"
    KNOWLEDGE_DIR = Path(__file__).parent.parent / "knowledge"
    CAPABILITIES_DIR = Path(__file__).parent.parent / "capabilities"
    RULES_DIR = Path(__file__).parent.parent / "rules"

config = Config()

# Models
class ProjectRequest(BaseModel):
    name: str
    wordpress_url: str
    description: Optional[str] = None
    design_system: Optional[str] = None
    references: Optional[List[str]] = []

class EditRequest(BaseModel):
    project_id: str
    instruction: str
    context: Optional[Dict[str, Any]] = None

class AnalysisRequest(BaseModel):
    url: str
    analysis_type: str = "full"  # full, layout, colors, typography, components

class ApprovalRequest(BaseModel):
    task_id: str
    approved: bool
    feedback: Optional[str] = None

class TaskResponse(BaseModel):
    task_id: str
    status: str  # pending, planning, executing, waiting_approval, completed, failed
    plan: Optional[Dict[str, Any]] = None
    preview_url: Optional[str] = None
    changes: Optional[List[Dict[str, Any]]] = None

# In-memory task storage (use Redis/DB in production)
tasks: Dict[str, Dict[str, Any]] = {}

# Helper functions
def load_yaml_file(path: Path) -> Dict:
    """Load YAML file safely"""
    if not path.exists():
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f) or {}

def get_capabilities() -> Dict:
    """Load all capabilities"""
    caps = {}
    for cap_file in config.CAPABILITIES_DIR.glob("*.yaml"):
        caps[cap_file.stem] = load_yaml_file(cap_file)
    return caps

def get_rules() -> Dict:
    """Load all rules"""
    rules = {}
    for rule_file in config.RULES_DIR.glob("*.yaml"):
        rules[rule_file.stem] = load_yaml_file(rule_file)
    return rules

def get_knowledge(topic: str) -> Dict:
    """Load knowledge for a specific topic"""
    knowledge_path = config.KNOWLEDGE_DIR / topic
    if not knowledge_path.exists():
        return {}
    
    knowledge = {}
    for file in knowledge_path.glob("*.md"):
        with open(file, 'r', encoding='utf-8') as f:
            knowledge[file.stem] = f.read()
    return knowledge

async def call_ai_provider(prompt: str, context: Optional[Dict] = None) -> str:
    """Call AI provider based on configuration"""
    # This is a placeholder - implement actual AI provider calls
    # For now, return mock response
    return f"AI Response for: {prompt[:100]}..."

async def wordpress_api_request(endpoint: str, method: str = "GET", data: Optional[Dict] = None):
    """Make authenticated request to WordPress REST API"""
    url = f"{config.WORDPRESS_URL}/wp-json/{endpoint}"
    
    async with httpx.AsyncClient() as client:
        try:
            if method == "GET":
                response = await client.get(url, auth=(config.WORDPRESS_API_USER, config.WORDPRESS_API_PASSWORD))
            elif method == "POST":
                response = await client.post(url, json=data, auth=(config.WORDPRESS_API_USER, config.WORDPRESS_API_PASSWORD))
            elif method == "PUT":
                response = await client.put(url, json=data, auth=(config.WORDPRESS_API_USER, config.WORDPRESS_API_PASSWORD))
            elif method == "DELETE":
                response = await client.delete(url, auth=(config.WORDPRESS_API_USER, config.WORDPRESS_API_PASSWORD))
            
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=e.response.status_code if hasattr(e, 'response') else 500, 
                              detail=f"WordPress API error: {str(e)}")

# Routes
@app.get("/")
async def root():
    return {
        "service": "NEX WoodMart Platform API",
        "version": "0.1.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/capabilities")
async def list_capabilities():
    """List all available WoodMart capabilities"""
    return get_capabilities()

@app.get("/rules")
async def list_rules():
    """List all active rules"""
    return get_rules()

@app.get("/knowledge/{topic}")
async def get_knowledge_topic(topic: str):
    """Get knowledge for a specific topic"""
    return get_knowledge(topic)

@app.post("/projects")
async def create_project(request: ProjectRequest):
    """Create a new project"""
    project_id = request.name.lower().replace(" ", "-")
    project_dir = config.PROJECTS_DIR / project_id
    
    if project_dir.exists():
        raise HTTPException(status_code=400, detail="Project already exists")
    
    project_dir.mkdir(parents=True, exist_ok=True)
    
    # Create project metadata
    project_data = {
        "id": project_id,
        "name": request.name,
        "wordpress_url": request.wordpress_url,
        "description": request.description,
        "design_system": request.design_system,
        "references": request.references,
        "created_at": str(Path(project_dir).stat().st_ctime)
    }
    
    # Save project metadata
    with open(project_dir / "project.yaml", 'w') as f:
        yaml.dump(project_data, f)
    
    return {"project_id": project_id, "status": "created"}

@app.get("/projects")
async def list_projects():
    """List all projects"""
    projects = []
    for project_dir in config.PROJECTS_DIR.iterdir():
        if project_dir.is_dir():
            project_file = project_dir / "project.yaml"
            if project_file.exists():
                with open(project_file, 'r') as f:
                    projects.append(yaml.safe_load(f))
    return {"projects": projects}

@app.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get project details"""
    project_file = config.PROJECTS_DIR / project_id / "project.yaml"
    if not project_file.exists():
        raise HTTPException(status_code=404, detail="Project not found")
    
    with open(project_file, 'r') as f:
        return yaml.safe_load(f)

@app.post("/analyze")
async def analyze_site(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """Analyze a website from URL"""
    task_id = f"analyze_{len(tasks) + 1}"
    
    tasks[task_id] = {
        "type": "analysis",
        "status": "pending",
        "request": request.dict(),
        "result": None
    }
    
    # Start analysis in background
    background_tasks.add_task(run_analysis, task_id, request)
    
    return {"task_id": task_id, "status": "started"}

async def run_analysis(task_id: str, request: AnalysisRequest):
    """Run site analysis"""
    try:
        tasks[task_id]["status"] = "executing"
        
        # TODO: Implement actual site analysis
        # - Fetch HTML/CSS
        - Extract layout patterns
        - Identify colors, typography
        - Detect components
        
        result = {
            "url": request.url,
            "analysis_type": request.analysis_type,
            "findings": {},
            "patterns": [],
            "recommendations": []
        }
        
        tasks[task_id]["result"] = result
        tasks[task_id]["status"] = "completed"
    except Exception as e:
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["error"] = str(e)

@app.post("/edit")
async def edit_site(request: EditRequest, background_tasks: BackgroundTasks):
    """Edit a site based on natural language instruction"""
    task_id = f"edit_{len(tasks) + 1}"
    
    tasks[task_id] = {
        "type": "edit",
        "status": "pending",
        "request": request.dict(),
        "plan": None,
        "preview_url": None,
        "changes": []
    }
    
    # Start editing workflow in background
    background_tasks.add_task(run_edit_workflow, task_id, request)
    
    return {"task_id": task_id, "status": "started"}

async def run_edit_workflow(task_id: str, request: EditRequest):
    """Run the complete edit workflow"""
    try:
        # Step 1: Planning
        tasks[task_id]["status"] = "planning"
        
        # Load context
        capabilities = get_capabilities()
        rules = get_rules()
        knowledge = get_knowledge("woodmart")
        
        # Get current site state
        current_state = await wordpress_api_request("wp/v2/pages?per_page=1")
        
        # Generate plan using AI
        planning_prompt = f"""
        Instruction: {request.instruction}
        
        Current Site State: {current_state}
        
        Available Capabilities: {list(capabilities.keys())}
        
        Rules to Follow: {list(rules.keys())}
        
        Create a step-by-step plan to implement this change using WoodMart native features first.
        """
        
        plan = await call_ai_provider(planning_prompt)
        tasks[task_id]["plan"] = {"steps": plan}
        
        # Step 2: Execute changes
        tasks[task_id]["status"] = "executing"
        
        # TODO: Execute planned changes via WordPress API
        
        # Step 3: Take screenshot for preview
        # TODO: Implement screenshot functionality
        tasks[task_id]["preview_url"] = "/preview/sample.jpg"
        
        # Step 4: Wait for approval
        tasks[task_id]["status"] = "waiting_approval"
        
    except Exception as e:
        tasks[task_id]["status"] = "failed"
        tasks[task_id]["error"] = str(e)

@app.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get task status and results"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return tasks[task_id]

@app.post("/tasks/{task_id}/approve")
async def approve_task(request: ApprovalRequest):
    """Approve or reject a task"""
    if request.task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[request.task_id]
    
    if request.approved:
        # Execute the approved changes
        # TODO: Implement execution
        task["status"] = "completed"
        return {"status": "approved_and_executed"}
    else:
        task["status"] = "rejected"
        task["feedback"] = request.feedback
        return {"status": "rejected"}

@app.get("/wordpress/status")
async def check_wordpress_status():
    """Check WordPress connection status"""
    try:
        site_info = await wordpress_api_request("")
        return {
            "connected": True,
            "site_url": config.WORDPRESS_URL,
            "site_info": site_info
        }
    except Exception as e:
        return {
            "connected": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
