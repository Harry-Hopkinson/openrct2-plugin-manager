import { label, tab, tabwindow, box, listview, store } from "openrct2-flexui";

const baseHeight = 90;
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
  ],
});

export function startup() {
  if (typeof ui !== "undefined") {
    const menuItemName = "Plugin Manager";
    ui.registerMenuItem(menuItemName, () => allWidgets.open());
    ui.registerToolboxMenuItem(menuItemName, () => allWidgets.open());
  }
}
