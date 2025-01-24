import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { version } from './package.json';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
    packagerConfig: {
        icon: 'src/assets/icon',
        asar: true,
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            authors: 'bernzrdo',
            iconUrl: 'https://raw.githubusercontent.com/bernzrdo/pomo/refs/heads/main/src/assets/icon.png',
            // setupIcon: 'src/assets/icon.png'
        }),
        new MakerZIP({}, ['darwin']),
        new MakerRpm({ options: {
            categories: ['Utility'],
            icon: 'src/assets/icon.png',
            genericName: 'Time Management Software',
            name: 'pomo',
            productName: 'Pomo',
            description: 'Time management software',
            productDescription: 'Open-source time management software based on the Pomodoro Technique with a focus on design.',
            version: `v${version}`
        }}),
        new MakerDeb({ options: {
            categories: ['Utility'],
            icon: 'src/assets/icon.png',
            genericName: 'Time Management Software',
            name: 'pomo',
            productName: 'Pomo',
            description: 'Time management software',
            productDescription: 'Open-source time management software based on the Pomodoro Technique with a focus on design.',
            version: `v${version}`
        }})
    ],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/index.html',
                        js: './src/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/preload.ts',
                        },
                    },
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
};

export default config;
