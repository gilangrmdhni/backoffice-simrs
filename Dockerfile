FROM node:14-alpine AS build-stage

RUN apk add --no-cache git

WORKDIR /app

COPY ./ ./

RUN npm install
RUN npm run build-prod


FROM nginx:alpine AS deploy-stage

#COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]