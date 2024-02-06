FROM node:20-alpine AS builder
WORKDIR /project
COPY . .
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /project
COPY --from=builder /project/dist ./dist
COPY package*.json .
RUN npm install --omit=dev
ENTRYPOINT [ "npm", "run", "start:prod" ]