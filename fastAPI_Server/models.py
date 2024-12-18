# models.py
from typing import Dict
from pydantic import BaseModel

class PriceAlert(BaseModel):
    symbol: str
    alert_price: float

# Initially monitor AAPL so we always have something fetching
# models.py
MONITORED_ALERTS: Dict[str, float] = {}
CURRENT_PRICES: Dict[str, float] = {}
