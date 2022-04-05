import {Readable} from "stream";
import 'jest-rdf';
import {
    BasicRepresentation,
    INTERNAL_QUADS,
    RepresentationMetadata,
    RepresentationPreferences, ResourceIdentifier
} from "@solid/community-server";
import arrayifyStream = require("arrayify-stream");
import {namedNode, triple} from "@rdfjs/data-model";
import {gitBinaryToQuadConverter} from "./gitBinaryToQuadConverter";
import {Doc, encodeStateAsUpdate, Map} from "yjs";
import streamifyArray = require("streamify-array");
import {gitBinaryTestingPrefix} from "./gitBinaryTestingPrefix";
import fs from "fs";
import {unzipSync} from "zlib";

describe('...', () => {

    beforeEach(() => {
        // Clean up
        fs.rmdirSync(".test-folder", {recursive: true})
    })

    const converter = new gitBinaryToQuadConverter();
    const identifier: ResourceIdentifier = { path: 'alice/inhalet/dybli/.....' };

    it('converts turtle to quads.', async(): Promise<void> => {

        // ? what kind of metadata is coming?
        const metadata = new RepresentationMetadata('text/turtle')
//Blob test
        //let blobHash = await gitBinaryTestingPrefix.initPodWriteBlob()
        //let blobBuffer =await gitBinaryTestingPrefix.readFromPodAsBuffer(".test-folder", blobHash)

        // Commit test
        //let blobHash = await gitBinaryTestingPrefix.initPodWriteCommit("")
        //let blobBuffer =await gitBinaryTestingPrefix.readFromPodAsBuffer(".test-folder", blobHash)

        // Tree test
        let blobHash = await gitBinaryTestingPrefix.initPodWriteTree()
        let blobBuffer =await gitBinaryTestingPrefix.readFromPodAsBuffer(".test-folder", blobHash)

        //console.log(blobBuffer) //here it is readable
        //console.log("hash:  "+blobHash.tostrS())

        let unzippi= unzipSync(blobBuffer)


        let blobSlice= unzippi.slice(unzippi.length-20,unzippi.length)
        //console.log(blobSlice.toString('hex')) // good


        const data = streamifyArray([blobBuffer])
        //console.log("readable  "+ data)
        const representation = new BasicRepresentation(data,metadata);

        const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
        const result = await converter.handle({ identifier, representation, preferences });

        //console.log(result)

        expect(result).toEqual({
            binary: false,
            data: expect.any(Readable),
            metadata: expect.any(RepresentationMetadata),
        });
/*
        expect(result.metadata.contentType).toEqual(INTERNAL_QUADS);
        await expect(arrayifyStream(result.data)).resolves.toEqualRdfQuadArray([ triple(
            namedNode('http://test.com/s'),
            namedNode('http://test.com/p'),
            namedNode('http://test.com/o'),
        ) ]);

 */
    });


})
