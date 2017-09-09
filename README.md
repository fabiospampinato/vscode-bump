# VSC Bump

<p align="center">
	<img src="https://raw.githubusercontent.com/fabiospampinato/vscode-bump/master/resources/logo-128x128.png" alt="Logo">
</p>

Bump your project's version and update the changelog. Opinionated but configurable.

This extension is here to save you time, this is what it can do for you:
- It can bump your project's version.
- It can detect which commits where made after the latest bump and update your changelog accordingly.
- It can automatically make a commit with the changes made.
- How the changelog gets rendered and the commit message can be customized.

It currently only works with Git projects having a `package.json` file at their root, basically JavaScript/TypeScript applications. Support for other kind of applications can be added given enough demand.

## Install

Run the following in the command palette:

```shell
ext install vscode-bump
```

## Usage

It adds 1 command to the command palette:

```js
Bump // Bump your project's version, you'll be asked to pick a value between "major", "minor", "patch" etc.
```

## Settings

```js
{
  "bump.commit.enabled": true, // Commit the changes automatically
  "bump.commit.message": "Bumped version to [version]", // Commit message
  "bump.changelog.enabled": true, // Enable changelog auto-updates
  "bump.changelog.create": false, // Create the changelog file if it doesn't exist
  "bump.changelog.open": false, // Open the changelog file after bumping
  "bump.changelog.file": "CHANGELOG.md", // Name of the changelog file
  "bump.templates.version": "### Version [version]", // Template for the version line
  "bump.templates.commit": "- [message]", // Template for the commit line
  "bump.templates.separator": "\n" // Template for the separator between versions sections
}
```

## Templates & Tokens

How things get written in the changelog can be customized via templates, which are plain strings where tokens in the form of `[token]` will be replaced with some values.

Here's a list of all the available tokens (not all of them are available for every template):

```js
[
  "version", // The new version
  "hash", // A commit's hash
  "hash4", // First 4 characters of a commit's hash
  "hash7", // First 7 characters of a commit's hash
  "hash8", // First 8 characters of a commit's hash
  "message", // A commit's message
  "author_name", // Name of the author of a commit
  "author_email", // Email of the author of a commit
]
```

## Demo

![Demo](resources/demo.gif)

## Hits:

- **Commits messages**: Spend some extra seconds to write descriptive commits messages, with no extra effort you'll be improving your changelogs as well. If you're already doing this, just enjoy the extra free time!
- **Review**: Setting `bump.commit.enabled = false` and `bump.changelog.open = true` allows you to review your changelog before committing it. Alternatively you can also auto-commit it, review it later, and in case amend the previous commit.

## License

MIT © Fabio Spampinato
