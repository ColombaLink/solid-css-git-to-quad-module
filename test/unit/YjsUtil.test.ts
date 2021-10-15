import streamifyArray from 'streamify-array';
import {Map, Doc} from "yjs";
import {YjsUtils} from "../../src/util/YjsUtil";
import rdfSerializer from 'rdf-serialize';
import {readableToString} from "@solid/community-server";
import type {Readable} from "stream";

describe("Yjs converter", () => {
    it("should convert to quad", async() => {
       const doc = new Doc();
       const ojects = new Map()
       ojects.set("http://t.co/o1", true);
       ojects.set("http://t.co/o2", true);

        const predicate = new Map()
        predicate.set("http://t.co/p1", ojects);

       doc.getMap("graph").set("http://t.co/s1", predicate);


       const q =  YjsUtils.toQuad(doc)

        const quadStream = streamifyArray(q);

        const textStream = rdfSerializer.serialize(quadStream, { contentType: 'text/turtle' });
        expect(await readableToString(textStream as Readable)).toBe("what")
    })
})
