export default (streamKey: string) =>
  `
    ffmpeg \
    -i pipe:0 \
    -c:v libx264 -c:a aac -ar 48000 \
    -map 0:v -map 0:a -map 0:v -map 0:a -map 0:v -map 0:a \
    -b:v:0 5000k \
    -maxrate:v:0 5000k \
    -bufsize:v:0 10000k \
    -s:v:0 1920x1080 \
    -crf:v:0 15 \
    -b:a:0 128k \
    -b:v:1 2500k \
    -maxrate:v:1 2500k \
    -bufsize:v:1 5000k \
    -s:v:1 1280x720 \
    -crf:v:1 22 \
    -b:a:1 128k \
    -b:v:2 1000k \
    -maxrate:v:2 1000k \
    -bufsize:v:2 2000k \
    -s:v:2 640x360 \
    -crf:v:2 28 \
    -b:a:2 96k \
    -f hls -var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:360p" \
    -hls_time 3 -hls_list_size 0 \
    -hls_playlist_type vod \
    -hls_flags independent_segments \
    -master_pl_name master.m3u8 \
    -hls_segment_filename "stream/${streamKey}/res_%v/file_%03d.ts" "stream/${streamKey}/res_%v/playlist.m3u8" \
    -progress - -nostats -v quiet \
  `;
