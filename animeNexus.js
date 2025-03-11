const fetch = require('node-fetch');

async function searchResults(query) {
    try {
        const url = `https://anime.nexus/api/anime/details/episodes?id=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();

        return data.results.map(item => ({
            id: item.id,
            title: item.title,
            url: `https://anime.nexus/watch/${item.id}`,
            image: item.image,
        }));
    } catch (err) {
        console.error('Error in searchResults:', err);
        return [];
    }
}

async function extractDetails(id) {
    try {
        const url = `https://anime.nexus/api/anime/details/episodes?id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            title: data.title,
            description: data.description,
            image: data.image,
            episodes: data.episodes.map(episode => ({
                id: episode.id,
                title: episode.title,
                url: `https://anime.nexus/watch/${episode.id}`,
            })),
        };
    } catch (err) {
        console.error('Error in extractDetails:', err);
        return null;
    }
}

async function extractStreamUrl(id) {
    try {
        const url = `https://anime.nexus/api/anime/details/episode/stream?id=${encodeURIComponent(id)}`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            url: data.streamUrl,
            quality: data.quality,
            subtitles: data.subtitles || [],
        };
    } catch (err) {
        console.error('Error in extractStreamUrl:', err);
        return null;
    }
}

module.exports = {
    searchResults,
    extractDetails,
    extractStreamUrl,
};
