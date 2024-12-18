# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from api import router
from background_tasks import start_background_tasks

app = FastAPI()

# Add this CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)

# Start background tasks
start_background_tasks()

@app.get("/")
def root():
    return {"message": "Real-Time Stock Price Alert System is running!"}
