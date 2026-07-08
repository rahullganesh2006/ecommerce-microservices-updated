from pydantic import BaseModel, Field
from typing import Optional


class ProductCreate(BaseModel):
    product_id: str = Field(..., example="P101")
    product_name: str = Field(..., example="Laptop")
    description: str = Field(..., example="Dell Inspiron Laptop")
    category: str = Field(..., example="Electronics")
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)


class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)


class ProductResponse(BaseModel):
    product_id: str
    product_name: str
    description: str
    category: str
    price: float
    stock: int