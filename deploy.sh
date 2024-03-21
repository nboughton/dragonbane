#!/bin/bash

quasar build
cp manifest.json dist/spa/

rsync -aWv --delete dist/spa/ server:/var/www/nboughton.uk/public/apps/obr-dragonbane-sheet/
