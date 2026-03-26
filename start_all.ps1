$ErrorActionPreference = "Continue"

Write-Host "Starting AI BRAIN (YOLOv8) Server..." -ForegroundColor Cyan
# Start the Python server in a new PowerShell window so you can see its logs separately
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd z:\ai-navigation; python training\detect_realtime.py" -WindowStyle Normal

Write-Host "Starting Expo App on LAN..." -ForegroundColor Green
Set-Location -Path "z:\ai-navigation\artifacts\ai-navigation"

# Ignore ProtonVPN block and bind directly to the active Wi-Fi adapter's IP address
$wifiIp = (Get-NetIPAddress -InterfaceAlias "WiFi" -AddressFamily IPv4 | Select-Object -ExpandProperty IPAddress)
if ($wifiIp) {
    Write-Host "Binding Expo to Local Wi-Fi IP: $wifiIp" -ForegroundColor Yellow
    $env:REACT_NATIVE_PACKAGER_HOSTNAME = $wifiIp
} else {
    Write-Host "Warning: Could not grab Wi-Fi IP. Please check your network connection." -ForegroundColor Red
}

npx expo start --lan --port 8081 -c
