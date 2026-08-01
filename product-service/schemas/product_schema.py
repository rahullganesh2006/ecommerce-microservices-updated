from pydantic import BaseModel, Field
from typing import Optional


class ProductCreate(BaseModel):
    product_id: str = Field(..., json_schema_extra={"example": "P101"})
    product_name: str = Field(..., json_schema_extra={"example": "Laptop"})
    description: str = Field(..., json_schema_extra={"example": "Dell Inspiron Laptop"})
    category: str = Field(..., json_schema_extra={"example": "Electronics"})
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    image: Optional[str] = Field(None, json_schema_extra={"example": "https://example.com/image.jpg"})


class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)
    image: Optional[str] = None


class ProductResponse(BaseModel):
    product_id: str
    product_name: str
    description: str
    category: str
    price: float
    stock: int
    image: Optional[str] = None