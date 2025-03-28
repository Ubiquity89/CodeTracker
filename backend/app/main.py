from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import leetcode, gfg, hackerrank
from api.codechef.codechef import router as codechef_router
from api.codeforces.codeforces import router as codeforces_router

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
app.include_router(leetcode.router, prefix="/api", tags=["leetcode"])
app.include_router(gfg.router, prefix="/api", tags=["gfg"])
app.include_router(hackerrank.router, prefix="/api", tags=["hackerrank"])
app.include_router(codechef_router, prefix="/api", tags=["codechef"])
app.include_router(codeforces_router, prefix="/api", tags=["codeforces"])

@app.get("/")
async def root():
    return {"message": "Coding Progress Dashboard API"}
