from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status
from fastapi import Depends

from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from schemas.product_schema import ProductCreate
from schemas.product_schema import ProductUpdate
from services.product_service import ProductService


# Swagger JWT Security
security = HTTPBearer()


router = APIRouter(
    prefix="/products",
    tags=["Product Service"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_product(
    product: ProductCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    created_product = ProductService.create_product(product)

    if created_product is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Product already exists"
        )

    return {
        "message": "Product created successfully",
        "data": created_product
    }


@router.get("/")
def get_all_products(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    products = ProductService.get_all_products()

    return {
        "count": len(products),
        "data": products
    }


@router.get("/{product_id}")
def get_product(
    product_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    product = ProductService.get_product_by_id(product_id)

    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return product


@router.put("/{product_id}")
def update_product(
    product_id: str,
    product: ProductUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    updated_product = ProductService.update_product(
        product_id,
        product
    )

    if updated_product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {
        "message": "Product updated successfully",
        "data": updated_product
    }


@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    deleted = ProductService.delete_product(product_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )

    return {
        "message": "Product deleted successfully"
    }