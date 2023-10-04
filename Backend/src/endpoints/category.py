from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.category import categoryFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Category"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get category details by location
    @router.get('/getAllCategory')
    async def get_all_category(self):
        try:
            category_data = categoryFunctions.get_all_category(self.session)
            print('get cat data',category_data )
            response = {
                "data": category_data,
                "code" : 201,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # API to get get category by ID
    @router.get('/getcategory/{category_id}')
    async def get_category_by_id(self, category_id: int):
        try:
            category_details = categoryFunctions.get_category_by_id(self.session , category_id)
            response = {
                "data" : category_details,
                "status": 'success',
                "code" : 201
            }
            return response
        except Exception as e:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    