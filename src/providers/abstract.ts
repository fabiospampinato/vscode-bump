
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
import Script from '../script';
import Tag from '../tag';
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

  async bump ( increment, version: string | boolean = false, commit = false ) {

    /* VARIABLES */

    const currentCommits = await this.getCurrentCommits ();

    /* CHECKS */

    if ( !currentCommits.length ) { // No changes

      const action = await vscode.window.showInformationMessage ( 'No changes detected, bump anyway?', { title: 'Cancel' }, { title: 'Bump' } );

      if ( !action || action.title !== 'Bump' ) return;

    }

    /* VERSION */

    if ( !version ) {

      const previousVersion = await this.getPreviousVersion ();

      version = await this.getNextVersion ( previousVersion, increment );

    }

    if ( !version ) return;

    await Script.run ( 'prebump' );

    await this.updateVersion ( version );

    await Script.run ( 'postbump' );

    /* COMMIT */

    if ( commit ) {

      /* CHANGELOG */

      if ( this.config.changelog.enabled ) {

        await Script.run ( 'prechangelog' );

        await Changelog.update ( this.git, version, currentCommits );

        await Script.run ( 'postchangelog' );

      }

      /* COMMIT */

      if ( this.config.commit.enabled ) {

        await Script.run ( 'precommit' );

        await Commit.do ( this.git, version );

        await Script.run ( 'postcommit' );

        if ( this.config.tag.enabled ) {

          await Script.run ( 'pretag' );

          await Tag.add ( this.git, version );

          await Script.run ( 'posttag' );

        }

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

  async getVersionByCommit ( commit? ) {

    return this.config.version.initial;

  }

  async getPreviousVersion () {

    const all = await this.getAllCommits ();

    return await this.getVersionByCommit ( all[0] );

  }

  async getNextVersion ( previousVersion, increment ) {

    return semver.inc ( previousVersion, increment );

  }

  async getAllCommits () {

    try { // An error gets thrown if there are no commits

      const log = await this.git.log ();

      return log.all;

    } catch ( e ) {

      return [];

    }

  }

  async getCurrentCommits () {

    const all = await this.getAllCommits (),
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
