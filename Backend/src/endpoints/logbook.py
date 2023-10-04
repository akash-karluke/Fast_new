from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.logbook import logbookFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["logbook"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get category details by location
    @router.get('/logbookdata')
    async def get_data_for_logbook(self):
        try:
            logbookdata = logbookFunctions.get_logbook_data(self.session)
            
            response = {
                "data": logbookdata,
                "code" : 201,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))