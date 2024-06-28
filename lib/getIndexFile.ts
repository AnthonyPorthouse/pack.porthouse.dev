import { readFileSync } from "fs";
import { parse } from "smol-toml";

interface IndexFile {
    'hash-format': string,

    files: {
        file: string,
        hash: string,
        metafile: boolean
    }[]
}

function isIndex(data: object): data is IndexFile {
    return "files" in data
}

export function getIndexFile(name: string): IndexFile {
    const indexData = readFileSync(`./pack/${name}`, "utf-8");

    const pack = parse(indexData);

    if (!isIndex(pack)) {
        throw "Invalid index file"
    }

    return pack
}
