FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY src src
COPY *.json *.ts *.js *.md *.html ./

RUN npm run build
# Created /app/dist


#########################################
FROM scratch AS dist
COPY --from=builder /app/dist /dist

#########################################
FROM joseluisq/static-web-server:2 AS webserver

COPY --from=dist /dist /dist

# See: https://static-web-server.net/configuration/environment-variables/
ENV SERVER_ROOT /dist
ENV SERVER_FALLBACK_PAGE ./index.html
