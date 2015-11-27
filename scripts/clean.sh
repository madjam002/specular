#!/bin/sh
set -e

for f in packages/*; do
  rm -rf "$f/node_modules"
  rm -rf "$f/lib"
done

wait
