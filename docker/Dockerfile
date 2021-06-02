FROM node:13-alpine3.10

ENV WORKDIR /usr/src/app
ENV YARN_VERSION 1.22.10

WORKDIR ${WORKDIR}

RUN apk --no-cache --update upgrade && \
    apk add --no-cache --update \
    ca-certificates \
    curl && \
    curl -fSLO --compressed "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-v$YARN_VERSION.tar.gz" && \
    tar -xzf yarn-v$YARN_VERSION.tar.gz -C /opt/ && \
    ln -snf /opt/yarn-v$YARN_VERSION/bin/yarn /usr/local/bin/yarn && \
    ln -snf /opt/yarn-v$YARN_VERSION/bin/yarnpkg /usr/local/bin/yarnpkg &&\
    rm yarn-v$YARN_VERSION.tar.gz  && \
    yarn config set registry https://registry.npmjs.org/

COPY . .

RUN yarn install

CMD ["yarn", "start"]
