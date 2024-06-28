import { readFileSync } from "fs";
import { parse } from "smol-toml";

interface ModFile {
    name: string,
    filename: string,
    side: "client" | "server" | "both"

    download: {
        url?: string,
        mode?: string,
        "hash-format": string,
        hash: string,
    }

    update: {
        modrinth?: {
            "mod-id": string,
            "version": string
        }

        curseforge?: {
            "file-id": number,
            "project-id": number
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