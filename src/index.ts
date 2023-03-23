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
    palette: ICommandPalette,
  ) => {
    const { commands, docRegistry } = app;
    const buttonExt = new ButtonExtension();
    docRegistry.addWidgetExtension('Notebook', buttonExt);
    palette.addItem({ command: 'voicepilot:modify-api-key', category: 'VoicePilot' });
    palette.addItem({ command: 'voicepilot:toggle-button', category: 'VoicePilot' });
    console.log('JupyterLab extension voicepilot is activated!');

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
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      const apiKey = setting.get('open_api_key').composite as string;
      console.log('apiKey:', apiKey);
      buttonExt.apiKey = apiKey;
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings?.load(PLUGIN_ID)])
      .then(([, setting]) => {
        // Read the settings
        const apiKey = setting?.get('open_api_key').composite as string;
        buttonExt.apiKey = apiKey;

        // Listen for your plugin setting changes using Signal
        setting?.changed.connect(loadSetting);

        commands.addCommand('voicepilot:modify-api-key', {
          label: 'Show API Key',
          execute: () => {
            // Programmatically change a setting
            Promise.all([setting?.set('open_api_key', apiKey)])
              .then(() => {
                const newKey = setting?.get('open_api_key').composite as string;
                buttonExt.apiKey = newKey;
                return showDialog({
                  title: 'VoicePilot API Key',
                  body: newKey,
                  buttons: [Dialog.okButton()],
                });
              })
              .catch(reason => {
                console.error(
                  `Something went wrong when changing the settings.\n${reason}`
                );
              });
          }
        });
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  }
};

export default plugin;
