const archiver = require('archiver');

const zipfile = (strObjects, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.on('warning', (err) => {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(res);

  for (let i = 0; i < strObjects.length; i++) {
    const buffer = Buffer.from(strObjects[i].file);
    archive.append(buffer, { name: strObjects[i].fileName });
  }
  archive.finalize();
};

exports = zipfile;
