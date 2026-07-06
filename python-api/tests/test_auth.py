import os
from unittest import mock

import pytest
from fastapi import HTTPException

from utils.auth import require_admin_key


def test_require_admin_key_no_key_local():
    """Locally (RENDER not true), if key is not set, it should pass (fail open)."""
    with mock.patch.dict(os.environ, {"RENDER": "false"}, clear=True):
        assert require_admin_key(x_admin_key=None) is None


def test_require_admin_key_no_key_prod():
    """In production (RENDER=true), if no key is configured on server, it MUST fail closed."""
    with mock.patch.dict(os.environ, {"RENDER": "true"}, clear=True):
        with pytest.raises(HTTPException) as exc_info:
            require_admin_key(x_admin_key=None)
        assert exc_info.value.status_code == 403
        assert "Admin key not configured in production" in exc_info.value.detail


def test_require_admin_key_invalid_key():
    """If key is configured on server, an invalid client key must fail."""
    with mock.patch.dict(os.environ, {"ANALYTICS_ADMIN_KEY": "secret123"}):
        with pytest.raises(HTTPException) as exc_info:
            require_admin_key(x_admin_key="wrongkey")
        assert exc_info.value.status_code == 403
        assert "Forbidden" in exc_info.value.detail


def test_require_admin_key_valid_key():
    """If key is configured on server, a matching client key must pass."""
    with mock.patch.dict(os.environ, {"ANALYTICS_ADMIN_KEY": "secret123"}):
        assert require_admin_key(x_admin_key="secret123") is None
