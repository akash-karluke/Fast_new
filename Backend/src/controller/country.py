from sqlalchemy.orm import Session
from sqlalchemy import text
from src.model import country


class countryFunctions:
    def get_all_country(session: Session, skip: int = 0, limit: int = 100):
        # return session.query(country).order_by(country.CountryName).offset(skip).limit(limit).all()
        return session.query(country).from_statement(text('''SELECT CountryID, CountryName FROM [dbo].[Dim_Country]''')).all()

    # Function to fetch country by ID
    def get_country_by_id(session: Session, country_id):
        # return session.query(country).filter(country.CountryID == country_id).first()
        return session.query(country).from_statement(text('''SELECT CountryID, CountryName FROM [dbo].[Dim_Country] WHERE CountryID = {}'''.format(country_id))).all()

    # Function to fetch countries as per region 
    def get_country_list_by_region(session: Session, salesRepId, regionId):
        # return session.query(country).filter(country.CountryID == cluster.ClusterID).filter(cluster.ClusterID == region.RegionID).first()
        query = """select distinct
                    dim_sales_rep.SalesRepID,
                    dim_sales_rep.SalesRepFirstName,
                    dim_country.CountryID,
                    dim_country.CountryName
                    from [dbo].[Dim_Sales_Representative] dim_sales_rep

                    INNER JOIN [dbo].[DIM_Bridge_Store_StoreRep] bridge_storerep
                    on bridge_storerep.SalesRepID=dim_sales_rep.SalesRepID

                    INNER JOIN [dbo].[Dim_Store] dim_store
                    on dim_store.StoreID = bridge_storerep.StoreID

                    INNER JOIN [dbo].[Dim_Location] dim_location
                    on dim_location.LocationID = dim_store.LocationID

                    INNER JOIN [dbo].[Dim_Country] dim_country
                    on dim_country.CountryID = dim_location.CountryID
                    
					INNER JOIN [dbo].[Dim_Region] dim_region
                    on dim_region.CountryID = dim_country.CountryID
                    
					where dim_sales_rep.SalesRepID = {} and
                    dim_region.RegionID = {}""".format(salesRepId,regionId)
        
        return session.query(country).from_statement(text(query)).all()