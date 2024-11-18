import products from "../database/productsDB.js";

const getOccurence = (filteredProducts, facetKey) => {
  const facetOccurrence = new Map();

  filteredProducts.forEach((product) => {
    if (facetKey === "size") {
      product.size.forEach((facetValue) => {
        facetOccurrence.set(
          facetValue,
          (facetOccurrence.get(facetValue) || 0) + 1
        );
      });
    } else {
      const facetValue = product[facetKey];
      facetOccurrence.set(
        facetValue,
        (facetOccurrence.get(facetValue) || 0) + 1
      );
    }
  });

  return Array.from(facetOccurrence.entries()).map(([key, value]) => ({
    code: key,
    count: value,
  }));
};

const getFacets = (filteredProducts) => {
  const categoryOccurence = getOccurence(filteredProducts, "category");
  const brandOccurence = getOccurence(filteredProducts, "brand");
  const colorOccurence = getOccurence(filteredProducts, "color");
  const ratingOccurence = getOccurence(filteredProducts, "rating");
  const sizeOccurence = getOccurence(filteredProducts, "size");

  const facets = [
    { code: "categories", values: categoryOccurence },
    { code: "brands", values: brandOccurence },
    { code: "colorWithNames", values: colorOccurence },
    { code: "ratings", values: ratingOccurence },
    { code: "sizes", values: sizeOccurence },
  ];

  return facets;
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

  const facets = getFacets(filteredProducts);

  if (categories) {
    filteredProducts = filterFacets(filteredProducts, categories, "category");
  }

  const sortedProducts = sortProducts(filteredProducts, sort);

  const updatedProducts = paginateProducts(
    sortedProducts,
    Number(pageNumber),
    Number(pageSize)
  );

  const data = { result: updatedProducts, facets: facets };

  res.send(data);
};

export default getProducts;
