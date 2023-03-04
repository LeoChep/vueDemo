const subscribe = (targetObj: any, key: any, f: Function) => {
  targetObj = new Proxy(targetObj, {
    set(target, prop, value, proxy) {
      target[prop] = value;
      if (prop === key) {
        f();
      }
      return true;
    },
  });
  return targetObj;
};
export { subscribe };
