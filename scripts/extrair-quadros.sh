#!/usr/bin/env bash
# Uso: bash scripts/extrair-quadros.sh <video> <quadros> <foco_x> [largura_desktop] [inicio_s] [fim_s]
# quadros: total desejado. foco_x: 0 a 1, centro do recorte retrato usado no celular.
# largura_desktop: nunca maior que a largura original do vídeo.
# BORDA (variável de ambiente, em px): corta faixas pretas no alto e embaixo do vídeo. Ex.: BORDA=4.
set -euo pipefail
IN="$1"; N="${2:-150}"; FOCO="${3:-0.5}"; LARG="${4:-1920}"; INI="${5:-0}"; FIM="${6:-}"
OUT=public/frames
BORDA="${BORDA:-0}"
LIMPA="crop=iw:ih-2*$BORDA:0:$BORDA"
rm -rf "$OUT" && mkdir -p "$OUT/desktop" "$OUT/mobile" public/img

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
if [ -n "$FIM" ]; then DUR=$(awk "BEGIN{print $FIM-$INI}"); fi
FPS=$(awk "BEGIN{printf \"%.4f\", $N/$DUR}")
CORTE=(-ss "$INI"); [ -n "$FIM" ] && CORTE+=(-to "$FIM")

ffmpeg -v error "${CORTE[@]}" -i "$IN" -an \
  -vf "$LIMPA,fps=$FPS,scale=$LARG:-2:flags=lanczos" -frames:v "$N" \
  -c:v libwebp -quality 78 -compression_level 6 "$OUT/desktop/%04d.webp"

ffmpeg -v error "${CORTE[@]}" -i "$IN" -an \
  -vf "$LIMPA,fps=$FPS,crop='min(iw,ih*9/16)':ih:'(iw-min(iw,ih*9/16))*$FOCO':0,scale='min(iw,900)':-2:flags=lanczos" -frames:v "$N" \
  -c:v libwebp -quality 74 -compression_level 6 "$OUT/mobile/%04d.webp"

cp "$OUT/desktop/0001.webp" public/img/poster.webp
cp "$OUT/mobile/0001.webp" public/img/poster-mobile.webp
LAST=$(printf "%04d" "$N")
cp "$OUT/desktop/$LAST.webp" public/img/final.webp
ffmpeg -v error -y -i "$OUT/desktop/0001.webp" -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" -q:v 3 public/og.jpg

ls "$OUT/desktop" | wc -l
du -sh "$OUT/desktop" "$OUT/mobile"
