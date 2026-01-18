from flask import Blueprint, jsonify, request
from system_health_ai import compute_health_score
from models import get_user_by_token

system_health_bp = Blueprint(
    "system_health",
    __name__,
    url_prefix="/super-admin/system-health"
)

def require_auth():
    """Check if user is authenticated and has admin privileges"""
    access_token = request.cookies.get('access_token')
    if not access_token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            access_token = auth_header.split(' ')[1]

    if not access_token:
        return None

    user = get_user_by_token(access_token)
    if not user or user.role not in ['admin', 'super_admin']:
        return None

    return user

@system_health_bp.route("/status", methods=["GET"])
def system_health_status():
    user = require_auth()
    if not user:
        return jsonify({'error': 'Admin access required'}), 403

    return jsonify(compute_health_score())
