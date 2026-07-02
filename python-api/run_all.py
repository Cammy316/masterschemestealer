"""
SchemeStealer Colour Engine Test Harness — RUNNER
=================================================

Runs all three modules and writes a single combined report you can bring back
for analysis. Fully automated — no hand-labelled data required.

  Module 1 (synthetic sweep)        -> categorical bugs, missing families,
                                       classifier disagreement
  Module 2 (distortion robustness)  -> survival under real phone-photo conditions
                                       (white balance, exposure, noise, JPEG)
  Module 3 (clustering/sampling)     -> small high-chroma trim blending
                                       (the bronze-nose class of bug)

USAGE
-----
1. Put this folder anywhere; set the engine location if it isn't ../python-api:
       export SS_ENGINE_ROOT=/path/to/masterschemestealer/python-api   (mac/linux)
       set SS_ENGINE_ROOT=C:\\...\\python-api                            (windows)
2. Install deps:  pip install numpy scikit-image pillow scipy
3. Run:           python run_all.py
4. Bring back:    harness_report.json   (and paste the console summary)

The combined harness_report.json is the file to hand to Claude for analysis.
"""
import sys, os, json, subprocess, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
MODULES = [
    ("1_synthetic_sweep.py",        "report_1_sweep.json"),
    ("2_distortion_robustness.py",  "report_2_distortion.json"),
    ("3_clustering_sampling.py",    "report_3_clustering.json"),
]

def main():
    combined = {
        "harness_version": "1.0",
        "generated_at": datetime.datetime.now().isoformat(timespec="seconds"),
        "engine_root": os.environ.get("SS_ENGINE_ROOT", "../python-api"),
        "python": sys.version.split()[0],
        "modules": {},
    }
    print("="*64)
    print("SchemeStealer Colour Engine Test Harness")
    print("engine root:", combined["engine_root"])
    print("="*64)

    for script, out in MODULES:
        print(f"\n>>> running {script} ...")
        try:
            subprocess.run([sys.executable, os.path.join(HERE, script)],
                           cwd=HERE, check=False)
        except Exception as e:
            print(f"  failed to launch {script}: {e}")
        path = os.path.join(HERE, out)
        if os.path.exists(path):
            try:
                combined["modules"][script] = json.load(open(path))
            except Exception as e:
                combined["modules"][script] = {"error": f"could not read {out}: {e}"}
        else:
            combined["modules"][script] = {"error": f"{out} not produced"}

    # Top-line health summary for quick reading
    summary = {}
    m1 = combined["modules"].get("1_synthetic_sweep.py", {})
    if "hard_misses" in m1:
        summary["sweep_hard_miss_rate"] = m1.get("hard_miss_rate")
        summary["missing_families"] = m1.get("missing_families")
        summary["classifier_disagreements"] = m1.get("classifier_disagreements")
    m2 = combined["modules"].get("2_distortion_robustness.py", {})
    if "total_family_flips" in m2:
        summary["distortion_family_flips"] = m2.get("total_family_flips")
        summary["most_fragile_families"] = m2.get("flip_by_base_family")
    m3 = combined["modules"].get("3_clustering_sampling.py", {})
    if "overall_recovery_rate" in m3:
        summary["region_recovery_rate"] = m3.get("overall_recovery_rate")
        summary["small_region_recovery"] = m3.get("small_region_recovery")
    combined["summary"] = summary

    out_path = os.path.join(HERE, "harness_report.json")
    json.dump(combined, open(out_path, "w"), indent=2)

    print("\n" + "="*64)
    print("COMBINED SUMMARY")
    print("="*64)
    for k, v in summary.items():
        print(f"  {k}: {v}")
    if not summary:
        print("  (no module produced a summary — check import errors in")
        print("   harness_report.json; most likely SS_ENGINE_ROOT is wrong or")
        print("   the engine imports from core/core/ — see README)")
    print(f"\n-> {out_path}")
    print("   Bring harness_report.json back to Claude for analysis.")

if __name__ == "__main__":
    main()
