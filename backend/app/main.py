from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import leetcode, gfg

app = FastAPI(title="Coding Progress Dashboard API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(leetcode.router, prefix="/api")
app.include_router(gfg.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Coding Progress Dashboard API"}
