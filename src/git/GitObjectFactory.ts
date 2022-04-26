import fs from 'fs';
import type { Commit, Oid } from 'nodegit';
import { Blob, Repository, Signature, Treebuilder, TreeEntry } from 'nodegit';
import { getLoggerFor } from '@solid/community-server';

export class GitObjectFactory {
  /**
     *  Creates a Git Repository and Adds some Objects to it for testing
     * @param path where the git repository should be created
     *
     * returns [][] of Oid where [0][x] =blob [1][x]=tree [2][x] = commit
     */

  public static async createBasicGitObjects(path: string): Promise<any> {
    const logger = getLoggerFor(this);
    try {
      fs.rmdir('./test-folder', {
        recursive: true,
      }, (): void => {
        logger.debug('delting directory');
      });
    } catch {
      logger.debug('error while delting director');
    }

    const repo = await Repository.init(path, 1);
    const x = await this.createTree(repo);
    // Returns array of Oid first two are Blobs 3. inner tree 4. outer Tree
    const y = await this.createTree(repo);

    const author = Signature.now('alice', 'alice@git.com');
    const parentArray: (string | Oid | Commit)[] = [];

    const commitOid0 = await repo.createCommit(
      'HEAD',
      author,
      author,
      'add firtst event',
      y[3],
      parentArray,
    );
    parentArray.push(commitOid0);

    const commitOid = await repo.createCommit(
      'HEAD',
      author,
      author,
      'add event',
      x[3],
      parentArray,
    );

    const gitObjectOidArray = [[x[0], x[1], y[0], y[1]], [x[2], x[3], y[2], y[3]], [commitOid0, commitOid]];

    return gitObjectOidArray;
  }

  public static async createTree(repo: Repository): Promise<any> {
    // Fs.rmSync(".test-folder/")

    // const repo = await Repository.init(".test-folder/", 1);

    const txt1 = JSON.stringify({ measurement: Math.random() * 9 * 1 * 1, unit: 'Celsius' });
    const blob = Buffer.from(txt1);
    const blobHash = await Blob.createFromBuffer(repo, blob, blob.length);
    const txt2 = JSON.stringify({ measurement: Math.random() * 10 * 1 * 1, unit: 'Celsius' });
    const blob2 = Buffer.from(txt2);
    const blobHash2 = await Blob.createFromBuffer(repo, blob2, blob2.length);

    const secondTreeBuilder = await Treebuilder.create(repo);

    const currentTreeBuilder = await Treebuilder.create(repo);
    await currentTreeBuilder.insert('filename', blobHash, TreeEntry.FILEMODE.BLOB);

    await secondTreeBuilder.insert('filename2', blobHash2, 33_188);
    const secondTreeHash = await secondTreeBuilder.write();
    await currentTreeBuilder.insert('treeName', secondTreeHash, TreeEntry.FILEMODE.TREE);
    const currentTreeOid = await currentTreeBuilder.write();

    const OidArray = [blobHash, blobHash2, secondTreeHash, currentTreeOid];

    return OidArray;
  }

  //
  // public static readFromPodAsBuffer(urlToRepo: string, file: Oid): Buffer {
  // const prefix = file.toString().slice(0, 2);
  // const ending = file.toString().slice(3);
  // const path = urlToRepo + prefix + ending;
  // const tect = fs.readFileSync(path);
  // return tect;
  // }
}
