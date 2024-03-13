import { label, tab, tabwindow, box, listview, store } from "openrct2-flexui";
import * as fs from "fs";

const baseHeight = 35;
const heightPerPlugin = 15;

const selectedPlugin = store("");

function updatePlugin(sourceName: string): void {
  selectedPlugin.set(sourceName);
}

export const allWidgets = tabwindow({
  title: "OpenRCT2 Plugin Manager",
  width: {
    value: 350,
    min: 150,
    max: 10_000,
  },
  height: {
    value: baseHeight + pluginManager.plugins.length * heightPerPlugin,
    min: baseHeight + heightPerPlugin,
    max: 10_000,
  },
  tabs: [
    tab({
      image: "search",
      content: [
        label({
          text: "Select a plugin to view more information",
          alignment: "centred",
        }),
        listview({
          items: pluginManager.plugins.map((plugin) => `${plugin.name}`),
          onClick: (index) => {
            const info =
              pluginManager.plugins[index].name +
              " - Author(s): " +
              pluginManager.plugins[index].authors;
            updatePlugin(info);
          },
        }),
        box({
          content: label({
            text: selectedPlugin,
            alignment: "centred",
          }),
        }),
      ],
    }),
    // tab({
    //   image: {
    //     frameBase: 5367,
    //     frameCount: 8,
    //     frameDuration: 4,
    //   },
    //   content: [],
    // }),
  ],
});

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

export function startup() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Plugin Manager";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
  }
}
