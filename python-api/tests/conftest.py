"""
Test configuration — stubs heavy native dependencies so unit tests
for pure-Python/numpy code can run without a full production install.
"""
import sys
from unittest.mock import MagicMock

import os

# Stub cv2 so helpers.py and color_engine.py can be imported without OpenCV.
if 'cv2' not in sys.modules and not os.environ.get('USE_REAL_CV2'):
    cv2_mock = MagicMock()
    cv2_mock.COLOR_RGB2LAB = 44
    cv2_mock.COLOR_LAB2RGB = 46
    cv2_mock.COLOR_RGB2HSV = 40
    cv2_mock.COLOR_RGB2GRAY = 7
    cv2_mock.COLOR_GRAY2RGB = 8
    cv2_mock.COLOR_RGBA2BGR = 26
    cv2_mock.COLOR_RGB2BGR = 4
    cv2_mock.DIST_L2 = 2
    cv2_mock.IMWRITE_JPEG_QUALITY = 1
    sys.modules['cv2'] = cv2_mock
