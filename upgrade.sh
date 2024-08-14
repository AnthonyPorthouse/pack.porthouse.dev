#! /usr/bin/env bash

cd pack || exit 1

slugs=$(find . -name "*.pw.toml" | rev | cut -d '/' -f 1 | rev | cut -d '.' -f 1)

echo "$slugs" | xargs -I"{}" packwiz upgrade {}
