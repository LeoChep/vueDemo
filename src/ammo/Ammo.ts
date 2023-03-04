import Ammo from "ammojs-typed";

const instanse = null;
const getInstanse = async () => {
  if (instanse === null) {
    const a = async () => {
      return await Ammo();
    };
    return await a();
    return;
    return instanse;
  }
};

export { getInstanse };
