from sqlalchemy.orm import Session
from sqlalchemy import text
from src.model import AGG_Store, AGG_Retailer, AGG_PRODUCT_CAT, AGG_Representativ


class tableFunctions:
    def get_table_data(session: Session, salesRepId : int, retailerId: int):
        print('table {} {}'.format(salesRepId, retailerId))
        # return session.query(country).order_by(country.CountryName).offset(skip).limit(limit).all()
        query = """select 
                    main.SalesRepID,
                    primary_index,
                    dim_store.StoreID,
                    dim_store.StoreID as StoreCode,
                    dim_store.StoreName,
                    dim_location.City as Location,
                    OSAPercentage as Full_OSA,
                    COREOSAPercentage as CORE_OSA,
                    NPDOSAPercentage as NPD_OSA,
                    SalesUplift  as Sales_Uplift 
                    from dbo.AGG_STORE main
                    
                    inner join dbo.Dim_Store dim_store
                    on dim_store.StoreID = main.StoreID
                    inner join dbo.Dim_Location dim_location
                    on dim_location.LocationID = dim_store.LocationID
                    inner join dbo.Dim_Retailer dim_retailer
                    on dim_retailer.RetailerID = dim_store.RetailerID
                    where main.SalesRepID = {}
                    and dim_retailer.RetailerID = {}""".format(salesRepId, retailerId)
        
        return session.query(AGG_Store).from_statement(text(query)).all()
   
    def get_top_10_retailer(session: Session, SalesRepID, GlobalDivision, CountryID):
       
        query = """select top(10) XX.primary_index,RetailerID,RetailerName, avg(OSAPercentage) as OSAPercentage
                from (
                select WeekID, A.RetailerID as RetailerID, A.primary_index, RetailerName, OSAPercentage , COREOSAPercentage, NPDOSAPercentage
                from (
                select * from [dbo].[AGG_Retailer]) as A
                inner join [dbo].[Dim_Category] as B
                on A.CategoryID=B.CategoryID
                inner Join [dbo].[Dim_Sales_Representative] as C
                on A.SalesRepID =C.SalesRepID
                inner join [dbo].[Dim_Retailer] as D
                on A.RetailerID=D.RetailerID
                inner join [dbo].[Dim_Location] as E
                on E.LocationID=D.LocationID
                where A.SalesRepID= {} and GlobalDivision ='{}' and CountryID={}
                ) as XX
                group by XX.primary_index,WeekID,RetailerID,RetailerName
                having WeekID = 82022
                Order By OSAPercentage DESC""".format(SalesRepID, GlobalDivision, CountryID)

        return session.query(AGG_Retailer).from_statement(text(query)).all()

        # EAN MApping NotAvailable
        # BEAUTY & PERSONAL CARE

    def Eggdie_all_star(session: Session, CountryID, GlobalDivision):
        query = '''select top 10 SalesRepFirstName, RegionName, primary_index, OSAPercentage from [dbo].[AGG_Representative] as A1
                inner join (
                select A.SalesRepID as SalesRepID, SalesRepFirstName, E.RegionName as RegionName, D.CountryID as CountryID
                from [dbo].[Dim_Sales_Representative] as A 
                inner join [dbo].[Dim_Bridge_Store_StoreRep] as B 
                on A.SalesRepID=B.SalesRepID 
                inner join [dbo].[Dim_Store] as C 
                on B.StoreID=C.StoreID
                inner Join [dbo].[Dim_Location] as D 
                on D.LocationID=C.LocationID
                inner join dbo.Dim_region as E
                on E.CountryID = D.CountryID
                group by A.SalesRepID, A.SalesRepFirstName, E.RegionName, D.CountryID
                ) as A2
                on A1.SalesRepID=A2.SalesRepID
                where WeekID= 82022 and GlobalDivision = '{}' and CountryID = {}'''.format(GlobalDivision, CountryID)
                
        return session.query(AGG_Representativ).from_statement(text(query)).all()

    def nested_table_category(session: Session, storeId: int):

        query = '''select
                    StoreID,
                    dim_salesrep.SalesRepID,
                    dim_salesrep.SalesRepFirstName,
                    dim_salesrep.SalesRepMiddleName,
                    dim_salesrep.SalesRepLastName,
                    dim_cat.CategoryID,
                    ProductCategory,
                    OSAPercentage,
                    COREOSAPercentage,
                    NPDOSAPercentage,
                    Action,
                    SalesUplift
                    from dbo.agg_product_cat main
                    inner join dbo.Dim_Category dim_cat
                    on dim_cat.CategoryID = main.CategoryID
                    inner join dbo.Dim_Retailer dim_retailer
                    on dim_retailer.RetailerID = main.RetailerID
                    inner join dbo.Dim_Sales_Representative dim_salesrep
                    on dim_salesrep.SalesRepID = main.SalesRepID
                    where OSAPercentage <0.95
                    and StoreID = {} '''.format(storeId)

        return session.query(AGG_PRODUCT_CAT).from_statement(text(query)).all()
