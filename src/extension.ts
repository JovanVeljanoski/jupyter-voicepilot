import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import recordVinylStr from '../style/icons/record-vinyl-solid.svg';
import { VoiceProcessor } from './voice-processor';

const vynilIcon = new LabIcon({
  name: 'jupyterlab:record-vinyl',
  svgstr: recordVinylStr
});

export class ButtonExtension
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  private button: ToolbarButton | null = null;
  private voiceProcessor: VoiceProcessor = new VoiceProcessor();

  set apiKey(apiKey: string) {
    this.voiceProcessor.apiKey = apiKey;
  }

  set maxTokens(maxTokens: number) {
    this.voiceProcessor.maxTokens = maxTokens;
  }

  set chatHistoryLength(chatHistoryLength: number) {
    this.voiceProcessor.chatHistoryLength = chatHistoryLength;
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
      if (!this.voiceProcessor.isConfigured()) {
        return;
      }
      const is_recording = this.button!.hasClass('vp-recording');
      this.button!.toggleClass('vp-recording');
      if (is_recording) {
        this.voiceProcessor.stop(panel);
      } else {
        this.voiceProcessor.start();
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
