import { getClasses } from "./curseforge/getClasses";
import { CurseforgeMod } from "./curseforge/types";
import { ModrithProject } from "./modrinth/project";

export interface NormalizedModData {
  title: string;
  summary: string;
  url: string;
  logoUrl: string;
  source: "curseforge" | "modrinth";
  version?: string;
  type: "mod" | "modpack" | "resourcepack" | "shader";
}

function isModrinthMod(
  mod: CurseforgeMod | ModrithProject
): mod is ModrithProject {
  return "client_side" in mod;
}

export async function normalizeModData(
  mods: (CurseforgeMod | ModrithProject)[]
) {
  const curseforgeCategories = await getClasses();

  return mods.map((mod): NormalizedModData => {
    if (isModrinthMod(mod)) {
      return {
        source: "modrinth",
        title: mod.title,
        summary: mod.description,
        logoUrl: mod.icon_url ?? "",
        url: `https://modrinth.com/mod/${mod.id}`,
        type: mod.project_type,
      };
    }

    const category = curseforgeCategories.find(
      (cat) => cat.id === mod.classId
    )!;

    return {
      source: "curseforge",
      title: mod.name,
      summary: mod.summary,
      logoUrl: mod.logo.thumbnailUrl,
      url: `https://curseforge.com/minecraft/${category.slug}/${mod.slug}`,
      type: ((): NormalizedModData["type"] => {
        switch (category.slug) {
          case "mc-mods":
            return "mod";
          case "shaders":
            return "shader";
          case "data-packs":
            return "mod";
          case "texture-packs":
            return "resourcepack";
          default:
            return "mod";
        }
      })(),
    };
  });
}
