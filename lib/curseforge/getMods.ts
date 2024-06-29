import { getCurseforgeClient } from "../http";
import { ModResponse } from "./types";

export async function getMods(modIds: number[]) {
    const client = getCurseforgeClient();

    try {
        const res = await client.post<ModResponse>('/v1/mods', {
            modIds,
        })

        return res.data.data
    } catch (e) {
        console.error(e)
        throw e
    }
}