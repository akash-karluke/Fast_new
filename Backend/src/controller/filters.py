from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from src.model import salesRep
from .store import storeFunctions
from .region import regionFunctions


class filterFunctions:
    # def getGlobalFilters(session: Session, retailer_id: int):
    def getGlobalFilters(session: Session):
        query  = '''select distinct  
                dim_sales_rep.SalesRepFirstName,
                dim_country.CountryName,
                dim_category.GlobalDivision,
                dim_category.ProductCategory 
                from [dbo].[Dim_Sales_Representative] dim_sales_rep

                INNER JOIN [dbo].[Dim_Bridge_Store_StoreRep] bridge_storerep
                on bridge_storerep.SalesRepID=dim_sales_rep.SalesRepID

                INNER JOIN [dbo].[Dim_Category] dim_category
                on dim_category.CategoryID = bridge_storerep.CategoryID

                INNER JOIN [dbo].[Dim_Store] dim_store
                on dim_store.StoreID = bridge_storerep.StoreID

                INNER JOIN [dbo].[Dim_Location] dim_location
                on dim_location.LocationID = dim_store.LocationID

                INNER JOIN [dbo].[Dim_Country] dim_country
                on dim_country.CountryID = dim_location.CountryID

                --INNER JOIN [dbo].[Dim_Region] dim_region
                --on dim_region.CountryID = dim_country.CountryID'''
        
        return session.query(salesRep).from_statement(text(query)).all()


        
### Sample response for global filters.
    
# {

#   "businessGroups": [
#     {

#       "personal care": [

#         { "categoryID": 1, "categoryName": "deodrants" },

#         { "categoryID": 2, "categoryName": "cream" }

#       ]
#     },

#     {

#       "neutrition": [

#         { "categoryID": 3, "categoryName": "chawanprash" },

#         { "categoryID": 4, "categoryName": "horlicks" }

#       ]

#     }

#   ],

#   "region": [

#     {

#       "regionId": "r1",

#       "regionName": "lat-am",

#       "regionData": [

#         {

#           "countryId": "c1",

#           "countryName": "brazil",

#           "countryData": [

#             {

#               "retialerId": "ret1",

#               "retailerName": "wallmart",

#               "retailerData": [

#                 {

#                   "storeId": "s1",

#                   "storeName": "store1"

#                 }

#               ]

#             }

#           ]

#         }
