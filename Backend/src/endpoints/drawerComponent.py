from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_utils.cbv import cbv
from sqlalchemy.orm import Session
from src.controller.drawerComponent import drawerFunctions
from db.database import get_db

#APIRouter creates path operations for item module
router = APIRouter(
    tags=["DrawerComponent"],
    responses={404: {"description": "Not found"}},
)

@cbv(router)
class Default:
    session: Session = Depends(get_db)

    # API to get category details by location
    @router.get('/root-causes')
    async def list_of_root_cause(self):
        try:
            data = drawerFunctions.get_list_of_rootCauses(self.session)
            
            response = {
                "data": data,
                "code" : 200,
                "status": 'success'
            }
            return response
        except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))