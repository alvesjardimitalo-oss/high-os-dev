# Bot do High OS na Oracle Cloud Free

O bot (`high-os-discord`) roda 24h numa máquina gratuita da Oracle, no lugar do Railway.
Os dados continuam no canal 💾 storage do Discord: o bot sobe e lê tudo de volta.

## 1. Conta e região
1. Crie a conta em <https://signup.cloud.oracle.com> (pede cartão só para verificação).
2. **Home Region: Brazil East (São Paulo)**. A região não muda depois e a máquina grátis só funciona nela.

## 2. Criar a máquina
Menu ☰ → **Compute → Instances → Create instance**
- **Name:** `high-os-bot`
- **Image:** Change image → **Canonical Ubuntu 24.04**
- **Shape:** Change shape → **Ampere → VM.Standard.A1.Flex** → **1 OCPU e 2 GB de memória**
  - Selo *Always Free-eligible* precisa aparecer.
  - 2 GB é de propósito: com o bot rodando, a memória fica acima de 20% e a Oracle não considera a máquina "ociosa".
  - Se der **Out of capacity**: tente outro *Availability domain* ou mais tarde. Em último caso use **VM.Standard.E2.1.Micro** (AMD, 1 GB).
- **Networking:** crie VCN nova com sub-rede pública e **Assign a public IPv4 address** ligado.
- **Add SSH keys:** **Generate a key pair for me** → **Save private key** (guarde o arquivo `.key`).
- **Create**. Quando ficar verde (RUNNING), copie o **Public IP address**.

## 3. Liberar as portas do site (80 e 443)
Na página da instância → **Subnet** (link) → **Security** → Security List padrão →
**Add Ingress Rules**: Source CIDR `0.0.0.0/0` • IP Protocol `TCP` • Destination Port Range `80,443` → **Add**.

## 4. Entrar na máquina
No Windows, abra o **PowerShell** na pasta onde salvou a chave:
```powershell
ssh -i .\ssh-key-AAAA-MM-DD.key ubuntu@SEU_IP_PUBLICO
```
(digite `yes` na primeira vez). Se reclamar de permissão da chave, use o **Cloud Shell** da Oracle (ícone `>_` no topo do console): envie o arquivo `.key` pelo menu ⚙ → Upload, depois `chmod 600 ssh-key-*.key` e o mesmo comando `ssh`.

## 5. Instalar o bot
Já dentro da máquina:
```bash
curl -fsSLo instalar-bot.sh https://raw.githubusercontent.com/alvesjardimitalo-oss/high-os-dev/main/tools/oracle/instalar-bot.sh
sudo bash instalar-bot.sh
```
O instalador vai pedir duas coisas:
1. **Chave do GitHub:** ele mostra uma linha `ssh-ed25519 ...`. Abra o link que ele mostra (Deploy keys do repositório `high-os-discord`), cole, deixe **Allow write access desmarcado** → **Add key** → ENTER.
2. **Variáveis do Railway:** no Railway → serviço do bot → **Variables → Raw Editor** → copie tudo, cole no terminal, digite `FIM` numa linha sozinha e ENTER.

No final aparece: `PRONTO! Endereço do bot: https://xxx-xxx-xxx-xxx.sslip.io`

> Pode rodar o instalador de novo a qualquer momento; ele não apaga nada.

## 6. Apontar o painel e as planilhas para o novo endereço
1. **Painel:** no GitHub, `high-os-dev` → `assets/api-config.js` → ✏️ → troque o endereço do Railway pelo novo → Commit.
2. **Apps Script "HIGH OS - Sync Métricas":** troque o valor de `HIGH_OS_RAILWAY_URL` pelo novo endereço → Salvar.
3. Qualquer outro Apps Script que tenha `high-os-discord-production.up.railway.app`: mesma troca.

Depois disso, abra o painel e faça um teste (entregar/recolher numa facção de teste ou só abrir Métricas).

## Manutenção (dentro da máquina)
| Comando | Para quê |
| --- | --- |
| `highos-status` | serviço ligado? `/health` respondendo? |
| `highos-logs` | log ao vivo do bot (Ctrl+C para sair) |
| `highos-atualizar` | baixa a versão nova do GitHub, confere e reinicia |
| `sudo nano /etc/high-os/high-os.env` | editar variáveis (depois: `sudo systemctl restart high-os`) |

O bot liga sozinho quando a máquina reinicia e volta sozinho se cair.

## Avisos
- **Não deixe o Railway e a Oracle ligados juntos.** Dois bots com o mesmo token duplicam posts e brigam pelo storage.
- O túnel MCP do Railway (`CONTROL_PLANE_*`) não é usado aqui; o `/mcp` continua acessível pelo endereço novo com a `HIGH_OS_API_KEY`.
- Os backups diários (`SNAPSHOT_DIR`) ficam em `/var/lib/high-os/snapshots` na máquina.
- Se recriar a máquina, o IP muda: refaça o passo 6 com o novo endereço.
