const F = () => {
  const f1 = () => {
    console.log("f1");
  };
  const f2 = () => {
    console.log("f2");
  };
  return { f1, f2 };
};
const f = F();
f.f1();
export default f;
