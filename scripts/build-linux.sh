#!/bin/bash


_electron=electron34

export NODE_ENV=production
export NODE_OPTIONS=--openssl-legacy-provider

npm run sandbox:bundle-libraries --workspace=packages/bruno-js


npm run build --workspace=packages/bruno-common
npm run build --workspace=packages/bruno-requests
npm run build --workspace=packages/bruno-converters
npm run build --workspace=packages/bruno-query
npm run build --workspace=packages/bruno-graphql-docs

npm run build --workspace=packages/bruno-app

rm -rf packages/bruno-electron/{out,web}
mkdir -p packages/bruno-electron/web
cp -r packages/bruno-app/dist/* packages/bruno-electron/web

sed -i -e 's@/static/@static/@g' packages/bruno-electron/web/**.html
sed -i -e 's@/static/font@../../static/font@g' packages/bruno-electron/web/static/css/**.**.css

find packages/bruno-electron/web -name '*.map' -type f -delete

electronDist="/usr/lib/${_electron}"
electronVer="$(cat ${electronDist}/version)"

npm run pack --workspace=packages/bruno-electron -- \
    --linux \
    --x64 \
    --config electron-builder-config.js \
    -c.electronDist=${electronDist} \
    -c.electronVersion=${electronVer}


mkdir -p ~/.local/bin/bruno
cp -r packages/bruno-electron/out/linux-unpacked/* ~/.local/bin/bruno/
