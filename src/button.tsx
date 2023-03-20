
import { IDisposable, DisposableDelegate } from '@lumino/disposable';
import { DocumentRegistry } from '@jupyterlab/docregistry';
// import { NotebookActions, NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';

import { insert_code_cell_below } from './notebook_actions';

import { Recorder } from './recorder';
import { OpenAIClient } from './openai_client';

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
    private ai: OpenAIClient | null = null;

    set apiKey(apiKey: string) {
        console.log("Setting API key");
        this.ai = new OpenAIClient(apiKey);
    }

    createNew(
        panel: NotebookPanel,
        context: DocumentRegistry.IContext<INotebookModel>
    ): IDisposable {                
        const buttonFunction = async () => {
            if (this.ai === null) {
                alert('Please set your OpenAI API key in the settings');
                return;
            }
            if (this.is_active) {
                this.is_active = false;
                if (this.recorder) {
                    const blob = await this.recorder.stopRecording();
                    console.log(blob);
                    const transcript = await this.ai.getTranscript(blob)
                    console.log(transcript);
                    const code = await this.ai.getCode(transcript!);
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