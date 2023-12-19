#!/bin/bash
export PATH=$PATH:/usr/bin

cd socioverse
git pull origin master
cd client/dist/
sudo cp -r * /var/www/socioverse.online/html/
pm2 kill
pm2 start /home/ubuntu/socioverse/server/build/app.js


