import React, { createContext, useState, useEffect } from "react";

import useFetchUrls from "../hooks/useFetchUrls";

export const FavoriteContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  useFetchUrls(favorites, "favorites");

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const addToFavorites = (item) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.find((fav) => fav.id === item.id)) {
        localStorage.setItem(
          "favorites",
          JSON.stringify([...prevFavorites, item])
        );

        return [...prevFavorites, item];
      }
      return prevFavorites;
    });
  };

  const removeFromFavorite = (itemId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== itemId)
    );
  };

  const isFavorite = (itemId) => {
    return favorites.some((fav) => fav.id === itemId);
  };

  const handleFavoriteClick = (item) => {
    if (isFavorite(item.id)) {
      removeFromFavorite(item.id);
    } else {
      addToFavorites(item);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        handleFavoriteClick,
        favorites,
        addToFavorites,
        removeFromFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

// useEffect(() => {
//   const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
//   if (!storedFavorites) return;

//   const getImages = async () => {
//     const imagesName = storedFavorites.map(
//       (listing) => listing.image.filename
//     );

//     try {
//       const urls = await fetchImagesUrls(imagesName);

//       urls.forEach((url, i) => (storedFavorites[i].image.url = url));
//     } catch (err) {
//       console.error(
//         err.message || "Couldn't get images, please try again later."
//       );
//     }
//   };

//   getImages();

//   setFavorites(storedFavorites);
// }, []);

// useEffect(() => {
//   localStorage.setItem("favorites", JSON.stringify(favorites));
// }, [favorites]);
