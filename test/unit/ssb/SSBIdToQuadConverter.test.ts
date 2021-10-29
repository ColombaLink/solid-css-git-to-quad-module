import 'jest-rdf';
import {
    BasicRepresentation, INTERNAL_QUADS, RDF,
    RepresentationMetadata,
    RepresentationPreferences,
    ResourceIdentifier
} from "@solid/community-server";
import {blankNode, namedNode, triple} from "@rdfjs/data-model";
import {SSBIdToQuadConverter} from "../../../src/ssb/storage/conversion/SSBKeyToQuadConverter";
import streamifyArray = require("streamify-array");
import arrayifyStream = require("arrayify-stream");

describe('SSB Id to quad converter', () => {
    const converter = new SSBIdToQuadConverter();
    const identifier: ResourceIdentifier = { path: 'path' };
    const id = {
        curve: 'ed25519',
        public: 'LGkKhMHc+8KZdqJRurtRwqQ+UVjtZOXCuxsZo6oYn/8=.ed25519',
        private: 'GAOJsSZYW/7W02/fYSdLU5evPgF31zY2vK/kgUO3y4EsaQqEwdz7wpl2olG6u1HCpD5RWO1k5cK7Gxmjqhif/w==.ed25519',
        id: '@LGkKhMHc+8KZdqJRurtRwqQ+UVjtZOXCuxsZo6oYn/8=.ed25519'
    }

    it('converts id to quads.', async(): Promise<void> => {
        const representation = new BasicRepresentation(
            streamifyArray([id]), new RepresentationMetadata('text/turtle')
        );
        const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
        const result = await converter.handle({representation, identifier, preferences})
        await expect(arrayifyStream(result.data)).resolves.toEqualRdfQuadArray([
            triple(blankNode('_:b1'), namedNode(RDF.type), namedNode("http://www.w3.org/ns/auth/cert#ed25519")),
            triple(blankNode('_:b1'), namedNode("http://www.w3.org/ns/auth/cert#privateKey"), namedNode(id.private)),
            triple(blankNode('_:b1'), namedNode("http://www.w3.org/ns/auth/cert#publicKey"), namedNode(id.public)),
            triple(blankNode('_:b1'), namedNode("http://www.w3.org/ns/auth/cert#curve"), namedNode(id.curve)),
            triple(blankNode('_:b1'), namedNode("http://www.w3.org/ns/auth/cert#identiy"), namedNode(id.id)),
         ]);
    });
})
