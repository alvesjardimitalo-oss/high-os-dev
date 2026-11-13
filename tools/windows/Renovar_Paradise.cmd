@echo off
title High OS - Renovar Paradise
echo.
echo  HIGH OS - Renovar a sessao do Paradise
echo  ----------------------------------------
echo  Antes de abrir este atalho, copie o cookie do Paradise
echo  (F12 ^> Rede ^> clique numa linha ^> Cabecalhos ^> cookie ^> Copiar valor).
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/alvesjardimitalo-oss/high-os-dev/main/tools/windows/ligar-paradise.ps1 | iex"
echo.
pause
