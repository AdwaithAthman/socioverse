#!/bin/bash
export PATH=$PATH:/usr/bin

cd socioverse
git pull origin master
cd server
npm run build
pm2 kill
pm2 start build/app.js