interface SystemPlugin {}
class System {
  systemPlugin: SystemPlugin;
  constructor(systemPlugin: SystemPlugin) {
    this.systemPlugin = systemPlugin;
  }
}
export { System };
export type { SystemPlugin };
