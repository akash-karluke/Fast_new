from logging.config import valid_ident
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.filters import filterFunctions
from src.controller.category import categoryFunctions
from src.controller.region import regionFunctions
from src.controller.country import countryFunctions
from src.controller.store import storeFunctions
from src.controller.retailer import retailerFunctions
from src.endpoints.country import Default

from db.database import get_db
from src.schema import Store

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["Filters"],
    responses={404: {"description": "Not found"}},
)

class store():
    salesRepId: str
    RetailerID: str
@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get Filter data
    @router.get('/{salesRepId}')
    async def get_filter_data(self, salesRepId):
        try:
            # Get Region by Sales Rep

            region_data =  regionFunctions.get_region_by_salesRep(self.session, salesRepId)
            data = {}
            data["Regions"] = region_data
            print(len(region_data));

            if not len(region_data):
                response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" : data
                }
                return response
            firstRegion = region_data[0]
            regionID = firstRegion.RegionID

            # Country
            country_data = countryFunctions.get_country_list_by_region(self.session,salesRepId, regionID)
            # Empty response
            
            data["Region"] = {
                    "RegionID": regionID,
                    "RegionName": firstRegion.RegionName,
                    "Country": country_data
                }
            if not len(country_data):
                response = {
                    "status": 'success',
                    "code" : status.HTTP_200_OK,
                    "data" : data
                }
                return response

            firstCountry = country_data[0]
            countryID = firstCountry.CountryID

            # print(country_data)
            # Category
            category_data = categoryFunctions.get_category_by_country(self.session, salesRepId, countryID)
            # Empty response
            globalDivisionData = list(set([category.GlobalDivision for category in category_data]))


            data["GlobalDivision"] = globalDivisionData
            data["Country"] = {
                "CountryID": countryID,
                "CountryName": firstCountry.CountryName,
                "Category": category_data
                }
            if not len(category_data):
                response = {
                    "status": 'success',
                    "code" : status.HTTP_200_OK,
                    "data" : data
                }
                return response

            firstCategory = category_data[0]
            categoryID = firstCategory.CategoryID
            # print(category_data)

            # Retailer
            retailer_data = retailerFunctions.get_retailers_by_category(self.session, salesRepId, categoryID)
            
            data["Category"] = {
                "CategoryID": categoryID,
                "CategoryName": firstCategory.ProductCategory,
                "GlobalDivision": firstCategory.GlobalDivision,
                "Retailer": retailer_data,
            }
            if not len(retailer_data):
                response = {
                    "status": 'success',
                    "code" : status.HTTP_200_OK,
                    "data" : data
                }
                return response

            firstRetailer = retailer_data[0]
            RetailerID = firstRetailer.RetailerID

            # print(retailer_data)
            # Store
            store_data = storeFunctions.get_stores_by_retailer(self.session, salesRepId, RetailerID)
            data["Retailer"] = {
                "RetailerID": RetailerID,
                "RetailerName": firstRetailer.RetailerName,
                "Store": store_data
            }
            # firstStore = store_data[0]
            # storeID = firstStore.StoreID

            # print(store_data)
            response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" :data
            }
            return response
        except Exception as e:
            print('Exception Occured',e)
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }
    

    @router.post('/get-stores')
    async def get_filter_data_stores(self, salesRepId : int, RetailerID: int):
        try:
            salesRepId = salesRepId
            RetailerID = RetailerID
            # Store
            data = {}
            store_data = storeFunctions.get_stores_by_retailer(self.session, salesRepId, RetailerID)
            
            data["Retailer"] = {
                "RetailerID": RetailerID,
                "Store": store_data
            }
            # print(store_data)

            response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" : data
            }

            return response
        except Exception as e:
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }
    
    @router.post('/get-retailers')
    async def get_filter_data_retailers(self, salesRepId, categoryId):
        try:
            salesRepId = salesRepId
            categoryID = categoryId

            data = {}
            # Retailer
            retailer_data = retailerFunctions.get_retailers_by_category(self.session, salesRepId, categoryID)
            
            data["Category"] = {
                "CategoryID": categoryID,
                "Retailer": retailer_data
                }
            if not len(retailer_data):
                response  = {
                    "status" : "success",
                    "code": status.HTTP_200_OK,
                    "data": data
                }
                return response

            firstRetailer = retailer_data[0]
            RetailerID = firstRetailer.RetailerID

            # Store
            store_data = storeFunctions.get_stores_by_retailer(self.session, salesRepId, RetailerID)
            
            data["Retailer"] = {
                "RetailerID": RetailerID,
                "RetailerName": firstRetailer.RetailerName,
                "Store": store_data
            }
            # print(store_data)

            response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" :data
            }

            return response
        except Exception as e:
            print('Exception Occured',e)
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.post('/get-categories')
    async def get_filter_data_categories(self, salesRepId: int, countryId: int):
        try:
            salesRepId = salesRepId
            countryID = countryId

            data = {}
            # Category
            category_data = categoryFunctions.get_category_by_country(self.session, salesRepId, countryID)
            
            data["Country"] = {
                "CountryID": countryID,
                "Category": category_data
            }
            if not len(category_data):
                response = {
                    "status":"success",
                    "code": status.HTTP_200_OK,
                    "data": data
                }
    
            print(data)
            firstCategory = category_data[0]
            categoryID = firstCategory.CategoryID

            globalDivisionData = list(set([category.GlobalDivision for category in category_data]))

            # Retailer
            retailer_data = retailerFunctions.get_retailers_by_category(self.session, salesRepId, categoryID)
            
            data["GlobalDivision"] = globalDivisionData
            data["Category"] = {
                "CategoryID": categoryID,
                "CategoryName": firstCategory.ProductCategory,
                "GlobalDivision": firstCategory.GlobalDivision,
                "Retailer": retailer_data
            }
            print(data)
            if not len(retailer_data):
                response = {
                    "status": "success",
                    "code": status.HTTP_200_OK,
                    "data" : data
                }
            firstRetailer = retailer_data[0]
            RetailerID = firstRetailer.RetailerID

            print(data)
            # Store
            store_data = storeFunctions.get_stores_by_retailer(self.session, salesRepId, RetailerID)
            data["Retailer"] = {
                "RetailerID": RetailerID,
                "RetailerName": firstRetailer.RetailerName,
                "Store": store_data
            }
            
            # print(store_data)

            response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" : data
            }

            return response
        except Exception as e:
            print('Exception Occured',e)
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    @router.post('/get-categories-by-global-division')
    async def get_filter_data_categories_by_global_division(self, salesRepId: int, globalDivision: str, countryId: int):
        try:

            salesRepId = salesRepId
            globalDivision = globalDivision
            countryId = countryId
            # Category

            data = {}
            category_data = categoryFunctions.get_category_by_global_division(self.session, salesRepId, globalDivision, countryId)
            
            # Empty response
            data["Country"]  = {
                "CountryID": countryId,
                "GlobalDivision": globalDivision,
                "Category": category_data
            }
            if not len(category_data):
                response = {
                    "status": "success",
                    "code": status.HTTP_200_OK,
                    "data": data
                }
                return response
            
            firstCategory = category_data[0]
            categoryID = firstCategory.CategoryID

            # Retailer
            retailer_data = retailerFunctions.get_retailers_by_category(self.session, salesRepId, categoryID)
            data["Category"] = {
                "CategoryID": categoryID,
                "CategoryName": firstCategory.ProductCategory,
                "GlobalDivision": firstCategory.GlobalDivision,
                "Retailer": retailer_data
            }

            if not len(retailer_data):
                # framedResponse = Default.frameEmptyResponse(data, retailer_data, "Category", "Retailer")
                response = {
                    "status": 'success',
                    "code" : status.HTTP_200_OK,
                    "data" : data
                }
                return response
            firstRetailer = retailer_data[0]
            RetailerID = firstRetailer.RetailerID

            # Store
            store_data = storeFunctions.get_stores_by_retailer(self.session, salesRepId, RetailerID)
            data["Retailer"] =  {
                "RetailerID": RetailerID,
                "RetailerName": firstRetailer.RetailerName,
                "Store": store_data
            }

            response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" : data
            }
            return response
        except Exception as e:
            print('Exception Occured',e)
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }
    
    
    @router.post('/get-countries')
    async def get_filter_data_countries(self,salesRepId: int, regionId: int):
        try:
            salesRepId = salesRepId
            regionID = regionId
            data = {}
            country_data = countryFunctions.get_country_list_by_region(self.session,salesRepId, regionID)
            
            data["Region"] ={
                "RegionID": regionID,
                "Country": country_data
            }
            if not len(country_data):
                response = {
                    "status": "success",
                    "code": status.HTTP_200_OK,
                    "data": data
                }
                return response

            firstCountry = country_data[0]
            countryID = firstCountry.CountryID
            # print(country_data)
            # Category
            category_data = categoryFunctions.get_category_by_country(self.session, salesRepId, countryID)
            data["Country"] = {
                "CountryID": countryID,
                "CountryName": firstCountry.CountryName,
                "Category": category_data
            }
            if not len(category_data):
                response = {
                    "status": "success",
                    "code": status.HTTP_200_OK,
                    "data": data
                }
                return response
            
            firstCategory = category_data[0]
            categoryID = firstCategory.CategoryID
            globalDivisionData = list(set([category.GlobalDivision for category in category_data]))

            
            # print(category_data)

            # Retailer
            retailer_data = retailerFunctions.get_retailers_by_category(self.session, salesRepId, categoryID)
            
            data["GlobalDivision"] = globalDivisionData,
                   
            data["Category"] =  {
                "CategoryID": categoryID,
                "CategoryName": firstCategory.ProductCategory,
                "GlobalDivision": firstCategory.GlobalDivision,
                "Retailer": retailer_data,
            }

            if not len(retailer_data):
                reponse = {
                    "status": "success",
                    "code": status.HTTP_200_OK,
                    "data": data
                }
                return response
            firstRetailer = retailer_data[0]
            RetailerID = firstRetailer.RetailerID

            # print(retailer_data)

            # Store
            store_data = storeFunctions.get_stores_by_retailer(self.session, salesRepId, RetailerID)
            
            data["Retailer"] = {
                "RetailerID": RetailerID,
                "RetailerName": firstRetailer.RetailerName,
                "Store": store_data
            }

            # print(store_data)
            response = {
                "status": 'success',
                "code" : status.HTTP_200_OK,
                "data" : data
            }

            return response

        except Exception as e:
            print('Exception Occured',e)
            return {
                "status": "error",
                "code":status.HTTP_400_BAD_REQUEST,
                "message": str(e)
            }

    def frameEmptyResponse(data , responseData, parentKey, childKey):
        print(parentKey. parentKey.iems(), childKey, childKey.items())
        return {data[parentKey][childKey] : responseData}

