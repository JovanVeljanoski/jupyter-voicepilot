import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { ICommandPalette, showDialog, Dialog } from '@jupyterlab/apputils';

import { ButtonExtension } from './extension';

/**
 * Initialization data for the voicepilot extension.
 */
const PLUGIN_ID = 'voicepilot:plugin';
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ISettingRegistry, ICommandPalette],
  activate: (
    app: JupyterFrontEnd,
    settings: ISettingRegistry,
    palette: ICommandPalette
  ) => {
    console.log('JupyterLab extension voicepilot is activated!');
    const { commands, docRegistry } = app;
    const buttonExt = new ButtonExtension();
    docRegistry.addWidgetExtension('Notebook', buttonExt);

    palette.addItem({
      command: 'voicepilot:show-api-key',
      category: 'VoicePilot'
    });
    palette.addItem({
      command: 'voicepilot:toggle-button',
      category: 'VoicePilot'
    });

    commands.addCommand('voicepilot:toggle-button', {
      label: 'Toggle VoicePilot',
      execute: () => {
        buttonExt.toggleRecording();
      }
    });

    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    function updateExtensionKey(setting: ISettingRegistry.ISettings): void {
      const apiKey = setting.get('open_api_key').composite as string;
      buttonExt.apiKey = apiKey;
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings?.load(PLUGIN_ID)])
      .then(([, setting]) => {
        // Read the settings
        const apiKey = setting?.get('open_api_key').composite as string;
        buttonExt.apiKey = apiKey;

        commands.addCommand('voicepilot:show-api-key', {
          label: 'Show API Key',
          execute: () => {
            const apiKey = setting?.get('open_api_key').composite as string;
            buttonExt.apiKey = apiKey;
            return showDialog({
              title: 'VoicePilot API Key',
              body: apiKey,
              buttons: [Dialog.okButton()]
            });
          }
        });

        // Listen for your plugin setting changes using Signal
        setting?.changed.connect(updateExtensionKey);
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  }
};

export default plugin;
