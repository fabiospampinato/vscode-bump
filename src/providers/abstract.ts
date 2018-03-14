
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as pify from 'pify';
import * as semver from 'semver';
import * as simpleGit from 'simple-git';
import * as touch from 'touch';
import * as vscode from 'vscode';
import Changelog from '../changelog';
import Commit from '../commit';
import Utils from '../utils';

/* ABSTRACT */

class Abstract {

  config; repo; git;

  constructor ( config, repo ) {

    this.config = config;
    this.repo = repo;
    this.git = pify ( _.bindAll ( simpleGit ( this.repo ), ['log', 'show'] ) );

    this.init ();

  }

  init () {}

  async isSupported () {

    return false;

  }

  async bump ( increment, commit = false ) {

    /* VARIABLES */

    const currentCommits = await this.getCurrentCommits ();

    /* CHECKS */

    if ( !currentCommits.length ) { // No changes

      const action = await vscode.window.showInformationMessage ( 'No changes detected, bump anyway?', { title: 'Cancel' }, { title: 'Bump' } );

      if ( !action || action.title !== 'Bump' ) return;

    }

    /* VERSION */

    let version;

    if ( increment === 'custom' ) {

      version = await vscode.window.showInputBox ({ placeHolder: 'Enter a version...' });

    } else {

      const previousVersion = await this.getPreviousVersion ();

      version = await this.getNextVersion ( previousVersion, increment );

    }

    if ( !version ) return;

    await this.updateVersion ( version );

    /* COMMIT */

    if ( commit ) {

      /* CHANGELOG */

      if ( this.config.changelog.enabled ) {

        await Changelog.update ( this.git, version, currentCommits );

      }

      /* COMMIT */

      if ( this.config.commit.enabled ) {

        await Commit.do ( this.git, version );

      }

    }

  }

  async getContent ( filePath ) {

    const repoFilePath = path.join ( this.repo, filePath );

    return await Utils.file.read ( repoFilePath );

  }

  async setContent ( filePath, content ) {

    const repoFilePath = path.join ( this.repo, filePath );

    await Utils.file.write ( repoFilePath, content );

    return touch.sync ( repoFilePath ); // So that they will get automatically refreshed by VSC

  }

  async getContentByCommit ( commit, filePath ) {

    try {
      return await this.git.show ( `${commit.hash}:${filePath}` );
    } catch ( e ) {}

  }

  async getDiffByCommit ( commit, filePath ) {

    try {
      return await this.git.show ( [commit.hash, filePath] );
    } catch ( e ) {}

  }

  async isCommitBump ( commit ) {

    return false;

  }

  async getVersionByCommit ( commit ) {}

  async getPreviousVersion () {

    const {all} = await this.git.log ();

    return await this.getVersionByCommit ( all[0] );

  }

  async getNextVersion ( previousVersion, increment ) {

    return semver.inc ( previousVersion, increment );

  }

  async getCurrentCommits () {

    const {all} = await this.git.log (),
          allCommits = all.slice ( 0, -1 ), // Ignoring the first commit
          currentCommits = [];

    if ( allCommits.length ) {

      let nextVersion;

      for ( let commit of allCommits ) {

        const version = await this.getVersionByCommit ( commit );

        if ( nextVersion && version !== nextVersion ) break;

        const isBump = await this.isCommitBump ( commit );

        if ( isBump ) break;

        currentCommits.push ( commit );

        nextVersion = version;

      }

    }

    return currentCommits;

  }

  async updateVersion ( version ) {}

}

/* EXPORT */

export default Abstract;
