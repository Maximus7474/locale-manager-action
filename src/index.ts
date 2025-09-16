import path from 'path';
import { promises as fs, constants } from 'fs';
import * as core from "@actions/core";

import config from './config';
import { fetchLocaleFileRefs, getGithubFileContent } from './fetchFiles';

export async function run() {
  try {
    core.info('Easter Egg *wink wink*');

    const workspace = process.env.GITHUB_WORKSPACE;
    if (!workspace) {
      throw new Error('GITHUB_WORKSPACE environment variable is not set.');
    }

    const localePath = path.join(workspace, config.localeDirectory);

    try {
      await fs.access(localePath, constants.F_OK | constants.W_OK);
    } catch (error) {
      throw new Error(`The specified locale directory '${localePath}' does not exist or is not writable. Please check your configuration.`);
    }


    const localeFiles = await fetchLocaleFileRefs(config.localeRepo, config.resourceName);

    if (localeFiles.length === 0) {
      core.warning('No locale files found, skipping...');
      return;
    }

    for (const locale of localeFiles) {
      const localeObject = await getGithubFileContent(locale.link);
      const localeFile = path.join(localePath, locale.name);
      
      await fs.writeFile(
        localeFile, 
        JSON.stringify(localeObject, null, 2),
        'utf-8'
      );
    }

    core.info('Latest versions of locale files have been added to the project');
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();
