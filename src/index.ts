import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { ButtonExtension } from './button';

/**
 * Initialization data for the voicepilot extension.
 */
const PLUGIN_ID = 'voicepilot:plugin';
const plugin: JupyterFrontEndPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settings: ISettingRegistry | null) => {
    const { commands } = app;
    const button = new ButtonExtension();
    app.docRegistry.addWidgetExtension('Notebook', button);
    console.log('JupyterLab extension voicepilot is activated!');

    /**
     * Load the settings for this extension
     *
     * @param setting Extension settings
     */
    function loadSetting(setting: ISettingRegistry.ISettings): void {
      const apiKey = setting.get('open_api_key').composite as string;
      console.log('apiKey:', apiKey);
      return;
    }

    // Wait for the application to be restored and
    // for the settings for this plugin to be loaded
    Promise.all([app.restored, settings?.load(PLUGIN_ID)])
      .then(([, setting]) => {
        // Read the settings
        const apiKey = setting?.get('open_api_key').composite as string;
        button.apiKey = apiKey;

        // Listen for your plugin setting changes using Signal
        setting?.changed.connect(loadSetting);

        commands.addCommand('COMMAND_ID', {
          label: 'Modify API Key',
          // isToggled: () => apiKey,
          execute: () => {
            // Programmatically change a setting
            Promise.all([setting?.set('open_api_key', apiKey)])
              .then(() => {
                const newKey = setting?.get('open_api_key').composite as string;
                button.apiKey = newKey;
                window.alert(`VoicePilot: API is set to '${newKey}'.`);
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

    // if (settingRegistry) {
    //   settingRegistry
    //     .load(plugin.id)
    //     .then(settings => {
    //       console.log('voicepilot settings loaded:', settings.composite);
    //       const key = settings.get('open_api_key').composite;
    //       console.log('mything:', key);
    //     })
    //     .catch(reason => {
    //       console.error('Failed to load settings for voicepilot.', reason);
    //     });
    // } else {
    //   console.warn('Setting registry not available.');
    // }
  }
};

export default plugin;
