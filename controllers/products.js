import products from "../database/productsDB.js";

const filterFacets = (filteredProducts, facet, key) => {
  if (Array.isArray(facet)) {
    return filteredProducts.filter((product) => facet.includes(product[key]));
  } else {
    return filteredProducts.filter((product) => product[key] === facet);
  }
};

const paginateProducts = (filteredProducts, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return filteredProducts.slice(startIndex, startIndex + pageSize);
};

const getProducts = (req, res) => {
  const { brand, categories, pageNumber, pageSize } = req.query;
  const filteredProducts = products;

  const categoryFiltered = filterFacets(
    filteredProducts,
    categories,
    "category"
  );
  const brandFiltered = filterFacets(categoryFiltered, brand, "brand");

  const updatedProducts = paginateProducts(
    brandFiltered,
    Number(pageNumber),
    Number(pageSize)
  );

  res.send(updatedProducts);
};

export default getProducts;
