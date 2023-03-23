import { Configuration, OpenAIApi } from 'openai';
import { showErrorMessage } from '@jupyterlab/apputils';

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

export class OpenAIClient {
  private openai: OpenAIApi | undefined;

  set apiKey(apiKey: string) {
    const configuration = new Configuration({
      apiKey: apiKey,
      formDataCtor: CustomFormData
    });
    this.openai = new OpenAIApi(configuration);
  }

  private createPrompt(text: string) {
    const prefix =
      'Context: Python, format the code output with 4 spaces \n Rules: Return the code only.';
    return `${prefix}${text}`;
  }

  async getCode(prompt: string) {
    const completion = await this.openai
      ?.createCompletion({
        model: 'text-davinci-003',
        prompt: this.createPrompt(prompt),
        max_tokens: 256
      })
      .catch(err => {
        showErrorMessage('OpenAI Error', err.response.data.error.message);
        return null;
      });
    return completion?.data.choices[0].text;
  }

  async getTranscript(blob: Blob) {
    const audio = new File([blob], 'input.webm', { type: 'audio/webm' });
    const transcript = await this.openai
      ?.createTranscription(audio, 'whisper-1')
      .catch(err => {
        showErrorMessage('OpenAI Error', err.response.data.error.message);
        return null;
      });
    return transcript?.data.text;
  }
}
