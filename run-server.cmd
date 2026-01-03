@echo off
set PORT=3001
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "C:\Users\amara\Downloads\ClassMateCode"
start "ClassMate Server" cmd /k ""C:\Program Files\nodejs\npm.cmd" start"
