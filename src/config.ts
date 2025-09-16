import * as core from "@actions/core";
import * as github from "@actions/github";

interface Config {
  localeRepo: string;
  localeRepoToken: string | null;
  resourceName: string;
  localeDirectory: string;
}

const config: Config = {
  localeRepo: core.getInput('locale-repo', { required: true }),
  localeRepoToken: core.getInput('locale-repo-token', { required: false }),

  resourceName: core.getInput('resource-name', { required: false }),
  localeDirectory: core.getInput('locale-directory', { required: false }),
};

if (!config.localeRepo) {
  throw new Error("The 'locale-repo' input is required.");
}

if (!config.resourceName) {
  const { repo } = github.context.repo;

  core.warning(`The 'resource-name' was not specified, using '${repo}'. Please define explicitly the repositor as 'owner/repository'.`);
  
  config.resourceName = repo;
}

if (!config.localeDirectory) {
  core.warning("The 'locale-directory' was not specified, using './locales/'. Please define explicitly the path.");
}

export default config;
