
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import Config from './config';
import Utils from './utils';

/* SCRIPT */

const Script = {

  async run ( name ) {

    const config = Config.get (),
          script = _.get ( config, `scripts.${name}` );

    if ( !script ) return;

    const term = vscode.window.createTerminal ({ name: `Bump - ${name}`});

    await term.processId;
    await Utils.delay ( 150 );

    return new Promise ( async resolve => {

      vscode.window.onDidCloseTerminal ( t => t === term && resolve () );

      term.show ( true );

      term.sendText ( `${script} && exit 0` ); //TODO: Does closing a terminal like this always work? Maybe the script exits early or something

    });

  }

};

/* EXPORT */

export default Script;
