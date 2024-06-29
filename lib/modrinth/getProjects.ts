import { getModrinthClient } from "../http";
import { ModrithProject } from "./project";

export async function getProjects(projectIds: string[]) {
    
    const client = getModrinthClient();

    try {
        const res = await client.get<ModrithProject[]>('/v2/projects', {
            params: {
                ids: JSON.stringify(projectIds)
            }
        });
          
          return res.data
    } catch (e) {
        console.error(e)
        throw e
    }
}