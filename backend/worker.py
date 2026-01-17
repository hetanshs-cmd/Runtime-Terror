import json
import time
from redis_client import redis_client
from worker_pool import process

QUEUE_KEY = "admission_queue"

print("Worker started...")

while True:
    task = redis_client.zpopmin(QUEUE_KEY)
    if task:
        data = json.loads(task[0][0])
        result = process(data)
        print("Processed:", result)
    else:
        time.sleep(1)
