from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.table import tableFunctions
from db.database import get_db
import math

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["tableAPI"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    @router.get('/gettabledetails')
    async def get_all_table_data(self, salesRepId: int, retailerId: int, page_num: int = 1, page_size: int = 10):
        try:
            start = (page_num - 1) * page_size
            end = start + page_size
            table_data = tableFunctions.get_table_data(self.session, salesRepId, retailerId)
            data_length = len(table_data)

            response = {
                "code" : 200,
                "status": 'success',
                "data": table_data[start:end],
                "total_record": data_length,
                "current_page": page_num,
                "total_record_per_page": page_size,
                "total_pages": math.ceil(data_length//page_size),
                "pagination": {}
                
            }

            print(response)

            if  end >= data_length:
                response["pagination"]['next'] = None

                if page_num > 1:
                    response["pagination"]['previous'] = f'api/v1/table/gettabledetails?salesRepId={salesRepId}&retailerId={retailerId}&page_num={page_num - 1}&page_size={page_size}'
                else:
                    response["pagination"]['previous'] = None

            else:
                if page_num > 1:
                    response["pagination"]['previous'] = f'api/v1/table/gettabledetails?salesRepId={salesRepId}&retailerId={retailerId}&page_num={page_num - 1}&page_size={page_size}'
                else:
                    response["pagination"]['previous'] = None
                
                response["pagination"]['next'] = f'api/v1/table/gettabledetails?salesRepId={salesRepId}&retailerId={retailerId}&page_num={page_num + 1}&page_size={page_size}'
            
            return response

        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.get('/get-category-tabular')
    async def get_category_tabular(self, storeId : int, page_num: int = 1, page_size: int = 5):
        try:
            start = (page_num - 1) * page_size
            end = start + page_size
            table_data = tableFunctions.nested_table_category(self.session, storeId)
            data_length = len(table_data)

            response = {
                "code" : 200,
                "status": 'success',
                "data": table_data[start:end],
                "total_record": data_length,
                "current_page": page_num,
                "total_record_per_page": page_size,
                "total_pages": math.ceil(data_length//page_size),
                "pagination": {}
                
            }

            print(response)

            if  end >= data_length:
                response["pagination"]['next'] = None

                if page_num > 1:
                    response["pagination"]['previous'] = f'api/v1/table/get-category-tabular?storeId={storeId}&page_num={page_num - 1}&page_size={page_size}'
                else:
                    response["pagination"]['previous'] = None

            else:
                if page_num > 1:
                    response["pagination"]['previous'] = f'api/v1/table/get-category-tabular?storeId={storeId}&page_num={page_num - 1}&page_size={page_size}'
                else:
                    response["pagination"]['previous'] = None
                
                response["pagination"]['next'] = f'api/v1/table/get-category-tabular?storeId={storeId}&page_num={page_num + 1}&page_size={page_size}'
            
            return response

        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

        
    @router.get('/eddgie_all_star')
    async def all_stars(self, CountryID: int, GlobalDivision: str):
        try:
            Eddgie_all_stars_data = tableFunctions.Eggdie_all_star(self.session, CountryID, GlobalDivision)
            response = {
                "code" : status.HTTP_200_OK,
                "status": 'success',
                "data": Eddgie_all_stars_data
                
            }

            return response

        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }
