@echo off
REM Script para iniciar el servidor con PATH configurado
SET PATH=C:\Program Files\nodejs;%PATH%
SET PORT=3001
cd /d C:\Users\amara\Downloads\ClassMateCode
echo Starting ClassMate AI server on port 3001...
echo.
"C:\Program Files\nodejs\npm.cmd" start
pause
