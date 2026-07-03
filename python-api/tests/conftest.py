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
    cv2_mock.CV_64F = 6
    
    # Simple pass-throughs for image processing functions to avoid MagicMock vs int crashes
    import numpy as np
    cv2_mock.cvtColor = lambda img, code: (
        img[:,:,0] if code == cv2_mock.COLOR_RGB2GRAY else 
        (np.stack([img]*3, axis=-1) if code == cv2_mock.COLOR_GRAY2RGB else img)
    )
    
    class DummyLaplacian:
        def var(self):
            return 500.0 # High variance = not blurry
    cv2_mock.Laplacian = lambda img, ddepth: DummyLaplacian()
    cv2_mock.split = lambda img: (img[:,:,0], img[:,:,1], img[:,:,2]) if img.ndim == 3 else (img, img, img)
    cv2_mock.merge = lambda channels: np.stack(channels, axis=-1)
    cv2_mock.LUT = lambda img, table: img
    
    class DummyCLAHE:
        def apply(self, img): return img
    cv2_mock.createCLAHE = lambda clipLimit, tileGridSize: DummyCLAHE()
    
    cv2_mock.findNonZero = lambda img: np.array([[0,0], [img.shape[1]-1, img.shape[0]-1]])
    cv2_mock.boundingRect = lambda coords: (0, 0, 300, 300)
    cv2_mock.resize = lambda img, dim, **kwargs: img
    cv2_mock.inRange = lambda img, lower, upper: np.zeros(img.shape[:2], dtype=np.uint8)
    cv2_mock.getStructuringElement = lambda shape, ksize: np.ones(ksize, dtype=np.uint8)
    cv2_mock.morphologyEx = lambda src, op, kernel: src
    cv2_mock.dilate = lambda src, kernel, **kwargs: src
    cv2_mock.GaussianBlur = lambda img, ksize, sigmaX: img
    cv2_mock.distanceTransform = lambda src, distanceType, maskSize: np.ones(src.shape, dtype=np.float32)
    cv2_mock.minMaxLoc = lambda src, mask=None: (0.0, 1.0, (0,0), (0,0))
    cv2_mock.connectedComponentsWithStats = lambda img, connectivity=8: (1, np.zeros(img.shape, dtype=np.int32), np.array([[0, 0, img.shape[1] if len(img.shape)>1 else 1, img.shape[0] if len(img.shape)>0 else 1, 1]]), np.array([[0, 0]]))
    cv2_mock.findContours = lambda img, mode, method: ([np.array([[[0, 0]], [[img.shape[1]-1, 0]], [[img.shape[1]-1, img.shape[0]-1]], [[0, img.shape[0]-1]]])], None)
    cv2_mock.contourArea = lambda contour, oriented=False: 100.0
    cv2_mock.drawContours = lambda image, contours, contourIdx, color, thickness=1, lineType=8, hierarchy=None, maxLevel=None, offset=None: image
    
    sys.modules['cv2'] = cv2_mock
