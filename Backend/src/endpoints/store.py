from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.store import storeFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Store"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get store details by location
    @router.get('/getAllStores/{salesRepId}')
    async def get_all_stores(self, salesRepId: int):
        try:
            stores_data = storeFunctions.get_all_stores(self.session, salesRepId)
            response = {
                "data": stores_data,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # API to get get store by ID
    @router.get('/getStore/{store_id}')
    async def get_store_by_id(self, store_id: int):
        try:
            store_details = storeFunctions.get_store_by_id(self.session , store_id)
            response = {
                "data" : store_details,
                "status": 'success',
                "code" : 201
            }
            return response
        except Exception as e:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    

     # API to get get store by name
    @router.get('/getStore/{storename}')
    async def get_store_by_name(self, storename: str):
        try:
            store_details = storeFunctions.get_store_by_name(self.session , storename)
            response = {
                "data" : store_details,
                "status": 'success',
                "code" : 201
            }
            return response
        except Exception as e:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


    # API to get Stores by reatilerID
    @router.get('/getStoreByRetailer/{retailer_id}')
    async def get_stores_by_retailer(self, retailer_id: int):
        try:
            store_details = storeFunctions.get_stores_by_retailer(self.session , retailer_id)
            response = {
                "data" : store_details,
                "status": 'success',
                "code" : 201
            }
            return response
        except Exception as e:
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
