#STAGE 1
FROM nginx:1.23.4

COPY ./build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
