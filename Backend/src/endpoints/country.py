from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.country import countryFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Country"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get country details by location
    @router.get('/getAllCountry')
    async def get_all_country(self):
        try:
            country_data = countryFunctions.get_all_country(self.session)
            response = {
                "data": country_data,
                "code" : 201,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # API to get get country by ID
    @router.get('/getCountry/{country_id}')
    async def get_country_by_id(self, country_id: int):
        try:
            country_details = countryFunctions.get_country_by_id(self.session , country_id)
            response = {
                "data" : country_details,
                "status": 'success',
                "code" : 201
            }
            return response
        except Exception as e:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))