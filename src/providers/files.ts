
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import Abstract from './abstract';
import Config from '../config';
import Utils from '../utils';

/* FILES */

class Files extends Abstract {

  files; basePaths; regexes; replacements;

  init () {

    this.files = this.files || this.config.files;
    this.basePaths = Object.keys ( this.files );
    this.regexes = this.basePaths.map ( basePath => new RegExp ( this.files[basePath][0], 'm' ) );
    this.replacements = this.basePaths.map ( basePath => this.files[basePath][1] );

  }

  async isSupported () {

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      if ( !!await this.getContent ( this.basePaths[i] ) ) return true;

    }

    return false;

  }

  async getVersionByCommit ( commit ) {

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      const content = await this.getContentByCommit ( commit, this.basePaths[i] );

      if ( !content ) continue;

      const match = content.match ( this.regexes[i] );

      if ( match ) return _.last ( match );

    }

    return this.config.version.initial;

  }

  async isCommitBump ( commit ) { //FIXME: A little brittle, we should also check if those matches are in adjacent lines

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      const diff = await this.getDiffByCommit ( commit, this.basePaths[i] );

      if ( !diff ) continue;

      const minusMatch = diff.match ( new RegExp ( `-.*${this.regexes[i].source}`, 'm' ) ),
            plusMatch = diff.match ( new RegExp ( `\\+.*${this.regexes[i].source}`, 'm' ) );

      if ( minusMatch && plusMatch ) return true;

    }

    return false;

  }

  async updateVersion ( version ) {

    await Promise.all ( this.basePaths.map ( async ( basePath, i ) => {

      const content = await this.getContent ( basePath );

      if ( !content ) return;

      const newContent = content.replace ( this.regexes[i], this.replacements[i].replace ( '[version]', version ) );

      this.setContent ( basePath, newContent );

    }));

  }

}

/* EXPORT */

export default Files;
