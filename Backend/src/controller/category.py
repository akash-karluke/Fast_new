from sqlalchemy.orm import Session
from src.model import category
from sqlalchemy import text

class categoryFunctions:
    def get_all_category(session: Session, skip: int = 0, limit: int = 100):
        return session.query(category).order_by(category.ProductCategory).offset(skip).limit(limit).all()

    # Function to fetch category by ID
    def get_category_by_id(session: Session, category_id):
        return session.query(category).filter(category.CategoryID == category_id).first()
    
    def get_category_by_country(session: Session, salesRepId, countryId):
        query = """select distinct
                    dim_country.CountryID,
                    dim_country.CountryName,
                    dim_category.GlobalDivision,
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

                    where dim_sales_rep.SalesRepID = {}
                    and dim_country.CountryID = {}""".format(salesRepId, countryId) 

        return session.query(category).from_statement(text(query)).all()

    def get_category_by_global_division(session: Session, salesRepId, globalDivision, countryId):
        print('salesRep -{} globalDivision-{} '.format(salesRepId, globalDivision))

        query = """select distinct dim_category.CategoryID,
                    dim_category.ProductCategory,
                    dim_category.GlobalDivision
                    from
                    dbo.DIM_Sales_Representative base_tbl

                    inner join dbo.DIM_Bridge_Store_StoreRep bridge
                    on base_tbl.SalesRepID = bridge.SalesRepID
                    
                    inner join dbo.Dim_Category dim_category
                    on dim_category.CategoryID = bridge.CategoryID
                    
                    where base_tbl.SalesRepID ={}
                    and dim_category.GlobalDivision = '{}'
                    order by dim_category.ProductCategory
                    """.format(salesRepId, globalDivision) 

        return session.query(category).from_statement(text(query)).all()
