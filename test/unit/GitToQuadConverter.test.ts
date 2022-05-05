import type { RepresentationPreferences, ResourceIdentifier } from '@solid/community-server';
import {
  BasicRepresentation,
  ChainedConverter,
  INTERNAL_QUADS,
  RdfToQuadConverter,
  RepresentationMetadata,
} from '@solid/community-server';
import { GitBinaryToQuadConverter } from '../../src';
import fs from 'fs';
import type { Readable } from 'stream';
import { GitObjectFactory } from '../../src/git/GitObjectFactory';
import streamifyArray from 'streamify-array';

describe('A chained converter ', (): void => {
  const converter = new ChainedConverter([
    new RdfToQuadConverter(),
    new GitBinaryToQuadConverter(),
  ]);

  it('gitConverterTesting', async(): Promise<void> => {
    const path = '.test-folder/';
    const arrayOfIds = await GitObjectFactory.createBasicGitObjects(path);

    // Define which object we want here [0][x] =blob [1][x]=tree [2][x] = commit
    const stringOfIDPrefix = arrayOfIds[0][0].toString();
    const pathToGit = `${path}/objects/${stringOfIDPrefix.slice(0, 2)}/${stringOfIDPrefix.slice(2)}`;

    const read = await fs.readFileSync(pathToGit);

    const metadata = new RepresentationMetadata('git/objects');
    const identifier: ResourceIdentifier = { path: pathToGit };

    // Convert Buffer to Readable
    const data = streamifyArray([read]);
    const representation = new BasicRepresentation(data, metadata);

    const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
    const result = await converter.handleSafe({ identifier, representation, preferences });

    const something: Readable = result.data;
    const readSomething = await something.read(20);
    //console.log(readSomething);

    expect(result.data).toBeTruthy();
  });
});
