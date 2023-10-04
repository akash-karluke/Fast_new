from ctypes.wintypes import FLOAT
from stat import FILE_ATTRIBUTE_NORMAL
from tokenize import Floatnumber
from xmlrpc.client import DateTime
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy.types import String, Integer, Text, Float
from sqlalchemy.orm import declarative_base, relationship
from db.database import Base
from datetime import date

# Table Format
# Users

class bridge_store_storeRep(Base):
    __tablename__ = "Dim_Bridge_Store_StoreRep"
    Bid = Column(Integer, primary_key=True, index=True)
    StoreID = Column(Integer, ForeignKey('Dim_Store.StoreID'))
    SaleRepID = Column(Integer, ForeignKey('Dim_Sales_Representative.SalesRepID'))
    ProductID = Column(Integer, ForeignKey('Dim_Product.ProductID'))


sales_store = Table("bridge_store_storeRep", Base.metadata,
                    Column('SaleRepID',  ForeignKey('Dim_Sales_Representative.SalesRepID'), primary_key=True),
                    Column('StoreID',  ForeignKey('Dim_Store.StoreID'), primary_key=True)
                )

class salesRep(Base):
    __tablename__ = "Dim_Sales_Representative"
    SalesRepID = Column(Integer, primary_key=True, index=True)
    SalesRepFirstName = Column(String(20))
    SalesRepMiddleName = Column(String(20))
    SalesRepEmailID = Column(String(20))
    # foreign key
    SalesRepManagerID = Column(Integer, ForeignKey("Dim_Sales_Manager.ManagerID"))
    stores = relationship("store", secondary=sales_store, back_populates='salesReps')


class salesManager(Base):
    __tablename__ = "Dim_Sales_Manager"
    ManagerID = Column(Integer, primary_key=True, index=True)
    ManagerEmailID = Column(String(20), unique=True)
    ManagerFirstName = Column(String(20))
    ManagerMiddleName = Column(String(20))
    ManagerLastName = Column(String(20))
    salesReps = relationship("salesRep",primaryjoin="salesManager.ManagerID == salesRep.SalesRepManagerID",cascade="all, delete-orphan")

class store(Base):
    __tablename__ = "Dim_Store"
    StoreID = Column(Integer, primary_key=True, index=True)
    StoreCode = Column(Integer)
    StoreName = Column(String(20))
    RetailerID = Column(Integer, ForeignKey('Dim_Retailer.RetailerID'))
    LocationID = Column(Integer, ForeignKey('Dim_Location.LocationID'))
    salesReps = relationship("salesRep", secondary=sales_store, back_populates='stores')

class retailer(Base):
    __tablename__ = "Dim_Retailer"
    RetailerID = Column(Integer, primary_key=True, index=True)
    RetailerName = Column(String(150))
    RetailerChain = Column(String(150))
    RetailerType = Column(String(150))
    LocationID = Column(Integer, ForeignKey('Dim_Location.LocationID'))

class location(Base):
    __tablename__ = "Dim_Location"
    LocationID = Column(Integer, primary_key=True, index=True)
    Address1 = Column(String(200))
    Address2 = Column(String(200))
    City = Column(String(100))
    State = Column(String(100))
    Zipcode = Column(String(100))
    CountryID = Column(Integer, ForeignKey('Dim_Country.CountryID'))


class country(Base):
    __tablename__ = "Dim_Country"
    CountryID = Column(Integer, primary_key=True, index=True)
    CountryName = Column(String(100))
    CountryGroup = Column(String(100))
    MCO = Column(String(100))


class region(Base):
    __tablename__ = "Dim_Region"
    RegionID = Column(Integer, primary_key=True, index=True)
    RegionName = Column(String(100))
    # CountryID = Column(Integer, ForeignKey('Dim_Country.CountryID'))
    # ClusterID = Column(Integer, ForeignKey('Dim_Cluster.ClusterID'))


class cluster(Base):
    __tablename__ = "Dim_Cluster"
    ClusterID = Column(Integer, primary_key=True, index=True)
    ClusterName = Column(String(100))


class category(Base):
    __tablename__ = "Dim_Category"
    CategoryID = Column(Integer, primary_key=True, index=True)
    ProductCategory = Column(String(100))
    GlobalCategory = Column(String(100))
    GlobalBrand = Column(String(100))
    GlobalDivision = Column(String(100))


class product(Base):
    __tablename__ = "Dim_Product"
    ProductID = Column(Integer, primary_key=True, index=True)
    ProductCode = Column(Integer)
    ProductDescription = Column(String(250))
    EAN = Column(Integer)
    CategoryID = Column(Integer, ForeignKey('Dim_Category.CategoryID'))
    COTCFlag = Column(Integer)

# Aggregation table

class AGG_Representativ(Base):
    __tablename__ = "AGG_Representativ"
    primary_index = Column(Integer, primary_key=True, index=True)
    SalesRepFirstName = Column(String(250))
    RegionName = Column(String(250))
    OSAPercentage = Column(Integer)
    Region = Column(String(250))
    Country = Column(String(250))
    GlobalDivison = Column(String(250))
    Sales_representative = Column(String(250))
    Regional_Sales_manager = Column(String(250))
    Location = Column(String(250))
    Week_No = Column(Integer)
    Cluster = Column(String(250))
    Month = Column(String(250))
    Year = Column(Integer)
    day = Column(Integer)
    actual_sales_value = Column(Integer)
    lost_sales_value = Column(Integer)
    CORE_actual_sales_value = Column(Integer)
    CORE_lost_sales_value = Column(Integer)
    NPD_actual_sales_value = Column(Integer)
    NPD_actual_sales_value = Column(Integer)
    NPD_actual_sales_value = Column(Integer)
    NPD_lost_sales_value = Column(Integer)
    # Date = Column(date)
    OSA = Column(Float)
    Target_OSA = Column(Float)
    
class AGG_Store(Base):
    __tablename__ = "AGG_STORE"
    
    primary_index = Column(Integer, primary_key=True, index=True)
    StoreID = Column(Integer)
    Regions = Column(Integer)
    SalesRepID = Column(Integer) 
    # StoreID = Column(Integer, primary_key=True, index=True)
    Country = Column(String(250))
    Retailer = Column(String(250))
    GlobalDivision = Column(String(250))
    store_chain = Column(String(250))
    Sales_Representative = Column(String(250))
    Regional_Sales_Manager = Column(String(250))
    Location = Column(String(250))
    Week_No = Column(Integer)
    Region = Column(String(250))
    Cluster = Column(String(250))
    Month = Column(Integer)
    Year = Column(Integer)
    day = Column(Integer)
    actual_sales_value = Column(Integer) 
    lost_sales_value = Column(Integer)
    SKU_Count = Column(Integer)
    No_of_targer_SKU = Column(Integer)
    Total_Value_Gain = Column(Integer)
    CORE_actual_sales_value = Column(Integer)
    CORE_lost_sales_value = Column(Integer)
    CORE_SKU_Count = Column(Integer)
    NPD_actual_sales_value = Column(Integer)
    NPD_lost_sales_value = Column(Integer)
    NPD_SKU_Count = Column(Integer)
    Full_OSA = Column(Float)
    CORE_OSA = Column(Float)
    NPD_OSA = Column(Float)
    # Date
    actual_sales_value_PY = Column(Integer)
    Sales_Uplift = Column(Float)
    best_performing_stores = Column(Integer)
    stores_with_growth_potential = Column(Integer)


class Dim_Bridge_Store_StoreRep(Base):
    __tablename__ = 'Bridge_Store_StoreRep'

    Bid = Column(Integer, primary_key=True, index=True)
    StoreID = Column(Integer)
    SalesRepID = Column(Integer)
    CategoryID = Column(Integer)


class AGG_Retailer(Base):
    __tablename__ = 'AGG_Retailer'

    primary_index = Column(Integer, primary_key=True, index=True)
    Region = Column(String(250))
    Month = Column(Integer)
    day = Column(Integer)
    Cluster = Column(String(250))
    GlobalDivision = Column(String(250))
    store_chain = Column(String(250))
    Full_OSA = Column(Integer)
    avg_osa = Column(Integer)

    RetailerName = Column(String(250))
    OSAPercentage = Column(Integer)


class EXECUTIVE_SUMMARY(Base):
    __tablename__ = "AGG_PRODUCT_FAKE"
    GlobalDivision = Column(String, primary_key = True)

    Current_OSA = Column(Float)
    Target_OSA = Column(Float)
    Delta_OSA = Column(Float)

class AGG_STORE_NEW(Base):
    __tablename__ = "AGG_STORE_NEW"

    SalesRepID = Column(Integer, primary_key = True)
    Regions = Column(Integer)
    No_of_target_SKU = Column(Integer)
    best_performing_stores = Column(Integer)
    stores_with_growth_potential = Column(Integer)
    Total_Value_Gain = Column(Integer)
    

class AGG_PRODUCT_CAT(Base):
    __tablename__ = "AGG_PRODUCT_CAT"
     
    StoreID = Column(Integer, primary_key=True, index=True)
    CategoryID = Column(Integer)
    Country = Column(String(250))
    Retailer = Column(String(250))
    GlobalCategory = Column(String(250))
    ProductCategory = Column(String(250))
    store_chain = Column(String(250))
    Sales_Representative = Column(String(250))
    Regional_Sales_Manager = Column(String(250))
    Location = Column(String(250))
    Week_No = Column(Integer)
    Region = Column(String(250))
    Cluster = Column(String(250))
    GlobalDivision = Column(String(250))
    Month = Column(Integer)
    Year = Column(Integer)
    day = Column(Integer)
    actual_sales_value = Column(Integer) 
    lost_sales_value = Column(Integer)
    SKU_Count = Column(Integer)
    OSAPercentage = Column(Float)
    COREOSAPercentage = Column(Float)
    NPDOSAPercentage = Column(Float)
    Action = Column(String(250))
    SalesUplift = Column(Float)
    CORE_actual_sales_value = Column(Integer)
    CORE_lost_sales_value = Column(Integer)
    CORE_SKU_Count = Column(Integer)
    CORE_OSA = Column(Float)
    NPD_actual_sales_value = Column(Integer)
    NPD_lost_sales_value = Column(Integer)
    NPD_SKU_Count = Column(Integer)
    NPD_OSA = Column(Float)
    # Date
    actual_sales_value_PY = Column(Integer)
    Action_Required = Column(Integer)
    
    Priority = Column(String(250))

    # User data
    SalesRepID = Column(Integer)
    SalesRepFirstName = Column(String(20))
    SalesRepMiddleName = Column(String(20))
    SalesRepLastName = Column(String(20))
    
class WEEKLY_MONTHLY_OSA(Base):
    __tablename__ = "WEEKLY_MONTHLY_OSA"
    primary_index = Column(Integer, primary_key=True, index=True)
    WeekID = Column(Integer)
    ActualSalesValue = Column(Float)
    TotalSalesValue = Column(Float)
    COREActualSalesValue = Column(Float)
    CORETotalSalesValue = Column(Float)
    ProductCategory = Column(String)
    GlobalDivision = Column(String)
    StoreCode = Column(Integer)
    SalesRepID = Column(Integer)
    OSAPercentage = Column(Float)
    COREOSAPercentage = Column(Float)
    Month = Column(Integer)

class ROOT_CAUSE(Base):
    __tablename__ = "ROOT_CAUSE_TABLE"
    RootCause = Column(String(250), primary_key=True)
    Value = Column(Float)


class AGG_PRODUCT_CAT_NEW(Base):
    __tablename__ = "AGG_PRODUCT_CAT_NEW"

    SalesRepID = Column(Integer, primary_key=True, index=True)
    OSAPercentage = Column(Integer)
    GlobalDivision = Column(String)
    COREOSAPercentage = Column(Integer)
    ActualSalesValue = Column(Integer)
    TotalSalesValue = Column(Integer)
    COREActualSalesValue = Column(Integer)
    CORETotalSalesValue = Column(Integer)
    DeltaPerc_ActSales_PrevWk = Column(Integer)
    DeltaPerc_COREActSales_PrevWk = Column(Integer)
    Last_5_Visits = Column(Integer)
    increase_net_sales = Column(Integer)
    Due_Date = Column(Integer)