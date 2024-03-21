#!/bin/bash

if [[ $1 == "-b" ]]; then
  quasar build
  cp manifest.json dist/spa/
fi

rsync -aWv --delete dist/spa/ server:/var/www/nboughton.uk/public/apps/obr-dragonbane-sheet/
