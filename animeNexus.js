const fetch = require('node-fetch');

async function searchResults(query) {
    try {
        const url = `https://anime.nexus/api/anime/details/episodes?id=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.results) throw new Error("No results found");

        return {
            status: "success",
            results: data.results.map(item => ({
                id: item.id,
                title: item.title,
                url: `https://anime.nexus/watch/${item.id}`,
                image: item.image || ""
            }))
        };
    } catch (err) {
        console.error('Error in searchResults:', err.message);
        return { status: "error", message: err.message };
    }
}

async function extractDetails(id) {
    try {
        const url = `https://anime.nexus/api/anime/details/episodes?id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data) throw new Error("No data found");

        return {
            status: "success",
            title: data.title,
            description: data.description,
            image: data.image,
            episodes: data.episodes.map(episode => ({
                id: episode.id,
                title: episode.title,
                url: `https://anime.nexus/watch/${episode.id}`
            }))
        };
    } catch (err) {
        console.error('Error in extractDetails:', err.message);
        return { status: "error", message: err.message };
    }
}

async function extractStreamUrl(id) {
    try {
        const url = `https://anime.nexus/api/anime/details/episode/stream?id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.streamUrl) throw new Error("Stream URL not found");

        return {
            status: "success",
            streamUrl: data.streamUrl,
            quality: data.quality,
            subtitles: data.subtitles || []
        };
    } catch (err) {
        console.error('Error in extractStreamUrl:', err.message);
        return { status: "error", message: err.message };
    }
}

module.exports = {
    searchResults,
    extractDetails,
    extractStreamUrl,
};
