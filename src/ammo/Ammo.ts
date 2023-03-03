import Ammo from "ammojs-typed";

const instanse = null;
const getInstanse = async () => {
  if (instanse === null) {
    return await Ammo();
  } else {
    return instanse;
  }
};

export { getInstanse };
