from sqlalchemy.orm import Session
from src.model import AGG_Store, AGG_STORE_NEW, AGG_Retailer, WEEKLY_MONTHLY_OSA, ROOT_CAUSE, AGG_PRODUCT_CAT_NEW
from sqlalchemy import text


class KPIFunctions:
    def get_KPI_data(session: Session, SalesRepID):

        query = """select
                main.primary_index,
                SalesRepID,
                --count(distinct (main.StoreID)) as Store_ID,
                count(distinct (dim_region.RegionID)) as Regions,
                avg(main.SKU_Count) as No_of_targer_SKU,
                --sum(stores_best_performing) as stores_best_performing,
                --sum(stores_growth_potential) as stores_growth_potential,
                sum(main.ActualSalesValue) as Total_Value_Gain
                from dbo.AGG_Store main

                inner join dbo.DIM_Store dim_store
                on dim_store.StoreID = main.StoreID

                inner join dbo.Dim_Location dim_location
                on dim_location.LocationID = dim_store.LocationID


                inner join dbo.Dim_Region dim_region
                on dim_region.CountryID = dim_location.CountryID

                where WeekID = 82022
                group by SalesRepID, main.primary_index
                having SalesRepID = {}""".format(SalesRepID)

        return session.query(AGG_Store).from_statement(text(query)).all()



    def get_KPI_data_new(session: Session, SalesRepID):

        query = """select
                SalesRepID,
                --count(distinct (main.StoreID)) as Store_ID,
                count(distinct (dim_region.RegionID)) as Regions,
                avg(main.SKU_Count) as No_of_target_SKU,
                sum(best_performing_stores) as best_performing_stores,
                sum(growth_opportunity_stores) as stores_with_growth_potential,
                sum(main.ActualSalesValue) as Total_Value_Gain
                from dbo.AGG_Store main

                inner join dbo.DIM_Store dim_store
                on dim_store.StoreID = main.StoreID

                inner join dbo.Dim_Location dim_location
                on dim_location.LocationID = dim_store.LocationID

                inner join dbo.Dim_Region dim_region
                on dim_region.CountryID = dim_location.CountryID

                where WeekID = 82022
                group by SalesRepID
                having SalesRepID like {}""".format(SalesRepID)

        return session.query(AGG_STORE_NEW).from_statement(text(query)).all()

    def get_KPI_smiley1_data(session: Session, SalesRepID):

        query = """select SalesRepID,sum(cast(ActualSalesValue as float)) as increase_net_sales
                from dbo.AGG_PRODUCT_CAT
                where Due_Date is NOT NULL
                and SalesRepID = {}
                group by SalesRepID""".format(SalesRepID)

        return session.query(AGG_PRODUCT_CAT_NEW).from_statement(text(query)).all()

    def get_KPI_smiley2_data_last5_visit(session: Session, SalesRepID):

        query = """select top 1 SalesRepID,Last_5_Visits from (
                select SalesRepID,Due_Date,sum(ActualSalesValue) over (partition by SalesRepID order by Due_Date asc rows between 5 preceding and current row) as Last_5_Visits,
                RANK() over (partition by SalesRepID order by Due_Date) as rank_col
                from (
                select SalesRepID,Due_Date,sum(cast(ActualSalesValue as float)) as ActualSalesValue
                from dbo.AGG_PRODUCT_CAT
                where Due_Date is NOT NULL
                group by SalesRepID,Due_Date
                ) as XX
                ) as YY where SalesRepID = {} order by rank_col desc""".format(SalesRepID)

        return session.query(AGG_PRODUCT_CAT_NEW).from_statement(text(query)).all()



    def get_retailer_based_on_saleRepId(session: Session, SalesRepID):

        query = """select SalesRepID,count(distinct(RetailerID)) as Number_of_retailers
                from dbo.AGG_Retailer
                group by SalesRepID
                having SalesRepID = {}""".format(SalesRepID)

        return session.query(AGG_Retailer).from_statement(text(query)).all()
        
    
    def get_weekly_osa(session: Session, salesRepId, storeId: int, globalDivision: str, categoryId : int):
        query = """
            select *, ActualSalesValue/TotalSalesValue as OSAPercentage,COREActualSalesValue/CORETotalSalesValue as COREOSAPercentage
            from (
            select AAA.primary_index,AAA.WeekID, sum(ActualSalesValue) as ActualSalesValue,(sum(LostSalesValue)+sum(ActualSalesValue)) as TotalSalesValue,
            sum(COREActualSalesValue)as COREActualSalesValue, (sum(CORELostSalesValue)+sum(COREActualSalesValue)) as CORETotalSalesValue, ProductCategory, GlobalDivision, AAA.StoreID, SalesRepID
            from [dbo].[AGG_PRODUCT_CAT] as AAA
            
            inner join [dbo].[Dim_Date] as DDD
            on AAA.WeekID=DDD.WeekID
            
            inner Join [dbo].[Dim_Store] as SSS
            on AAA.StoreID=SSS.StoreID
            
            inner Join [dbo].[Dim_Category] as CCC
            on CCC.categoryID=AAA.CategoryID
            where AAA.CategoryID= {} and AAA.StoreID = {}
            group by AAA.primary_index,AAA.WeekID, [Date], AAA.StoreID, SalesRepID, CCC.ProductCategory, CCC.GlobalDivision
            having SalesRepID={} and GlobalDivision ='{}'
            --and AAA.WeekID =72022
            ) as XX
                    """.format(categoryId, storeId, salesRepId, globalDivision)

        return session.query(WEEKLY_MONTHLY_OSA).from_statement(text(query)).all()

    def get_monthly_osa(session: Session, salesRepId, storeId: int, globalDivision: str, categoryId : int):
        query = """
            select *, ActualSalesValue/TotalSalesValue as OSAPercentage,COREActualSalesValue/CORETotalSalesValue as COREOSAPercentage
                    from (
                    select primary_index,[Month], sum(ActualSalesValue) as ActualSalesValue,(sum(LostSalesValue)+sum(ActualSalesValue)) as TotalSalesValue,
                    sum(COREActualSalesValue)as COREActualSalesValue, (sum(CORELostSalesValue)+sum(COREActualSalesValue)) as CORETotalSalesValue, ProductCategory, GlobalDivision, AAA.StoreID, SalesRepID
                    from [dbo].[AGG_PRODUCT_CAT] as AAA
                    inner join [dbo].[Dim_Date] as DDD
                    on AAA.WeekID=DDD.WeekID
                    inner Join  [dbo].[Dim_Store] as SSS
                    on AAA.StoreID=SSS.StoreID
                    inner Join [dbo].[Dim_Category] as CCC
                    on CCC.categoryID=AAA.CategoryID
                    where AAA.CategoryID = {} AND AAA.StoreID = {}
                    group by primary_index,[Month], AAA.StoreID, SalesRepID, CCC.ProductCategory, CCC.GlobalDivision
                    having SalesRepID={} and GlobalDivision ='{}'
                    ) as XXX
                    """.format(categoryId, storeId, salesRepId, globalDivision,)
        return session.query(WEEKLY_MONTHLY_OSA).from_statement(text(query)).all()

    def get_break_root_cause(session: Session, countryId: int, categoryId: int,  retailerId: int):
        query = """
            select StoreID,CategoryID,RootCause,
            cast(sum(Value)/sum(sum(Value)) OVER () *100 as decimal(10,2)) AS Value
            from (
            select
            AA.StoreID,
            EE.CategoryID,
            RootCause,
            convert(decimal(16,2),count(*)) as Value
            from [dbo].[Fact_OSA] as AA
            inner join [dbo].[Dim_Store] as BB
            on AA.StoreID=BB.StoreID
            inner Join [dbo].[Dim_Retailer] as CC
            on BB.RetailerID=CC.RetailerID
            inner join [dbo].[Dim_Location] as DD
            on CC.LocationID=DD.LocationID
            inner join [dbo].[Dim_Category] as EE
            on EE.CategoryID=AA.CategoryID
            Where RecordedStatus =1
            and WeekID =82022 and
            AA.CategoryID= {} and
            CC.RetailerID={} and
            DD.CountryID ={}            
            group by AA.StoreID,EE.CategoryID,RootCause) as XX
            group by StoreID,CategoryID,RootCause
            """.format(categoryId,retailerId, countryId)
        return session.query(ROOT_CAUSE).from_statement(text(query)).all()

    def get_compliance_data(session: Session, CategoryID ,GlobalDivision, WeekID, SalesRepID):
        query = """select *, (ActualSalesValue/TotalSalesValue)*100 as OSAPercentage,(COREActualSalesValue/CORETotalSalesValue)*100 as COREOSAPercentage
                    from (
                    select sum(ActualSalesValue) as ActualSalesValue,(sum(LostSalesValue)+sum(ActualSalesValue)) as TotalSalesValue,
                    sum(COREActualSalesValue)as COREActualSalesValue, (sum(CORELostSalesValue)+sum(COREActualSalesValue)) as CORETotalSalesValue,AAA.WeekID, SalesRepID,
                    --lag(ActualSalesValue,1,0) over (partition by AAA.StoreID,SalesRepID order by AAA.WeekID) as prev_wk_sales
                    100*(sum(ActualSalesValue)-lag(ActualSalesValue,1,0) over (partition by AAA.StoreID,SalesRepID order by AAA.WeekID))/sum(ActualSalesValue) as DeltaPerc_ActSales_PrevWk,
                    100*(sum(COREActualSalesValue)-lag(COREActualSalesValue,1,0) over (partition by AAA.StoreID,SalesRepID order by AAA.WeekID))/sum(ActualSalesValue) as DeltaPerc_COREActSales_PrevWk
                    from [dbo].[AGG_PRODUCT_CAT] as AAA
                    inner join [dbo].[Dim_Date] as DDD
                    on AAA.WeekID=DDD.WeekID
                    inner Join [dbo].[Dim_Store] as SSS
                    on AAA.StoreID=SSS.StoreID
                    inner Join [dbo].[Dim_Category] as CCC
                    on CCC.categoryID = AAA.CategoryID
                    where AAA.CategoryID =  {} and GlobalDivision ='{}'-- and AAA.WeekID = {}
                    group by AAA.StoreID,AAA.WeekID, SalesRepID,ActualSalesValue,COREActualSalesValue
                    having AAA.StoreID = 2340 and SalesRepID = {}
                    ) as XX""".format(CategoryID, GlobalDivision, WeekID, SalesRepID)

        return session.query(AGG_PRODUCT_CAT_NEW).from_statement(text(query)).all()

