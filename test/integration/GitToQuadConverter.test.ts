'use strict';
import fetch from 'node-fetch';
import { GitObjectFactory } from '../../src/git/GitObjectFactory';
import fs from 'fs';
import { unzipSync } from 'zlib';
import type { RepresentationPreferences, ResourceIdentifier } from '@solid/community-server';
import {
  BasicRepresentation,
  ChainedConverter,
  INTERNAL_QUADS,
  RdfToQuadConverter,
  RepresentationMetadata,
} from '@solid/community-server';
import type { Readable } from 'stream';
import { GitToQuadConverter } from '../../src';
import { getDefaultVariables, getTestConfigPath, instantiateFromConfig } from './Config';
import streamifyArray from 'streamify-array';

Object.defineProperty(exports, '__esModule', { value: true });
const port = 3001;
const baseUrl = `http://localhost:${port}/`;
describe('Test', () => {
  let app: any;
  beforeAll(async() => {
    app = await instantiateFromConfig('urn:solid-server:default:App', getTestConfigPath('default.json'), getDefaultVariables(port, baseUrl));
    await app.start();
  });
  afterAll(async() => {
    await app.stop();
  });
  it('simple int test', async() => {
    const path = '.test-folder';
   // const arrayOfIds = await GitObjectFactory.createBasicGitObjects(path);

    // Define which object we want here [0][x] =blob [1][x]=tree [2][x] = commit
   // const stringOfIDPrefix = arrayOfIds[0][0].toString();
  //  const pathToGit = `${path}/objects/${stringOfIDPrefix.slice(0, 2)}/${stringOfIDPrefix.slice(2)}`;

      const pathToGit ="ptg"

    //  const read = await fs.readFileSync(pathToGit);
      const read = "blub"


      try {


          const put1 = await fetch(`${baseUrl}ax`, {
              method: 'PUT',
              headers: {
                  'content-type': 'application/json'
              },
              body: "bluiiie",
          });

          console.log(put1.status);
      }catch (error){
          console.log(error)
      }



    const getRes0 = await fetch("http://localhost:3001/abc", {
      method: 'GET',
        headers:{
          'accept': 'application/git'}
    });
    console.log(getRes0.status);

    const contentType = getRes0.headers.get('content-type');
    console.log(contentType);

    const a = getRes0.body.read();
    console.log(a);
    const syncTxt = unzipSync(a).toString('utf-8');
    console.log(syncTxt);

    // Give Data to Converter
    const converter = new ChainedConverter([
      new RdfToQuadConverter(),
      new GitToQuadConverter(),
    ]);

    const metadata = new RepresentationMetadata('application/git'); // Wie findet me das use

    const identifier: ResourceIdentifier = { path: pathToGit };
    const dataReadable = streamifyArray([read]);
    const representation = new BasicRepresentation(dataReadable, metadata);

    const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
    const result = await converter.handleSafe({ identifier, representation, preferences });

    const something: Readable = result.data;
    const readSomething = await something.read(20);
    console.log(readSomething);
    expect(readSomething).toBeTruthy();
  });
});
// # sourceMappingURL=Yjs.test.js.map
