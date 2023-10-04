from sqlalchemy.orm import Session
from src.model import retailer
from sqlalchemy import text


class retailerFunctions:
    def get_all_retailers(session: Session, skip: int = 0, limit: int = 100):
        return session.query(retailer).order_by(retailer.RetailerID).offset(skip).limit(limit).all()

    # Function to fetch Retailer by ID
    def get_retailer_by_id(session: Session, retailer_id):
        return session.query(retailer).filter(retailer.RetailerID == retailer_id).first() 

    
    # Function to fetch Retailer list as per countries
    def get_retailer_list_by_country(session: Session):
        query = """SELECT distinct dim_country.CountryID,dim_retailer.RetailerID, dim_retailer.RetailerName
                FROM [dbo].[Dim_Country] dim_country
                INNER JOIN [dbo].[Dim_Location] dim_location on dim_country.CountryID=dim_location.CountryID
                INNER JOIN [dbo].[Dim_Retailer] dim_retailer on dim_location.LocationID=dim_retailer.LocationID"""
        # return session.query(retailer).filter(retailer.RetailerID == retailer_id).first()
        return session.query(retailer).from_statement(text(query)).all()
    
    def get_retailers_by_category(session: Session, salesRepId, categoryId):
        query = """select distinct
                    dim_retailer.RetailerID,
                    dim_retailer.RetailerName,
                    dim_category.CategoryID,
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

                    INNER JOIN [dbo].[Dim_Retailer] dim_retailer
                    on dim_retailer.RetailerID = dim_store.RetailerID

                    where dim_sales_rep.SalesRepID = {}
                    and dim_category.CategoryID = {}""".format(salesRepId, categoryId)

        return session.query(retailer).from_statement(text(query)).all()
