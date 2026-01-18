import json
import os
import time

LOG_FILE = "logs/system_metrics.json"
START_TIME_FILE = "logs/server_start_time.txt"

os.makedirs("logs", exist_ok=True)

if not os.path.exists(START_TIME_FILE):
    with open(START_TIME_FILE, "w") as f:
        f.write(str(time.time()))


def log_request_metrics(latency_ms, status_code):
    entry = {
        "timestamp": time.time(),
        "latency_ms": latency_ms,
        "error": status_code >= 500
    }

    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

    with open(LOG_FILE, "r+") as f:
        data = json.load(f)
        data.append(entry)
        data = data[-5000:]  # larger rolling window

        f.seek(0)
        json.dump(data, f)
        f.truncate()
