FROM node:12-alpine

ADD . / paystring-cli/

RUN cd paystring-cli/ &&\
    npm set unsafe-perm true &&\
    npm cache clean --force &&\
    npm install &&\
    npm run build && \
    npm link

FROM node:12-alpine

RUN mkdir /opt/paystring-cli

WORKDIR /opt/paystring-cli

COPY --from=0 /paystring-cli/dist  /opt/paystring-cli/dist
COPY --from=0 /paystring-cli/node_modules  /opt/paystring-cli/node_modules

ENTRYPOINT ["node", "/opt/paystring-cli/dist/cli.js"]
