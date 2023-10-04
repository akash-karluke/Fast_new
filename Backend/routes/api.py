from fastapi import APIRouter
from src.endpoints import product, salesRep, filters, store, retailer, category, country, region, table, KPI_data

router = APIRouter()

API_VERSION = '/api/v1'
router.include_router(filters.router, prefix="{}/globalFilters".format(API_VERSION))
router.include_router(product.router, prefix="{}/product".format(API_VERSION))
router.include_router(salesRep.router, prefix="{}/salesRep".format(API_VERSION))
router.include_router(store.router, prefix="{}/store".format(API_VERSION))
router.include_router(retailer.router, prefix="{}/retailer".format(API_VERSION))
router.include_router(category.router, prefix="{}/category".format(API_VERSION))
router.include_router(country.router, prefix="{}/country".format(API_VERSION))
router.include_router(region.router, prefix="{}/region".format(API_VERSION))
router.include_router(table.router, prefix="{}/table".format(API_VERSION))
router.include_router(KPI_data.router, prefix="{}/KPI".format(API_VERSION))
