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

const filterSize = (filteredProducts, size) => {
  if (Array.isArray(size)) {
    return filteredProducts.filter((product) =>
      product.size.some((item) => size.includes(item))
    );
  } else {
    return filteredProducts.filter((product) =>
      product.size.some((item) => item == size)
    );
  }
};

const filterRating = (filteredProducts, rating) => {
  return filteredProducts.filter((product) => product.rating >= Number(rating));
};

const sortProducts = (filteredProducts, sort) => {
  if (sort === "stock") {
    return filteredProducts;
  }
  return [...filteredProducts].sort((a, b) => {
    if (sort === "ascPrice") {
      return a.price - b.price;
    } else if (sort === "descPrice") {
      return b.price - a.price;
    }
  });
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
    sort,
    categories,
    size,
    brand,
    rating,
    colorWithNames,
  } = req.query;
  let filteredProducts = [...products];

  if (priceRange) {
    filteredProducts = filterPriceRange(filteredProducts, priceRange);
  }

  if (categories) {
    filteredProducts = filterFacets(filteredProducts, categories, "category");
  }

  if (size) {
    filteredProducts = filterSize(filteredProducts, size);
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

  const sortedProducts = sortProducts(filteredProducts, sort);

  const updatedProducts = paginateProducts(
    sortedProducts,
    Number(pageNumber),
    Number(pageSize)
  );

  res.send(updatedProducts);
};

export default getProducts;
