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
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension());
    console.log('JupyterLab extension voicepilot is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('voicepilot settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for voicepilot.', reason);
        });
    }
  }
};

export default plugin;

