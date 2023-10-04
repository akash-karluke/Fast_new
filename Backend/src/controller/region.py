from sqlalchemy.orm import Session
from src.model import region, bridge_store_storeRep, location, store
from sqlalchemy import text


class regionFunctions:
    def get_regions(session: Session):
        return session.query(region).order_by(region.RegionID).offset(0).limit(100).all()
        # return session.fetch_all('SELECT * FROM {}'.format(region.__tablename__))

    def get_region_by_salesRep(session: Session, salesRepId):
        query = """
            select distinct base_tbl.SalesRepID, 
            dim_region.RegionName, 
            dim_region.RegionID
            from dbo.DIM_Sales_Representative base_tbl
            inner join dbo.DIM_Bridge_Store_StoreRep bridge
            on bridge.SalesRepID = base_tbl.SalesRepID
            inner join dbo.DIM_Store dim_store
            on dim_store.StoreID = bridge.StoreID
            inner join dbo.Dim_Location dim_location
            on dim_location.LocationID = dim_store.LocationID
            inner join dbo.Dim_Country dim_country
            on dim_country.CountryID = dim_location.CountryID
            inner join dbo.Dim_Region dim_region
            on dim_region.CountryID = dim_country.CountryID
            where base_tbl.SalesRepID = {}
                """.format(salesRepId)
        
        return session.query(region).from_statement(text(query)).all()
