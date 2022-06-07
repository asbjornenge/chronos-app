FROM node:16.15.0-alpine3.15
RUN npm install -g node-static
RUN mkdir /app
ADD src/ /app/src
ADD public/ /app/public
ADD *.json /app/
WORKDIR /app
RUN npm install
RUN npm run build 
CMD ["static","-a","0.0.0.0","build"]
