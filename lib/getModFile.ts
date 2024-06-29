import { readFileSync } from "fs";
import { parse } from "smol-toml";
type ModFile = ModrinthFile | CurseforgeFile


interface BaseModFile {
    name: string,
    filename: string,
    side: "client" | "server" | "both"

    download: {
        "hash-format": string,
        hash: string,
    }

    update: {
    }
}


interface ModrinthFile extends BaseModFile {
    download: {
        url: string
        "hash-format": string,
        hash: string,
    }

    update: {
        modrinth: {
            'mod-id': string
            version: string
        }
    }
}

interface CurseforgeFile extends BaseModFile {
    download: {
        mode: string
        "hash-format": string,
        hash: string,
    }

    update: {
        curseforge: {
            'project-id': number
            'file-id': number
        }
    }
}

function isModFile(data: object): data is ModFile {
    return 'side' in data
}


export function getModFile(path: string): ModFile {
    const data = readFileSync(`./pack/${path}`, 'utf-8');
    const modFile = parse(data);

    if (!isModFile(modFile)) {
        throw Error("Not a valid mod file")
    }

    return modFile
}

export function isModrinthFile(file: ModFile): file is ModrinthFile {
    return 'modrinth' in file.update
}

export function isCurseforgeFile(file: ModFile): file is ModrinthFile {
    return 'curseforge' in file.update
}