FROM node:16

#install and configure nginx
RUN apt update
RUN apt install nginx -y
COPY ./build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/src/app
COPY ./rest-api-server .
RUN npm install
EXPOSE 3001

#start nginx and rest api server
CMD nginx & npm start
