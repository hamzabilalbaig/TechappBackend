FROM node:16.13.2
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
RUN npm install pm2@latest -g
COPY . /usr/src/app/
EXPOSE 3001
CMD ["pm2-runtime","index.js"]