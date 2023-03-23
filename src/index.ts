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
    function updateExtension(settings: ISettingRegistry.ISettings): void {
      const apiKey = settings.get('open_api_key').composite as string;
      const maxTokens = settings.get('max_tokens').composite as number;
      buttonExt.apiKey = apiKey;
      buttonExt.maxTokens = maxTokens;
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings?.load(PLUGIN_ID)])
      .then(([, settings]) => {
        // Read the settings
        updateExtension(settings);

        commands.addCommand('voicepilot:show-api-key', {
          label: 'Show API Key',
          execute: () => {
            const apiKey = settings?.get('open_api_key').composite as string;
            buttonExt.apiKey = apiKey;
            return showDialog({
              title: 'VoicePilot API Key',
              body: apiKey,
              buttons: [Dialog.okButton()]
            });
          }
        });

        // Listen for your plugin setting changes using Signal
        settings?.changed.connect(updateExtension);
      })
      .catch(reason => {
        console.error(
          `Something went wrong when reading the settings.\n${reason}`
        );
      });
  }
};

export default plugin;
