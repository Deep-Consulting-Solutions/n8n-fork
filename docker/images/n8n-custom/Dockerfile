ARG NODE_VERSION=16
ARG ACCESS_TOKEN

# 1. Create an image to build n8n
FROM n8nio/base:${NODE_VERSION} as builder
ARG ACCESS_TOKEN
ENV TOKEN_FOR_PACKAGES=${ACCESS_TOKEN}

COPY --chown=node:node turbo.json package.json .npmrc pnpm-lock.yaml pnpm-workspace.yaml jest.config.js tsconfig.json ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node packages ./packages
COPY --chown=node:node patches ./patches

RUN apk add --update libc6-compat jq
RUN corepack enable && corepack prepare --activate
USER node

RUN printf "@deep-consulting-solutions:registry=https://npm.pkg.github.com/\nalways-auth=true\n//npm.pkg.github.com/:_authToken=%s" $TOKEN_FOR_PACKAGES >> .npmrc
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Delete all dev dependencies
RUN jq 'del(.pnpm.patchedDependencies)' package.json > package.json.tmp; mv package.json.tmp package.json
RUN node scripts/trim-fe-packageJson.js

# Delete any source code, source-mapping, or typings
RUN find . -type f -name "*.ts" -o -name "*.js.map" -o -name "*.vue" -o -name "tsconfig.json" -o -name "*.tsbuildinfo" | xargs rm -rf

# 2 . install packages
FROM node:${NODE_VERSION}-slim as privatenodepackages
ARG ACCESS_TOKEN
ENV TOKEN_FOR_PACKAGES=${ACCESS_TOKEN}
RUN cd /home/node && mkdir .n8n && cd .n8n && mkdir nodes && cd nodes
WORKDIR /home/node/.n8n/nodes
RUN printf "@deep-consulting-solutions:registry=https://npm.pkg.github.com/\nalways-auth=true\n//npm.pkg.github.com/:_authToken=%s" $TOKEN_FOR_PACKAGES > .npmrc
RUN npm install "@deep-consulting-solutions/n8n-nodes-dcs-crm" "@deep-consulting-solutions/n8n-nodes-dcs-noco-db" "@deep-consulting-solutions/n8n-nodes-dcs-s3" "@deep-consulting-solutions/n8n-nodes-esa-sendgrid"

# 3. Start with a new clean image with just the code that is needed to run n8n
FROM n8nio/base:${NODE_VERSION}
ENV NODE_ENV=production

ARG N8N_RELEASE_TYPE=dev
ENV N8N_RELEASE_TYPE=${N8N_RELEASE_TYPE}

WORKDIR /home/node
COPY --from=builder /compiled /usr/local/lib/node_modules/n8n
COPY docker/images/n8n/docker-entrypoint.sh /

RUN \
	pnpm rebuild --dir /usr/local/lib/node_modules/n8n sqlite3 && \
	ln -s /usr/local/lib/node_modules/n8n/bin/n8n /usr/local/bin/n8n && \
	mkdir .n8n && \
	chown node:node .n8n

RUN cd .n8n && mkdir nodes &&  cd nodes
COPY --from=privatenodepackages /home/node/.n8n/nodes /home/node/.n8n/nodes

USER node
ENV NODE_ENV=production
ENV DB_TYPE=postgresdb
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]
