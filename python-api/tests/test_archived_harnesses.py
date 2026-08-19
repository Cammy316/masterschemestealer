"""
DEC-10 — the three void harnesses are archived and must stay un-wired.

WHY THEY WENT.

  `1_synthetic_sweep.py`   grades the LAB classifier against a superseded HSV
                           hue-band oracle — the design core invariant 1 and
                           ledger D1 forbid. Its "9.4% hard miss rate" is a
                           disagreement rate with a deleted design, not a defect
                           rate, and most of the disagreements are the current
                           classifier being right. "Fixing" it means making the
                           classifier agree with the forbidden design through the
                           anchor build, which is the trap. (O-G10)
  `2_distortion_robustness.py`  has zero assertions and always exits 0. It never
                           calls the real corrector, and its distortion model
                           cannot reach the <=3000 K it is nominally about.
                           Ledger D4 named this as its gate; that gate was void.
                           (O-B6)
  `3_clustering_sampling.py`   is compared against `baseline_harness.json`, whose
                           recorded `region_recovery_rate = 1.0` scores a blend
                           matching NEITHER planted colour, while today's 0.96
                           scores a real one. The metric penalises D6 and D7 by
                           construction. (O-G9)

Archived rather than deleted: their numbers are still quoted in older documents,
and a reader who finds the 9.4% needs to be able to reach an explanation. A
deleted file teaches nothing. `python-api/archive/README.md` is that explanation.

This file is the gate. The risk is not that someone runs them — it is that
something quietly imports one, or that the runner gets re-wired, and a number
that cannot fail starts reading as coverage again.
"""

import sys
from pathlib import Path

_PY_API = Path(__file__).resolve().parent.parent
_REPO = _PY_API.parent
sys.path.insert(0, str(_PY_API))

ARCHIVED = (
    "1_synthetic_sweep",
    "2_distortion_robustness",
    "3_clustering_sampling",
    "run_all",
)


def test_the_harnesses_are_in_the_archive_and_not_on_the_import_path():
    """They must not sit beside `core/` and `benchmarks/` where an import would
    find them.

    FAILS IF: one is moved back to `python-api/`. Their module names are not
    importable identifiers anyway (a leading digit), but `run_all` is — and
    `run_all` is the one that made the other three look like a suite.
    """
    archive = _PY_API / "archive"
    assert archive.is_dir(), "python-api/archive/ is missing"
    assert (archive / "README.md").exists(), (
        "the archive lost its README — without it the 9.4% has no explanation "
        "attached and someone will 'fix' the sweep"
    )

    for name in ARCHIVED:
        assert (archive / f"{name}.py").exists(), f"{name}.py left the archive"
        assert not (_PY_API / f"{name}.py").exists(), (
            f"{name}.py is back in python-api/ — it cannot gate anything and "
            "must not sit where the engine's own modules live"
        )


def test_nothing_in_the_live_tree_imports_or_runs_them():
    """No live module, script or workflow may import or execute one of them.

    Deliberately NOT "the name does not appear". Three live files mention these
    harnesses precisely to warn people off — `benchmarks/run.py` and
    `benchmarks/__init__.py` both say the scoreboard does not use
    `1_synthetic_sweep.py` and its 9.4% must not be quoted, and
    `run_all_tests.ps1` records where `run_all.py` went. Those references are the
    point; banning the string would delete the warnings. What must not come back
    is a WIRING.

    FAILS IF: something imports one, or shells out to one — which is exactly how
    `run_all_tests.ps1 -Harness` kept three dead gates alive long after the audit
    had refuted all three.
    """
    def live(pattern):
        for path in _REPO.rglob(pattern):
            if set(path.parts) & {"venv", "node_modules", "__pycache__", ".next",
                                  "archive", "test-results", "playwright-report"}:
                continue
            yield path

    offenders = []

    # Python: parsed, not grepped. A docstring warning ("do not quote the 9.4%")
    # is not an import, and only the AST can tell those apart reliably —
    # `benchmarks/run.py` and `benchmarks/__init__.py` both name the sweep inside
    # string literals for exactly that reason.
    import ast
    py_files = [p for p in live("*.py") if p.name != Path(__file__).name]
    assert py_files, "the Python walk found nothing — the search is broken"
    for path in py_files:
        try:
            tree = ast.parse(path.read_text(encoding="utf-8", errors="replace"))
        except SyntaxError:
            continue
        for node in ast.walk(tree):
            names = []
            if isinstance(node, ast.Import):
                names = [a.name.split(".")[0] for a in node.names]
            elif isinstance(node, ast.ImportFrom) and node.module:
                names = [node.module.split(".")[0]]
            for n in names:
                if n in ARCHIVED:
                    offenders.append(
                        f"{path.relative_to(_REPO)}:{node.lineno} imports {n}")

    # Shell and workflow files: the only other place a wiring can hide. Comment
    # lines carry the explanation of where the harnesses went and are skipped.
    import re
    shell_files = [p for pat in ("*.ps1", "*.yml", "*.yaml", "*.sh")
                   for p in live(pat)]
    assert shell_files, "the shell walk found nothing — the search is broken"
    for path in shell_files:
        for lineno, line in enumerate(
                path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
            if line.lstrip().startswith("#"):
                continue
            for name in ARCHIVED:
                if re.search(rf"\b{re.escape(name)}\.py\b", line):
                    offenders.append(
                        f"{path.relative_to(_REPO)}:{lineno} invokes {name}.py")

    assert not offenders, (
        "live files are wired to an archived harness again:\n  "
        + "\n  ".join(offenders)
    )


def test_the_runner_no_longer_offers_a_harness_switch():
    """`run_all_tests.ps1 -Harness` was `run_all.py`'s only caller.

    FAILS IF: the switch comes back. Reinstating it would restore a "gate" whose
    three modules exit 0 regardless of the engine's state.
    """
    ps1 = _REPO / "run_all_tests.ps1"
    if not ps1.exists():
        import pytest
        pytest.skip("run_all_tests.ps1 not present")

    text = ps1.read_text(encoding="utf-8", errors="replace")
    assert "[switch]$Harness" not in text, (
        "the -Harness switch is back; it runs three harnesses that cannot fail"
    )
    # The explanation must travel with the removal, or the next reader
    # reinstates it as a regression.
    assert "archive" in text.lower(), (
        "run_all_tests.ps1 no longer says where the harnesses went"
    )
