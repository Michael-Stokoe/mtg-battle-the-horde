#!/bin/bash

echo "Building new assets"

npm run build

echo "Changing directories"

cd ../michael-stokoe.github.io

pwd

echo "Removing old assets"
rm -rf assets images index.html vite.svg

echo "Copying new assets"
cp -r ../mtg-battle-the-horde/dist/assets ./assets
cp -r ../mtg-battle-the-horde/dist/images ./images
cp -r ../mtg-battle-the-horde/dist/index.html ./index.html
cp -r ../mtg-battle-the-horde/dist/vite.svg ./vite.svg

echo "Pushing changes"
git add .
git commit -m "Automatic push"
git push

cd -

echo "ALL DONE"