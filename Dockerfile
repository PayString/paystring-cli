FROM node:12-alpine

ADD . / payid-cli/

RUN cd payid-cli/ &&\
    npm set unsafe-perm true &&\
    npm cache clean --force &&\
    npm install &&\
    npm run build && \
    npm link

FROM node:12-alpine

RUN mkdir /opt/payid-cli

WORKDIR /opt/payid-cli

COPY --from=0 /payid-cli/dist  /opt/payid-cli/dist
COPY --from=0 /payid-cli/node_modules  /opt/payid-cli/node_modules

ENTRYPOINT ["node", "/opt/payid-cli/dist/cli.js"]
