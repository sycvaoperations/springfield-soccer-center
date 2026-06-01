$ErrorActionPreference = "Stop"

$files = @()
$files += ".pages.yml"

if (Test-Path "content/programs.json") {
  $files += "content/programs.json"
}

if (Test-Path "content/programs") {
  $files += Get-ChildItem "content/programs/*.json" | ForEach-Object { $_.FullName }
}

# Build corrupted sequences using character codes so PowerShell never has to parse the bad text directly.
$badEnDash      = [string]::Concat([char]0x00E2, [char]0x20AC, [char]0x201C)
$badEmDash      = [string]::Concat([char]0x00E2, [char]0x20AC, [char]0x201D)
$badLeftSingle  = [string]::Concat([char]0x00E2, [char]0x20AC, [char]0x02DC)
$badRightSingle = [string]::Concat([char]0x00E2, [char]0x20AC, [char]0x2122)
$badLeftDouble  = [string]::Concat([char]0x00E2, [char]0x20AC, [char]0x0153)
$badMiddleDot   = [string]::Concat([char]0x00C2, [char]0x00B7)
$badA           = [string]::Concat([char]0x00C2)

foreach ($file in $files) {
  if (!(Test-Path $file)) { continue }

  $text = Get-Content $file -Raw

  $text = $text.Replace($badEnDash, "-")
  $text = $text.Replace($badEmDash, "-")
  $text = $text.Replace($badLeftSingle, "'")
  $text = $text.Replace($badRightSingle, "'")
  $text = $text.Replace($badLeftDouble, '"')
  $text = $text.Replace($badMiddleDot, "-")
  $text = $text.Replace($badA, "")

  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText((Resolve-Path $file), $text, $utf8NoBom)

  Write-Host "Cleaned $file"
}

Write-Host "Encoding cleanup complete."
