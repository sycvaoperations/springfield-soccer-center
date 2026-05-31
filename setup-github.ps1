# Springfield Soccer Center — GitHub Setup Script
# Run this from PowerShell in the Facility folder
# Right-click -> "Run with PowerShell" OR open PowerShell here and type: .\setup-github.ps1

$ErrorActionPreference = "Stop"
$repoName = "springfield-soccer-center"
$githubUser = "sycvaoperations"

Write-Host "`n=== Springfield Soccer Center GitHub Setup ===" -ForegroundColor Cyan
Write-Host "Folder: $PSScriptRoot" -ForegroundColor Gray

# Step 1: Init git
Set-Location $PSScriptRoot
Write-Host "`n[1/5] Initializing git..." -ForegroundColor Yellow
git init
git branch -M main

# Step 2: Configure identity
Write-Host "`n[2/5] Configuring git identity..." -ForegroundColor Yellow
git config user.email "sycvaoperations@gmail.com"
git config user.name "sycvaoperations"

# Step 3: Stage and commit
Write-Host "`n[3/5] Staging and committing all files..." -ForegroundColor Yellow
git add .
git commit -m "Initial production build"

# Step 4: Add remote
Write-Host "`n[4/5] Adding GitHub remote..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$githubUser/$repoName.git"
git remote add origin $remoteUrl
Write-Host "Remote set to: $remoteUrl" -ForegroundColor Gray

# Step 5: Push
Write-Host "`n[5/5] Pushing to GitHub (you may be prompted for credentials)..." -ForegroundColor Yellow
Write-Host "If prompted for a password, use a GitHub Personal Access Token (not your GitHub password)." -ForegroundColor Magenta
Write-Host "Create one at: https://github.com/settings/tokens/new (check 'repo' scope)" -ForegroundColor Magenta
git push -u origin main

Write-Host "`n=== Done! Repo pushed to github.com/$githubUser/$repoName ===" -ForegroundColor Green
Write-Host "Next: go to https://github.com/$githubUser/$repoName/settings/pages" -ForegroundColor Cyan
Write-Host "  - Source: Deploy from branch" -ForegroundColor White
Write-Host "  - Branch: main / (root)" -ForegroundColor White
Write-Host "  - Check 'Enforce HTTPS'" -ForegroundColor White
