#!/usr/bin/env bash
# =============================================================================
#  HIGH OS • Instalador do bot (high-os-discord) na Oracle Cloud Free
# -----------------------------------------------------------------------------
#  Rode DENTRO da VM Ubuntu da Oracle (22.04 ou 24.04):
#
#    curl -fsSLo instalar-bot.sh https://raw.githubusercontent.com/alvesjardimitalo-oss/high-os-dev/main/tools/oracle/instalar-bot.sh
#    sudo bash instalar-bot.sh
#
#  O que ele faz (pode rodar de novo quantas vezes quiser; não apaga nada):
#    1. memória extra (swap) se a VM for pequena
#    2. Node 22, git, OCR (tesseract) e fontes dos gráficos
#    3. chave de acesso SÓ LEITURA ao repositório privado do bot (deploy key)
#    4. baixa o bot e instala as dependências
#    5. pede as variáveis do Railway (cole o "Raw Editor") — ficam só na VM
#    6. serviço que liga sozinho com a VM e reinicia se cair
#    7. HTTPS grátis (Caddy + sslip.io) e libera as portas 80/443
#    8. comandos de manutenção: highos-status, highos-logs, highos-atualizar
#
#  Nenhum segredo fica neste arquivo nem no GitHub.
# =============================================================================
set -euo pipefail

REPO_SSH="git@github.com:alvesjardimitalo-oss/high-os-discord.git"
REPO_KEYS_URL="https://github.com/alvesjardimitalo-oss/high-os-discord/settings/keys/new"
APP_USER="highos"
APP_HOME="/var/lib/high-os"
APP_DIR="/opt/high-os-discord"
ENV_DIR="/etc/high-os"
ENV_FILE="$ENV_DIR/high-os.env"
SERVICE="high-os"
PORT_LOCAL="3000"
DOMAIN="${DOMAIN:-}"   # opcional: DOMAIN=meu.dominio.com sudo -E bash instalar-bot.sh

azul(){ printf '\n\033[1;35m▶ %s\033[0m\n' "$*"; }
ok(){ printf '\033[1;32m  ✔ %s\033[0m\n' "$*"; }
aviso(){ printf '\033[1;33m  ! %s\033[0m\n' "$*"; }
erro(){ printf '\033[1;31m  ✖ %s\033[0m\n' "$*" >&2; exit 1; }
perguntar(){ local r; read -r -p "$1" r </dev/tty; printf '%s' "$r"; }

[ "$(id -u)" -eq 0 ] || erro "Rode com sudo:  sudo bash instalar-bot.sh"
. /etc/os-release
[ "${ID:-}" = "ubuntu" ] || erro "Este instalador é para a imagem Ubuntu da Oracle (encontrei: ${PRETTY_NAME:-?})."
export DEBIAN_FRONTEND=noninteractive

# ---------------------------------------------------------------------------
azul "1/8 Memória"
MEM_MB=$(awk '/MemTotal/{print int($2/1024)}' /proc/meminfo)
if [ "$MEM_MB" -lt 3000 ] && ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ok "Swap de 2 GB criado (VM com ${MEM_MB} MB de RAM)."
else
  ok "RAM: ${MEM_MB} MB — sem necessidade de swap extra."
fi

# ---------------------------------------------------------------------------
azul "2/8 Pacotes do sistema"
echo iptables-persistent iptables-persistent/autosave_v4 boolean true | debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | debconf-set-selections
apt-get update -qq
apt-get install -y -qq git curl ca-certificates gnupg debian-keyring debian-archive-keyring \
  apt-transport-https fontconfig fonts-dejavu-core tesseract-ocr tesseract-ocr-por \
  iptables-persistent >/dev/null
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
ok "Node $(node -v), git, tesseract e fontes instalados."

# ---------------------------------------------------------------------------
azul "3/8 Usuário do serviço e chave do GitHub (só leitura)"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --home-dir "$APP_HOME" --create-home --shell /usr/sbin/nologin "$APP_USER"
install -d -o "$APP_USER" -g "$APP_USER" -m 700 "$APP_HOME/.ssh"
install -d -o "$APP_USER" -g "$APP_USER" -m 750 "$APP_HOME/snapshots"
KEY="$APP_HOME/.ssh/id_ed25519"
if [ ! -f "$KEY" ]; then
  sudo -u "$APP_USER" ssh-keygen -q -t ed25519 -N '' -C "high-os-oracle" -f "$KEY"
fi
ssh-keyscan -t ed25519 github.com 2>/dev/null > "$APP_HOME/.ssh/known_hosts"
chown "$APP_USER:$APP_USER" "$APP_HOME/.ssh/known_hosts"

# "ssh -T" sempre sai com código 1 no GitHub; o que vale é a mensagem.
github_ok(){ local out; out=$(sudo -u "$APP_USER" ssh -o BatchMode=yes -T git@github.com 2>&1 || true); [[ "$out" == *"successfully authenticated"* ]]; }
until github_ok; do
  echo
  echo "  Adicione esta chave no repositório do bot (deixe 'Allow write access' DESMARCADO):"
  echo "  $REPO_KEYS_URL"
  echo "  Title: Oracle VM      Key:"
  echo
  echo "  $(cat "$KEY.pub")"
  echo
  perguntar "  Depois de clicar em 'Add key', aperte ENTER para eu testar... " >/dev/null
done
ok "Acesso ao GitHub confirmado."

# ---------------------------------------------------------------------------
azul "4/8 Código do bot"
install -d -o "$APP_USER" -g "$APP_USER" "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  sudo -u "$APP_USER" git -C "$APP_DIR" pull --ff-only -q
else
  sudo -u "$APP_USER" git clone -q --depth 50 "$REPO_SSH" "$APP_DIR"
fi
cd "$APP_DIR"
sudo -u "$APP_USER" HOME="$APP_HOME" npm ci --omit=dev --no-audit --no-fund --loglevel=error
sudo -u "$APP_USER" HOME="$APP_HOME" npm run -s check
ok "Bot baixado ($(sudo -u "$APP_USER" git -C "$APP_DIR" log -1 --format='%h %s'))."

# ---------------------------------------------------------------------------
azul "5/8 Variáveis (as mesmas do Railway)"
install -d -m 750 -o root -g "$APP_USER" "$ENV_DIR"
if [ ! -s "$ENV_FILE" ]; then
  cat <<'TXT'

  No Railway: projeto > serviço do bot > Variables > "Raw Editor" > copie TUDO.
  Cole aqui embaixo e, numa linha sozinha, digite  FIM  e aperte ENTER.

TXT
  TMP=$(mktemp)
  while IFS= read -r linha </dev/tty; do
    [ "$linha" = "FIM" ] && break
    printf '%s\n' "$linha" >> "$TMP"
  done
  grep -q '^ *DISCORD_TOKEN *=' "$TMP" || { rm -f "$TMP"; erro "Não encontrei DISCORD_TOKEN no que foi colado. Rode de novo e cole o Raw Editor inteiro."; }
  install -m 640 -o root -g "$APP_USER" "$TMP" "$ENV_FILE"; rm -f "$TMP"
  ok "Variáveis salvas em $ENV_FILE (só root e o serviço leem)."
else
  ok "Variáveis já existem em $ENV_FILE (mantidas). Para trocar: sudo nano $ENV_FILE"
fi
# Ajustes da VM: porta local fixa, backups no disco da VM, sem o túnel do Railway.
sed -i -E '/^ *(PORT|SNAPSHOT_DIR|CONTROL_PLANE_TUNNEL_ID|CONTROL_PLANE_API_KEY) *=/d' "$ENV_FILE"
printf 'PORT=%s\nSNAPSHOT_DIR=%s/snapshots\n' "$PORT_LOCAL" "$APP_HOME" >> "$ENV_FILE"
ln -sfn "$ENV_FILE" "$APP_DIR/.env"
# Confere as variáveis lendo do mesmo jeito que o bot lê (dotenv).
( cd "$APP_DIR" && sudo -u "$APP_USER" node --input-type=module -e '
import "dotenv/config";
const e=process.env, falta=["DISCORD_TOKEN","DISCORD_GUILD_ID","HIGH_OS_API_KEY"].filter(k=>!String(e[k]||"").trim());
if(falta.length){console.error("  ✖ Faltando: "+falta.join(", "));process.exit(1)}
console.log("  ✔ DISCORD_TOKEN, DISCORD_GUILD_ID e HIGH_OS_API_KEY presentes.");
if(e.HIGH_OS_FIREBASE_SERVICE_ACCOUNT_JSON){try{const j=JSON.parse(e.HIGH_OS_FIREBASE_SERVICE_ACCOUNT_JSON);if(!j.client_email||!j.private_key)throw 0;console.log("  ✔ Conta de serviço do Firebase legível.")}
catch{console.log("  ! HIGH_OS_FIREBASE_SERVICE_ACCOUNT_JSON não ficou legível (só afeta a cópia para o Firestore; o painel e o bot funcionam). Para corrigir: deixe o JSON numa linha só, entre aspas simples.")}}
' ) || erro "Variáveis incompletas. Corrija com: sudo nano $ENV_FILE  e rode o instalador de novo."

# ---------------------------------------------------------------------------
azul "6/8 Serviço (liga sozinho e reinicia se cair)"
cat > /etc/systemd/system/$SERVICE.service <<UNIT
[Unit]
Description=High OS Discord (bot + API)
After=network-online.target
Wants=network-online.target

[Service]
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=HOME=$APP_HOME
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=5
NoNewPrivileges=true
ProtectSystem=full
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now $SERVICE >/dev/null 2>&1
systemctl restart $SERVICE
ok "Serviço $SERVICE ativo."

# ---------------------------------------------------------------------------
azul "7/8 HTTPS e firewall"
for p in 80 443; do
  iptables -C INPUT -p tcp --dport $p -j ACCEPT 2>/dev/null || iptables -I INPUT -p tcp --dport $p -j ACCEPT
done
netfilter-persistent save >/dev/null 2>&1 || true
if [ -z "$DOMAIN" ]; then
  IP=$(curl -fsS4 --max-time 10 https://api.ipify.org || curl -fsS4 --max-time 10 https://ifconfig.me)
  [ -n "$IP" ] || erro "Não consegui descobrir o IP público da VM."
  DOMAIN="${IP//./-}.sslip.io"
fi
if ! command -v caddy >/dev/null; then
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq && apt-get install -y -qq caddy >/dev/null
fi
cat > /etc/caddy/Caddyfile <<CADDY
$DOMAIN {
	encode gzip
	reverse_proxy 127.0.0.1:$PORT_LOCAL
}
CADDY
systemctl reload caddy 2>/dev/null || systemctl restart caddy
echo "$DOMAIN" > "$ENV_DIR/dominio"
ok "Endereço do bot: https://$DOMAIN"

# ---------------------------------------------------------------------------
azul "8/8 Comandos de manutenção"
cat > /usr/local/bin/highos-status <<'S'
#!/usr/bin/env bash
D=$(cat /etc/high-os/dominio 2>/dev/null)
systemctl --no-pager --lines=0 status high-os | head -5
echo; echo "Saúde (https://$D/health):"; curl -fsS --max-time 10 "https://$D/health" || echo "  sem resposta"
echo
S
cat > /usr/local/bin/highos-logs <<'S'
#!/usr/bin/env bash
exec journalctl -u high-os -f -n 100
S
cat > /usr/local/bin/highos-atualizar <<'S'
#!/usr/bin/env bash
# Baixa a versão nova do bot do GitHub, confere e reinicia.
set -euo pipefail
[ "$(id -u)" -eq 0 ] || exec sudo "$0" "$@"
cd /opt/high-os-discord
sudo -u highos git pull --ff-only
sudo -u highos HOME=/var/lib/high-os npm ci --omit=dev --no-audit --no-fund --loglevel=error
sudo -u highos HOME=/var/lib/high-os npm run -s check
systemctl restart high-os
sleep 8; highos-status
S
chmod 755 /usr/local/bin/highos-status /usr/local/bin/highos-logs /usr/local/bin/highos-atualizar
ok "highos-status • highos-logs • highos-atualizar"

# ---------------------------------------------------------------------------
azul "Conferindo se o bot respondeu"
for _ in $(seq 1 45); do
  if curl -fsS --max-time 5 "https://$DOMAIN/health" >/dev/null 2>&1; then
    curl -fsS "https://$DOMAIN/health"; echo
    printf '\n\033[1;32m  PRONTO! Endereço do bot:  https://%s\033[0m\n\n' "$DOMAIN"
    echo "  Próximo passo: colocar esse endereço no painel (assets/api-config.js)"
    echo "  e no Apps Script 'HIGH OS - Sync Métricas' (HIGH_OS_RAILWAY_URL)."
    exit 0
  fi
  sleep 4
done
aviso "O HTTPS ainda não respondeu. Quase sempre é a porta 80/443 fechada na Oracle:"
aviso "Rede > VCN > Security List > Add Ingress Rules: 0.0.0.0/0, TCP, portas 80,443."
aviso "Depois rode:  sudo systemctl restart caddy && highos-status"
aviso "Log do bot: highos-logs"
