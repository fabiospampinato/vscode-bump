
/* IMPORT */

import * as _ from 'lodash';
import delay from 'delay';
import * as execa from 'execa';
import * as vscode from 'vscode';

/* SCRIPT */

const Script = {

  async execa ( cwd: string, bin: string, args: string[] = [] ) {

    try {

      await execa ( bin, args, {cwd} );

      vscode.window.showInformationMessage ( '[bump] Done!' );

    } catch ( e ) {

      vscode.window.showErrorMessage ( `[bump] ${e}` );

    }

  },

  async terminal ( cwd: string, bin: string, args: string[] = [] ) {

    const term = vscode.window.createTerminal ({ cwd, name: 'Bump' });

    await term.processId;
    await delay ( 200 );

    term.show ( true );

    term.sendText ( `${bin} ${args.join ( ' ' )}` );

  }

};

/* EXPORT */

export default Script;
