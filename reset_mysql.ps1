# Require Admin privileges
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "This script must be run as Administrator!"
    exit
}

Write-Host "Creating initialization file to reset password to 'lakshya123'..."
$initPath = "C:\mysql-init.txt"
"ALTER USER 'root'@'localhost' IDENTIFIED BY 'lakshya123';" | Out-File -FilePath $initPath -Encoding ascii

Write-Host "Stopping MySQL service..."
Stop-Service -Name MySQL80 -Force -ErrorAction SilentlyContinue

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
if (!(Test-Path $mysqlPath)) {
    Write-Error "Could not find mysqld.exe at the standard location: $mysqlPath"
    Write-Host "Please ensure MySQL is installed."
    exit
}

Write-Host "Resetting MySQL root password..."
# Run mysqld with the init file and skip networking to quickly execute the password reset
$myIni = "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini"
if (Test-Path $myIni) {
    $p = Start-Process -PassThru -NoNewWindow -FilePath $mysqlPath -ArgumentList "--defaults-file=`"$myIni`"", "--init-file=`"$initPath`""
} else {
    Write-Warning "my.ini not found. Attempting to run with defaults."
    $p = Start-Process -PassThru -NoNewWindow -FilePath $mysqlPath -ArgumentList "--init-file=`"$initPath`""
}

# Give it 10 seconds to execute the file
Start-Sleep -Seconds 10

Write-Host "Stopping temporary mysqld process..."
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue

Write-Host "Cleaning up initialization file..."
if (Test-Path $initPath) {
    Remove-Item -Path $initPath -Force
}

Write-Host "Restarting MySQL Service..."
Start-Service -Name MySQL80

Write-Host "============================================="
Write-Host " SUCCESS: Password reset to 'lakshya123'     "
Write-Host "============================================="
