import axios from "axios";

export function getModrinthClient() {
  return axios.create({
    baseURL: "https://api.modrinth.com/",
    headers: {
      "User-Agent":
        "anthonyporthouse/packwiz-renderer/0.1.0 (anthony@porthou.se)",
    },
  });
}

export function getCurseforgeClient() {
    return axios.create({
        baseURL: "https://api.curseforge.com/",
        headers: {
          "User-Agent":
            "anthonyporthouse/packwiz-renderer/0.1.0 (anthony@porthou.se)",
            "x-api-key": process.env.CURSEFORGE_KEY
        },
      });
}