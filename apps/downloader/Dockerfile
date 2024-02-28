FROM node:20-alpine AS builder
WORKDIR /project
COPY . .
RUN npm install
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /ytdl
RUN apt update -y
RUN apt upgrade -y
RUN apt install curl -y
RUN curl -L -o ytdl https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux
RUN chmod 777 ytdl
ENV DOWNLOADER_YOUTUBE_YTDL_COMMAND=/ytdl/ytdl

WORKDIR /project
COPY --from=builder /project/dist ./dist
COPY package*.json .
RUN npm install --omit=dev

EXPOSE 3000:3000
ENTRYPOINT [ "npm", "run", "start:prod" ]