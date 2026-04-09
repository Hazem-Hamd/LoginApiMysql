
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host " SANCTUARY API - FULL TEST SUITE" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$base   = "http://localhost:3000/api"
$global:pass  = 0
$global:fail  = 0
$global:token = $null

function Invoke-Test {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Body,
        [int]$ExpectedStatus,
        [string]$ReturnKey
    )
    $headers = @{ "Content-Type" = "application/json" }
    if ($global:token) { $headers["Authorization"] = "Bearer $global:token" }
    try {
        $invokeParams = @{ Method = $Method; Uri = $Url; Headers = $headers; ErrorAction = "Stop"; UseBasicParsing = $true }
        if ($Body) { $invokeParams["Body"] = ($Body | ConvertTo-Json) }
        $resp   = Invoke-WebRequest @invokeParams
        $status = [int]$resp.StatusCode
        $json   = $resp.Content | ConvertFrom-Json
        if ($status -eq $ExpectedStatus) {
            Write-Host "  [PASS] $Name (HTTP $status)" -ForegroundColor Green
            $global:pass++
            if ($ReturnKey) { return $json.$ReturnKey }
            return $json
        } else {
            Write-Host "  [FAIL] $Name -- Expected $ExpectedStatus, got $status" -ForegroundColor Red
            $global:fail++
        }
    } catch {
        $errStatus = [int]$_.Exception.Response.StatusCode
        $errBody   = $null
        try { $errBody = $_.ErrorDetails.Message | ConvertFrom-Json } catch {}
        if ($errStatus -eq $ExpectedStatus) {
            Write-Host "  [PASS] $Name (HTTP $errStatus -- expected error)" -ForegroundColor Green
            $global:pass++
            return $errBody
        }
        Write-Host "  [FAIL] $Name -- $($_.Exception.Message)" -ForegroundColor Red
        $global:fail++
    }
    return $null
}

# 1. Health Check
Write-Host "1. Health Check" -ForegroundColor Yellow
$health = Invoke-Test -Name "GET /api/health" -Method GET -Url "$base/health" -ExpectedStatus 200
if ($health) { Write-Host "     message: $($health.message)" -ForegroundColor DarkGray }

# 2. Sign Up
Write-Host ""
Write-Host "2. Sign Up" -ForegroundColor Yellow
$ts        = Get-Date -Format "HHmmss"
$testEmail = "testuser_$ts@sanctuary.test"

$tok = Invoke-Test -Name "POST /api/signup (valid new user)" -Method POST -Url "$base/signup" -Body @{ full_name = "Test User $ts"; email = $testEmail; password = "SecurePass123" } -ExpectedStatus 201 -ReturnKey "token"
if ($tok) { $global:token = $tok }

Invoke-Test -Name "POST /api/signup (duplicate email -> 409)" -Method POST -Url "$base/signup" -Body @{ full_name = "Dupe"; email = $testEmail; password = "AnotherPass123" } -ExpectedStatus 409 | Out-Null
Invoke-Test -Name "POST /api/signup (invalid inputs -> 422)"  -Method POST -Url "$base/signup" -Body @{ full_name = ""; email = "not-an-email"; password = "short" } -ExpectedStatus 422 | Out-Null

# 3. Login
Write-Host ""
Write-Host "3. Login" -ForegroundColor Yellow

$loginTok = Invoke-Test -Name "POST /api/login (valid credentials)" -Method POST -Url "$base/login" -Body @{ email = $testEmail; password = "SecurePass123" } -ExpectedStatus 200 -ReturnKey "token"
if ($loginTok) { $global:token = $loginTok }

Invoke-Test -Name "POST /api/login (wrong password -> 401)"  -Method POST -Url "$base/login" -Body @{ email = $testEmail; password = "WrongPassword!" } -ExpectedStatus 401 | Out-Null
Invoke-Test -Name "POST /api/login (unknown email -> 401)"   -Method POST -Url "$base/login" -Body @{ email = "nobody@nowhere.com"; password = "SecurePass123" } -ExpectedStatus 401 | Out-Null
Invoke-Test -Name "POST /api/login (empty body -> 422)"      -Method POST -Url "$base/login" -Body @{ email = ""; password = "" } -ExpectedStatus 422 | Out-Null

# 4. Protected Routes (authenticated)
Write-Host ""
Write-Host "4. Protected Routes (authenticated)" -ForegroundColor Yellow
$me = Invoke-Test -Name "GET /api/me (valid token)" -Method GET -Url "$base/me" -ExpectedStatus 200
if ($me) { Write-Host "     user: $($me.user.full_name) <$($me.user.email)>" -ForegroundColor DarkGray }

$users = Invoke-Test -Name "GET /api/users (valid token)" -Method GET -Url "$base/users" -ExpectedStatus 200
if ($users) { Write-Host "     total users in DB: $($users.count)" -ForegroundColor DarkGray }

# 5. Protected Routes (unauthorized)
Write-Host ""
Write-Host "5. Protected Routes (unauthorized)" -ForegroundColor Yellow
$global:token = $null
Invoke-Test -Name "GET /api/me (no token -> 401)"    -Method GET -Url "$base/me"    -ExpectedStatus 401 | Out-Null
Invoke-Test -Name "GET /api/users (no token -> 401)" -Method GET -Url "$base/users" -ExpectedStatus 401 | Out-Null
$global:token = "invalid.jwt.token"
Invoke-Test -Name "GET /api/me (bad token -> 401)"    -Method GET -Url "$base/me"    -ExpectedStatus 401 | Out-Null
Invoke-Test -Name "GET /api/users (bad token -> 401)" -Method GET -Url "$base/users" -ExpectedStatus 401 | Out-Null

# Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
$color = if ($global:fail -eq 0) { "Green" } else { "Red" }
Write-Host "  Results: $($global:pass) passed, $($global:fail) failed" -ForegroundColor $color
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
