
/* IMPORT */

import Files from './files';

/* NPM */

class NPM extends Files {

  init () {

    this.files = {
      'package.json': ['"version":\\s*"([^"]*)"', '"version": "[version]"', 'm'],
      'package-lock.json': ['"version":\\s*"([^"]*)"', '"version": "[version]"', 'm']
    };

    super.init ();

  }

}

/* EXPORT */

export default NPM;
