import "./stylesheets/main.css";

// Small helpers you might want to keep
import "./helpers/context_menu.js";
import "./helpers/external_links.js";

// ----------------------------------------------------------------------------
// Everything below is just to show you how it works. You can delete all of it.
// ----------------------------------------------------------------------------

import { remote } from "electron";
import jetpack from "fs-jetpack";
import { greet } from "./hello_world/hello_world";
import env from "env";

const app = remote.app;
const basePath = 'txt';
const appDir = jetpack.cwd(app.getAppPath());
const appDirRoot = jetpack.cwd(basePath);

// Holy crap! This is browser window with HTML and stuff, but I can read
// files from disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read("package.json", "json");

const osMap = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux"
};

const refreshFilesList = ()=>{
  var foldersList = ""
  appDirRoot.find('.',{matching:['*']}).forEach(x=>{
    var info = jetpack.inspect(`${basePath}/${x}`);
    foldersList = foldersList.concat(`<span class="file-item">${x} <span class="file-size">${info.size} bytes</span></span>`);
  });
  
  document.querySelector("#files").innerHTML = foldersList;
}
refreshFilesList();
setInterval(()=>{
  refreshFilesList();
},2000);


document.querySelector("#app").style.display = "block";
document.querySelector("#greet").innerHTML = greet();
document.querySelector("#os").innerHTML = osMap[process.platform];
document.querySelector("#env").innerHTML = env.name;
document.querySelector("#electron-version").innerHTML = process.versions.electron;
