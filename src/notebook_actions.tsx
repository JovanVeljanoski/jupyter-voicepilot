import { Configuration, OpenAIApi } from "openai";
import { NotebookActions, NotebookPanel} from '@jupyterlab/notebook';

class CustomFormData extends FormData {
    getHeaders() {
        return {}
    }
}

const configuration = new Configuration({
    apiKey: '',
    formDataCtor: CustomFormData
});

const openai = new OpenAIApi(configuration);


async function get_transcript(blob: Blob) {
    const audio = new File([blob], 'input.webm', { type: 'audio/webm' });
    const transcript = await openai.createTranscription(
        audio,
        "whisper-1",
    );
    return transcript.data.text
}


function get_prompt(text: string) {
    const prefix = "Context: Python, format the code output with 4 spaces \n Rules: Return the code only.";
    return `${prefix}${text}`;
}

async function get_code(prompt: string) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: get_prompt(prompt),
        max_tokens: 256,
    });
    return completion.data.choices[0].text;
}


function insert_code_cell_below(panel: NotebookPanel, code: string) {
    NotebookActions.insertBelow(panel.content);
    const cell = panel.content.activeCell;
    if (cell) {
        cell.model.value.text = code;
    } else {
        console.error("Could not insert cell because active cell is null");
    }
}


function insert_code_cell_above(panel: NotebookPanel, code: string) {
    NotebookActions.insertAbove(panel.content);
    const cell = panel.content.activeCell;
    if (cell) {
        cell.model.value.text = code;
    } else {
        console.error("Could not insert cell because active cell is null");
    }
}





export {
    insert_code_cell_below,
    insert_code_cell_above,
    get_transcript,
    get_code
};