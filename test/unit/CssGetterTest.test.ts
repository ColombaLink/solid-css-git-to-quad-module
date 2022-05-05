import type { RepresentationPreferences, ResourceIdentifier } from '@solid/community-server';
import {
  BasicRepresentation,
  ChainedConverter,
  INTERNAL_QUADS,
  RdfToQuadConverter,
  RepresentationMetadata,
} from '@solid/community-server';
import { GitBinaryToQuadConverter } from '../../src/git/GitBinaryToQuadConverter';
import fs from 'fs';
import type { Readable } from 'stream';
import { GitObjectFactory } from '../../src/git/GitObjectFactory';
import streamifyArray from 'streamify-array';
import fetch from "node-fetch";

describe('CSS getter ', (): void => {
  const converter = new ChainedConverter([
    new RdfToQuadConverter(),
    new GitBinaryToQuadConverter(),
  ]);

  it('gitConverterTesting', async(): Promise<void> => {
   // const path = 'C:\\Users\\timoc\\Desktop\\CommunitySolidServer\\data';
      const path= 'http://localhost:3000/data'
   // const arrayOfIds = await GitObjectFactory.createBasicGitObjects(path);

    // Define which object we want here [0][x] =blob [1][x]=tree [2][x] = commit
    //const stringOfIDPrefix = arrayOfIds[0][0].toString();
   // const pathToGit = `${path}/objects/${stringOfIDPrefix.slice(0, 2)}/${stringOfIDPrefix.slice(2)}`;

   // const read = await fs.readFileSync(pathToGit);
      //console.log(read)
      let pathToGit=`${path}/objects/04/5957f09af06330af241de36c37d04d863ed4d4`
      const metadata = new RepresentationMetadata('application/git');
    const identifier: ResourceIdentifier = { path: pathToGit };


      const getRes0 = await fetch(`${path}/objects/04/5957f09af06330af241de36c37d04d863ed4d4`, {
          method: 'GET',
          headers: {'accept': 'application/git'}
      });
      console.log(getRes0.status);


      const contentType = getRes0.headers.get('content-type');
      console.log(contentType);

    // Convert Buffer to Readable
    const data = streamifyArray([getRes0]);
    const representation = new BasicRepresentation(data, metadata);

    const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
    const result = await converter.handleSafe({ identifier, representation, preferences });

    const something: Readable = result.data;
    const readSomething = await something.read(20);
    console.log(readSomething);

    expect(result.data).toBeTruthy();
  });
});
