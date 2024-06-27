#! /usr/bin/env bash

curl -Lo "packwiz.zip" "https://nightly.link/packwiz/packwiz/workflows/go/main/Linux%2064-bit%20x86.zip"

unzip packwiz.zip

chmod +x packwiz

cd pack || exit 1

../packwiz refresh