import {JupyterFrontEnd, JupyterFrontEndPlugin} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { ButtonExtension } from './button';

/**
 * Initialization data for the voicepilot extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  // activate,
  id: 'voicepilot:plugin',
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
    console.log('JupyterLab extension voicepilot is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('voicepilot settings loaded:', settings.composite);
          const key = settings.get('open_api_key').composite;
          console.log('mything:', key);
        })
        .catch(reason => {
          console.error('Failed to load settings for voicepilot.', reason);
        });
    } else {
      console.warn('Setting registry not available.');
    }

  }
};

export default plugin;

