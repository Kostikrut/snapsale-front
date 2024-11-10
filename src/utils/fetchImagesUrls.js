import { config } from "../config";

const apiUrl = config.API_URL;

export async function fetchImagesUrls(imagesName) {
  try {
    const res = await fetch(`${apiUrl}/api/v1/listings/getImagesUrls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: imagesName }),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return data.data;
  } catch (err) {
    console.error("Couldn't fetch images:", err.message || err);
    throw err;
  }
}
