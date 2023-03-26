import { showErrorMessage } from '@jupyterlab/apputils';
import { Recorder } from './recorder';
import OpenAIClient from './openai';
import { NotebookCmdHandler, notebookUtils } from './notebook';
import { NotebookPanel } from '@jupyterlab/notebook';

export class VoiceProcessor {
  private CHAT_TRIGGER = 'hey';
  private recorder: Recorder = new Recorder();
  private aiClient: OpenAIClient = new OpenAIClient();
  private cmdHandler: NotebookCmdHandler = new NotebookCmdHandler();

  set apiKey(apiKey: string) {
    console.log('Setting API key');
    this.aiClient.apiKey = apiKey;
  }

  set maxTokens(maxTokens: number) {
    console.log('Setting max tokens');
    this.aiClient.maxTokens = maxTokens;
  }

  set chatHistoryLength(chatHistoryLength: number) {
    console.log('Setting chat history length');
    this.aiClient.chatHistoryLength = chatHistoryLength;
  }

  isConfigured(): boolean {
    if (!this.aiClient.apiKey) {
      showErrorMessage(
        'Voice Pilot Error',
        'Please set your OpenAI API key in the settings'
      );
      return false;
    }
    return true;
  }

  private isChatCmd(transcript: string): boolean {
    return transcript!
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .startsWith(this.CHAT_TRIGGER);
  }

  start() {
    this.recorder.startRecording();
    console.log('Recording started');
  }

  async stop(panel: NotebookPanel) {
    const blob = await this.recorder.stopRecording();
    console.log(blob);
    const transcript = await this.aiClient.getTranscript(blob);
    console.log(transcript);
    const executed = this.cmdHandler.execute(panel, transcript!);
    if (!executed) {
      if (this.isChatCmd(transcript!)) {
        console.log('Calling ChatGPT');
        const answer = await this.aiClient.getChat(transcript!);
        notebookUtils.insert_chat_answer_in_cell(panel, answer!);
      } else {
        if (panel.content.activeCell?.model.type === 'code') {
          const code = await this.aiClient.getCode(transcript!);
          notebookUtils.insert_code_in_cell(panel, code!);
        } else {
          notebookUtils.insert_code_in_cell(panel, transcript!);
        }
      }
    } else {
      console.log('Notebook action has been executed.');
    }
    console.log('Recording stopped');
  }
}
