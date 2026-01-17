import json
import heapq
from threading import Lock

# Simple in-memory priority queue for development
admission_queue = []
queue_lock = Lock()
QUEUE_KEY = "admission_queue"

def admit(task, priority=1):
    """Add task to priority queue"""
    with queue_lock:
        # Use negative priority for min-heap behavior (higher priority = lower number)
        heapq.heappush(admission_queue, (-priority, json.dumps(task)))
