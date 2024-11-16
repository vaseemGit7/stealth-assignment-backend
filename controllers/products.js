import products from "../database/productsDB.js";

const filterFacets = (filteredProducts, facet, key) => {
  if (Array.isArray(facet)) {
    return filteredProducts.filter((product) => facet.includes(product[key]));
  } else {
    return filteredProducts.filter((product) => product[key] === facet);
  }
};

const filterPriceRange = (filteredProducts, priceRange) => {
  const price = priceRange.split("-");
  const minPrice = price[0];
  const maxPrice = price[1];

  return filteredProducts.filter(
    (product) =>
      product.price >= Number(minPrice) && product.price <= Number(maxPrice)
  );
};

const filterRating = (filteredProducts, rating) => {
  return filteredProducts.filter((product) => product.rating >= Number(rating));
};

const paginateProducts = (filteredProducts, pageNumber, pageSize) => {
  const startIndex = (pageNumber - 1) * pageSize;
  return filteredProducts.slice(startIndex, startIndex + pageSize);
};

const getProducts = (req, res) => {
  const {
    pageNumber,
    pageSize,
    priceRange,
    categories,
    brand,
    rating,
    colorWithNames,
  } = req.query;
  let filteredProducts = products;

  if (priceRange) {
    filteredProducts = filterPriceRange(filteredProducts, priceRange);
  }

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
