#!/bin/sh
set -e

for f in packages/*; do
  if [ -d "$f/src" ]; then
    (cd $f && npm install)
  fi
done

wait
