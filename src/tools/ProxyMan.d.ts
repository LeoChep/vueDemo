// Type definitions for ./ProxyMan.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace ProxyManHandler.prototype {
  // ProxyManHandler.prototype.set.!0

  /**
   *
   */
  interface Set0 {}
}

/**
 *
 */
declare interface ProxyManHandler {
  /**
   *
   */
  new ();

  /**
   *
   * @param target
   * @param prop
   * @param value
   * @param proxy
   * @return
   */
  set(
    target: ProxyManHandler.prototype.Set0,
    prop: any,
    value: any,
    proxy: any
  ): boolean;

  /**
   *
   * @param target
   * @param prop
   * @return
   */
  get(target: any, prop: any): /* !this */ any;

  /**
   *
   * @param watchers
   * @param prop
   * @param thisArg
   * @param argumentsList
   */
  _invoke_watchers(
    watchers: any,
    prop: any,
    thisArg: /* ProxyManHandler.prototype.+ProxyManHandler */ any,
    argumentsList: any
  ): void;

  /**
   *
   * @param {}
   */
  // eslint-disable-next-line no-empty-pattern
  watchers_before({}: any): void;

  /**
   *
   */
  _addWatcherProxy: Proxy;
}

/**
 *
 */
declare interface ProxyMan {
  /**
   *
   * @return
   */
  new (): ProxyMan;
}

/**
 *
 */
declare namespace ProxyMan {
  /**
   *
   * @param target
   * @return
   */
  function getProxy(target: any): Proxy;
}

/**
 *
 */
declare interface Watcher {
  /**
   *
   * @param key
   * @param f
   */
  new (key: any, f: any);

  /**
   *
   * @param plane
   * @param target
   */
  watch(plane: any, target: any): void;
}
