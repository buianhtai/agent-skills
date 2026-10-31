#!/bin/sh
# Usage: verify_stills.sh <movie.mp4> [out_dir]; pulls review stills at fixed times.
M=${1:?movie}; O=${2:-/tmp/clay_stills}; mkdir -p "$O"
for t in 3 8 14.5 22 28.2 44.4 52.8 56.5; do ffmpeg -y -loglevel error -ss $t -i "$M" -frames:v 1 "$O/still_$t.png"; done
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of csv=p=0 "$M"; shasum -a 256 "$M"
