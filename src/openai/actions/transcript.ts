import { OpenAIApi } from 'openai';
import { IOpenAIAction, showError } from './base';

export class TranscriptAction implements IOpenAIAction {
  MODEL_ID = 'whisper-1';

  async run(
    api: OpenAIApi | undefined,
    input: any
  ): Promise<string | undefined> {
    const audio = new File([input as Blob], 'input.webm', {
      type: 'audio/webm'
    });
    const transcript = await api
      ?.createTranscription(audio, this.MODEL_ID)
      .catch(err => {
        showError(err);
        return null;
      });
    return transcript?.data.text;
  }
}
