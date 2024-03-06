# rtmp-hls media server

node-media-server 모듈을 사용하지 않고, nginx와 ffmpeg을 활용하여 OBS에서 송출하는 라이브 스트리밍 데이터를 rtmp 프로토콜 전송 및 hls 방식으로 세그먼트와 매니페스트 파일을 저장하는 미디어 서버를 구현합니다. (진행 중...)

## 진행현황

- nginx와 nestjs 서버 컨테이너 구축
- Makefile로 커멘드 간편화
- nginx에서 OBS와 스트림 데이터 통신 및 nest 서버에 전달
- nest 서버에서 child_process로 ffmpeg 커멘드를 통해 hls 방식 적용 시도
- 이미 생성된 영상을 대상으로 영상 해상도 분리(1080, 720, 360) 및 hls 적용 성공(VOD)
- nginx 내부에서 스트리밍 영상 해상도 분리 및 hls 저장, 8080포트로 master.m3u8 제공 성공
- nginx와 nest서버 간 http 커넥션을 통해 스트림 데이터 전달 시 전송이 원활하지 않음
- nginx에서 hls 및 화질 분리 후 ffmpeg의 -method 옵션을 통해 서버와 통신하는 방법 모색 중

## 참고 예시

```zsh
# https://velog.io/@haerong22/%EC%98%81%EC%83%81-%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D-9.-%EB%9D%BC%EC%9D%B4%EB%B8%8C-%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%B0%8D

# rmtp 모듈
rtmp {
    server {
    	# rtmp 는 기본적으로 1935 포트를 사용한다.
        listen 1935;
        chunk_size 4096; # 청크 사이즈

		# app 이름 live
        application live {

            live on;

			# 들어온 rtmp 데이터를 ffmpeg를 이용해서 hls로 인코딩
            # 화질별로 인코딩 $app은 app 이름 $name은 식별자(채널 같은 의미)
            exec_push ffmpeg -i rtmp://localhost:1935/$app/$name -async 1 -vsync -1
              -c:v libx264 -c:a aac -b:v 256k  -b:a 64k  -vf "scale=480:trunc(ow/a/2)*2"  -tune zerolatency -preset superfast -crf 23 -f flv rtmp://localhost:1935/hls/$name_low
              -c:v libx264 -c:a aac -b:v 768k  -b:a 128k -vf "scale=720:trunc(ow/a/2)*2"  -tune zerolatency -preset superfast -crf 23 -f flv rtmp://localhost:1935/hls/$name_mid
              -c:v libx264 -c:a aac -b:v 1024k -b:a 128k -vf "scale=960:trunc(ow/a/2)*2"  -tune zerolatency -preset superfast -crf 23 -f flv rtmp://localhost:1935/hls/$name_high
              -c:v libx264 -c:a aac -b:v 6000k -r 60  -b:a 128k -vf "scale=1280:trunc(ow/a/2)*2" -tune zerolatency -preset superfast -crf 23 -f flv rtmp://localhost:1935/hls/$name_hd720
              -c copy -f flv rtmp://localhost:1935/hls/$name_src;

            drop_idle_publisher 10s;
        }

		# hls 파일로 저장~
        application hls {
            live on;
            hls on;
            hls_fragment 10s;
            hls_playlist_length 10;
            hls_path /tmp/hls; # 파일 위치

            hls_variant _src BANDWIDTH=4096000;
            hls_variant _hd720 BANDWIDTH=2048000;
            hls_variant _high BANDWIDTH=1152000;
            hls_variant _mid BANDWIDTH=448000;
            hls_variant _low BANDWIDTH=288000;
        }
    }
}
```
