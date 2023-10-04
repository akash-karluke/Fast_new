from sqlalchemy.orm import Session
from src.model import Root_cause
from sqlalchemy import text

class drawerFunctions:
    
    
    def get_list_of_rootCauses(session: Session):
        query = """SELECT TOP (1000) * FROM [dbo].[Dim_Root_Cause]"""

        return session.query(Root_cause).from_statement(text(query)).all()