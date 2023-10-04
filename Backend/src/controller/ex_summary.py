from sqlalchemy.orm import Session
from sqlalchemy import text
from src.model import EXECUTIVE_SUMMARY

class SummaryFunctions:

    def get_current_osa(session: Session, salesRepId: int, countryId: int):

        query = '''select distinct GlobalDivision, 
                OSAPercentage as Current_OSA
                from dbo.AGG_Representative main 

                inner join dbo.Dim_Bridge_Store_StoreRep bridge 
                on bridge.SalesRepID = main.SalesRepID 

                inner join dbo.Dim_Store dim_store 
                on dim_store.StoreID = bridge.StoreID 

                inner join dbo.Dim_Location dim_location 
                on dim_location.LocationID = dim_store.LocationID 
                where main.SalesRepID = {} 
                and WeekID = 82022 
                and dim_location.CountryID = {}'''.format(salesRepId, countryId)
        return session.query(EXECUTIVE_SUMMARY).from_statement(text(query)).all()

    def get_target_osa(session: Session, salesRepId: int, countryId: int):
        query = '''select distinct GlobalDivision, 
                0.95 as Target_OSA
                from dbo.AGG_Representative main 

                inner join dbo.Dim_Bridge_Store_StoreRep bridge 
                on bridge.SalesRepID = main.SalesRepID 

                inner join dbo.Dim_Store dim_store 
                on dim_store.StoreID = bridge.StoreID 

                inner join dbo.Dim_Location dim_location 
                on dim_location.LocationID = dim_store.LocationID
                
                where main.SalesRepID = {}
                and WeekID = 82022 
                and dim_location.CountryID = {}'''.format(salesRepId, countryId)
        return session.query(EXECUTIVE_SUMMARY).from_statement(text(query)).all()

    def get_delta_osa(session: Session, salesRepId: int, countryId: int):
        query = '''select distinct GlobalDivision, 
                0.95  - OSAPercentage  as Delta_OSA 

                from dbo.AGG_Representative main 
                inner join dbo.Dim_Bridge_Store_StoreRep bridge 

                on bridge.SalesRepID = main.SalesRepID 
                inner join dbo.Dim_Store dim_store 

                on dim_store.StoreID = bridge.StoreID 
                inner join dbo.Dim_Location dim_location 

                on dim_location.LocationID = dim_store.LocationID 
                where 
                main.SalesRepID = {}
                and WeekID = 82022 
                and dim_location.CountryID = {}'''.format(salesRepId, countryId)
        
        return session.query(EXECUTIVE_SUMMARY).from_statement(text(query)).all()