# jupyter_voicepilot

[![Github Actions Status](https://github.com/JovanVeljanoski/jupyter-voicepilot/workflows/Build/badge.svg)](https://github.com/JovanVeljanoski/jupyter-voicepilot/actions/workflows/build.yml)

A JupyterLab extension for generating code and interacting with JupyterLab via voice commands. This extension can also be used for some basic nagivation around in JupyterLab Notebook. It is built around OpenAI's `Whisper-1` and `GPT-3` APIs. You will need to have an OpenAI API key to use this extension.

Click on the image below to see a demo of the extension:
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/JlHnDm4oUgA/maxresdefault.jpg)](https://www.youtube.com/watch?v=JlHnDm4oUgA)

## Requirements

- JupyterLab >= 3.0

## Install

To install the extension, execute:

```bash
pip install jupyter_voicepilot
```

## Uninstall

To remove the extension, execute:

```bash
pip uninstall jupyter_voicepilot
```

## Usage

Click the `Voice Pilot` button in the JupyterLab to start recording your instruction. When done, click the button again to stop the recording. The extension will then process your instruction and execute the appropriate action.

### Generating code

If a cell is of type `code`, the extension will generate code based on the input you provided.
The generated code will be inserted in the cell. An exception to this is when you provide a set phrase which is mapped to a specific Notebook navigation action. See below for more details.

### Dictation

If a cell is of type `markdown`, the extension will insert the text you provided in the cell.
An exception to this is when you provide a set phrase which is mapped to a specific Notebook navigation action. See below for more details.

### ChatGPT interaction

If you start your voice message with "hey", the message will be sent to the `ChatGPT` model.
If the current cell is empty, it will be converted to a markdown cell and the response will be added there. If the current cell is not empty, a new `markdown` cell will be inserted below the current cell, containing the response from ChatGPT.

### Notebook navigation

The extension can also be used for some basic nagivation around in JupyterLab Notebook. The following table shows the Notebook actions that a supported, and the corresponding phrases that you can use to trigger them.

| Action                     | Phrase                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `run`                      | "run", "run cell", "run the cell", "execute"                                           |
| `runAll`                   | "run all", "run all cells", "execute all", "execute all cells"                         |
| `runAndAdvance`            | "run and advance", "run cell and advance", "execute and advance"                       |
| `runAndInsert`             | "run and insert", "run cell and insert", "execute and insert"                          |
| `runAllAbove`              | "run all above", "run all cells above", "execute all above", "execute all cells above" |
| `runAllBelow`              | "run all below", "run all cells below", "execute all below", "execute all cells below" |
| `deleteCells`              | "delete", "delete cell", "delete cells", "delete the cell", "delete the cells"         |
| `clearAllOutputs`          | "clear all outputs", "clear all the outputs", "clear outputs"                          |
| `selectLastRunCell`        | "select last run cell", "select the last run cell"                                     |
| `undo`                     | "undo"                                                                                 |
| `redo`                     | "redo"                                                                                 |
| `cut`                      | "cut"                                                                                  |
| `copy`                     | "copy"                                                                                 |
| `paste`                    | "paste"                                                                                |
| `changeCellTypeToMarkdown` | "markdown", "to markdown", "markdown cell", "convert to markdown", "cast to markdown"  |
| `changeCellTypeToCode`     | "code", "to code", "code cell", "convert to code", "cast to code"                      |
| `insertMarkdownCellBelow`  | "insert markdown cell below", "add markdown below"                                     |
| `insertMarkdownCellAbove`  | "insert markdown cell above", "add markdown above"                                     |
| `insertCodeCellBelow`      | "insert code cell below", "add code below"                                             |
| `insertCodeCellAbove`      | "insert code cell above", "add code above"                                             |

## Configuration

In the advanced settings editor, you can set the following configuration options:

- Open API Key (_required_): Your OpenAI API key. You can get one [here](https://platform.openai.com/overview).

## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Change directory to the jupyter_voicepilot directory
# Install package in development mode
pip install -e "."
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```bash
jupyter lab build --minimize=False
```

### Development uninstall

```bash
pip uninstall jupyter_voicepilot
```

In development mode, you will also need to remove the symlink created by `jupyter labextension develop`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `voicepilot` within that folder.

<!-- ### Testing the extension

#### Frontend tests

This extension is using [Jest](https://jestjs.io/) for JavaScript code testing.

To execute them, execute:

```sh
jlpm
jlpm test
```

#### Integration tests

This extension uses [Playwright](https://playwright.dev/docs/intro) for the integration tests (aka user level tests).
More precisely, the JupyterLab helper [Galata](https://github.com/jupyterlab/jupyterlab/tree/master/galata) is used to handle testing the extension in JupyterLab.

More information are provided within the [ui-tests](./ui-tests/README.md) README.

### Packaging the extension

See [RELEASE](RELEASE.md) -->
