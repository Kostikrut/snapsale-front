const config = {
  API_URL: "https://snapsalemarket.store",
};

const getCategories = async () => {
  const res = await fetch(config.API_URL + "/api/v1/categories");

  if (!res.ok) return null;

  const categories = await res.json();

  return categories.data;
};

export { getCategories, config };
