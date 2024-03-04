# main-server
FROM node:18.17.1 AS build
WORKDIR /opt/app
COPY ["package.json", "yarn.lock", "./"]
RUN ["yarn", "install"]

COPY ["tsconfig.build.json", "tsconfig.json", "./"]
COPY ["nest-cli.json", "./"]
COPY ["src/", "./src/"]
RUN ["yarn", "build"]

FROM node:18.17.1-alpine

# ffmpeg 설치
RUN apk add --update pcre ffmpeg

WORKDIR /opt/app
RUN ["mkdir", "stream"]
COPY --from=build ["/opt/app/node_modules/", "./node_modules/"]
COPY --from=build ["/opt/app/dist", "./dist"]

# 환경 변수 설정
ARG ENV
ENV ENV=${ENV}

# 설정 및 .env 파일 복사
COPY [".env.${ENV}", "./.env"]

CMD ["yarn", "node", "dist/main.js"]