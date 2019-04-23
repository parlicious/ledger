#!/usr/bin/env bash

function deploy_lambda(){
    local FUNCTION_NAME=$1
    rm -rf dist
    mkdir -p dist
    npm run build
    cd dist
    zip -r ${FUNCTION_NAME}.zip . ../node_modules
    cd ..
    aws s3 cp dist/${FUNCTION_NAME}.zip s3://parlicious-functions
    aws lambda update-function-code --function-name ${FUNCTION_NAME} --s3-bucket parlicious-functions --s3-key ${FUNCTION_NAME}.zip
    aws lambda publish-version --function-name ${FUNCTION_NAME}
}
