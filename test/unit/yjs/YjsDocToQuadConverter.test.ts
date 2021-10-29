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
import {YjsDocToQuadConverter} from "../../../dist/storage/conversion/YjsDocToQuadConverter";
import {Doc, encodeStateAsUpdate, Map} from "yjs";
import streamifyArray = require("streamify-array");

describe('...', () => {
    const converter = new YjsDocToQuadConverter();
    const identifier: ResourceIdentifier = { path: 'path' };

    it('converts turtle to quads.', async(): Promise<void> => {
        const metadata = new RepresentationMetadata('text/turtle');

        const doc = new Doc();
        const ojects = new Map()
        ojects.set("http://t.co/o1", true);
        ojects.set("http://t.co/o2", true);

        const predicate = new Map()
        predicate.set("http://t.co/p1", ojects);

        doc.getMap("graph").set("http://t.co/s1", predicate);
        const data = streamifyArray([encodeStateAsUpdate(doc)])

        const representation = new BasicRepresentation(
            data, metadata,
        );
        const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
        const result = await converter.handle({ identifier, representation, preferences });
        expect(result).toEqual({
            binary: false,
            data: expect.any(Readable),
            metadata: expect.any(RepresentationMetadata),
        });

        expect(result.metadata.contentType).toEqual(INTERNAL_QUADS);
        await expect(arrayifyStream(result.data)).resolves.toEqualRdfQuadArray([ triple(
            namedNode('http://test.com/s'),
            namedNode('http://test.com/p'),
            namedNode('http://test.com/o'),
        ) ]);
    });


})
