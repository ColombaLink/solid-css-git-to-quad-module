import 'jest-rdf';
import {
    BasicRepresentation, INTERNAL_QUADS, RDF,
    RepresentationMetadata,
    RepresentationPreferences,
    ResourceIdentifier
} from "@solid/community-server";
import {blankNode, namedNode, triple} from "@rdfjs/data-model";
import streamifyArray = require("streamify-array");
import arrayifyStream = require("arrayify-stream");
import {SSBMsgToQuadConverter} from "../../../src/ssb/storage/conversion/SSBMsgToQuadConverter";
import {AS, XSD} from "@inrupt/vocab-common-rdf";
import { ValidMessage } from 'ssb-validate';


describe('SSB Id to quad converter', () => {
    const converter = new SSBMsgToQuadConverter();
    const identifier: ResourceIdentifier = { path: 'https://test.com/doc/.ssb/objects/messages/%currentHashiROQsc=.sha256' };
    const message: ValidMessage = {
        "previous": "%Ys5adZpG5bElsmckVbAR3IRMJEREuEgfniHQViROQsc=.sha256",
        "sequence": 2,
        "author": "@LGkKhMHc+8KZdqJRurtRwqQ+UVjtZOXCuxsZo6oYn/8=.ed25519",
        "timestamp": 1635519904796,
        "hash": "sha256",
        "content": {
            "type": "test1"
        },
        "signature": "08m/UCdIxBliUsjqCvXam8TNaiWUpHkzZL/Me6VmWseUIflqp/exc8FguSrHL0tMqIVSYhNK2SjRDcTTppg6Dg==.sig.ed25519"
    }

    it('converts id to quads.', async(): Promise<void> => {
        const representation = new BasicRepresentation(
            streamifyArray([message]), new RepresentationMetadata('application/x-ssb-msg')
        );
        const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};
        const result = await converter.handle({representation, identifier, preferences})




        const subject = blankNode();
        const digest = blankNode()
        await expect(arrayifyStream(result.data)).resolves.toEqualRdfQuadArray([
            triple(subject, namedNode(RDF.type), namedNode("http://www.w3.org/ns/auth/cert#ed25519")),
            triple(subject, namedNode(AS.actor), namedNode(message.author)),
            triple(subject, namedNode(AS.content), namedNode(message.content)),
            triple(subject, namedNode(XSD.date), namedNode(message.timestamp.toString())),
            triple(subject, namedNode("https://scuttlebutt.nz/ns/v1#previous"), namedNode(`https://test.com/doc/.ssb/objects/messages/%Ys5adZpG5bElsmckVbAR3IRMJEREuEgfniHQViROQsc=.sha256`)),
            triple(subject, namedNode("https://w3id.org/security/v1#digest"), digest),

            triple(digest, namedNode(RDF.type), namedNode("https://w3id.org/security/v1#Digest")),
            triple(digest, namedNode("https://w3id.org/security/v1#digestAlgorithm"), namedNode(`http://www.w3.org/2000/09/xmldsig#${message.hash}`)),
            triple(digest, namedNode("https://w3id.org/security/v1#digestValue"), namedNode(message.signature)),
            triple(subject, namedNode("https://scuttlebutt.nz/ns/v1#sequence"), namedNode(message.sequence.toString())),
        ]);
    });
})
