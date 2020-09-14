import { Storage } from '@google-cloud/storage';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

export class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: 'ninth-moment-271720',
      keyFilename: 'key.json'
    });
    this.bucketName = 'teachathome-document-bucket';
  }

  async uploadDocument(name: string, documentPath: string, minetype: string) {
    await this.storage.bucket(this.bucketName).upload(documentPath, {
      destination: name,
      contentType: minetype,
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        // Enable long-lived HTTP caching headers
        // Use only if the contents of the file will never change
        // (If the contents will change, use cacheControl: 'no-cache')
        cacheControl: 'public, max-age=31536000'
      }
    });
    await fs.unlink(documentPath);
    console.log(`${documentPath} uploaded to ${this.bucketName}.`);
  }

  async createTempFile(name: string, content: string) {
    const filePath = path.resolve(os.tmpdir(), name);
    await fs.writeFile(filePath, content);
    return filePath;
  }

  async downloadDocument(name: string) {
    const destFilePath = path.resolve(os.tmpdir(), name);
    const options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: destFilePath
    };

    // Downloads the file
    await this.storage.bucket(this.bucketName).file(name).download(options);

    console.log(
      `gs://${this.bucketName}/${name} downloaded to ${destFilePath}.`
    );
    return destFilePath;
  }
}
