# Bump

> This is just a front-end for [bump](https://github.com/fabiospampinato/bump), which you must **install** on your system. Read its readme to learn how to configure it.

<p align="center">
  <img src="https://raw.githubusercontent.com/fabiospampinato/vscode-bump/master/resources/logo.png" width="128" alt="Logo">
</p>

Bump updates the project's version, updates/creates the changelog, makes the bump commit, tags the bump commit and makes the release to GitHub. Opinionated but configurable.

## Install

Follow the instructions in the [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-bump), or run the following in the command palette:

```shell
ext install fabiospampinato.vscode-bump
```

## Usage

It adds 6 commands to the command palette:

```js
Bump // Executes `bump`
Bump: Version // Executes `bump version`
Bump: Changelog // Executes `bump changelog`
Bump: Commit // Executes `bump commit`
Bump: Tag // Executes `bump tag`
Bump: Release // Executes `bump release`
```

## Settings

```js
{
  "bump.terminal": false // Execute the bump command in a new terminal
}
```

## Contributing

If you found a problem, or have a feature request, please open an [issue](https://github.com/fabiospampinato/vscode-bump/issues) about it.

If you want to make a pull request you can debug the extension using [Debug Launcher](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-debug-launcher).

## License

MIT © Fabio Spampinato
