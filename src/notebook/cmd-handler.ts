import { NotebookActions, NotebookPanel } from '@jupyterlab/notebook';
import { Notebook } from '@jupyterlab/notebook';

type NotebookAction = CallableFunction;
type CmdRegistry = Record<string, Array<NotebookAction>>;

function changeCellTypeToMarkdown(widget: Notebook): void {
  NotebookActions.changeCellType(widget, 'markdown');
}

function changeCellTypeToCode(widget: Notebook): void {
  NotebookActions.changeCellType(widget, 'code');
}

export class NotebookCmdHandler {
  private registry: CmdRegistry = {};

  constructor() {
    for (const cmd of ['run cell', 'run the cell', 'run', 'execute']) {
      this.registry[cmd] = [NotebookActions.run];
    }
    for (const cmd of [
      'run all',
      'run all cells',
      'execute all',
      'execute all cells'
    ]) {
      this.registry[cmd] = [NotebookActions.runAll];
    }
    for (const cmd of [
      'run and advance',
      'run cell and advance',
      'execute and advance'
    ]) {
      this.registry[cmd] = [NotebookActions.runAndAdvance];
    }
    for (const cmd of [
      'run all above',
      'run all cells above',
      'execute all above',
      'execute all cells above'
    ]) {
      this.registry[cmd] = [NotebookActions.runAllAbove];
    }
    for (const cmd of [
      'run all below',
      'run all cells below',
      'execute all below',
      'execute all cells below'
    ]) {
      this.registry[cmd] = [NotebookActions.runAllBelow];
    }
    for (const cmd of [
      'run and insert',
      'run cell and insert',
      'execute and insert'
    ]) {
      this.registry[cmd] = [NotebookActions.runAndInsert];
    }
    for (const cmd of [
      'delete',
      'delete cell',
      'delete the cell',
      'delete cells',
      'delete the cells'
    ]) {
      this.registry[cmd] = [NotebookActions.deleteCells];
    }
    for (const cmd of [
      'clear all outputs',
      'clear all the outputs',
      'clear outputs'
    ]) {
      this.registry[cmd] = [NotebookActions.clearAllOutputs];
    }
    for (const cmd of ['select last run cell', 'select the last run cell']) {
      this.registry[cmd] = [NotebookActions.selectLastRunCell];
    }
    this.registry['undo'] = [NotebookActions.undo];
    this.registry['redo'] = [NotebookActions.redo];
    for (const cmd of ['copy', 'copy cell', 'copy cells']) {
      this.registry[cmd] = [NotebookActions.copy];
    }
    for (const cmd of ['cut', 'cut cell', 'cut cells']) {
      this.registry[cmd] = [NotebookActions.cut];
    }
    for (const cmd of ['paste', 'paste cell', 'paste cells']) {
      this.registry[cmd] = [NotebookActions.paste];
    }
    for (const cmd of [
      'to markdown',
      'convert to markdown',
      'markdown',
      'markdown cell',
      'cast to markdown'
    ]) {
      this.registry[cmd] = [changeCellTypeToMarkdown];
    }
    for (const cmd of [
      'to code',
      'convert to code',
      'code',
      'code cell',
      'cast to code'
    ]) {
      this.registry[cmd] = [changeCellTypeToCode];
    }
    for (const cmd of [
      'insert code cell below',
      'add code cell below',
      'insert cell below',
      'add cell below',
      'insert cell below'
    ]) {
      this.registry[cmd] = [NotebookActions.insertBelow];
    }
    for (const cmd of [
      'insert code cell above',
      'add code cell above',
      'insert cell above',
      'add cell above',
      'insert cell above'
    ]) {
      this.registry[cmd] = [NotebookActions.insertAbove];
    }
    for (const cmd of [
      'insert markdown cell below',
      'add markdown cell below'
    ]) {
      this.registry[cmd] = [
        NotebookActions.insertBelow,
        changeCellTypeToMarkdown
      ];
    }
    for (const cmd of [
      'insert markdown cell above',
      'add markdown cell above'
    ]) {
      this.registry[cmd] = [
        NotebookActions.insertAbove,
        changeCellTypeToMarkdown
      ];
    }
    console.log(this.registry);
  }

  private preprocess_cmd(cmd: string): string {
    return cmd.replace(/[^\w\s]/gi, '').toLowerCase();
  }

  execute(panel: NotebookPanel, cmd: string): boolean {
    cmd = this.preprocess_cmd(cmd);
    if (cmd in this.registry) {
      const actions = this.registry[cmd];
      for (const action of actions) {
        action(panel.content, panel.sessionContext);
      }
      return true;
    }
    return false;
  }
}
