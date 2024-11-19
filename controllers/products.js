import products from "../database/productsDB.js";

const getOccurence = (filteredProducts, facetKey) => {
  const facetOccurrence = new Map();

  filteredProducts.forEach((product) => {
    if (facetKey === "size" || facetKey === "color") {
      product[facetKey].forEach((facetValue) => {
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

const getOthers = (filteredProducts) => {
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    return a.price - b.price;
  });

  return {
    minPrice: sortedProducts[0]?.price,
    maxPrice: sortedProducts[sortedProducts.length - 1]?.price,
    totalProducts: filteredProducts.length,
  };
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
    sortBy,
    categories,
    sizes,
    brands,
    ratings,
    colorWithNames,
  } = req.query;
  let filteredProducts = [...products];

  if (priceRange) {
    filteredProducts = filterPriceRange(filteredProducts, priceRange);
  }

  if (sizes) {
    filteredProducts = filterSize(filteredProducts, sizes);
  }

  if (brands) {
    filteredProducts = filterFacets(filteredProducts, brands, "brand");
  }

  if (ratings) {
    filteredProducts = filterRating(filteredProducts, ratings);
  }

  if (colorWithNames) {
    filteredProducts = filterFacets(filteredProducts, colorWithNames, "color");
  }

  const facets = getFacets(filteredProducts);
  const others = getOthers(filteredProducts);

  if (categories) {
    filteredProducts = filterFacets(filteredProducts, categories, "category");
  }

  const sortedProducts = sortProducts(filteredProducts, sortBy);

  const updatedProducts = paginateProducts(
    sortedProducts,
    Number(pageNumber),
    Number(pageSize)
  );

  const data = { result: updatedProducts, facets: facets, others: others };

  res.send(data);
};

export default getProducts;
