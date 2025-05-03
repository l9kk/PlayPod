from typing import Any, Dict, List, Optional, Union
from fastapi import HTTPException, status
from pydantic import BaseModel


class ResponseModel(BaseModel):
    data: Optional[Union[Dict[str, Any], List[Any], str]] = None
    message: str = "Success"


def success_response(data: Any = None, message: str = "Success") -> Dict[str, Any]:
    return {"data": data, "message": message}


def error_response(status_code: int, message: str) -> None:
    raise HTTPException(status_code=status_code, detail=message)


def not_found_error(item_name: str) -> None:
    error_response(
        status_code=status.HTTP_404_NOT_FOUND, message=f"{item_name} not found"
    )


def already_exists_error(item_name: str) -> None:
    error_response(
        status_code=status.HTTP_400_BAD_REQUEST, message=f"{item_name} already exists"
    )


def unauthorized_error() -> None:
    error_response(
        status_code=status.HTTP_401_UNAUTHORIZED, message="Authentication required"
    )
