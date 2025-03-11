// AnimeNexus.js - Sora Module for anime.nexus
const BASE_URL = "https://anime.nexus";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

// Utility function to make API requests
async function fetchAPI(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": USER_AGENT,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Get list of featured anime
async function getAnimeList() {
  const data = await fetchAPI("/api/anime/featured");
  // Adjust field names based on actual API response
  return data.map((item) => ({
    id: item.id || item.animeId,              // Unique anime ID
    title: item.title || item.name,           // Anime title
    image: item.image || item.thumbnail,      // Poster image URL
    url: `/anime/${item.id || item.animeId}`, // Custom URL for Sora
  }));
}

// Get episodes for a specific anime
async function getAnimeEpisodes(animeId, page = 1, perPage = 20) {
  const data = await fetchAPI("/api/anime/details/episodes", {
    id: animeId,
    page: page,
    perPage: perPage,
    order: "asc",
  });

  // Assuming data contains an "episodes" array
  return data.episodes.map((ep) => ({
    id: ep.id || ep.episodeId,                // Unique episode ID
    number: ep.number || ep.episodeNumber,    // Episode number
    title: ep.title || `Episode ${ep.number || ep.episodeNumber}`,
    url: `/episode/${ep.id || ep.episodeId}`, // Custom URL for Sora
  }));
}

// Get streaming sources for an episode
async function getEpisodeSources(episodeId) {
  const data = await fetchAPI("/api/anime/details/episode/stream", { id: episodeId });

  // Assuming data contains a "sources" array with video links
  return data.sources.map((source) => ({
    url: source.url || source.link,           // Video URL
    quality: source.quality || "auto",        // e.g., "1080p", "720p"
    isM3U8: (source.url || source.link).includes(".m3u8"), // Detect HLS streams
  }));
}

// Export Sora-compatible module
module.exports = {
  name: "AnimeNexus",
  version: "1.0.0",
  description: "Module for scraping anime.nexus",
  author: "YourName", // Replace with your name or handle
  language: "English",
  appVersion: "V2 and up",
  async: true, // Indicate this is an async module
  getAnimeList,
  getAnimeEpisodes,
  getEpisodeSources,
};
