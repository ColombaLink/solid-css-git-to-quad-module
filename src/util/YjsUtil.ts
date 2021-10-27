import type { Doc } from 'yjs/dist/src/utils/Doc';
import type { Quad } from 'rdf-js';
import {namedNode, triple} from "@rdfjs/data-model";
import {YMap} from "yjs/dist/src/types/YMap";

export class YjsUtils {
  public static toQuad(doc: Doc): Quad[] {
    const quads: Quad[] = [];
    const graph = doc.getMap("graph");
    const subjects = graph.keys();
    for(let subject of subjects) {
       const p_o = graph.get(subject) as YMap<YMap<boolean>>;
       const predicates = p_o.keys();
       for(let predicate of predicates){
           // We dont care about the boolean as it is just a placeholder.
           // Representing RDF by using a Y.Map is the simplest way for now.
           const objects= p_o.get(predicate)!.keys();
           for (let object of objects){
               const q = triple(namedNode(subject),namedNode(predicate), namedNode(object));
               quads.push(q);
           }
       }
    }
    return quads;
  }
}
