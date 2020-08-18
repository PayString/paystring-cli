FROM node:12-alpine

ADD . / payid-utils/

RUN cd payid-utils/ &&\
    npm cache clean --force &&\
    npm install &&\
    npm run build && \
    npm link

FROM node:12-alpine

RUN mkdir /opt/payid-utils

WORKDIR /opt/payid-utils

COPY --from=0 /payid-utils/dist  /opt/payid-utils/dist
COPY --from=0 /payid-utils/node_modules  /opt/payid-utils/node_modules

CMD ["node", "/opt/payid-utils/dist/cli.js"]
