from datetime import date
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Validation of request response FROM Table
class salesRep(BaseModel):
    id : int
    username: str
    email: EmailStr
    first_name: str
    middle_name: str
    last_name: str
    # foreign key
    managerId:  int

    class Config:
        orm_mode = True

class salesManager(BaseModel):
    id: int
    first_name: str
    middle_name: str
    last_name: str

    class Config:
        orm_mode = True

class Category(BaseModel):
    id: int
    name: str
    description: Optional[str] = Field(
        None, title="The description of the Product", max_length=300)
    price: float = Field(..., gt=0,
                        description="The price must be greater than zero")
    globalBrand: str
    globalDivision: str


class Product(BaseModel):
    id: int
    name: str
    code: int
    description: str
    cotcFlag: int
    ean: int
    # foreign keys
    categoryId: int

class Country(BaseModel):
    id: int
    name: str
    group: str
    mco: str
    # foreign keys

# Region (Combination of Markets)
class Region(BaseModel):
    id: int
    name: str

# store level
class Store(BaseModel):
    StoreId : int
    StoreCode: int
    StoreName: str
    RetailerId: int
    LocationId: int

class Retailer(BaseModel):
    id: int
    name: str
    chain: str
    type: str
    # foreign keys
    regionId: int


class AGG_Representativ(BaseModel):
    Region = str
    Country = str
    Global_Divison = str
    Sales_representative = str
    Regional_Sales_manager = str
    Location = str
    Week_No = int
    Cluster = str
    Month = str
    Year = int
    day = int
    actual_sales_value = int
    lost_sales_value = int
    CORE_actual_sales_value = int
    CORE_lost_sales_value = int
    NPD_actual_sales_value = int
    NPD_actual_sales_value = int
    NPD_actual_sales_value = int
    NPD_lost_sales_value = int
    Date = date
    OSA_percentage = float
    Target_OSA_percentage = float


class AGG_Store(BaseModel):
    primary_index = int
    StoreID = int
    Country = str
    Retailer = str
    GlobalDivision = str
    store_chain = str
    Sales_Representative = str
    Regional_Sales_Manager = str
    Location = str
    Week_No = int
    Region = str
    Cluster = str
    Month = int
    Year = int
    day = int
    actual_sales_value = int 
    lost_sales_value = int
    SKU_Count = int
    CORE_actual_sales_value = int
    CORE_lost_sales_value = int
    CORE_SKU_Count = int
    NPD_actual_sales_value = int
    NPD_lost_sales_value = int
    NPD_SKU_Count = int
    Full_OSA = int
    CORE_OSA = int
    NPD_OSA = int
    # Date
    actual_sales_value_PY = int
    Sales_Uplift = int


class AGG_Retailer(BaseModel):
    Region = str
    Cluster = str
    GlobalDivision = str
    store_chain = str
    Full_OSA = int

class ProductStatus(BaseModel):
    id: str

class AGG_PRODUCT_CAT(BaseModel):
    
    primary_index = int
    StoreID = int
    Country = str
    Retailer = str
    GlobalCategory = str
    ProductCategory = str
    store_chain = str
    Sales_Representative = str
    Regional_Sales_Manager = str
    Location = str
    Week_No = int
    Region = str
    Cluster = str
    GlobalDivision = str
    Month = int
    Year = int
    day = int
    actual_sales_value = int 
    lost_sales_value = int
    SKU_Count = int
    Full_OSA = int
    CORE_actual_sales_value = int
    CORE_lost_sales_value = int
    CORE_SKU_Count = int
    CORE_OSA = int
    NPD_actual_sales_value = int
    NPD_lost_sales_value = int
    NPD_SKU_Count = int
    NPD_OSA = int
    # Date
    actual_sales_value_PY = int
    Sales_Uplift = int
    Action_Required = int
    Action = str
    Priority = str

class ProductStatus(BaseModel):
    ID = int
    status = str
# class Response(BaseModel):
#     status = str
#     code = int
#     data = any