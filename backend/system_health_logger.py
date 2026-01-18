import json
import os
import time
import tempfile
import shutil

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

    # Ensure log file exists
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

    # Use atomic write with temporary file to prevent corruption
    try:
        # Read existing data
        with open(LOG_FILE, "r") as f:
            data = json.load(f)

        # Append new entry and keep only last 5000 entries
        data.append(entry)
        data = data[-5000:]

        # Write to temporary file first
        temp_fd, temp_path = tempfile.mkstemp(dir=os.path.dirname(LOG_FILE))
        try:
            with os.fdopen(temp_fd, 'w') as temp_file:
                json.dump(data, temp_file)
            # Atomic move
            shutil.move(temp_path, LOG_FILE)
        except Exception:
            # Clean up temp file if something goes wrong
            os.unlink(temp_path)
            raise
    except Exception as e:
        # If anything fails, don't crash the application
        # Just skip logging this entry
        print(f"Warning: Failed to log system metrics: {e}")
        pass
