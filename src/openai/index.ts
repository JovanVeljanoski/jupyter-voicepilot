import { CodeAction, ChatAction, TranscriptAction } from './actions';
import { Configuration, OpenAIApi } from 'openai';

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

type ChatHistory = Array<{ role: string; content: string }>;

export default class OpenAIClient {
  private api: OpenAIApi | undefined;
  private _apiKey = '';
  private _maxTokens = 256;
  private _chatHistory: ChatHistory = [
    { role: 'system', content: 'You are a helpful assistant.' }
  ];
  private _chatHistoryMaxLength = 10;

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

  set chatHistoryMaxLength(chatHistoryMaxLength: number) {
    this._chatHistoryMaxLength = chatHistoryMaxLength;
  }

  public appendChatMessage(role: string, content: string): void {
    this._chatHistory.push({ role: role as string, content: content });
    if (this._chatHistory.length > this._chatHistoryMaxLength) {
        this._chatHistory.shift();
    }
  }

  async getCode(input: string) {
    return new CodeAction(this._maxTokens).run(this.api, input);
  }

  async getChat(input: string) {
    this.appendChatMessage('user', input);
    const answer = await new ChatAction().run(this.api, this._chatHistory);
    if (answer) {
        this.appendChatMessage('system', answer);
    }
    return answer;
  }

  async getTranscript(input: Blob) {
    return new TranscriptAction().run(this.api, input);
  }
}
