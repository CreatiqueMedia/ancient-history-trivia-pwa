#!/bin/bash

# Block npm and npx usage in this project
if command -v npm &> /dev/null; then
    echo "⚠️  npm is blocked in this project. Please use yarn instead:"
    echo "   yarn install    (instead of npm install)"
    echo "   yarn dev        (instead of npm run dev)"
    echo "   yarn build      (instead of npm run build)"
    echo "   yarn dlx        (instead of npx)"
    exit 1
fi

if command -v npx &> /dev/null; then
    echo "⚠️  npx is blocked in this project. Please use 'yarn dlx' instead:"
    echo "   yarn dlx <package>  (instead of npx <package>)"
    exit 1
fi
