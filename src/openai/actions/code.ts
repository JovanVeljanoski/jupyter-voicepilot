import { OpenAIApi } from 'openai';
import { IOpenAIAction, showError } from './base';

export class CodeAction implements IOpenAIAction {
  MODEL_ID = 'text-davinci-003';
  private _maxTokens: number;

  constructor(maxTokens: number) {
    this._maxTokens = maxTokens;
  }

  set maxTokens(maxTokens: number) {
    this._maxTokens = maxTokens;
  }

  private createPrompt(text: string) {
    const prefix =
      'Context: Python, format the code output with 4 spaces \n Rules: Return the code only.';
    return `${prefix}${text}`;
  }

  async execute(
    api: OpenAIApi | undefined,
    input: any
  ): Promise<string | undefined> {
    const completion = await api
      ?.createCompletion({
        model: this.MODEL_ID,
        prompt: this.createPrompt(input as string),
        max_tokens: this._maxTokens
      })
      .catch(err => {
        showError(err);
        return null;
      });
    return completion?.data.choices[0].text;
  }
}
