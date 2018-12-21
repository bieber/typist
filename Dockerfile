FROM node:10-alpine AS builder
ARG PATH_TO_WORDSERV
WORKDIR /app
COPY . /app
RUN sed \
	"s/PATH_TO_WORDSERV/$PATH_TO_WORDSERV/" \
	config/config.example.js \
	> config/config.js
RUN npm install
ENV NODE_ENV production
RUN npm run build

FROM nginx:1.15.6-alpine
LABEL maintainer="docker@biebersprojects.com"
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
