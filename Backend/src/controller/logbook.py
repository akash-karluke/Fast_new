from sqlalchemy.orm import Session
from src.model import AGG_PRODUCT_CAT_NEW
from sqlalchemy import text

class logbookFunctions:

    def get_logbook_data(session: Session):
        query = """select SalesRepID,StoreName, prod.StoreID, StoreCode, ProductCategory, prod.CategoryID , [action], OSAPercentage,COREOSAPercentage, SalesUplift, DATEFROMPARTS([Year],[Month],[Day]) as CreatedOn, AssignedTo,TransferedTo, CompleatedBy
                from [dbo].[AGG_Product_CAT] as prod
                inner join Dim_Store as store
                on prod.storeid=store.storeid
                inner join Dim_Category as cat
                on cat.CategoryID=prod.CategoryID
                inner join (select *, (datepart (week, [Date])-2) as WeekNo from Dim_Date) as da
                on da.weekid= prod.weekid
                inner join Dim_Retailer as ret
                on ret.RetailerID=prod.RetailerID
                inner join Dim_Location as loc
                on loc.LocationID=ret.LocationID
                where SalesrepID=4 and (weekno between 8 and 11) and prod.RetailerID = 1000316 and actionrequired=1 and CountryID =3"""

        return session.query(AGG_PRODUCT_CAT_NEW).from_statement(text(query)).all()