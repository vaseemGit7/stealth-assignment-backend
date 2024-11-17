import products from "../database/productsDB.js";

const getOccurence = (filteredProducts, facetKey) => {
  let facetOccurence = {};

  if (facetKey === "size") {
    filteredProducts.forEach((product) => {
      product.size.forEach((facetValue) => {
        if (facetOccurence[facetValue]) {
          facetOccurence[facetValue]++;
        } else {
          facetOccurence[facetValue] = 1;
        }
      });
    });
  } else {
    filteredProducts.forEach((product) => {
      const facetValue = product[facetKey];
      if (facetOccurence[facetValue]) {
        facetOccurence[facetValue]++;
      } else {
        facetOccurence[facetValue] = 1;
      }
    });
  }

  return facetOccurence;
};

const getFacets = (filteredProducts) => {
  const categoryOccurence = getOccurence(filteredProducts, "category");
  const brandOccurence = getOccurence(filteredProducts, "brand");
  const colorOccurence = getOccurence(filteredProducts, "color");
  const ratingOccurence = getOccurence(filteredProducts, "rating");
  const sizeOccurence = getOccurence(filteredProducts, "size");
  console.log(sizeOccurence);
};

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

  getFacets(filteredProducts);

  const sortedProducts = sortProducts(filteredProducts, sort);

  const updatedProducts = paginateProducts(
    sortedProducts,
    Number(pageNumber),
    Number(pageSize)
  );

  res.send(updatedProducts);
};

export default getProducts;
