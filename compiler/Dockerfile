FROM node:22-alpine
WORKDIR /app
RUN apk update && apk add --no-cache \
  openjdk17 \
  g++ \
  make \
  python3
RUN npm install -g nodemon
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD ["nodemon", "compiler.js"]
