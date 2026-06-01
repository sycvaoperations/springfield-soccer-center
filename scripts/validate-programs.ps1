$ErrorActionPreference = "Stop"

$InputDir = "content/programs"

$RequiredFields = @(
  "id",
  "title",
  "cat",
  "age",
  "banner",
  "desc",
  "status",
  "visible",
  "featured",
  "order"
)

$AllowedStatuses = @("open", "waitlist", "coming-soon")
$Ids = @{}

if (!(Test-Path $InputDir)) {
  throw "Missing folder: $InputDir"
}

Get-ChildItem "$InputDir/*.json" | ForEach-Object {
  $file = $_
  Write-Host "Checking $($file.Name)"

  try {
    $p = Get-Content $file.FullName -Raw | ConvertFrom-Json
  } catch {
    throw "Invalid JSON in $($file.Name): $($_.Exception.Message)"
  }

  foreach ($field in $RequiredFields) {
    if (-not ($p.PSObject.Properties.Name -contains $field)) {
      throw "$($file.Name) is missing required field: $field"
    }
  }

  if ($p.id -notmatch "^[a-z0-9-]+$") {
    throw "$($file.Name) has invalid id '$($p.id)'. Use lowercase letters, numbers, and hyphens only."
  }

  $expectedFileName = "$($p.id).json"
  if ($file.Name -ne $expectedFileName) {
    throw "$($file.Name) does not match id '$($p.id)'. File should be named $expectedFileName"
  }

  if ($Ids.ContainsKey($p.id)) {
    throw "Duplicate id found: $($p.id)"
  }

  $Ids[$p.id] = $true

  if ($AllowedStatuses -notcontains $p.status) {
    throw "$($file.Name) has invalid status '$($p.status)'. Use open, waitlist, or coming-soon."
  }

  if ($null -eq $p.meta) {
    Write-Warning "$($file.Name) has no meta array. Cards may look incomplete."
  }

  if ($p.details -and $p.details.body -and ($p.details.body -isnot [string])) {
    throw "$($file.Name) details.body must be plain text, not rich text/object data."
  }
}

Write-Host "All program files passed validation."
