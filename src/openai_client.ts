import { Configuration, OpenAIApi } from 'openai';
import { showErrorMessage } from '@jupyterlab/apputils';

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

export class OpenAIClient {
  private openai: OpenAIApi | undefined;
  private _maxTokens: number | undefined;

  set apiKey(apiKey: string) {
    const configuration = new Configuration({
      apiKey: apiKey,
      formDataCtor: CustomFormData
    });
    this.openai = new OpenAIApi(configuration);
  }

  set maxTokens(maxTokens: number) {
    this._maxTokens = maxTokens;
  }

  private createPrompt(text: string) {
    const prefix =
      'Context: Python, format the code output with 4 spaces \n Rules: Return the code only.';
    return `${prefix}${text}`;
  }

  private showError(err: any) {
    const errorMessage = err.response.data.error.message;
    showErrorMessage('OpenAI Error', errorMessage);
  }

  async getCode(prompt: string) {
    const completion = await this.openai
      ?.createCompletion({
        model: 'text-davinci-003',
        prompt: this.createPrompt(prompt),
        max_tokens: this._maxTokens || 256
      })
      .catch(err => {
        this.showError(err);
        return null;
      });
    return completion?.data.choices[0].text;
  }

  async getChatAnswer(prompt: string) {
    const answer = await this.openai
      ?.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      })
      .catch(err => {
        this.showError(err);
        return null;
      });
    return answer?.data.choices[0].message?.content;
  }

  async getTranscript(blob: Blob) {
    const audio = new File([blob], 'input.webm', { type: 'audio/webm' });
    const transcript = await this.openai
      ?.createTranscription(audio, 'whisper-1')
      .catch(err => {
        this.showError(err);
        return null;
      });
    return transcript?.data.text;
  }
}
