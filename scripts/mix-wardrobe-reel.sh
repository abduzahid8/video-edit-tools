#!/usr/bin/env bash
# Mix a full-resolution picture master with an already synchronized Mark Dou take.
set -euo pipefail

if [[ $# -ne 4 ]]; then
  echo "Usage: $0 picture.mp4 synchronized-mark-dou.wav music.wav output.mp4" >&2
  exit 2
fi
picture=$1
voice=$2
music=$3
output=$4

format=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate -of csv=p=0 "$picture")
if [[ "$format" != h264,1080,1920,30/1 ]]; then
  echo "Expected a 1080 × 1920 H.264 picture master at 30 fps, got $format" >&2
  exit 1
fi

ffmpeg -nostdin -v error -n -i "$picture" -i "$voice" -i "$music" \
  -filter_complex '[1:a]loudnorm=I=-17:TP=-2:LRA=7,aresample=48000,aformat=channel_layouts=stereo,apad,asplit=2[narration][key];[2:a]volume=0.4[bed];[bed][key]sidechaincompress=threshold=0.035:ratio=4:attack=15:release=270[ducked];[narration][ducked]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.86:level=0[audio]' \
  -map 0:v:0 -map '[audio]' -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$output"
