import "dotenv/config";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import Handlebars from "handlebars";
import { getMods } from "../lib/curseforge/getMods";
import { getIndexFile } from "../lib/getIndexFile";
import { getModFile, isCurseforgeFile, isModrinthFile } from "../lib/getModFile";
import { getPackFile } from "../lib/getPackFile";
import { getProjects } from "../lib/modrinth/getProjects";
import { ModrinthVersion } from "../lib/modrinth/project";
import { NormalizedModData, normalizeModData } from "../lib/normalizeModData";

async function main() {
  const pack = getPackFile();

  const index = getIndexFile(pack.index.file);
  const mods = index.files.map((file) => getModFile(file.file));

  const projects: NormalizedModData[] = [];
  const versions: { [key: string]: ModrinthVersion } = {};

  try {
    const modrinthProjects = mods
      .filter(isModrinthFile)
      .map((mod) => mod.update.modrinth["mod-id"]);

    const modrinthMods = await getProjects(modrinthProjects);

    const curseforgeModIds = mods.filter(isCurseforgeFile).map((mod) => mod.update.curseforge["project-id"])
    const curseforgeMods = await getMods(curseforgeModIds)

    projects.push(...await normalizeModData([...modrinthMods, ...curseforgeMods]))

    // Fetch all versions we have

    
  } catch (e) {
    console.error(e);
    return;
  }

  const sortedProjects = projects.sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  Handlebars.registerHelper('lte', (val1: number, val2: number) => val1 <= val2)
  Handlebars.registerHelper('gte', (val1: number, val2: number) => val1 >= val2)

  const template = Handlebars.compile(
    readFileSync("./templates/index.hbs", "utf-8")
  );
  const output = template({
    pack: pack,
    mods: sortedProjects.filter((project) => project.type === "mod"),
    resourcePacks: sortedProjects.filter(
      (project) => project.type === "resourcepack"
    ),
    versions: versions,
  });

  mkdirSync("./public", { recursive: true });

  writeFileSync("./public/index.html", output);
}

await main();
