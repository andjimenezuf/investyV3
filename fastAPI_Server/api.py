# api.py
import requests
from fastapi import APIRouter, HTTPException
from models import PriceAlert, MONITORED_ALERTS, CURRENT_PRICES
from config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_URL

router = APIRouter()

@router.get("/stocks")
def get_current_prices():
    return CURRENT_PRICES

@router.post("/alerts")
def add_alert(alert: PriceAlert):
    MONITORED_ALERTS[alert.symbol] = alert.alert_price
    return {"message": f"Alert set for {alert.symbol} at ${alert.alert_price}"}

@router.get("/alerts")
def view_alerts():
    return MONITORED_ALERTS

@router.delete("/alerts/{symbol}")
def remove_alert(symbol: str):
    if symbol in MONITORED_ALERTS:
        del MONITORED_ALERTS[symbol]
        if symbol in CURRENT_PRICES:
            del CURRENT_PRICES[symbol]
        return {"message": f"Alert for {symbol} removed."}
    else:
        raise HTTPException(status_code=404, detail=f"No alert found for {symbol}.")

@router.get("/stocks/{symbol}/history")
def get_historical_data(symbol: str):
    """Fetch historical data for a stock (daily)."""
    try:
        response = requests.get(ALPHA_VANTAGE_URL, params={
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": ALPHA_VANTAGE_API_KEY
        })
        data = response.json()

        if "Time Series (Daily)" not in data:
            raise HTTPException(status_code=400, detail="Invalid response from API")

        historical_data = []
        for time, values in data["Time Series (Daily)"].items():
            historical_data.append({
                "time": time,
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
            })

        # Return data oldest to newest (sort by time ascending)
        historical_data.sort(key=lambda x: x["time"])
        return {"data": historical_data}

    except Exception as e:
        print(f"Error fetching historical data for {symbol}: {e}")
        raise HTTPException(status_code=500, detail="Error fetching historical data")
