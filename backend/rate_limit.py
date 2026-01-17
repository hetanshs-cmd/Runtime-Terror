from flask import abort
from config import RATE_LIMIT, RATE_WINDOW
import time
from collections import defaultdict

# Simple in-memory rate limiting for development
rate_limits = defaultdict(list)

def rate_limit(user_id):
    """Simple in-memory rate limiting"""
    current_time = time.time()
    key = f"rate:{user_id}"

    # Clean up old entries
    rate_limits[key] = [t for t in rate_limits[key] if current_time - t < RATE_WINDOW]

    # Check if rate limit exceeded
    if len(rate_limits[key]) >= RATE_LIMIT:
        abort(429, "Rate limit exceeded")

    # Add current request
    rate_limits[key].append(current_time)
