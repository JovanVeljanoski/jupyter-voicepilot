import { OpenAIApi } from 'openai';
import { IOpenAIAction, showError } from './base';

export class ChatAction implements IOpenAIAction {
  MODEL_ID = 'gpt-3.5-turbo';

  async run(
    api: OpenAIApi | undefined,
    messages: any
  ): Promise<string | undefined> {
    const answer = await api
      ?.createChatCompletion({
        model: this.MODEL_ID,
        messages: messages
      })
      .catch(err => {
        showError(err);
        return null;
      });
    return answer?.data.choices[0].message?.content;
  }
}
