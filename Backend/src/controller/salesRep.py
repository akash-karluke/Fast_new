from sqlalchemy.orm import Session
from src.model import salesRep, region, country, retailer, store, category, product
from sqlalchemy import text


class salesRepFunctions:

    # Function to fetch salesRep by emailID
    def get_salesRep_by_email(session: Session, email_id):
        return session.query(salesRep).filter(salesRep.SalesRepEmailID == email_id).first()

    # Function to fetch KPI metrics
    def get_kpi_metrics(session: Session, salesRepId):
        query = """select 
                    cast(Sales_Representative as varchar(100)),
                    count(distinct(cast(Region as varchar(100)))) as region_count,
                    sum(SKU_Count) as sku_count

                    from dbo.AGG_STORE
                    group by cast(Sales_Representative as varchar(100))"""
        return session.query().from_statement(text(query)).all()

    def sales_rep_region_store_retailer(session: Session):
        # query = '''select distinct TOP (5)

        #         dim_sales_rep.SalesRepID,
        #         dim_sales_rep.SalesRepFirstName,

        #         --dim_region.RegionID,
        #         --dim_region.RegionName,

        #         dim_country.CountryID,
        #         dim_country.CountryName,

        #         dim_category.CategoryID,
        #         dim_category.ProductCategory,
        
        #         dim_retailer.RetailerID,
        #         dim_retailer.RetailerName,

        #         dim_store.StoreID,
        #         dim_store.StoreName,

        #         Dim_product.ProductID,
        #         Dim_product.ProductDescription

        #         from [dbo].[Dim_Sales_Representative] dim_sales_rep

        #         INNER JOIN [dbo].[Dim_Bridge_Store_StoreRep] bridge_storerep
        #         on bridge_storerep.SalesRepID=dim_sales_rep.SalesRepID


        #         INNER JOIN [dbo].[Dim_Store] dim_store
        #         on dim_store.StoreID = bridge_storerep.StoreID

        #         INNER JOIN [dbo].[Dim_Location] dim_location
        #         on dim_location.LocationID = dim_store.LocationID

        #         INNER JOIN [dbo].[Dim_Country] dim_country
        #         on dim_country.CountryID = dim_location.CountryID

        #         INNER JOIN [dbo].[Dim_Retailer] dim_retailer
        #         on dim_retailer.RetailerID = dim_store.RetailerID

        #         --INNER JOIN [dbo].[Dim_Region] dim_region
        #         --on dim_region.CountryID = dim_country.CountryID

        #         INNER JOIN [dbo].[Dim_Category] dim_category
        #         on dim_category.CategoryID = bridge_storerep.CategoryID

        #         INNER JOIN [dbo].[Dim_product] dim_product
        #         on Dim_product.CategoryID = bridge_storerep.CategoryID

        #         where dim_sales_rep.SalesRepID = 1'''
        
        query2 = '''select distinct TOP(5) 
                    dim_sales_rep.SalesRepID,dim_sales_rep.SalesRepFirstName,
                    dim_country.CountryID,
                    dim_country.CountryName,
                    dim_store.StoreID,dim_store.StoreName,
                    dim_retailer.RetailerID,dim_retailer.RetailerName
                    from [dbo].[Dim_Sales_Representative] dim_sales_rep
                    
                    INNER JOIN [dbo].[Dim_Bridge_Store_StoreRep] bridge_storerep
                    on bridge_storerep.SalesRepID=dim_sales_rep.SalesRepID
                    
                    INNER JOIN [dbo].[Dim_Store] dim_store
                    on dim_store.StoreID = bridge_storerep.StoreID
                    
                    INNER JOIN [dbo].[Dim_Location] dim_location
                    on dim_location.LocationID = dim_store.LocationID
                    
                    INNER JOIN [dbo].[Dim_Country] dim_country
                    on dim_country.CountryID = dim_location.CountryID
                    
                    INNER JOIN [dbo].[Dim_Retailer] dim_retailer
                    on dim_retailer.RetailerID = dim_store.RetailerID

                    where dim_sales_rep.SalesRepID = 1'''
        return session.query(salesRep, country, retailer, store, category).from_statement(text(query2)).all()


    def sales_rep_store_category_product(session: Session):
        query = '''select distinct
                dim_sales_rep.SalesRepID,
                dim_sales_rep.SalesRepFirstName,
                dim_store.StoreID,
                dim_store.StoreName,
                dim_category.CategoryID,
                dim_category.ProductCategory 
                from [dbo].[Dim_Sales_Representative] dim_sales_rep

                INNER JOIN [dbo].[Dim_Bridge_Store_StoreRep] bridge_storerep
                on bridge_storerep.SalesRepID=dim_sales_rep.SalesRepID

                INNER JOIN [dbo].[Dim_Category] dim_category
                on dim_category.CategoryID = bridge_storerep.CategoryID

                INNER JOIN [dbo].[Dim_Store] dim_store
                on dim_store.StoreID = bridge_storerep.StoreID

                where dim_sales_rep.SalesRepID = 1'''

        # return session.query(salesRep, category).from_statement(text(query)).all()
        return session.query(store, salesRep, category).from_statement(text(query)).all()      
        


    def get_core_osa_summary(session: Session, salesRepId, LocationId):
        query = """
                select 
                ProductCategory,
                Full_OSA
                from dbo.agg_product_cat
                where Sales_Representative like 'Jordan'
                and store_ID=774907
                and Week_No = 8
                """
        return session.query().from_statement(text(query)).all()

    def get_target_osa_summary(session: Session, salesRepId, LocationId):
        query = """
                """
        return session.query().from_statement(text(query)).all()

    def get_delta_osa_summary(session: Session, salesRepId, LocationId):
        query = """
                """
        return session.query().from_statement(text(query)).all() 

    def search_salesrep_by_store(session: Session, store_id, locationId, firstName, lastName):
        baseQuery = f"""select distinct top 10 dim_sales_rep.SalesRepID,dim_sales_rep.SalesRepFirstName, 
                dim_sales_rep.SalesRepMiddleName, 
                dim_sales_rep.SalesRepLastName
                from dbo.Dim_Sales_Representative dim_sales_rep

                inner join dbo.Dim_Bridge_Store_StoreRep dim_bridge
                on dim_sales_rep.SalesRepId = dim_bridge.SalesRepID

                inner join dbo.dim_store dim_store
                on dim_store.StoreID = dim_bridge.StoreID

                where dim_bridge.StoreID = {store_id}
                and dim_store.LocationID = {locationId}
                and dim_sales_rep.SalesRepFirstName like '%{firstName}%'"""

        finalQuery = baseQuery;
        if lastName is not None:
            finalQuery = finalQuery + f''' and (dim_sales_rep.SalesRepMiddleName like '%{lastName}%' or dim_sales_rep.SalesRepLastName like '%{lastName}%')'''
        return session.query(salesRep).from_statement(text(finalQuery)).all() 