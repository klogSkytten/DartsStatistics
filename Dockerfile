FROM node:12
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
VOLUME /app/userdata
EXPOSE 9000
CMD ["node", "backend/server.js"]