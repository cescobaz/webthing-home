#!/bin/sh

set -ex

DESTINATION=${1:-'/tmp/webthing-camera-media'}
mkdir -p "$DESTINATION"
# keep last X hours so:
HOURS_TO_KEEP=3
SEG_DURATION=3
SECONDS_IN_HOURS=3600
WINDOW_SIZE=$(($HOURS_TO_KEEP * $SECONDS_IN_HOURS / $SEG_DURATION))
FULL_HD_WIDTH=1920
FULL_HD_HEIGHT=1080
HEIGHT=720
WIDTH=$(($HEIGHT * $FULL_HD_WIDTH / $FULL_HD_HEIGHT))
raspivid --nopreview \
	-t 0 \
	--profile baseline \
	--level 4 \
	-fps 10 \
	--shutter 150000 \
	--exposure night \
	--drc high \
	--width $WIDTH \
	--height $HEIGHT \
	--mode 2 \
	-a 12 \
	-o - | ffmpeg \
	-i - -vcodec copy -an \
	-r 10 \
	-f dash \
	-seg_duration $SEG_DURATION \
	-window_size $WINDOW_SIZE \
	-streaming 1 \
	"$DESTINATION/playlist.mpd" &

echo $!
