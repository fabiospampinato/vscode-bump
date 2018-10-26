
/* IMPORT */

import * as vscode from 'vscode';
import Files from './providers/files';
import NPM from './providers/npm';
import Config from './config';
import Utils from './utils';

/* COMMANDS */

async function bump () {

  const config = Config.get (),
        repo = await Utils.git.getRepository ();

  if ( !repo ) return vscode.window.showErrorMessage ( 'You have to open a Git repository before being able to bump its version' );

  const providers = [Files, NPM].map ( provider => new provider ( config, repo ) ),
        supported = await Promise.all ( providers.map ( provider => provider.isSupported () ) ),
        supportedProviders = providers.filter ( ( p, index ) => supported[index] );

  if ( !supportedProviders.length ) return vscode.window.showErrorMessage ( 'This repository is not supported, read Bump\'s readme to learn more about it' );

  const increments = config.version.increments,
        increment = increments.length === 1 ? increments[0] : await vscode.window.showQuickPick ( increments, { placeHolder: 'Select an increment...'} );

  if ( !increment ) return;

  const version = increment === 'custom' && await vscode.window.showInputBox ({ placeHolder: 'Enter a version...' });

  for ( let i = 0, l = supportedProviders.length; i < l; i++ ) {

    const isLast = ( i === l - 1 );

    await supportedProviders[i].bump ( increment, version, isLast );

  }

}

/* EXPORT */

export {bump};
