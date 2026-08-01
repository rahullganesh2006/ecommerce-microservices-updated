from pydantic import BaseModel, Field
from typing import Optional


class InventoryCreate(BaseModel):
    inventory_id: str = Field(..., json_schema_extra={"example": "I101"})
    product_id: str = Field(..., json_schema_extra={"example": "P101"})
    available_stock: int = Field(..., ge=0)
    reserved_stock: int = Field(default=0, ge=0)
    warehouse_location: str = Field(..., json_schema_extra={"example": "Chennai"})


class InventoryUpdate(BaseModel):
    available_stock: Optional[int] = Field(default=None, ge=0)
    reserved_stock: Optional[int] = Field(default=None, ge=0)
    warehouse_location: Optional[str] = None


class InventoryResponse(BaseModel):
    inventory_id: str
    product_id: str
    available_stock: int
    reserved_stock: int
    warehouse_location: str