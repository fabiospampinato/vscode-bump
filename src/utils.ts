
/* IMPORT */

import * as _ from 'lodash';
import * as execa from 'execa';
import * as opn from 'opn';
import * as path from 'path';
import * as vscode from 'vscode';
import * as Commands from './commands';
import Config from './config';

/* UTILS */

const Utils = {

  initCommands ( context: vscode.ExtensionContext ) {

    const {commands} = vscode.extensions.getExtension ( 'fabiospampinato.vscode-bump' ).packageJSON.contributes;

    commands.forEach ( ({ command }) => {

      const commandName = _.last ( command.split ( '.' ) ) as string,
            handler = Commands[commandName],
            disposable = vscode.commands.registerCommand ( command, () => handler () );

      context.subscriptions.push ( disposable );

    });

    return Commands;

  },

  bump: {

    async getCwd () {

      const textEditor = vscode.window.activeTextEditor;

      if ( textEditor && path.isAbsolute ( textEditor.document.uri.fsPath ) ) {

        if ( vscode.workspace.workspaceFolders ) {

          const rootPaths = vscode.workspace.workspaceFolders.map ( folder => folder.uri.fsPath ),
                sortedRootPaths = _.sortBy ( rootPaths, [path => path.length] ).reverse (); // In order to get the closest root

          return sortedRootPaths.find ( rootPath => textEditor.document.uri.fsPath.startsWith ( rootPath ) );

        } else {

          return path.dirname ( textEditor.document.uri.fsPath );

        }

      } else if ( vscode.workspace.workspaceFolders ) {

        return vscode.workspace.workspaceFolders[0].uri.fsPath;

      } else {

        vscode.window.showErrorMessage ( 'You have to execute the command in a supported directory' );

      }

    },

    getBinName: () => 'bump',

    getBinPath: async () => {

      const bin = Utils.bump.getBinName ();

      try {

        await execa ( bin, ['--version'] );

        return bin;

      } catch ( e ) {

        const option = await vscode.window.showErrorMessage ( 'Couldn\'t find bump on your system, you need to install it', { title: 'Install' } );

        if ( !option || option.title !== 'Install' ) return;

        opn ( 'https://github.com/fabiospampinato/bump', { wait: false } );

      }

    },

    async getArguments ( command?: string ) {

      const args: string[] = [];

      if ( command ) args.push ( command );

      if ( !command || command === 'version' ) {

        const increments = ['major', 'minor', 'patch', 'custom'],
              increment = await vscode.window.showQuickPick ( increments, { placeHolder: 'Select an increment...'} );

        if ( !increment ) return;

        if ( increment === 'custom' ) {

          const version = await vscode.window.showInputBox ({ placeHolder: 'Enter a version...' });

          if ( !version ) return;

          args.push ( version );

        } else {

          args.push ( increment );

        }

      }

      const config = Config.get ();

      if ( !config.terminal ) args.push ( '--force', '--silent' );

      return args;

    }

  }

};

/* EXPORT */

export default Utils;
