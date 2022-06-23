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
import arrayifyStream from "arrayify-stream";
import fs from "fs";

export class GitToQuadConverter extends BaseTypedRepresentationConverter {
  protected readonly logger = getLoggerFor(this);

  public constructor() {
    super(APPLICATION_GIT, INTERNAL_QUADS);
  }

  public async handle({ representation, identifier }: RepresentationConverterArgs): Promise<Representation> {
    this.logger.debug('Convert git to quads.');


    /**
     * TODO: Schould not read from fs, but get a readable
     */
    // @ts-ignore
    let fileRead= fs.readFileSync(representation.data.path)

    const pathOfIdentifier = identifier.path;
    const index = pathOfIdentifier.lastIndexOf('/objects/');
    let oid = '';
    if (index < 0) {
      this.logger.debug('invalid identifier path');
    } else {
      oid = pathOfIdentifier.slice(index + 9, index + 11) + pathOfIdentifier.slice(index + 12);
    }

    // Since the readable is in object mode the "size" argument we read does not matter
/*
    let tryRead = representation.data;
    console.log(tryRead)
    let tryReadIt = tryRead.read();
    let tryReadItWait =await tryRead.read();

    console.log(representation.data.read())
    const data: Buffer = representation.data.read();
*/
    const unzip: Buffer = unzipSync(fileRead);
    const syncTxt = unzipSync(fileRead).toString('utf-8');

    let quad: Quad[];

    // Figure out the type of Git Object we are dealing with
    const compare = fileRead.readUInt8(2);
    if (compare === 75) {
      this.logger.debug(' Found a Blob');
      const txtNoPrefix = syncTxt.slice(8, syncTxt.length);
      quad = GitUtils.blobToQuad(txtNoPrefix, oid, pathOfIdentifier);
    } else if (compare === 43) {
      this.logger.debug('Found a Tree');
      quad = GitUtils.treeToQuad(unzip, pathOfIdentifier);
    } else if (compare === 141) {
      this.logger.debug('Found a Commit');
      quad = GitUtils.commitToQuad(syncTxt, oid, pathOfIdentifier);
    } else {
      quad = [];
      this.logger.debug('undefined');
    }
    return new BasicRepresentation(quad, representation.metadata, INTERNAL_QUADS);
  }
}
