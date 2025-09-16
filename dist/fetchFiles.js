"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLocaleFileRefs = fetchLocaleFileRefs;
exports.getGithubFileContent = getGithubFileContent;
async function fetchLocaleFileRefs(repository, resource) {
    const url = `https://api.github.com/repos/${repository}/contents/${resource}?ref=main`;
    const response = await fetch(url);
    const data = await response.json();
    const fileUrls = data.map(({ name, download_url }) => ({ name, link: download_url }));
    return fileUrls;
}
async function getGithubFileContent(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
