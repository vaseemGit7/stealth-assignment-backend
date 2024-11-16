import products from "../database/productsDB.js";

const filterCategories = (filteredProducts, categories) => {
  if (Array.isArray(categories)) {
    return filteredProducts.filter((product) =>
      categories.includes(product["category"])
    );
  } else {
    return filteredProducts.filter(
      (product) => product["category"] == categories
    );
  }
};

const paginateProducts = (filteredProducts, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return filteredProducts.slice(startIndex, startIndex + pageSize);
};

const getProducts = (req, res) => {
  const { categories, pageNumber, pageSize } = req.query;
  const filteredProducts = products;

  const categoryFiltered = filterCategories(filteredProducts, categories);

  const updatedProducts = paginateProducts(
    categoryFiltered,
    Number(pageNumber),
    Number(pageSize)
  );

  res.send(updatedProducts);
};

export default getProducts;
