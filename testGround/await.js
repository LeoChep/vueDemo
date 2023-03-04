var res = "f";

async function f2() {
  console.log("f2");
}

async function run() {
  const promise = f1();
  await promise;
  console.log(res);
  f2();
}
async function f1() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      res = "res";
      console.log("f1");
      resolve();
    }, 4000);
  });
}
const promise2 = async () => {
  await f1();
  console.log("promise2");
};
const promise3 = async () => {
  await promise2();
};
promise3();
run().then();
