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

function notebook_voice_actions(panel: NotebookPanel, str: string): boolean {
  str = str.replace(/[^\w\s]/gi, '');
  str = str.toLowerCase();

  if (['run cell', 'run the cell', 'run', 'execute'].includes(str)) {
    NotebookActions.run(panel.content, panel.sessionContext);
    return true;
  } else if (
    ['run and advance', 'run cell and advance', 'execute and advance'].includes(
      str
    )
  ) {
    NotebookActions.runAndAdvance(panel.content, panel.sessionContext);
    return true;
  } else if (
    ['run all', 'run all cells', 'execute all', 'execute all cells'].includes(
      str
    )
  ) {
    NotebookActions.runAll(panel.content, panel.sessionContext);
    return true;
  } else if (
    [
      'run all above',
      'run all cells above',
      'execute all above',
      'execute all cells above'
    ].includes(str)
  ) {
    NotebookActions.runAllAbove(panel.content, panel.sessionContext);
    return true;
  } else if (
    [
      'run all below',
      'run all cells below',
      'execute all below',
      'execute all cells below'
    ].includes(str)
  ) {
    NotebookActions.runAllBelow(panel.content, panel.sessionContext);
    return true;
  } else if (
    ['run and insert', 'run cell and insert', 'execute and insert'].includes(
      str
    )
  ) {
    NotebookActions.runAndInsert(panel.content, panel.sessionContext);
    return true;
  } else if (
    [
      'delete',
      'delete cell',
      'delete the cell',
      'delete cells',
      'delete the cells'
    ].includes(str)
  ) {
    NotebookActions.deleteCells(panel.content);
    return true;
  } else if (
    ['clear all outputs', 'clear all the outputs', 'clear outputs'].includes(
      str
    )
  ) {
    NotebookActions.clearAllOutputs(panel.content);
    return true;
  } else if (
    ['select last run cell', 'select the last run cell'].includes(str)
  ) {
    NotebookActions.selectLastRunCell(panel.content);
    return true;
  } else if (['undo'].includes(str)) {
    NotebookActions.undo(panel.content);
    return true;
  } else if (['redo'].includes(str)) {
    NotebookActions.redo(panel.content);
    return true;
  } else if (['copy', 'copy cell', 'copy cells'].includes(str)) {
    NotebookActions.copy(panel.content);
    return true;
  } else if (['cut', 'cut cell', 'cut cells'].includes(str)) {
    NotebookActions.cut(panel.content);
    return true;
  } else if (['paste', 'paste cell', 'paste cells'].includes(str)) {
    NotebookActions.paste(panel.content);
    return true;
  } else if (
    [
      'to markdown',
      'convert to markdown',
      'markdown',
      'markdown cell',
      'cast to markdown'
    ].includes(str)
  ) {
    NotebookActions.changeCellType(panel.content, 'markdown');
    return true;
  } else if (
    [
      'to code',
      'convert to code',
      'code',
      'code cell',
      'cast to code'
    ].includes(str)
  ) {
    NotebookActions.changeCellType(panel.content, 'code');
    return true;
  } else if (
    ['insert markdown cell below', 'add markdown cell below'].includes(str)
  ) {
    NotebookActions.insertBelow(panel.content);
    NotebookActions.changeCellType(panel.content, 'markdown');
    return true;
  } else if (
    ['insert markdown cell above', 'add markdown cell above'].includes(str)
  ) {
    NotebookActions.insertAbove(panel.content);
    NotebookActions.changeCellType(panel.content, 'markdown');
  } else {
    return false;
  }

  // If no condition is met, return false, to make the typing happy
  return false;
}

export {
  insert_code_in_cell,
  insert_code_cell_below,
  insert_code_cell_above,
  notebook_voice_actions
};
