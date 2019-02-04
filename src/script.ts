
/* IMPORT */

import * as _ from 'lodash';
import delay from 'delay';
import * as execa from 'execa';
import * as vscode from 'vscode';
import Utils from './utils';

/* SCRIPT */

const Script = {

  async execa ( cwd: string, bin: string, args: string[] = [] ) {

    try {

      await execa ( bin, args, {cwd} );

      vscode.window.showInformationMessage ( '[bump] Done!' );

    } catch ( e ) {

      vscode.window.showErrorMessage ( `[bump] ${e}` );

      Utils.bump.getBinPath ();

    }

  },

  async terminal ( cwd: string, bin: string, args: string[] = [] ) {

    const term = vscode.window.createTerminal ({ cwd, name: 'Bump' });

    await term.processId;
    await delay ( 200 );

    term.show ( false );

    term.sendText ( `${bin} ${args.join ( ' ' )}` );

    Utils.bump.getBinPath ();

  }

};

/* EXPORT */

export default Script;
