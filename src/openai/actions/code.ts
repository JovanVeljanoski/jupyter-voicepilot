import { OpenAIApi } from 'openai';
import { IOpenAIAction, showError } from './base';

export class CodeAction implements IOpenAIAction {
  MODEL_ID = 'text-davinci-003';
  private maxTokens: number;

  constructor(maxTokens: number) {
    this.maxTokens = maxTokens;
  }

  private createPrompt(text: string) {
    const prefix =
      'Context: Python, format the code output with 4 spaces \n Rules: Return the code only.';
    return `${prefix}${text}`;
  }

  async run(
    api: OpenAIApi | undefined,
    input: any
  ): Promise<string | undefined> {
    const completion = await api
      ?.createCompletion({
        model: this.MODEL_ID,
        prompt: this.createPrompt(input as string),
        max_tokens: this.maxTokens
      })
      .catch(err => {
        showError(err);
        return null;
      });
    return completion?.data.choices[0].text;
  }
}
