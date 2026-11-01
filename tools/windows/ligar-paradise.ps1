# =====================================================================
#  High OS - liga as métricas pelo Paradise (apidash.touz.dev) no bot do PC
#
#  Uso (Terminal / PowerShell normal, não precisa ser administrador):
#    irm https://raw.githubusercontent.com/alvesjardimitalo-oss/high-os-dev/main/tools/windows/ligar-paradise.ps1 | iex
#
#  O que faz:
#    1. pede o cookie da sua sessão no Paradise (a digitação fica oculta)
#    2. testa o cookie direto no site antes de salvar
#    3. grava PARADISE_COOKIE no .env do bot (só no seu PC)
#    4. atualiza o bot pelo GitHub e reinicia
#    5. confere se a coleta do Paradise ligou
#  Rodar de novo é seguro: serve também para renovar o cookie quando vencer.
# =====================================================================
$ErrorActionPreference = 'Stop'
$Base    = Join-Path $env:LOCALAPPDATA 'HighOS'
$App     = Join-Path $Base 'high-os-discord'
$EnvFile = Join-Path $App '.env'
$Manage  = Join-Path $Base 'gerenciar.ps1'
$Utf8    = New-Object System.Text.UTF8Encoding($false)
$Teste   = 'https://apidash.touz.dev/api/s/default/groups/hourly-batch?groups=Armas01,Armas04&hours=2'

function Ok([string]$t){ Write-Host "  OK  $t" -ForegroundColor Green }
function Falha([string]$t){ Write-Host "  X   $t" -ForegroundColor Red; throw $t }

Write-Host ''
Write-Host 'HIGH OS - Métricas pelo Paradise' -ForegroundColor Magenta
if (-not (Test-Path $EnvFile)) { Falha "Bot não encontrado em $App. Rode antes o instalador do bot (tools/windows/instalar-bot-windows.ps1)." }

Write-Host ''
Write-Host 'Como copiar o cookie (uma vez):' -ForegroundColor Cyan
Write-Host '  1. Abra https://paradise.touz.dev/groups/daily-peak logado e aperte F12 > aba Rede.'
Write-Host '  2. Selecione um grupo na página. Clique na linha "hourly-batch..." que aparecer.'
Write-Host '  3. Cabeçalhos > Cabeçalhos de solicitação > linha "cookie": clique com o botão direito > Copiar valor.'
Write-Host ''
$seguro = Read-Host 'Cole o valor do cookie aqui (não aparece na tela) e aperte ENTER' -AsSecureString
$cookie = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($seguro)).Trim()
if ($cookie -match '^(?i)cookie\s*:\s*') { $cookie = $cookie -replace '^(?i)cookie\s*:\s*', '' }
if (-not $cookie) { Falha 'Nada foi colado.' }
if ($cookie -match '[\r\n]') { Falha 'O valor colado tem quebra de linha. Copie só o valor do cookie.' }

Write-Host ''
Write-Host 'Testando o cookie no Paradise...' -ForegroundColor Cyan
try {
  $r = Invoke-RestMethod -Uri $Teste -Headers @{ Cookie = $cookie } -TimeoutSec 20
} catch {
  Falha ("O Paradise recusou o cookie (" + $_.Exception.Message + "). Confira se copiou o valor inteiro e se está logado no site.")
}
if (-not $r.success -or -not $r.data) { Falha 'O Paradise respondeu, mas sem os dados esperados.' }
Ok ('Cookie válido. Grupos lidos: ' + (($r.data.PSObject.Properties.Name) -join ', '))

$linhas = @(Get-Content -Path $EnvFile -Encoding UTF8) | Where-Object { $_ -notmatch '^\s*PARADISE_COOKIE\s*=' }
$linhas = @($linhas) + @("PARADISE_COOKIE=$cookie")
[IO.File]::WriteAllLines($EnvFile, [string[]]$linhas, $Utf8)
$cookie = $null
Ok 'Cookie salvo no .env do bot (só no seu PC).'

Write-Host ''
Write-Host 'Atualizando e reiniciando o bot...' -ForegroundColor Cyan
if (Test-Path $Manage) { & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $Manage atualizar }
else { Falha "Atalho de manutenção não encontrado ($Manage). Use o atalho Atualizar na pasta High OS Bot." }

Write-Host ''
Write-Host 'Conferindo a coleta (pode levar até 1 minuto)...' -ForegroundColor Cyan
$ok = $false
for ($i = 0; $i -lt 12 -and -not $ok; $i++) {
  Start-Sleep 5
  try {
    $h = Invoke-RestMethod 'http://127.0.0.1:3000/health' -TimeoutSec 5
    if ($h.paradise.ultimoSucesso) { $ok = $true; Ok ("Paradise sincronizado. Linhas lidas: " + $h.paradise.linhas) }
    elseif ($h.paradise.erro) { Write-Host ("  !   Paradise: " + $h.paradise.erro) -ForegroundColor Yellow }
  } catch {}
}
if (-not $ok) { Write-Host '  !   Ainda sem confirmação. O bot pode estar carregando o Discord; confira daqui a pouco pelo atalho "Ver log" (procure "Paradise").' -ForegroundColor Yellow }
Write-Host ''
Write-Host 'Pronto. Quando a sessão do Paradise vencer, rode este mesmo comando de novo.' -ForegroundColor Green
