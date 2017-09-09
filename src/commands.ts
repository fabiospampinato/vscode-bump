
/* IMPORT */

import * as vscode from 'vscode';
import NPM from './providers/npm';
import Utils from './utils';

/* COMMANDS */

async function bump () {

  const repo = await Utils.git.getRepository ();

  if ( !repo ) return vscode.window.showErrorMessage ( 'You have to open a Git repository before being able to bump its version' );

  const providers = [NPM],
        supported = await Promise.all ( providers.map ( p => p.isSupported ( repo ) ) ),
        provider = providers.find ( ( p, index ) => supported[index] );

  if ( !provider ) return vscode.window.showErrorMessage ( 'This repository is not supported, read Bump\'s readme to learn more about it' );

  const increment = await vscode.window.showQuickPick ( provider.increments );

  if ( !increment ) return;

  return new provider ().bump ( repo, increment );

}

/* EXPORT */

export {bump};
