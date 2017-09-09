
/* IMPORT */

import Changelog from './changelog';
import Config from './config';
import Utils from './utils';

/* COMMIT */

const Commit = {

  async do ( git, version ) {

    const config = Config.get (),
          message = Changelog.renderLine ( config.commit.message, {version} );

    return Utils.exec ( `git commit -a -m "${message}"`, { cwd: git._baseDir } );

  }

};

/* EXPORT */

export default Commit;
