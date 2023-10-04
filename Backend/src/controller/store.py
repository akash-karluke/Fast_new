from sqlalchemy.orm import Session
from src.model import store, retailer
from sqlalchemy import text


class storeFunctions:
    def get_all_stores(session: Session, salesRepId: int = 1):
        query = """select * from Dim_Store"""
        data = session.query(store).from_statement(text(query)).all()
        return data
        # return session.query(store).order_by(store.StoreID).offset(skip).limit(limit).all()

    # Function to fetch store by ID
    def get_store_by_id(session: Session, store_id):
        return session.query(store).filter(store.StoreID == store_id).first()
    
    def get_store_by_name(session: Session, storename:str):
        return session.query(store).filter(store.StoreName == storename).first()    

    # Function to fecth stores by Retailer
    def get_stores_by_retailer(session: Session, salesRepId, retailerId):
        print('retailer-{} salesRep -{}'.format(salesRepId, retailerId))
        query = """select distinct
                    dim_store.StoreID,
                    dim_store.StoreName,
                    dim_location.LocationID,
                    dim_location.Address1,
                    dim_retailer.RetailerID,
                    dim_retailer.RetailerName

                    from [dbo].[Dim_Sales_Representative] dim_sales_rep
                    INNER JOIN [dbo].[Dim_Bridge_Store_StoreRep] bridge_storerep
                    on bridge_storerep.SalesRepID=dim_sales_rep.SalesRepID

                    INNER JOIN [dbo].[Dim_Store] dim_store
                    on dim_store.StoreID = bridge_storerep.StoreID

                    INNER JOIN [dbo].[Dim_Location] dim_location
                    on dim_location.LocationID = dim_store.LocationID

                    INNER JOIN [dbo].[Dim_Retailer] dim_retailer
                    on dim_retailer.RetailerID = dim_store.RetailerID

                    where dim_sales_rep.SalesRepID = {}
                    and dim_retailer.RetailerID = {}""".format(salesRepId,retailerId)

        return session.query(store).from_statement(text(query)).all()