const subscribe = (targetObj: any, key: any, f: Function) => {
  const proxy = new Proxy(targetObj, {
    set(target, prop, value, proxy) {
      target[prop] = value;
      if (prop === key) {
        f();
      }
      return true;
    },
  });
  targetObj.hook = proxy;
  return proxy;
};
export { subscribe };
