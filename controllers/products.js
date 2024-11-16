import products from "../database/productsDB.js";

const filterFacets = (filteredProducts, facet, key) => {
  if (Array.isArray(facet)) {
    return filteredProducts.filter((product) => facet.includes(product[key]));
  } else {
    return filteredProducts.filter((product) => product[key] === facet);
  }
};

const filterRating = (filteredProducts, rating) => {
  return filteredProducts.filter((product) => product.rating >= rating);
};

const paginateProducts = (filteredProducts, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return filteredProducts.slice(startIndex, startIndex + pageSize);
};

const getProducts = (req, res) => {
  const { pageNumber, pageSize, categories, brand, rating, colorWithNames } =
    req.query;
  let filteredProducts = products;

  if (categories) {
    filteredProducts = filterFacets(filteredProducts, categories, "category");
  }

  if (brand) {
    filteredProducts = filterFacets(filteredProducts, brand, "brand");
  }

  if (rating) {
    filteredProducts = filterRating(filteredProducts, rating);
  }

  if (colorWithNames) {
    filteredProducts = filterFacets(filteredProducts, colorWithNames, "color");
  }

  const updatedProducts = paginateProducts(
    filteredProducts,
    Number(pageNumber),
    Number(pageSize)
  );

  res.send(updatedProducts);
};

export default getProducts;
