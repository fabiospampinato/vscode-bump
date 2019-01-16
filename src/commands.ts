
/* IMPORT */

import Config from './config';
import Script from './script';
import Utils from './utils';

/* COMMANDS */

async function bump ( command?: string ) {

  const cwd = await Utils.bump.getCwd ();

  if ( !cwd ) return;

  const bin = await Utils.bump.getBinPath ();

  if ( !bin ) return;

  const args = await Utils.bump.getArguments ( command );

  if ( !args ) return;

  const config = Config.get ();

  if ( !config.terminal ) {

    Script.execa ( cwd, bin, args );

  } else {

    Script.terminal ( cwd, bin, args );

  }

}

function version () {

  return bump ( 'version' );

}

function changelog () {

  return bump ( 'changelog' );

}

function commit () {

  return bump ( 'commit' );

}

function tag () {

  return bump ( 'tag' );

}

function release () {

  return bump ( 'release' );

}

/* EXPORT */

export {bump, version, changelog, commit, tag, release};
