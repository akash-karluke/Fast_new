from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from ..controller.salesRep import salesRepFunctions
from src.controller.ex_summary import SummaryFunctions
from src.controller.table import tableFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Sales Representative"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get salesRep details
    @router.get('/getSalesRepByEmail/{email_id}')
    async def get_all_salesReps(self, email_id : str = 'adnan.fayaz@tredence.com'):
        try:
            salesRep_data = salesRepFunctions.get_salesRep_by_email(self.session, email_id)
            response = {
                "data": salesRep_data,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    @router.get('/get-kpi/{salesRepId}')
    async def get_kpi_metrics(self, salesRepId: int = 1):
        try:
            kpi_metrics = salesRepFunctions.get_kpi_metrics(self.session, salesRepId)
            print(kpi_metrics)
            # kpi_metrics = {
            #     "numberOfRegions": 25,
            #     "numberOfRetailers": 69,
            #     "numberOfBestPerformingStores": 450,
            #     "numberOfStoresWithLargestGrowthPotential": 119,
            #     "netSalesIncrement": {
            #         "amount": 50000,
            #         "currency": "USD"
            #     },
            #     "lastFiveVistsIncrement": {
            #         "amount": -75000, 
            #         "currency": "USD"
            #     },
            #     "numberOfTargetSKUs": 10,
            #     "totalValueGain": {
            #         "amount": 56987,
            #         "currency": "USD"
            #     }
            # }
            response = {
                "data": kpi_metrics,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.get('/get-summary')
    async def executive_summary(self, salesRepId: int, countryId: int):
        try:
            data = {}
            summary_data1 = SummaryFunctions.get_current_osa(self.session, salesRepId, countryId)
            data["Current_OSA"] = summary_data1

            summary_data2 = SummaryFunctions.get_target_osa(self.session, salesRepId, countryId)
            data["Target_OSA"] = summary_data2

            summary_data3 = SummaryFunctions.get_delta_osa(self.session, salesRepId, countryId)
            data["Delta_OSA"] = summary_data3
            
            response = {
                "code" : status.HTTP_200_OK,
                "status": 'success',
                "data": data
            }
            return response
        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.post('/search-by-store')
    async def get_executive_summary(self, store_id: int, locationId: int, firstName : str,  lastName: str = None):
        try:
            salesRepList = salesRepFunctions.search_salesrep_by_store(self.session, store_id, locationId, firstName, lastName)
            response = {
                "code": status.HTTP_200_OK,
                "status" : 'success',
                "data" : salesRepList
            }
            return response
        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }



    @router.get('/top_retailer')
    async def get_retailer(self, SalesRepID: int, GlobalDivision: str, CountryID: int):
        try:
            ratailer_data = tableFunctions.get_top_10_retailer(self.session, SalesRepID, GlobalDivision, CountryID)
            response = {
                "code": status.HTTP_200_OK,
                "status" : 'success',
                "data" : ratailer_data
            }
            return response
        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }