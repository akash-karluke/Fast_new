from sqlalchemy import create_engine,MetaData
from sqlalchemy.engine.url import URL
from sqlalchemy.engine import result

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import textwrap
import urllib
from dotenv import load_dotenv
import pyodbc
load_dotenv()

# Importing DB configurations from server

driver= os.getenv('DRIVER')
database = os.getenv('DATABASE')
server = os.getenv('SERVER')
username = os.getenv('SQLUSERNAME')
password = os.getenv('PASSWORD')
authentication= os.getenv('AUTHENTICATION')
dialect = os.getenv('DIALECT')
isDeployed = os.getenv('DEPLOYED')

# Construct Database URL

if isDeployed is None:
    DATABASE_URL = f'{dialect}://{username}:{password}@{server}/{database}'
else:
    DATABASE_URL = f'{dialect}://{username}:@{server}/{database}?driver={driver}&authentication={authentication}'

# Creating Connections
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initiating Connection
def get_db():
    try:
        db = SessionLocal()
        print('opening Connection')
        yield db
    finally:
        print('Closing Connection')
        db.close()
        
Base = declarative_base()