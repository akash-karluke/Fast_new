from sqlalchemy.orm import Session
from src.model import product
from sqlalchemy import text


class productFunctions:
    # API to fetch product list by storeID & categoryID
    def get_all_products(session: Session, storeId, categoryId):
        query = """
                """
        return session.query(product).from_statement(text(query)).all()