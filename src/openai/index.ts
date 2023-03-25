import {
  CodeAction,
  ChatAction,
  TranscriptAction,
  IOpenAIAction
} from './actions';
import { Configuration, OpenAIApi } from 'openai';

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

enum AIActionType {
  Code = 'code',
  Chat = 'chat',
  Transcript = 'transcript'
}

export default class OpenAIClient {
  private api: OpenAIApi | undefined;
  private actions: Record<AIActionType, IOpenAIAction>;
  private _apiKey = '';

  constructor() {
    this.actions = {
      [AIActionType.Code]: new CodeAction(256),
      [AIActionType.Chat]: new ChatAction(),
      [AIActionType.Transcript]: new TranscriptAction()
    };
  }

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
    (this.actions[AIActionType.Code] as CodeAction).maxTokens = maxTokens;
  }

  private async execute(actionType: AIActionType, input: any) {
    return this.actions[actionType]?.execute(this.api, input);
  }

  async getCode(input: string) {
    return this.execute(AIActionType.Code, input);
  }

  async getChat(input: string) {
    return this.execute(AIActionType.Chat, input);
  }

  async getTranscript(input: Blob) {
    return this.execute(AIActionType.Transcript, input);
  }
}
