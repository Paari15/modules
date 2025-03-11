// animeNexus.js - Sora Module for Anime Nexus
const cheerio = require('cheerio');
const axios = require('axios');

async function fetchHtml(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching HTML from ${url}:`, error);
        return null;
    }
}

async function searchResults(html) {
    const $ = cheerio.load(html);
    let results = [];
    $(".anime-card").each((i, elem) => {
        const title = $(elem).find(".title").text();
        const image = $(elem).find("img").attr("src");
        const link = $(elem).find("a").attr("href");
        results.push({ title, image, link });
    });
    return results;
}

async function extractDetails(html) {
    const $ = cheerio.load(html);
    let details = {
        title: $(".anime-title").text(),
        description: $(".anime-description").text(),
        aliases: $(".anime-aliases").text(),
        airDate: $(".anime-air-date").text()
    };
    return details;
}

async function extractEpisodes(html) {
    const $ = cheerio.load(html);
    let episodes = [];
    $(".episode-item").each((i, elem) => {
        const number = $(elem).find(".episode-number").text();
        const title = $(elem).find(".episode-title").text();
        const link = $(elem).find("a").attr("href");
        episodes.push({ number, title, link });
    });
    return episodes;
}

async function extractStreamUrl(html) {
    const $ = cheerio.load(html);
    const streamUrl = $("video").attr("src");
    return streamUrl;
}

module.exports = {
    fetchHtml,
    searchResults,
    extractDetails,
    extractEpisodes,
    extractStreamUrl
};

// animeNexus.json - Configuration file for Sora Module
const config = {
    name: "Anime Nexus",
    baseUrl: "https://anime.nexus",
    endpoints: {
        featured: "/api/anime/featured",
        details: "/api/anime/details/episodes",
        stream: "/api/anime/details/episode/stream"
    },
    searchEnabled: true,
    episodeListing: true
};

module.exports = config;
