import { NotebookActions, NotebookPanel } from '@jupyterlab/notebook';

function insert_code_in_cell(panel: NotebookPanel, code: string) {
  const cell = panel.content.activeCell;
  if (cell) {
    cell.model.value.text = code;
  } else {
    console.error('Could not insert cell because active cell is null');
  }
}

function insert_code_cell_below(panel: NotebookPanel, code: string) {
  NotebookActions.insertBelow(panel.content);
  const cell = panel.content.activeCell;
  if (cell) {
    cell.model.value.text = code;
  } else {
    console.error('Could not insert cell because active cell is null');
  }
}

function insert_code_cell_above(panel: NotebookPanel, code: string) {
  NotebookActions.insertAbove(panel.content);
  const cell = panel.content.activeCell;
  if (cell) {
    cell.model.value.text = code;
  } else {
    console.error('Could not insert cell because active cell is null');
  }
}

function insert_chat_answer_in_cell(panel: NotebookPanel, answer: string) {
  NotebookActions.changeCellType(panel.content, 'markdown');
  const cell = panel.content.activeCell;
  if (cell) {
    if (cell.model && cell.model.value && cell.model.value.text.length === 0) {
      if (cell) {
        cell.model.value.text = answer;
      } else {
        console.error('Could not insert cell because active cell is null');
      }
    } else {
      NotebookActions.insertBelow(panel.content);
      NotebookActions.changeCellType(panel.content, 'markdown');
      const cell = panel.content.activeCell;
      if (cell) {
        cell.model.value.text = answer;
      } else {
        console.error('Could not insert cell because active cell is null');
      }
    }
  }
}

function insert_chat_answer_cell_below(panel: NotebookPanel, answer: string) {
  NotebookActions.insertBelow(panel.content);
  NotebookActions.changeCellType(panel.content, 'markdown');
  const cell = panel.content.activeCell;
  if (cell) {
    cell.model.value.text = answer;
  } else {
    console.error('Could not insert cell because active cell is null');
  }
}

export {
  insert_code_in_cell,
  insert_code_cell_below,
  insert_code_cell_above,
  insert_chat_answer_in_cell,
  insert_chat_answer_cell_below
};
