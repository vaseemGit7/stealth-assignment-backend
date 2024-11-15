import products from "../database/productsDB.js";

const getProducts = (req, res) => {
  res.send(products);
};

export default getProducts;
