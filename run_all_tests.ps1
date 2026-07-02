# run_all_tests.ps1 — the comprehensive SchemeStealer test suite.
#
# Re-run after ANY large change:
#
#   .\run_all_tests.ps1            backend (pytest) + frontend (vitest)
#   .\run_all_tests.ps1 -Harness   also run the colour-engine accuracy harness
#                                  (slower; compare against python-api/baseline_harness.json)
#
# Backend needs USE_REAL_CV2=1 (the e2e pipeline and engine-colorimetry tests
# use real OpenCV; conftest.py stubs cv2 otherwise).

param(
    [switch]$Harness
)

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

if ($Harness) {
    Write-Host "=== Harness: colour-engine accuracy (run_all.py) ===" -ForegroundColor Cyan
    Push-Location (Join-Path $root "python-api")
    $env:SS_ENGINE_ROOT = "."
    & ".\venv\Scripts\python.exe" run_all.py
    if ($LASTEXITCODE -ne 0) { $failures += "harness" }
    Pop-Location
    Write-Host "Compare harness_report.json against baseline_harness.json — accuracy must not regress."
}

Write-Host ""
if ($failures.Count -gt 0) {
    Write-Host "FAILED: $($failures -join ', ')" -ForegroundColor Red
    exit 1
} else {
    Write-Host "ALL SUITES GREEN" -ForegroundColor Green
    exit 0
}
