export interface GithubApiFileListing {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: "file" | "dir";
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

interface LocaleFileData {
  [key: string]: string | LocaleFileData;
}

export async function fetchLocaleFileRefs(repository: string, resource: string) {
  const url = `https://api.github.com/repos/${repository}/contents/${resource}?ref=main`;

  const response = await fetch(url);
  const data: GithubApiFileListing[] = await response.json();

  const fileUrls = data.map(({ name, download_url }) => ({ name, link: download_url}));

  return fileUrls;
} 

export async function getGithubFileContent(url: string) {
  const response = await fetch(url);
  const data: LocaleFileData = await response.json();

  return data;
}
