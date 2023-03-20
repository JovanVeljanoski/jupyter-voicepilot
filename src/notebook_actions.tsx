import { NotebookActions, NotebookPanel} from '@jupyterlab/notebook';


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
};
