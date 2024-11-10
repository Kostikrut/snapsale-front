import { useEffect, useState } from "react";
import { getCategories } from "../config";

export default function useCategory(refetchTrigger) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        const categories = res.categories.map((cat) => cat);

        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [refetchTrigger]); // re-fetch when refetchTrigger changes

  return categories;
}
