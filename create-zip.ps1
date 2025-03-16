$sourceDir = "."
$destinationZip = "..\advertzorgame-deploy.zip"

# Create a temporary directory for files to zip
$tempDir = ".\temp-for-zip"
New-Item -ItemType Directory -Force -Path $tempDir

# Copy files excluding node_modules, dist, and other unnecessary files
Get-ChildItem -Path $sourceDir -Exclude @("node_modules", "dist", "temp-for-zip", "create-zip.ps1") |
Copy-Item -Destination $tempDir -Recurse -Force

# Create the zip file
Compress-Archive -Path "$tempDir\*" -DestinationPath $destinationZip -Force

# Clean up temporary directory
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Created deployment ZIP at: $destinationZip"
