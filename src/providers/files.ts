
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
    this.regexes = {};
    this.replacements = {};

    /* POPULATING REGEXES / REPLACEMENTS */

    _.forOwn ( this.files, ( data, basePath ) => {

      const datas = _.isArray ( data[0] ) ? data : [data],
            [regexes, replacements, flags] = _.zip ( ...datas );

      this.regexes[basePath] = regexes.map ( ( regex, i ) => new RegExp ( regex, _.get ( flags, i, 'gm' ) ) );
      this.replacements[basePath] = replacements;

    });

  }

  async isSupported () {

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      if ( !!await this.getContent ( this.basePaths[i] ) ) return true;

    }

    return false;

  }

  async getVersionByCommit ( commit ) {

    if ( !commit ) return super.getVersionByCommit ();

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      const basePath = this.basePaths[i],
            content = await this.getContentByCommit ( commit, basePath );

      if ( !content ) continue;

      for ( let ri = 0, rl = this.regexes[basePath].length; ri < rl; ri++ ) {

        const match = content.match ( this.regexes[basePath][ri] );

        if ( match ) return _.last ( match );

      }

    }

    return super.getVersionByCommit ();

  }

  async isCommitBump ( commit ) { //FIXME: A little brittle, we should also check if those matches are in adjacent lines

    for ( let i = 0, l = this.basePaths.length; i < l; i++ ) {

      const basePath = this.basePaths[i],
            diff = await this.getDiffByCommit ( commit, basePath );

      if ( !diff ) continue;

      for ( let ri = 0, rl = this.regexes[basePath].length; ri < rl; ri++ ) {

        const regexSource = this.regexes[basePath][ri].source,
              minusMatch = diff.match ( new RegExp ( `-.*${regexSource}`, 'm' ) ),
              plusMatch = diff.match ( new RegExp ( `\\+.*${regexSource}`, 'm' ) );

        if ( minusMatch && plusMatch ) return true;

      }

    }

    return false;

  }

  async updateVersion ( version ) {

    await Promise.all ( this.basePaths.map ( async ( basePath, i ) => {

      const content = await this.getContent ( basePath );

      if ( !content ) return;

      let newContent = content;

      this.regexes[basePath].forEach ( ( regex, ri ) => {

        const replacement = this.replacements[basePath][ri];

        newContent = newContent.replace ( regex, replacement.replace ( /\[version\]/g, version ) );

      });

      this.setContent ( basePath, newContent );

    }));

  }

}

/* EXPORT */

export default Files;
