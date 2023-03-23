import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import recordVinylStr from '../style/icons/record-vinyl-solid.svg';

import { insert_code_in_cell } from './notebook_actions';

import { Recorder } from './recorder';
import { OpenAIClient } from './openai_client';
import { NotebookCmdHandler } from './notebook_cmd_handler';

const vynilIcon = new LabIcon({
  name: 'jupyterlab:record-vinyl',
  svgstr: recordVinylStr
});

export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  private button: ToolbarButton | null = null;
  private recorder: Recorder = new Recorder();
  private aiClient: OpenAIClient  = new OpenAIClient();
  private cmdHandler: NotebookCmdHandler = new NotebookCmdHandler();

  set apiKey(apiKey: string) {
    console.log('Setting API key');
    this.aiClient.apiKey = apiKey;
  }

  toggleRecording() {
    this.button?.onClick();
  }

  /**
   * Create a new extension for the notebook panel widget.
   *
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */
  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const onClick = async () => {
      if (this.aiClient?.apiKey === null) {
        alert('Please set your OpenAI API key in the settings');
        return;
      }
      const is_recording = this.button!.hasClass('vp-recording');
      this.button!.toggleClass('vp-recording');
      if (is_recording) {
        const blob = await this.recorder.stopRecording();
        console.log(blob);
        const transcript = await this.aiClient.getTranscript(blob);
        console.log(transcript);
        const executed = this.cmdHandler.execute(panel, transcript!);
        if (!executed) {
          if (panel.content.activeCell?.model.type === 'code') {
            const code = await this.aiClient.getCode(transcript!);
            insert_code_in_cell(panel, code!);
          } else {
            insert_code_in_cell(panel, transcript!);
          }
        } else {
          console.log('Notebook action has been executed.');
        }
        console.log('Recording stopped');
      } else {
        this.recorder?.startRecording();
        console.log('Recording started');
      }      
    };
    this.button = new ToolbarButton({
      className: 'vp-button',
      icon: vynilIcon,
      pressedTooltip: 'Stop recording...',
      label: 'Voice Pilot',
      onClick: onClick,
      tooltip: 'Start recording...'
    });

    panel.toolbar.insertItem(10, 'vp-button', this.button);
    return new DisposableDelegate(() => {
      this.button?.dispose();
    });
  }
}

export default ButtonExtension;
