from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.region import regionFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Region"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get all region details
    @router.get('/getAllRegion')
    async def get_all_region(self):
        try:
            print('x')
            region_data = regionFunctions.get_regions(self.session)
            print('y')
            response = {
                "data": region_data,
                "code" : 201,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))