
import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { DocumentRegistry } from '@jupyterlab/docregistry';
// import { NotebookActions, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';

import { insert_code_cell_below, get_transcript, get_code } from './notebook_actions';

import { Recorder } from './recorder';

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

    private is_active = false;
    private recorder: Recorder | null = new Recorder();

    createNew(
        panel: NotebookPanel,
        context: DocumentRegistry.IContext<INotebookModel>
    ): IDisposable {
        const buttonFunction = async () => {
            if (this.is_active) {
                this.is_active = false;
                if (this.recorder) {
                    const blob = await this.recorder.stopRecording();
                    console.log(blob);
                    const transcript = await get_transcript(blob)
                    console.log(transcript);
                    const code = await get_code(transcript);
                    insert_code_cell_below(panel, code!);
                }
                console.log('Recording stopped');

            } else {
                this.is_active = true;
                this.recorder?.startRecording();
                console.log('Recording started');
            }
        };
        const button = new ToolbarButton({
            className: 'clear-output-button',
            label: 'Voice Pilot',
            onClick: buttonFunction,
            tooltip: 'Voice Pilot',
        });

        panel.toolbar.insertItem(10, 'clearOutputs', button);
        return new DisposableDelegate(() => {
            button.dispose();
        });
    }
}

export default ButtonExtension;