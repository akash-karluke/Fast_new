from imp import reload
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.api import router as api_router
from db.database import SessionLocal, engine
from a2wsgi import ASGIMiddleware

import src.model as model

# model.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
wsgi_app = ASGIMiddleware(app)

# def get_database_session():
#     try:
#         db = SessionLocal()
#         yield db
#     finally:
#         db.close()

print('Running main.py')
if __name__ == '__main__':
    print('Started Runnning : '+__name__)
    uvicorn.run("main:app", host='0.0.0.0', port=8000, log_level="info", reload=True)
    print("running")