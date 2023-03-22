import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { DocumentRegistry } from '@jupyterlab/docregistry';
// import { NotebookActions, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import recordVinylStr from '../style/icons/record-vinyl-solid.svg';

import { insert_code_cell_below } from './notebook_actions';

import { Recorder } from './recorder';
import { OpenAIClient } from './openai_client';


const vynilIcon = new LabIcon({
  name: 'jupyterlab:record-vinyl',
  svgstr: recordVinylStr
});

export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  /**
   * Create a new extension for the notebook panel widget.
   *
   * @param panel Notebook panel
   * @param context Notebook context
   * @returns Disposable on the added button
   */

  private button: ToolbarButton | null = null;
  private recorder: Recorder | null = new Recorder();
  private ai: OpenAIClient | null = null;

  set apiKey(apiKey: string) {
    console.log('Setting API key');
    this.ai = new OpenAIClient(apiKey);
  }

  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): IDisposable {
    const onClick = async () => {
      if (this.ai === null) {
        alert('Please set your OpenAI API key in the settings');
        return;
      }
      if (this.button!.hasClass('vp-recording')) {
        this.button!.toggleClass('vp-recording');
        if (this.recorder) {
          const blob = await this.recorder.stopRecording();
          console.log(blob);
          const transcript = await this.ai.getTranscript(blob);
          console.log(transcript);
          const code = await this.ai.getCode(transcript!);
          insert_code_cell_below(panel, code!);
        }
        console.log('Recording stopped');
      } else {
        this.button!.toggleClass('vp-recording');
        this.recorder?.startRecording();
        console.log('Recording started');
      }
    };
    this.button = new ToolbarButton({
      icon: vynilIcon,
      pressedTooltip: 'Stop recording...',
      label: 'Voice Pilot',
      onClick: onClick,
      tooltip: 'Start recording...'
    });

    panel.toolbar.insertItem(10, 'voicePilotBtn', this.button);
    return new DisposableDelegate(() => {
      this.button!.dispose();
    });
  }
}

export default ButtonExtension;
