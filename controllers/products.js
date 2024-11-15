import products from "../database/productsDB.js";

const paginateProducts = (filteredProducts, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return filteredProducts.slice(startIndex, startIndex + pageSize);
};

const getProducts = (req, res) => {
  const { pageNumber, pageSize } = req.query;
  const filteredProducts = products;

  const updatedProducts = paginateProducts(
    filteredProducts,
    Number(pageNumber),
    Number(pageSize)
  );

  res.send(updatedProducts);
};

export default getProducts;
