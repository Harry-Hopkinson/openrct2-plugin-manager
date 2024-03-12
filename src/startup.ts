import { box, label, window, checkbox } from "openrct2-flexui";
import * as fs from "fs";

const baseHeight = 50;
const heightPerPlugin = 20;

export const allWidgets = window({
  title: "OpenRCT2 Plugin Manager",
  width: { value: 200, min: 200, max: 10_000 },
  height: {
    value: baseHeight + pluginManager.plugins.length * heightPerPlugin,
    min: 200,
    max: 10_000,
  },
  content: [
    box({
      content: label({
        text: "Your plugins",
        alignment: "centred",
      }),
    }),
    label({
      text: pluginManager.plugins
        .map((plugin) => {
          return plugin.name;
        })
        .join("\n\n"),
    }),
  ],
});

export function startup() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Plugin Manager";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
  }
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

export function registerPlugin(name: String) {
  registerPlugin(name);
}
