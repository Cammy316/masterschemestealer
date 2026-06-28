import pytest
import math
import sys
import os

# Add python-api to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from core.recipe_geometry import is_warm
from core.schemestealer_engine import SchemeStealerEngine
from core.color_engine import classify_family

class MockPaint:
    def __init__(self, lab=None):
        self.lab = lab

def test_hue_boundary_epsilon():
    """Test that boundary values (120 and 340 degrees) are caught by the epsilon tolerance."""
    a = -1.0
    b = math.sqrt(3)
    h = math.degrees(math.atan2(b, a))
    
    # With epsilon, this should evaluate to True (warm)
    assert is_warm(h) is True, f"Failed at 120 degree boundary. h={h}"

    a2 = math.cos(math.radians(340))
    b2 = math.sin(math.radians(340))
    h2 = math.degrees(math.atan2(b2, a2)) % 360.0
    
    assert is_warm(h2) is True, f"Failed at 340 degree boundary. h={h2}"

def test_monotonicity_guard():
    """Test that missing LAB data immediately fails the monotonicity guard."""
    base_lab = (50.0, 10.0, 10.0)
    broken_paint = MockPaint(None)
    
    # It must return False to prevent the broken paint from being selected
    assert SchemeStealerEngine._monotonic_ok('highlight', base_lab, broken_paint) is False
    assert SchemeStealerEngine._monotonic_ok('shade', base_lab, broken_paint) is False

def test_ciede2000_classification():
    """Test that the updated CIEDE2000 classifier correctly identifies tricky colors."""
    # A dark, desaturated color that Euclidean distance might mistakenly snap to 'black'
    # Dark blue-grey (L=25, a=-2, b=-10)
    dark_blue_grey = [25.0, -2.0, -10.0]
    
    family = classify_family(dark_blue_grey, is_metallic=False)
    
    # With CIEDE2000, it should be accurately classified (likely grey, blue, or purple, but NOT black)
    # The threshold for black is L < 15 usually.
    assert family != 'black', "Color was incorrectly snapped to black!"
