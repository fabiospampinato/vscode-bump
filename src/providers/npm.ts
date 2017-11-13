
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import Abstract from './abstract';
import Utils from '../utils';

/* NPM */

class NPM extends Abstract {

  /* STATIC */

  static increments = ['custom', 'major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease'];

  static async isSupported ( repo ) {

    const packagePath = path.join ( repo, 'package.json' );

    return !!await Utils.file.read ( packagePath );

  }

  /* API */

  async getVersionByCommit ( git, commit ) {

    const content = await git.show ( `${commit.hash}:package.json` ),
          pkg = _.attempt ( JSON.parse, content );

    if ( _.isError ( pkg ) ) return;

    return pkg.version;

  }

  async isCommitBump ( git, commit ) {

    const diff = await this.getDiffByCommit ( git, commit, 'package.json' );

    return diff.match ( /-\s*"version":\s*".*",?/gm ) &&
           diff.match ( /\+\s*"version":\s*".*",?/gm );

  }

  async updateVersion ( git, version ) {

    return Utils.exec ( `npm version --no-git-tag-version "${version}"`, { cwd: git._baseDir } );

  }

}

/* EXPORT */

export default NPM;
