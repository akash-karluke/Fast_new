from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from ..controller.retailer import retailerFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Retailer"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get retailer details by location
    @router.get('/get-retailers-by-user')
    async def get_all_retailers(self):
        try:
            retailers_data = retailerFunctions.get_all_retailers(self.session)
            response = {
                "data": retailers_data,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

        
        # API to get retailer details by countries
    @router.get('/getRetailers_by_Countries')
    async def get_retailers_list_byCountries(self):
        try:
            retailers_data = retailerFunctions.get_retailer_list_by_country(self.session)
            response = {
                "data": retailers_data,
                "code" : 201,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
