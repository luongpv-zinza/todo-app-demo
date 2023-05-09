#!/bin/bash

# Exit on fail
set -e

# Bundle install
yarn install

# Start services
if [ ${ENVIROMENT} = "PROD" ]; then
    yarn run build && yarn start
else
    yarn run dev
fi

# Finally call command issued to the docker service
exec "$@"
