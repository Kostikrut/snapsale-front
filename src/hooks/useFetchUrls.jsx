import { useEffect, useState } from "react";
import { fetchImagesUrls } from "../utils/fetchImagesUrls";

export default function useFetchUrls(data, storageKey) {
  const [dataWithImages, setDataWithImages] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return; // Exit if data is empty

    const fetchDataWithImages = async () => {
      const dataCopy = data.map((item) => ({ ...item }));
      const dataImages = dataCopy.map((listing) => listing.image.filename);

      try {
        const urls = await fetchImagesUrls(dataImages);
        urls.forEach((url, i) => (dataCopy[i].image.url = url));

        setDataWithImages(dataCopy);
      } catch (err) {
        console.error(
          err.message || "Couldn't get images, please try again later."
        );
      }
    };

    fetchDataWithImages();
  }, [data]);

  return { dataWithImages };
}
