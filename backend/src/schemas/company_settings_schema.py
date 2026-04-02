from pydantic import BaseModel, ConfigDict

class CompanySettings(BaseModel):
    id: int
    name: str
    logo_url: str | None = None
    admin_password: str | None = None
    model_config = ConfigDict(from_attributes=True)