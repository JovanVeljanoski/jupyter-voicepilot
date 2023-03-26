import { OpenAIApi } from 'openai';
import { showErrorMessage } from '@jupyterlab/apputils';

export interface IOpenAIAction {
  MODEL_ID: string;

  run(api: OpenAIApi | undefined, input: any): Promise<string | undefined>;
}

export function showError(err: any) {
  const msg = err.response.data.error.message;
  showErrorMessage('OpenAI Error', msg);
}
