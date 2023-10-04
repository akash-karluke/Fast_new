from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Optional
from fastapi import Query
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.schema import Product, Category, ProductStatus
from db.database import get_db
from src.controller.product import productFunctions

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Product"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get product list by category
    @router.post('/get-products')
    async def get_all_products(self, storeId : int, categoryId: int):
        try:
            product_list = productFunctions.get_all_products(self.session, storeId, categoryId)
            total = len(product_list)
            totalAvailable = 0
            totalUnavailable = 0
            if len(product_list):
                totalAvailable = sum(map(lambda product: product['status'].lower() == 'available', product_list))
                totalUnavailable = sum(map(lambda product: product['status'].lower() == 'navailable', product_list))
            
            response = {
                "data": {
                    "products": product_list,
                    "total": total,
                    "totalAvailable": totalAvailable,
                    "totalUnavailable": totalUnavailable
                },
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    # API to update product availability
    @router.patch('status-availability/{productId}')
    async def update_product_availability(self, productId : int, product: ProductStatus):
        pass
    

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

    