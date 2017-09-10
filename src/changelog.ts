
/* IMPORT */

import * as _ from 'lodash';
import * as path from 'path';
import Config from './config';
import Utils from './utils';

/* CHANGELOG */

const Changelog = {

  renderSection ( version, commits ) {

    /* VARIABLES */

    const config = Config.get (),
          lines = [];

    /* VERSION */

    if ( config.templates.version ) {

      const tokens = {version};

      lines.push ( Changelog.renderLine ( config.templates.version, tokens ) );

    }

    /* COMMITS */

    if ( config.templates.commit ) {

      commits.forEach ( ( commit, index ) => {

        const {hash, date, message, author_name, author_email} = commit;

        const tokens = {
          hash: hash,
          hash4: hash.slice ( 0, 4 ),
          hash7: hash.slice ( 0, 7 ),
          hash8: hash.slice ( 0, 8 ),
          message: index ? message : message.replace ( / \(HEAD\)/i, '' ).replace ( / \(HEAD -> \S+\)/i, '' ), //FIXME: Ugly, there should be a better way of doing it
          author_name,
          author_email
        };

        lines.push ( Changelog.renderLine ( config.templates.commit, tokens ) );

      });

    }

    /* SECTION */

    let section = lines.join ( '\n' ) + '\n';

    /* SEPARATOR */

    if ( config.templates.separator ) {

      section += Changelog.renderLine ( config.templates.separator );

    }

    /* RETURN */

    return section;

  },

  renderLine ( template, tokens = {} ) {

    _.forOwn ( tokens, ( value, token ) => {

      template = template.replace ( `[${token}]`, value );

    });

    return template;

  },

  async writeSection ( git, section ) {

    const config = Config.get (),
          changelogPath = path.join ( git._baseDir, config.changelog.file ),
          content = await Utils.file.read ( changelogPath );

    if ( _.isUndefined ( content ) && !config.changelog.create ) return;

    const changelog = section + ( content || '' ),
          changelogCleaned = changelog.replace ( /^(\s*\n){2,}/gm, '\n' ); // Removing multiple new lines

    await Utils.file.make ( changelogPath, changelogCleaned );

    if ( config.changelog.open ) return Utils.file.open ( changelogPath );

  },

  async update ( git, version, commits ) {

    const section = Changelog.renderSection ( version, commits );

    return Changelog.writeSection ( git, section );

  }

};

/* EXPORT */

export default Changelog;
