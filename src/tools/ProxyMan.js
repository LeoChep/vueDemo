class ProxyManHandler {
  set(target, prop, value, proxy) {
    proxy._handler._invoke_watchers(
      proxy._handler.watchers_before[prop],
      prop,
      this,
      [value, target[prop]]
    );
    var oldVal = target[prop];
    target[prop] = value;
    //console.log("setValue");
    proxy._handler._invoke_watchers(
      proxy._handler.watchers_after[prop],
      prop,
      this,
      [value, oldVal]
    );
    return true;
  }
  get(target, prop) {
    //  console.log(prop);
    //console.log(this);
    var type = typeof target[prop];
    if (prop == "_target") return target;
    if (prop == "_handler") return this;
    if (prop == "_addWatcher") {
      if (this._addWatcherProxy == undefined)
        this._addWatcherProxy = new Proxy(this.addWatcher, {
          apply: (target, thisArg, argumentsList) => {
            this.addWatcher.apply(this, argumentsList);
            return;
          },
        });
      return this._addWatcherProxy;
    }
    if (type == "function") {
      console.log("run function");
      var newF = new Proxy(target[prop], {
        apply: (target, thisArg, argumentsList) => {
          console.log("apply");
          console.log(this);
          //   console.log(target.name);
          //  console.log(argumentsList);
          this._invoke_watchers(
            this.watchers_before[target.name],
            target.name,
            this, //这里的this为声明的ProxyManHandler
            argumentsList
          );
          console.log(target);
          var result = target.apply(thisArg, argumentsList); //thisArg 为执行函数时的函数体中的this，也是外部调用函数时传入的本来函数的this
          //     console.log("proxy function");
          this._invoke_watchers(
            this.watchers_after[target.name],
            target.name,
            this, //这里的this为声明的ProxyManHandler
            argumentsList
          );
          return result;
        },
      });
      return newF;
    } else return target[prop];
  }
  _invoke_watchers(watchers, prop, thisArg, argumentsList) {
    //  console.log("invoke_watcher");
    //  console.log(watchers);
    var length = watchers == undefined ? 0 : watchers.length;
    for (var i = 0; i < length; i++) {
      var newArgs = [thisArg, watchers[i], argumentsList];
      watchers[i]["function"].apply(watchers[i]["function"], newArgs);
    }
    console.log("invoke_watcher" + prop);
  }
  watchers_before = {};
  watchers_after = {};
  addWatcher(watcher, plane) {
    var key = watcher.key;
    console.log("add watcher " + key);
    // console.log(this.watchers);
    var watchers = [];
    if (plane === "before") watchers = this.watchers_before;
    if (plane === "after") watchers = this.watchers_after;
    if (watchers[key] == undefined) watchers[key] = [];
    watchers[key].push(watcher);
    // console.log(this);
  }
}

class ProxyMan {
  static getProxy(target) {
    var handler = new ProxyManHandler();
    var testProxy = new Proxy(target, handler);
    return testProxy;
  }
}

class Watcher {
  constructor(key, f) {
    this.key = key;
    this.function = f;
  }
  watch(plane, target) {
    target._addWatcher(this, plane);
  }
}
export { ProxyMan, ProxyManHandler, Watcher };
