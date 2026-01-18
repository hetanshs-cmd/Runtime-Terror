#!/usr/bin/env python3
"""
Log cleanup utility for GovConnect
Cleans up old log files to prevent disk space issues
"""

import os
import time
import glob
import logging
from pathlib import Path

def cleanup_old_logs(log_dir=".", max_age_days=30, max_size_mb=100):
    """
    Clean up old log files
    - Remove files older than max_age_days
    - Remove files larger than max_size_mb if they're not the current log
    """
    log_dir = Path(log_dir)
    if not log_dir.exists():
        return

    current_time = time.time()
    max_age_seconds = max_age_days * 24 * 60 * 60
    max_size_bytes = max_size_mb * 1024 * 1024

    # Find all log files
    log_patterns = ["*.log", "*.log.*", "system_metrics.json*"]
    cleaned_files = 0
    freed_space = 0

    for pattern in log_patterns:
        for log_file in log_dir.glob(pattern):
            try:
                stat = log_file.stat()
                file_age = current_time - stat.st_mtime
                file_size = stat.st_size

                # Remove files older than max_age_days
                if file_age > max_age_seconds:
                    freed_space += file_size
                    log_file.unlink()
                    cleaned_files += 1
                    print(f"Removed old log file: {log_file.name} ({file_size} bytes, {file_age/86400:.1f} days old)")
                    continue

                # For very large files that are not current logs, truncate them
                if file_size > max_size_bytes and not log_file.name.endswith('.log'):
                    try:
                        # For JSON files, keep only recent entries
                        if log_file.name.endswith('.json'):
                            import json
                            with open(log_file, 'r') as f:
                                data = json.load(f)

                            # Keep only entries from last 7 days
                            week_ago = current_time - (7 * 24 * 60 * 60)
                            recent_data = [d for d in data if d.get('timestamp', 0) > week_ago]

                            if len(recent_data) < len(data):
                                with open(log_file, 'w') as f:
                                    json.dump(recent_data, f)
                                new_size = log_file.stat().st_size
                                freed_space += (file_size - new_size)
                                print(f"Truncated large JSON file: {log_file.name} ({file_size} -> {new_size} bytes)")
                    except Exception as e:
                        print(f"Error processing {log_file.name}: {e}")

            except Exception as e:
                print(f"Error processing {log_file}: {e}")

    if cleaned_files > 0 or freed_space > 0:
        print(f"Log cleanup complete: {cleaned_files} files removed, {freed_space} bytes freed")
    else:
        print("No old log files to clean up")

if __name__ == "__main__":
    # Run cleanup in the logs directory
    cleanup_old_logs("logs")