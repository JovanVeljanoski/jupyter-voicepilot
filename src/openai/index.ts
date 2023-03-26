import { CodeAction, ChatAction, TranscriptAction } from './actions';
import { Configuration, OpenAIApi } from 'openai';

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

export default class OpenAIClient {
  private api: OpenAIApi | undefined;
  private _apiKey = '';
  private _maxTokens = 256;

  set apiKey(apiKey: string) {
    this._apiKey = apiKey;
    const configuration = new Configuration({
      apiKey: apiKey,
      formDataCtor: CustomFormData
    });
    this.api = new OpenAIApi(configuration);
  }

  get apiKey() {
    return this._apiKey;
  }

  set maxTokens(maxTokens: number) {
    this._maxTokens = maxTokens;
  }

  async getCode(input: string) {
    return new CodeAction(this._maxTokens).run(this.api, input);
  }

  async getChat(input: string) {
    // history.push(input);
    // pass history to chat action in constructor
    return new ChatAction().run(this.api, input);
    // history.push(answer);
  }

  async getTranscript(input: Blob) {
    return new TranscriptAction().run(this.api, input);
  }
}
