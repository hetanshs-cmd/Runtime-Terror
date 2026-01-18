# system_health_ai.py

import json
import os
import time
import statistics
import math

LOG_FILE = "logs/system_metrics.json"
START_TIME_FILE = "logs/server_start_time.txt"

# ==========================
# SERVER UPTIME
# ==========================
def get_server_uptime():
    if not os.path.exists(START_TIME_FILE):
        return 0

    with open(START_TIME_FILE, "r") as f:
        start_time = float(f.read().strip())

    return int(time.time() - start_time)


# ==========================
# LOAD METRICS (DECAY-AWARE)
# ==========================
def load_metrics(max_window_seconds=600):
    """
    Load last 10 minutes of metrics.
    Older data is considered irrelevant.
    """
    if not os.path.exists(LOG_FILE):
        return []

    try:
        now = time.time()
        with open(LOG_FILE, "r") as f:
            data = json.load(f)

        return [
            d for d in data
            if now - d["timestamp"] <= max_window_seconds
        ]
    except (json.JSONDecodeError, IOError, KeyError) as e:
        # If file is corrupted, return empty list and log warning
        print(f"Warning: Failed to load system metrics: {e}. Using empty metrics.")
        # Try to recreate the file
        try:
            with open(LOG_FILE, "w") as f:
                json.dump([], f)
        except Exception:
            pass  # If we can't even recreate, just continue
        return []


# ==========================
# WEIGHT CALCULATION (TIME DECAY)
# ==========================
def time_weight(timestamp, now):
    """
    Exponential decay:
    - Very recent data ≈ 1.0
    - 10 min old data ≈ near 0
    """
    age = now - timestamp
    return math.exp(-age / 300)  # 5 min half-life


# ==========================
# AI HEALTH ENGINE
# ==========================
def compute_health_score():
    now = time.time()
    data = load_metrics()
    uptime_seconds = get_server_uptime()

    if len(data) < 10:
        return {
            "health_score": 100,
            "status": "WARMING_UP",
            "uptime_seconds": uptime_seconds,
            "metrics": {}
        }

    # ==========================
    # WEIGHTED METRICS
    # ==========================
    weighted_latencies = []
    weighted_errors = []
    total_weight = 0

    for d in data:
        w = time_weight(d["timestamp"], now)
        weighted_latencies.append(d["latency_ms"] * w)
        weighted_errors.append((1 if d["error"] else 0) * w)
        total_weight += w

    avg_latency = sum(weighted_latencies) / max(total_weight, 1)
    error_rate = (sum(weighted_errors) / max(total_weight, 1)) * 100

    # RPM (true, but scaled for production)
    rpm = (len(data) / 10) * 60  # last 10 min

    # ==========================
    # SMART SCORING COMPONENTS
    # ==========================

    # Latency: helps recovery when low
    latency_penalty = min(35, math.log(avg_latency + 1) * 8)
    latency_score = max(0, 100 - latency_penalty)

    # RPM: low RPM should NOT hurt health
    if rpm < 50:
        rpm_score = 100  # idle but healthy
    else:
        rpm_score = min(100, (rpm / 1500) * 100)

    # Error rate: strong penalty only if persistent
    error_penalty = min(100, error_rate * 6)
    error_score = max(0, 100 - error_penalty)

    # ==========================
    # RECOVERY BOOST LOGIC (KEY PART)
    # ==========================
    recovery_boost = 0

    if rpm < 30 and error_rate < 1 and avg_latency < 300:
        # system is idle + healthy → recover fast
        recovery_boost = 10

    # ==========================
    # FINAL HEALTH SCORE
    # ==========================
    health_score = round(
        (latency_score * 0.45) +
        (rpm_score * 0.25) +
        (error_score * 0.30) +
        recovery_boost,
        2
    )

    health_score = min(100, health_score)

    if health_score >= 88:
        status = "HEALTHY"
    elif health_score >= 70:
        status = "STABLE"
    elif health_score >= 45:
        status = "DEGRADED"
    else:
        status = "CRITICAL"

    return {
        "health_score": health_score,
        "status": status,
        "uptime_seconds": uptime_seconds,
        "metrics": {
            "avg_latency_ms": round(avg_latency, 2),
            "requests_per_min": round(rpm, 2),
            "error_rate_percent": round(error_rate, 2),
            "recovery_boost": recovery_boost
        }
    }
