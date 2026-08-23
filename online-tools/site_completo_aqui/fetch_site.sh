#!/usr/bin/env bash
set -euo pipefail

# Script para baixar e extrair o repositório emn178/online-tools (branch master)
# Executar a partir da raiz do repositório: bash online-tools/site_completo_aqui/fetch_site.sh

UPSTREAM_ZIP_URL="https://github.com/emn178/online-tools/archive/refs/heads/master.zip"
TMP_ZIP="/tmp/online-tools-master.zip"
DEST_DIR="$(pwd)/online-tools/site_completo_aqui"

mkdir -p "$DEST_DIR"

echo "Baixando $UPSTREAM_ZIP_URL..."
if command -v curl >/dev/null 2>&1; then
  curl -L -o "$TMP_ZIP" "$UPSTREAM_ZIP_URL"
elif command -v wget >/dev/null 2>&1; then
  wget -O "$TMP_ZIP" "$UPSTREAM_ZIP_URL"
else
  echo "Erro: nem curl nem wget estão disponíveis." >&2
  exit 1
fi

echo "Extraindo para $DEST_DIR..."
unzip -o "$TMP_ZIP" -d "$DEST_DIR"

# O zip geralmente cria uma pasta online-tools-master dentro do DEST_DIR.
# Se preferir mover os arquivos diretamente para DEST_DIR, descomente o bloco abaixo.

# echo "Movendo arquivos para $DEST_DIR..."
# INNER_DIR="$DEST_DIR/online-tools-master"
# if [ -d "$INNER_DIR" ]; then
#   shopt -s dotglob
#   mv "$INNER_DIR"/* "$DEST_DIR"/
#   rmdir "$INNER_DIR"
# fi

rm -f "$TMP_ZIP"

echo "Concluído. Arquivos extraídos em: $DEST_DIR"
