import type {Quad} from "rdf-js";
import {namedNode, triple} from "@rdfjs/data-model";
import {AS} from "@inrupt/vocab-common-rdf"
import {URL} from "url";
import {Oid} from "nodegit";
export class GitUtils {

    public static blobToQuad(data:string):Quad[]{

        let toJson= JSON.parse(data); //eigentlich binary data /
        const quads:Quad[] = [];
        const t= triple(namedNode("Pfad/oid"),namedNode(AS.content),namedNode(toJson)) //object evt utf8 string

        // Blob LDP non rdf resource
        // falls mir s umwandle bevor em witerschicke genau definiere
        const d= triple(namedNode("Pfad/oid"),namedNode("eg JSON/Turtle"),namedNode(toJson))


        quads.push(t)
        return quads;
    }
     public static treeToQuad(data:string):Quad[]{

        const quads:Quad[] = [];

        // read string find entries which can be trees or Blobs or (commits?)
        // entries[name , OId] maybe Json object
         let entries= JSON.stringify({entry:[{name:"name0", oid: "oid0"},{name:"name1", oid: "oid1"}]})

        const t = triple(namedNode("oid"), namedNode("LDP/Container"),namedNode(entries))
         //jede itrag git e triplle mit LDP.contains
        quads.push(t)

        return quads;
     }


     public static commitToQuad(data:string){
         const quads:Quad[] = [];

         //loop over parents
         let parent:string="parent";
         const p = triple(namedNode("oid"), namedNode(AS.origin),namedNode(parent))
         quads.push(p)

         let tree:string="oidOfTreeAsString"
         let t = triple(namedNode("oid"), namedNode(AS.target),namedNode(tree))
         quads.push(t)
         let author="alice@git.com"
         let committer="Commit-alice@git.com"
         let event="add event"

         const a = triple(namedNode("oid"), namedNode(AS.author),namedNode(author))
         quads.push(a)
         const c = triple(namedNode("oid"), namedNode(AS.actor),namedNode(committer))
         quads.push(c)
         const m = triple(namedNode("oid"), namedNode(AS.Event),namedNode(event))
         quads.push(m)

         return quads
     }
}
