# run_all_tests.ps1 — the comprehensive SchemeStealer test suite.
#
# Re-run after ANY large change:
#
#   .\run_all_tests.ps1            backend (pytest) + frontend (vitest)
#
# Backend needs USE_REAL_CV2=1 (the e2e pipeline and engine-colorimetry tests
# use real OpenCV; conftest.py stubs cv2 otherwise).
#
# The -Harness switch is gone (DEC-10). It ran python-api/run_all.py, whose three
# modules are now in python-api/archive/ because none of them can gate anything:
# one grades the classifier against a superseded HSV oracle, one has no
# assertions and always exits 0, and one is compared against a baseline that
# scores the wrong answer. See python-api/archive/README.md. The colour gate is
# `python -m benchmarks.run` from python-api/.

$root = $PSScriptRoot
$failures = @()

Write-Host "=== Backend: pytest (python-api/tests) ===" -ForegroundColor Cyan
$env:USE_REAL_CV2 = "1"
Push-Location (Join-Path $root "python-api")
& ".\venv\Scripts\python.exe" -m pytest tests
if ($LASTEXITCODE -ne 0) { $failures += "backend pytest" }
Pop-Location

Write-Host "=== Frontend: vitest (schemestealer-react) ===" -ForegroundColor Cyan
Push-Location (Join-Path $root "schemestealer-react")
npm test
if ($LASTEXITCODE -ne 0) { $failures += "frontend vitest" }
Pop-Location

Write-Host ""
if ($failures.Count -gt 0) {
    Write-Host "FAILED: $($failures -join ', ')" -ForegroundColor Red
    exit 1
} else {
    Write-Host "ALL SUITES GREEN" -ForegroundColor Green
    exit 0
}
