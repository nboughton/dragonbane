#!/bin/bash

version=$(grep '"version"' package.json | sed -re 's/[^0-9.]+//g')
echo "Building and packaging v$version in 5 seconds"
sleep 5

quasar b -m electron

cd dist/electron/Packaged

echo "Zipping Win32 build in 3s"
sleep 3
zip -r Dragonbane-win-$version.zip 'Dragonbane-win32-x64'

echo "Tarring Linux build in 3s"
sleep 3
tar czvf Dragonbane-linux-$version.tar.gz 'Dragonbane-linux-x64'

echo "Tarring Mac build in 3s"
sleep 3
tar czvf Dragonbane-OSX-$version.tar.gz 'Dragonbane-darwin-x64'
