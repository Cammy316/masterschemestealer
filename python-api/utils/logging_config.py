"""
Logging configuration for SchemeStealer
"""

import logging
import logging.handlers
from pathlib import Path
from config import Logging

def setup_logging():
    """Configure application logging"""
    
    # Create logs directory
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Create logger
    logger = logging.getLogger("SchemeStealer")
    logger.setLevel(getattr(logging, Logging.LEVEL))
    
    # Console handler (for development)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_formatter = logging.Formatter('%(levelname)s - %(message)s')
    console_handler.setFormatter(console_formatter)
    
    # File handler (for production)
    file_handler = logging.handlers.RotatingFileHandler(
        log_dir / Logging.LOG_FILE,
        maxBytes=Logging.MAX_BYTES,
        backupCount=Logging.BACKUP_COUNT
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(Logging.FORMAT)
    file_handler.setFormatter(file_formatter)
    
    # Add handlers
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger

# Global logger instance
logger = setup_logging()