"""
Session State Management Utilities
Handles race conditions and safe state updates for Streamlit
"""

import streamlit as st
import threading
from contextlib import contextmanager

# Global lock for session updates
_session_lock = threading.Lock()

def safe_session_update(key, update_func, *args, **kwargs):
    """
    Thread-safe wrapper for updating session state.
    Prevents race conditions when users click buttons rapidly.
    
    Args:
        key: The session_state key to update (e.g., 'shopping_cart')
        update_func: Function to apply to the value at that key
        *args, **kwargs: Arguments passed to update_func
    """
    with _session_lock:
        if key in st.session_state:
            # Apply the update
            update_func(st.session_state[key], *args, **kwargs)

def get_state(key, default=None):
    """Safe getter for session state"""
    if key not in st.session_state:
        st.session_state[key] = default
    return st.session_state[key]

def init_state(key, default_value):
    """Initialize state if it doesn't exist"""
    if key not in st.session_state:
        st.session_state[key] = default_value