# Springfield Soccer Center — Build Program Catalog
# Combines individual JSON files from content/programs/
# into the single content/programs.json file used by the website.

$ErrorActionPreference = "Stop"

$InputDir = "content/programs"
$OutputFile = "content/programs.json"

if (!(Test-Path $InputDir)) {
  throw "Missing folder: $InputDir"
}

$programs = Get-ChildItem "$InputDir/*.json" |
  ForEach-Object {
    Write-Host "Reading $($_.Name)"
    Get-Content $_.FullName -Raw | ConvertFrom-Json
  } |
  Sort-Object order

if ($programs.Count -eq 0) {
  throw "No program JSON files found in $InputDir"
}

@{
  programs = @($programs)
} | ConvertTo-Json -Depth 20 | Set-Content $OutputFile -Encoding UTF8

Write-Host "Built $OutputFile with $($programs.Count) programs."
