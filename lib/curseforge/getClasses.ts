import { getCurseforgeClient } from "../http";
import { Category } from "./types";

export async function getClasses() {
    const client = getCurseforgeClient()

    const res = await client.get<{ data: Category[] }>('/v1/categories', {
        params: {
            gameId: 432,
            classesOnly: true
        }
    })

    return res.data.data
}