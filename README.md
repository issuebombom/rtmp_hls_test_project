# rtmp-hls media server

node-media-server 모듈을 사용하지 않고, nginx와 ffmpeg을 활용하여 OBS에서 송출하는 라이브 스트리밍 데이터를 rtmp 프로토콜 전송 및 hls 방식으로 세그먼트와 매니페스트 파일을 저장하는 미디어 서버를 구현합니다. (진행 중...)

## 진행현황
- nginx와 nestjs 서버 컨테이너 구축
- Makefile로 커멘드 간편화
- nginx에서 OBS와 스트림 데이터 통신 및 nest 서버에 전달
- nest 서버에서 child_process로 ffmpeg 커멘드를 통해 hls 방식 적용
- 이미 생성된 영상을 대상으로 영상 화질 분리(1080, 720, 360) 및 hls 적용 성공(VOD)
- nginx와 nest서버 간 http 커넥션을 통해 스트림 데이터 전달 구현 과정에서 진행 막힘
- nginx에서 hls 및 화질 분리 후 ffmpeg의 -method 옵션을 통해 서버와 통신하는 방법 모색 중
