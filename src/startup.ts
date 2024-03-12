import { label, window, listview, box, Bindable } from "openrct2-flexui";
import * as fs from "fs";

const baseHeight = 40;
const heightPerPlugin = 15;
let plugin: Bindable<String> = "";

export const allWidgets = window({
  title: "OpenRCT2 Plugin Manager",
  width: {
    value: 400,
    min: 200,
    max: 10_000,
  },
  height: {
    value: baseHeight + pluginManager.plugins.length * heightPerPlugin,
    min: 200,
    max: 10_000,
  },
  content: [
    listview({
      items: pluginManager.plugins.map(
        (plugin) => `${plugin.name} - ${plugin.authors.toString()}`
      ),
      onClick: (index) => {
        plugin = fetchInfo();
        park.postMessage(updateInfo(index));
      },
    }),
    box({
      content: label({
        text: plugin.toString(),
        alignment: "centred",
      }),
    }),
  ],
});

export function startup() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Plugin Manager";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
  }
}

function updateInfo(index: number) {
  return pluginManager.plugins[index].name;
}

function fetchInfo() {
  return plugin.toString();
}

export function removePlugins(name: string) {
  let path: string = "";
  // check if on mac, windows, or linux
  if (process.platform === "darwin") {
    path = "~/Library/Application Support/OpenRCT2/plugin";
  } else if (process.platform === "win32") {
    let username = process.env.USERNAME;
    path = `C:\\Users\\${username}\\Documents\\OpenRCT2\\plugin`;
  } else {
    path = "~/.config/OpenRCT2/plugin";
  }

  if (path !== "") {
    fs.readdir(path, (err, files) => {
      if (err) {
        console.error(err);
      }
      for (let file of files) {
        if (file.includes(name)) {
          fs.unlink(`${path}/${file}`, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
    });
  }
}
