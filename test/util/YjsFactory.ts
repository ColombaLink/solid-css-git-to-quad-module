import {Doc, encodeStateAsUpdate, Map} from "yjs";
import streamifyArray = require("streamify-array");

export class YjsFactory {

    public static createSimpleDoc() {
        const doc = new Doc();
        const ojects = new Map()
        ojects.set("http://t.co/o1", true);
        ojects.set("http://t.co/o2", true);

        const predicate = new Map()
        predicate.set("http://t.co/p1", ojects);
        doc.getMap("graph").set("http://t.co/s1", predicate);

        return doc
    }

    public static createSimpleDocStream(){
        return streamifyArray([encodeStateAsUpdate(YjsFactory.createSimpleDoc())])
    }
}
