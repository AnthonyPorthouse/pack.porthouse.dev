#! /usr/bin/env bash

if [[ $(uname) = "Darwin" ]] && [[ $(uname -m) = "arm64" ]]; then
    curl -Lo "packwiz.zip" "https://nightly.link/packwiz/packwiz/workflows/go/main/macOS%2064-bit%20ARM.zip"
elif [[ $(uname) = "Darwin" ]] && [[ $(uname -m) = "x86_64" ]]; then
    curl -Lo "packwiz.zip" "https://nightly.link/packwiz/packwiz/workflows/go/main/macOS%2064-bit%20x86.zip"
elif [[ $(uname) = "Linux" ]] && [[ $(uname -m) = "arm64" ]]; then
    curl -Lo "packwiz.zip" "https://nightly.link/packwiz/packwiz/workflows/go/main/Linux%2064-bit%20ARM.zip"
elif [[ $(uname) = "Linux" ]] && [[ $(uname -m) = "x86_64" ]]; then
    curl -Lo "packwiz.zip" "https://nightly.link/packwiz/packwiz/workflows/go/main/Linux%2064-bit%20x86.zip"
fi

unzip -u packwiz.zip

chmod +x packwiz

cd pack || exit 1

../packwiz refresh

cd - || exit 1

npx -y github:anthonyporthouse/packwiz-renderer build pack --output ./public

cp -r pack/* public
