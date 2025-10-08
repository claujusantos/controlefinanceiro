from app.main import app

# This is the new modular entry point
# The app is now configured in app/main.py with all modular components

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)