import type { Representation,
  RepresentationConverterArgs } from '@solid/community-server';
import {
  BaseTypedRepresentationConverter,
  BasicRepresentation,
  getLoggerFor, INTERNAL_QUADS,

} from '@solid/community-server';
import { GitUtils } from './GitUtils';
import type { Quad } from 'rdf-js';
import { unzipSync } from 'zlib';
import { APPLICATION_GIT } from '../util/ContentType';
import fs from "fs";

export class GitToQuadConverter extends BaseTypedRepresentationConverter {
  protected readonly logger = getLoggerFor(this);

  public constructor() {
    super(APPLICATION_GIT, INTERNAL_QUADS);
  }

  public async handle({ representation, identifier }: RepresentationConverterArgs): Promise<Representation> {
    this.logger.debug('Convert git to quads.');

    const pathOfIdentifier = identifier.path;
    const index = pathOfIdentifier.lastIndexOf('/objects/');
    let oid = '';
    if (index < 0) {
      this.logger.debug('invalid identifier path');
    } else {
      oid = pathOfIdentifier.slice(index + 9, index + 11) + pathOfIdentifier.slice(index + 12);
    }

    async function streamToString(stream: any) {
      let chunks: any[];
      chunks = [];
      return new Promise((resolve, reject) => {
        // @ts-ignore
        stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
        // @ts-ignore
        stream.on('error', err => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    }
    // @ts-ignore
    const result:Buffer = await streamToString(representation.data);
    const unzip: Buffer = unzipSync(result);
    const syncTxt = unzipSync(result).toString('utf-8');

    let quad: Quad[];

    // Figure out the type of Git Object we are dealing with
    const compare = result.readUInt8(2);
    console.log(compare);
    if (compare === 75) {
      this.logger.debug(' Found a Blob');
      const txtNoPrefix = syncTxt.slice(8, syncTxt.length);
      quad = GitUtils.blobToQuad(txtNoPrefix, oid, pathOfIdentifier);
    } else if (compare === 43) {
      this.logger.debug('Found a Tree');
      quad = GitUtils.treeToQuad(unzip, pathOfIdentifier);
    } else if (compare === 149) {
      this.logger.debug('Found a Commit');
      quad = GitUtils.commitToQuad(syncTxt, oid, pathOfIdentifier);
    } else {
      quad = [];
      this.logger.debug('undefined object with start bytes: ' + compare);
    }
    return new BasicRepresentation(quad, representation.metadata, INTERNAL_QUADS);
  }
}
