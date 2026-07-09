import json
import os
import sys
from datetime import date, timedelta
import pytest

# Ensure we can import scripts
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scripts.build_daily_puzzles import generate_puzzles, is_eligible

@pytest.fixture
def run_generator(tmp_path):
    # Temporarily override the output path for generation test to avoid mutating the committed one
    import scripts.build_daily_puzzles
    original_out = scripts.build_daily_puzzles.__dict__.get("out_path")
    
    # We will just run it and read the output from the known location
    # But wait, generate_puzzles() writes to a fixed path. 
    # Let's mock the path during the test.
    
    def mock_run(out_path):
        import unittest.mock
        with unittest.mock.patch('scripts.build_daily_puzzles.os.path.abspath') as mock_abs:
            # We want to mock just the out_dir resolution
            def side_effect(path, *args, **kwargs):
                if 'schemestealer-react' in path:
                    return str(tmp_path)
                return os.path.abspath(path)
            mock_abs.side_effect = side_effect
            generate_puzzles()
            return os.path.join(str(tmp_path), "daily_puzzles.json")
    
    return mock_run

def test_daily_puzzles_determinism(run_generator):
    out1 = run_generator("out1")
    with open(out1, 'r', encoding='utf-8') as f:
        data1 = json.load(f)
        
    out2 = run_generator("out2")
    with open(out2, 'r', encoding='utf-8') as f:
        data2 = json.load(f)
        
    assert data1 == data2, "Generator should be deterministic"

def test_daily_puzzles_rules(run_generator):
    out = run_generator("out")
    with open(out, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Read paints_groundtruth for eligibility check
    db_path = os.path.join(os.path.dirname(__file__), '..', 'paints_groundtruth.json')
    with open(db_path, 'r', encoding='utf-8') as f:
        paints = {p['paint_id']: p for p in json.load(f)}
        
    days = data['days']
    
    # Sort dates
    sorted_dates = sorted(days.keys())
    
    # (b) No repeats in any 60 day window
    for i in range(len(sorted_dates)):
        window = [days[d]['answer'] for d in sorted_dates[i:i+60]]
        assert len(window) == len(set(window)), f"Found duplicate answers in a 60-day window starting at {sorted_dates[i]}"
        
    # (c) Every answer passes eligibility
    for d, puzzle in days.items():
        ans = puzzle['answer']
        assert ans in paints, f"Answer {ans} not in DB"
        assert is_eligible(paints[ans]), f"Answer {ans} fails eligibility check"

def test_daily_puzzles_coverage_guard():
    """
    (d) coverage guard: the committed JSON must extend ≥ 180 days beyond today.
    This test is the expiry alarm — do not weaken it.
    """
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'schemestealer-react', 'lib', 'data'))
    out_path = os.path.join(out_dir, "daily_puzzles.json")
    
    assert os.path.exists(out_path), f"Committed JSON missing at {out_path}"
    
    with open(out_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    target_date = date.today() + timedelta(days=180)
    target_iso = target_date.isoformat()
    
    days = data.get('days', {})
    sorted_dates = sorted(days.keys())
    
    # Find max date
    if not sorted_dates:
        pytest.fail("No dates in daily_puzzles.json")
        
    max_date = sorted_dates[-1]
    assert max_date >= target_iso, f"Coverage guard: JSON only goes up to {max_date}, need {target_iso} (≥ 180 days)"
