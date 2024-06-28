import { readFileSync } from "fs";
import { parse } from "smol-toml";

interface PackFile {
    name: string,
    version: string,
    'pack-format': string,

    index: {
        file: string
        'hash-format': string
        hash: string
    }

    versions: {
        [key: string]: string
    }

    options: {
        [key: string]: string
    }
}

function isPack(pack: object): pack is PackFile {
    return "pack-format" in pack
}

export function getPackFile(): PackFile {
    const indexData = readFileSync("./pack/pack.toml", "utf-8");

    const pack = parse(indexData);

    if (!isPack(pack)) {
        throw "Invalid pack"
    }

    return pack
}
