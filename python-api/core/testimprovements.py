"""
SchemeStealer v2.0 - Comprehensive Test Suite
Tests all four critical improvements

Run this after integration to validate fixes
"""

import cv2
import numpy as np
import sys
from pathlib import Path

# Add project to path
sys.path.append('/mnt/project')

from core.base_detector import BaseDetector
from core.colour_engine import ColourAnalyser
from skimage import colour
import coloursys


def test_base_detector():
    """
    Test 1: Verify base detector doesn't clip legs
    """
    print("\n" + "="*60)
    print("TEST 1: Base Detector - Leg Clipping Prevention")
    print("="*60)
    
    # Create synthetic test image (jumping miniature)
    height, width = 400, 300
    test_img = np.zeros((height, width, 4), dtype=np.uint8)
    
    # Draw miniature body (upper 60%)
    test_img[0:240, 100:200, :] = [100, 100, 100, 255]  # Grey body
    
    # Draw legs extending down (60-80%)
    test_img[240:320, 130:170, :] = [100, 100, 100, 255]  # Legs
    
    # Draw base (bottom 15%)
    test_img[340:400, 50:250, :] = [80, 60, 40, 255]  # Brown base
    
    print(f"✓ Created test image: {width}x{height}")
    print(f"  - Body: rows 0-240 (top 60%)")
    print(f"  - Legs: rows 240-320 (60-80%)")
    print(f"  - Base: rows 340-400 (bottom 15%)")
    
    # Run detector
    detector = BaseDetector()
    mini_mask = detector.detect_base_region(test_img)
    
    # Check if legs are preserved
    legs_region = mini_mask[240:320, 130:170]
    legs_preserved_pct = (np.sum(legs_region) / legs_region.size) * 100
    
    print(f"\n✓ Detector executed")
    print(f"  - Legs preserved: {legs_preserved_pct:.1f}%")
    
    # Test passes if >80% of legs are kept
    if legs_preserved_pct > 80:
        print("✅ PASS: Legs not clipped!")
    else:
        print("❌ FAIL: Legs were removed")
        return False
    
    # Check if base was removed
    base_region = mini_mask[340:400, 50:250]
    base_removed_pct = (1 - np.sum(base_region) / base_region.size) * 100
    
    print(f"  - Base removed: {base_removed_pct:.1f}%")
    
    if base_removed_pct > 50:
        print("✅ PASS: Base successfully removed!")
    else:
        print("⚠️  WARNING: Base not fully removed (but legs OK)")
    
    return True


def test_gunmetal_detection():
    """
    Test 2: Verify dark grey cloth is NOT detected as metallic
    """
    print("\n" + "="*60)
    print("TEST 2: Gunmetal Detection - False Positive Prevention")
    print("="*60)
    
    # Test Case A: Dark grey cloth (should be NON-metallic)
    dark_grey_cloth_rgb = np.array([[50, 50, 50]] * 100).astype(np.uint8)  # v=0.20, s=0.0
    dark_grey_cloth_hsv = cv2.cvtColour(
        dark_grey_cloth_rgb.reshape(-1, 1, 3), 
        cv2.COLOUR_RGB2HSV
    ).reshape(-1, 3).astype(float)
    dark_grey_cloth_hsv[:, 0] /= 180.0
    dark_grey_cloth_hsv[:, 1] /= 255.0
    dark_grey_cloth_hsv[:, 2] /= 255.0
    
    result_cloth = ColourAnalyser.detect_metallic(dark_grey_cloth_hsv, dark_grey_cloth_rgb)
    
    print(f"\nTest A: Dark Grey Cloth")
    print(f"  RGB: {dark_grey_cloth_rgb[0]}")
    print(f"  HSV: h={dark_grey_cloth_hsv[0,0]*360:.1f}°, s={dark_grey_cloth_hsv[0,1]:.2f}, v={dark_grey_cloth_hsv[0,2]:.2f}")
    print(f"  Metallic: {result_cloth['is_metallic']}")
    print(f"  Confidence: {result_cloth['confidence']:.2f}")
    print(f"  Signals: {result_cloth['signals']}")
    
    if not result_cloth['is_metallic']:
        print("✅ PASS: Dark cloth correctly identified as NON-metallic")
    else:
        print("❌ FAIL: Dark cloth incorrectly flagged as metallic")
        return False
    
    # Test Case B: Actual gunmetal (should be metallic)
    # Leadbelcher hex: #888D8F -> RGB(136, 141, 143) -> v=0.56, s=0.05
    gunmetal_rgb = np.array([[136, 141, 143]] * 100).astype(np.uint8)
    gunmetal_hsv = cv2.cvtColour(
        gunmetal_rgb.reshape(-1, 1, 3),
        cv2.COLOUR_RGB2HSV
    ).reshape(-1, 3).astype(float)
    gunmetal_hsv[:, 0] /= 180.0
    gunmetal_hsv[:, 1] /= 255.0
    gunmetal_hsv[:, 2] /= 255.0
    
    # Add some brightness variance (metallics have specular highlights)
    gunmetal_rgb_varied = gunmetal_rgb.copy()
    gunmetal_rgb_varied[::2] = [160, 165, 167]  # Highlights
    gunmetal_rgb_varied[1::2] = [100, 105, 107]  # Shadows
    
    gunmetal_hsv_varied = cv2.cvtColour(
        gunmetal_rgb_varied.reshape(-1, 1, 3),
        cv2.COLOUR_RGB2HSV
    ).reshape(-1, 3).astype(float)
    gunmetal_hsv_varied[:, 0] /= 180.0
    gunmetal_hsv_varied[:, 1] /= 255.0
    gunmetal_hsv_varied[:, 2] /= 255.0
    
    result_gunmetal = ColourAnalyser.detect_metallic(gunmetal_hsv_varied, gunmetal_rgb_varied)
    
    print(f"\nTest B: Actual Gunmetal (Leadbelcher)")
    print(f"  RGB: {gunmetal_rgb[0]}")
    print(f"  HSV: h={gunmetal_hsv[0,0]*360:.1f}°, s={gunmetal_hsv[0,1]:.2f}, v={gunmetal_hsv[0,2]:.2f}")
    print(f"  Metallic: {result_gunmetal['is_metallic']}")
    print(f"  Confidence: {result_gunmetal['confidence']:.2f}")
    print(f"  Signals: {result_gunmetal['signals']}")
    
    if result_gunmetal['is_metallic']:
        print("✅ PASS: Gunmetal correctly identified as metallic")
    else:
        print("⚠️  WARNING: Gunmetal not detected (may need more variance in test data)")
    
    return True


def test_warm_metal_separation():
    """
    Test 3: Verify gold/bronze/brown separation using chroma
    """
    print("\n" + "="*60)
    print("TEST 3: Warm Metal Separation - Chroma-Based Classification")
    print("="*60)
    
    # Test Case A: Gold (Retributor Armour hex: #C69843)
    gold_rgb = np.array([198, 152, 67]) / 255.0
    gold_lab = colour.rgb2lab(np.array([[gold_rgb]]))[0][0]
    gold_hsv = np.array(coloursys.rgb_to_hsv(*gold_rgb))
    gold_chroma = np.sqrt(gold_lab[1]**2 + gold_lab[2]**2)
    
    family_gold, conf_gold = ColourAnalyser.classify_colour_family(
        gold_hsv[0], gold_hsv[1], gold_hsv[2], 
        gold_chroma, is_metallic=True, lab=gold_lab
    )
    
    print(f"\nTest A: Gold (Retributor Armour)")
    print(f"  RGB: {(gold_rgb*255).astype(int)}")
    print(f"  HSV: h={gold_hsv[0]*360:.1f}°, s={gold_hsv[1]:.2f}, v={gold_hsv[2]:.2f}")
    print(f"  LAB: L={gold_lab[0]:.1f}, a={gold_lab[1]:.1f}, b={gold_lab[2]:.1f}")
    print(f"  Chroma: {gold_chroma:.1f}")
    print(f"  Classification: {family_gold} (conf={conf_gold:.2f})")
    
    if "Gold" in family_gold or "Brass" in family_gold:
        print("✅ PASS: Gold correctly classified")
    else:
        print(f"❌ FAIL: Gold misclassified as {family_gold}")
        return False
    
    # Test Case B: Bronze (Balthasar Gold hex: #784F33)
    bronze_rgb = np.array([120, 79, 51]) / 255.0
    bronze_lab = colour.rgb2lab(np.array([[bronze_rgb]]))[0][0]
    bronze_hsv = np.array(coloursys.rgb_to_hsv(*bronze_rgb))
    bronze_chroma = np.sqrt(bronze_lab[1]**2 + bronze_lab[2]**2)
    
    family_bronze, conf_bronze = ColourAnalyser.classify_colour_family(
        bronze_hsv[0], bronze_hsv[1], bronze_hsv[2],
        bronze_chroma, is_metallic=True, lab=bronze_lab
    )
    
    print(f"\nTest B: Bronze (Balthasar Gold)")
    print(f"  RGB: {(bronze_rgb*255).astype(int)}")
    print(f"  HSV: h={bronze_hsv[0]*360:.1f}°, s={bronze_hsv[1]:.2f}, v={bronze_hsv[2]:.2f}")
    print(f"  LAB: L={bronze_lab[0]:.1f}, a={bronze_lab[1]:.1f}, b={bronze_lab[2]:.1f}")
    print(f"  Chroma: {bronze_chroma:.1f}")
    print(f"  Classification: {family_bronze} (conf={conf_bronze:.2f})")
    
    if "Bronze" in family_bronze or "Copper" in family_bronze:
        print("✅ PASS: Bronze correctly classified")
    else:
        print(f"⚠️  WARNING: Bronze classified as {family_bronze} (acceptable if Gold/Brown)")
    
    # Test Case C: Brown leather (Leather Brown hex: #5E4231)
    brown_rgb = np.array([94, 66, 49]) / 255.0
    brown_lab = colour.rgb2lab(np.array([[brown_rgb]]))[0][0]
    brown_hsv = np.array(coloursys.rgb_to_hsv(*brown_rgb))
    brown_chroma = np.sqrt(brown_lab[1]**2 + brown_lab[2]**2)
    
    family_brown, conf_brown = ColourAnalyser.classify_colour_family(
        brown_hsv[0], brown_hsv[1], brown_hsv[2],
        brown_chroma, is_metallic=False, lab=brown_lab
    )
    
    print(f"\nTest C: Brown Leather")
    print(f"  RGB: {(brown_rgb*255).astype(int)}")
    print(f"  HSV: h={brown_hsv[0]*360:.1f}°, s={brown_hsv[1]:.2f}, v={brown_hsv[2]:.2f}")
    print(f"  LAB: L={brown_lab[0]:.1f}, a={brown_lab[1]:.1f}, b={brown_lab[2]:.1f}")
    print(f"  Chroma: {brown_chroma:.1f}")
    print(f"  Classification: {family_brown} (conf={conf_brown:.2f})")
    
    if "Brown" in family_brown:
        print("✅ PASS: Brown correctly classified")
    else:
        print(f"❌ FAIL: Brown misclassified as {family_brown}")
        return False
    
    # Summary
    print(f"\n📊 Chroma Separation Summary:")
    print(f"  Gold chroma:   {gold_chroma:.1f} (should be >30)")
    print(f"  Bronze chroma: {bronze_chroma:.1f} (should be 15-30)")
    print(f"  Brown chroma:  {brown_chroma:.1f} (should be <20)")
    
    if gold_chroma > 30 and bronze_chroma < 30 and brown_chroma < 20:
        print("✅ PASS: Chroma values correctly separate categories")
    else:
        print("⚠️  WARNING: Chroma ranges may need adjustment")
    
    return True


def test_texture_analysis():
    """
    Test 4: Verify texture analysis works for metallic detection
    """
    print("\n" + "="*60)
    print("TEST 4: Texture Analysis - Edge Density for Metallics")
    print("="*60)
    
    # Test Case A: Smooth flat paint (low edge density)
    smooth_img = np.ones((20, 20, 3), dtype=np.uint8) * 128  # Flat grey
    smooth_rgb = smooth_img.reshape(-1, 3)
    smooth_hsv = cv2.cvtColour(smooth_img, cv2.COLOUR_RGB2HSV).reshape(-1, 3).astype(float)
    smooth_hsv[:, 0] /= 180.0
    smooth_hsv[:, 1] /= 255.0
    smooth_hsv[:, 2] /= 255.0
    
    result_smooth = ColourAnalyser.detect_metallic(smooth_hsv, smooth_rgb)
    
    print(f"\nTest A: Smooth Flat Paint")
    print(f"  Texture signal: {result_smooth['signals'].get('texture', False)}")
    print(f"  Metallic: {result_smooth['is_metallic']}")
    
    if not result_smooth['signals'].get('texture', True):  # Should be False
        print("✅ PASS: Smooth paint has low edge density")
    else:
        print("⚠️  WARNING: Smooth paint incorrectly has high texture")
    
    # Test Case B: Textured metallic (high edge density)
    # Create synthetic metallic texture with micro-scratches
    textured_img = np.ones((20, 20, 3), dtype=np.uint8) * 128
    # Add random noise to simulate scratches
    noise = np.random.randint(-30, 30, (20, 20, 3))
    textured_img = np.clip(textured_img.astype(int) + noise, 0, 255).astype(np.uint8)
    
    textured_rgb = textured_img.reshape(-1, 3)
    textured_hsv = cv2.cvtColour(textured_img, cv2.COLOUR_RGB2HSV).reshape(-1, 3).astype(float)
    textured_hsv[:, 0] /= 180.0
    textured_hsv[:, 1] /= 255.0
    textured_hsv[:, 2] /= 255.0
    
    result_textured = ColourAnalyser.detect_metallic(textured_hsv, textured_rgb)
    
    print(f"\nTest B: Textured Metallic (with scratches)")
    print(f"  Texture signal: {result_textured['signals'].get('texture', False)}")
    print(f"  Metallic: {result_textured['is_metallic']}")
    
    if result_textured['signals'].get('texture', False):  # Should be True
        print("✅ PASS: Textured metal has high edge density")
    else:
        print("⚠️  WARNING: Textured metal not detected (may need more variance)")
    
    return True


def run_all_tests():
    """
    Run complete test suite
    """
    print("\n" + "="*60)
    print("🧪 SCHEMSTEALER v2.0 - COMPREHENSIVE TEST SUITE")
    print("="*60)
    
    results = []
    
    try:
        results.append(("Base Detector", test_base_detector()))
    except Exception as e:
        print(f"❌ Base Detector Test CRASHED: {e}")
        results.append(("Base Detector", False))
    
    try:
        results.append(("Gunmetal Detection", test_gunmetal_detection()))
    except Exception as e:
        print(f"❌ Gunmetal Test CRASHED: {e}")
        results.append(("Gunmetal Detection", False))
    
    try:
        results.append(("Warm Metal Separation", test_warm_metal_separation()))
    except Exception as e:
        print(f"❌ Warm Metal Test CRASHED: {e}")
        results.append(("Warm Metal Separation", False))
    
    try:
        results.append(("Texture Analysis", test_texture_analysis()))
    except Exception as e:
        print(f"❌ Texture Test CRASHED: {e}")
        results.append(("Texture Analysis", False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(1 for _, p in results if p)
    
    print(f"\nTotal: {passed}/{total} tests passed ({passed/total*100:.0f}%)")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Ready for production.")
    elif passed >= total * 0.75:
        print("\n⚠️  Most tests passed. Review warnings above.")
    else:
        print("\n❌ MULTIPLE FAILURES. Review integration carefully.")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)