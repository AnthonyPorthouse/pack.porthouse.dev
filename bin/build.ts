import Axios from "axios";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import Handlebars from "handlebars";
import { getIndexFile } from "../lib/getIndexFile";
import { getModFile, isModrinthFile } from "../lib/getModFile";
import { getPackFile } from "../lib/getPackFile";
import { ModrinthVersion, ModrithProject } from "../lib/project";

async function main() {
  const pack = getPackFile();

  const index = getIndexFile(pack.index.file);
  const mods = index.files.map((file) => getModFile(file.file));

  const projects: ModrithProject[] = [];
  const versions: {[key: string]: ModrinthVersion} = {};

  try {
    const modrinthProjects = mods.filter(isModrinthFile)
      .map((mod) => mod.update.modrinth["mod-id"])

    const url = new URL("/v2/projects", "https://api.modrinth.com/");

    url.searchParams.set("ids", JSON.stringify(modrinthProjects));

    const res = await Axios.get<ModrithProject[]>(url.toString(), {
      headers: {
        "User-Agent":
          "anthonyporthouse/packwiz-renderer/0.1.0 (anthony@porthou.se)",
      },
    });
    res.data.map((project) => projects.push(project));

    // Fetch all versions we have

    const modrinthVersions = mods.filter(isModrinthFile)
      .map((mod) => mod.update.modrinth.version)

    const versionUrl = new URL("/v2/versions", "https://api.modrinth.com/");

    versionUrl.searchParams.set("ids", JSON.stringify(modrinthVersions));

    const versionRes = await Axios.get<ModrinthVersion[]>(versionUrl.toString(), {
      headers: {
        "User-Agent":
          "anthonyporthouse/packwiz-renderer/0.1.0 (anthony@porthou.se)",
      },
    });
    versionRes.data.map((version: ModrinthVersion) => versions[version.project_id] = version);
  } catch (e) {
    console.error(e);
    return;
  }

  const sortedProjects = projects.sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const template = Handlebars.compile(
    readFileSync("./templates/index.hbs", "utf-8")
  );
  const output = template({
    pack: pack,
    mods: sortedProjects.filter((project) => project.project_type === "mod"),
    resourcePacks: sortedProjects.filter(
      (project) => project.project_type === "resourcepack"
    ),
    versions: versions
  });

  mkdirSync('./public', { recursive: true })

  writeFileSync("./public/index.html", output);
}

await main();
