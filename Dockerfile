FROM node:12
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
VOLUME /usr/src/app/userdata
EXPOSE 9000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "backend/server.js"]