import requests
import pandas as pd
from datetime import datetime
import sys
sys.stdout.reconfigure(encoding='utf-8')


API_KEY = "c779218577b96d19807c12795fa60219"
UNITS = "metric"
COUNTRY = "IN"   # Change if needed

def get_weather_by_city(city, state=None):
    query = f"{city},{state},{COUNTRY}" if state else f"{city},{COUNTRY}"

    geo_url = (
        f"http://api.openweathermap.org/geo/1.0/direct?"
        f"q={query}&limit=1&appid={API_KEY}"
    )

    geo = requests.get(geo_url).json()
    if not geo:
        raise ValueError("City not found")

    lat, lon = geo[0]["lat"], geo[0]["lon"]

    weather_url = (
        f"https://api.openweathermap.org/data/2.5/weather?"
        f"lat={lat}&lon={lon}&units={UNITS}&appid={API_KEY}"
    )

    data = requests.get(weather_url).json()
    if "cod" in data and data["cod"] != 200:
        raise ValueError(f"Weather API error: {data.get('message', 'Unknown error')}")

    return {
        "city": city,
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "rain_1h": data.get("rain", {}).get("1h", 0),
        "timestamp": datetime.fromtimestamp(data["dt"])
    }


# ---- SIMPLE AI LOGIC (CAN BE REPLACED BY ML) ----
def pest_risk(weather):
    if weather["humidity"] > 70 and weather["temperature"] > 25:
        return "HIGH"
    elif weather["humidity"] > 60:
        return "MEDIUM"
    return "LOW"
