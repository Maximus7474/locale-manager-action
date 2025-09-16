"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const core = __importStar(require("@actions/core"));
const config_1 = __importDefault(require("./config"));
const fetchFiles_1 = require("./fetchFiles");
async function run() {
    try {
        const workspace = process.env.GITHUB_WORKSPACE;
        if (!workspace) {
            throw new Error('GITHUB_WORKSPACE environment variable is not set.');
        }
        const localePath = path_1.default.join(workspace, config_1.default.localeDirectory);
        try {
            await fs_1.promises.access(localePath, fs_1.constants.F_OK | fs_1.constants.W_OK);
        }
        catch (error) {
            throw new Error(`The specified locale directory '${localePath}' does not exist or is not writable. Please check your configuration.`);
        }
        const localeFiles = await (0, fetchFiles_1.fetchLocaleFileRefs)(config_1.default.localeRepo, config_1.default.resourceName);
        if (localeFiles.length === 0) {
            core.warning('No locale files found, skipping...');
            return;
        }
        for (const locale of localeFiles) {
            const localeObject = await (0, fetchFiles_1.getGithubFileContent)(locale.link);
            const localeFile = path_1.default.join(localePath, locale.name);
            await fs_1.promises.writeFile(localeFile, JSON.stringify(localeObject, null, 2), 'utf-8');
        }
        core.info('Latest versions of locale files have been added to the project');
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
