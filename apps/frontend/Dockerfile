FROM node:20-alpine AS builder
WORKDIR /project
COPY . .
RUN npm install
RUN npm run build

FROM nginx
COPY ./server/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /project/dist/messenger/browser /etc/nginx/html
EXPOSE 3030
