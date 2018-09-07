
/* IMPORT */

import Changelog from './changelog';
import Config from './config';
import Utils from './utils';

/* TAG */

const Tag = {

  async add ( git, version ) {

    const config = Config.get (),
          name = Changelog.renderLine ( config.tag.name, {version} );

    return Utils.exec ( `git tag ${name}`, { cwd: git._baseDir } );

  }

};

/* EXPORT */

export default Tag;
