# system_health_middleware.py

import time
from flask import request
from system_health_logger import log_request_metrics


def register_system_health_middleware(app):
    """
    Registers before_request and after_request hooks
    for passive system health monitoring.
    """

    @app.before_request
    def _system_health_start_timer():
        request._start_time = time.time()

    @app.after_request
    def _system_health_log_metrics(response):
        try:
            latency_ms = int((time.time() - request._start_time) * 1000)
            log_request_metrics(
                latency_ms=latency_ms,
                status_code=response.status_code
            )
        except Exception:
            # Never affect response lifecycle
            pass

        return response
