# background_tasks.py
import threading
import time
import requests
from config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_URL, FETCH_INTERVAL, ALERT_CHECK_INTERVAL
from models import MONITORED_ALERTS, CURRENT_PRICES

def fetch_stock_price(symbol: str) -> float:
    """Fetch the real-time stock price from Alpha Vantage."""
    try:
        response = requests.get(ALPHA_VANTAGE_URL, params={
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": ALPHA_VANTAGE_API_KEY
        })
        data = response.json()
        price = float(data["Global Quote"]["05. price"])
        return price
    except Exception as e:
        print(f"Error fetching {symbol}: {e}")
        return -1

triggered_alerts = set()  # To store already-triggered alerts

def stock_price_fetcher():
    """Fetch stock prices for all monitored alerts periodically."""
    while True:
        for symbol in MONITORED_ALERTS.keys():
            price = fetch_stock_price(symbol)
            if price > 0:
                CURRENT_PRICES[symbol] = price
                print(f"Updated: {symbol} - ${price}")
        time.sleep(FETCH_INTERVAL)

def price_alert_monitor():
    """Check for price alerts and print notifications once."""
    while True:
        for symbol, alert_price in MONITORED_ALERTS.items():
            current_price = CURRENT_PRICES.get(symbol)
            if current_price and current_price >= alert_price:
                if (symbol, alert_price) not in triggered_alerts:
                    print(f"ALERT: {symbol} hit ${alert_price} (Current: ${current_price})")
                    triggered_alerts.add((symbol, alert_price))
        time.sleep(ALERT_CHECK_INTERVAL)

def start_background_tasks():
    fetcher_thread = threading.Thread(target=stock_price_fetcher, daemon=True)
    monitor_thread = threading.Thread(target=price_alert_monitor, daemon=True)
    fetcher_thread.start()
    monitor_thread.start()
