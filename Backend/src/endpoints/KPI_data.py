from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from ..controller.KPI_data import KPIFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["KPI"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    @router.get('/get_data_for_KPICards/{SalesRepID}')
    async def get_KPI_data(self, SalesRepID: int):
        try:
            KPI_data = KPIFunctions.get_KPI_data(self.session, SalesRepID)
            response = {
                "KPI_data": KPI_data,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

        
@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API for COMPLIANCE TO ALL KPI'S DATA based on selected category 
    @router.post('/get-compliance-to-kpi')
    async def get_compliance_to_kpi(self, salesRepId: int, categoryId : int, locationId: int):
        try:
            # KPI_data = KPIFunctions.get_KPI_data(self.session)

            KPI_data = {
            "selectedCategoryComplianceToKPI's": {
                "coreOsa": {
                "compliancePercentage": 0.9887,
                "prevWeekOSAPercenetage": 90,
                "currentWeekOSAValue": 1232,
                "currency": "$"
                },
                "fullOsa": {
                "compliancePercentage": 0.7876,
                "prevWeekOSAPercenetage": 90,
                "currentWeekOSAValue": 1232,
                "currency": "$"
                }
            }
            }

            response = {
                "data": KPI_data,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


    @router.get('/get_kpi')
    async def get_data_forkpi(self, SalesRepID: int):
        try:
            KPI_data1 = KPIFunctions.get_KPI_data_new(self.session, SalesRepID)
            
            response = {
                "data": KPI_data1,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    
    @router.get('/get_numberOfRetailers_KPI')
    async def numberOfReatilers_data_forkpi(self, SalesRepID: int):
        try:
            retailers_data1 = KPIFunctions.get_retailer_based_on_saleRepId(self.session, SalesRepID)
            response = {
                "data": retailers_data1,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @router.get('/weekly-osa')
    async def get_weekly_osa(self, salesRepId, storeId: int, globalDivision: str, categoryId : int):
        try:
            weekly_osa = KPIFunctions.get_weekly_osa(self.session, salesRepId, storeId, globalDivision, categoryId)
            response = {
                "data": weekly_osa,
                "code" : status.HTTP_200_OK,
                "status": 'success'
            }
            return response

        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.get('/monthly-osa')
    async def get_monthly_osa(self, salesRepId, storeId: int, globalDivision: str, categoryId : int):
        try:
            monthly_osa = KPIFunctions.get_monthly_osa(self.session, salesRepId, storeId, globalDivision, categoryId)
            response = {
                "data": monthly_osa,
                "code" : status.HTTP_200_OK,
                "status": 'success'
            }
            return response
        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }


    @router.get('/get_break_root_cause')
    async def get_break_root_cause(self, countryId: int, categoryId: int,  retailerId: int):
        try:
            break_root_cause = KPIFunctions.get_break_root_cause(self.session, countryId, categoryId,  retailerId)
            response = {
                "data": break_root_cause,
                "code" : status.HTTP_200_OK,
                "status": 'success'
            }
            return response

        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.get('/compliance-to-all-kpi')
    async def get_compliance_to_kpi1(self, CategoryID: int, GlobalDivision: str, WeekID: int, SalesRepID: int):
        try:

            data = KPIFunctions.get_compliance_data(self.session, CategoryID, GlobalDivision, WeekID, SalesRepID)

            response = {
                "data": data,
                "code" : 200,
                "status": 'success'
            }

            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    @router.get('/smiley-data')
    async def get_smiley_KPI_data(self,SalesRepID: int):
        try:

            data = KPIFunctions.get_KPI_smiley1_data(self.session, SalesRepID)
            data1 = KPIFunctions.get_KPI_smiley2_data_last5_visit(self.session, SalesRepID)

            # dict = {"smiley1":data ,"smiley2":data1}
            

            response = {
                # "data": dict,
                "data": data,
                # "data1": data1,
                "code" : 200,
                "status": 'success'
            }

            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    
    # @router.get('/smiley-data2')
    # async def smiley2_KPI_data_(self,SalesRepID: int):
    #     try:

    #         data = KPIFunctions.get_KPI_smiley2_data_last5_visit(self.session, SalesRepID)

    #         response = {
    #             "data": data,
    #             "code" : 200,
    #             "status": 'success'
    #         }

    #         return response
    #     except Exception as e:
    #             raise HTTPException(
    #                 status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))