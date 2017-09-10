
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import * as pify from 'pify';
import * as semver from 'semver';
import * as simpleGit from 'simple-git';
import * as vscode from 'vscode';
import Changelog from '../changelog';
import Commit from '../commit';
import Config from '../config';

/* ABSTRACT */

class Abstract {

  /* STATIC */

  static increments = [];

  static async isSupported ( repo ) {

    return false;

  }

  /* API */

  async bump ( repo, increment ) {

    /* VARIABLES */

    const config = Config.get (),
          git = pify ( _.bindAll ( simpleGit ( repo ), ['log', 'show'] ) ),
          currentCommits = await this.getCurrentCommits ( git );

    /* CHECKS */

    if ( !currentCommits.length ) return vscode.window.showErrorMessage ( 'No changes detected, cannot bump' );

    /* VERSION */

    const previousVersion = await this.getPreviousVersion ( git ),
          nextVersion = await this.getNextVersion ( previousVersion, increment );

    await this.updateVersion ( git, nextVersion );

    /* CHANGELOG */

    if ( config.changelog.enabled ) {

      await Changelog.update ( git, nextVersion, currentCommits );

    }

    /* COMMIT */

    if ( config.commit.enabled ) {

      await Commit.do ( git, nextVersion );

    }

  }

  async getDiffByCommit ( git, commit, filepath ) {

    return await git.show ( [commit.hash, filepath] );

  }

  async isCommitBump ( git, commit ) {

    return false;

  }

  async getVersionByCommit ( git, commit ) {}

  async getPreviousVersion ( git ) {

    const {all} = await git.log ();

    return await this.getVersionByCommit ( git, all[0] );

  }

  async getNextVersion ( previousVersion, increment ) {

    return semver.inc ( previousVersion, increment );

  }

  async getCurrentCommits ( git ) {

    const {all} = await git.log (),
          allCommits = all.slice ( 0, -1 ), // Ignoring the first commit
          currentCommits = [];

    if ( allCommits.length ) {

      let nextVersion;

      for ( let commit of allCommits ) {

        const version = await this.getVersionByCommit ( git, commit );

        if ( nextVersion && version !== nextVersion ) break;

        const isBump = await this.isCommitBump ( git, commit );

        if ( isBump ) break;

        currentCommits.push ( commit );

        nextVersion = version;

      }

    }

    return currentCommits;

  }

  async updateVersion ( git, version ) {}

}

/* EXPORT */

export default Abstract;
