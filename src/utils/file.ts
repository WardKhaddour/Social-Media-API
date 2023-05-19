import fs from 'fs';

export const deleteFile = (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        fs.unlink(filePath, err => {
          if (err) reject(err);
          resolve();
        });
      }
    });
  });
};
