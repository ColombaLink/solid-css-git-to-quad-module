import type {Quad} from "rdf-js";
import {namedNode, triple} from "@rdfjs/data-model";
import {AS} from "@inrupt/vocab-common-rdf"
import ldp = require("@inrupt/vocab-common-rdf")

import {URL} from "url";
import {Oid} from "nodegit";
import {unzipSync} from "zlib";
export class GitUtils {

    public static blobToQuad(data:string,id:string):Quad[]{

        let toJson= JSON.parse(data); //eigentlich binary data /
        const quads:Quad[] = [];
        const t= triple(namedNode(id),namedNode(ldp.LDP.Resource),namedNode(toJson)) //object evt utf8 string

        // Blob LDP non rdf resource
        // falls mir s umwandle bevor em witerschicke genau definiere
        const d= triple(namedNode("Pfad/oid"),namedNode("eg JSON/Turtle"),namedNode(toJson))


        quads.push(t)
        return quads;
    }
     public static treeToQuad(data:Buffer,id:string):Quad[]{

         let indexOfBackslash= [];
         let index = 0;
         while (true){
             index= data.indexOf("\0",index+1);
             if(index>0){
                 indexOfBackslash.push(index)
             }
             else break
         }

         let oidArray= [];
         // we need to ignore first occurence and following ones with a distance shorter than 20
         for(let i=1;i<indexOfBackslash.length;i++){
             let indexi=indexOfBackslash[i];
             if(i>1) {
                 if (indexi - 20 < indexOfBackslash[i - 1]) { // e.g indexi=30 last index 15 -> 30-20 < 15 === true
                     let rm= indexOfBackslash.splice(i,1)
                     console.log("remove indexi :"+ rm )
                     i--; //the array size get reduced so we reduce loop counter as well
                     continue;
                 }
             }
             // plus 1 because index of returns start of occurence
             let blobSlice= data.slice(indexi+1,indexi+21)
             oidArray.push(blobSlice.toString('hex'))
         }
         console.log(oidArray)

         let syncTxt = data.toString("utf-8")

         let indexOfSpaces= [];
         let indexSpace = 0;
         while (true){
             indexSpace= data.indexOf(" ",indexSpace+1);
             if(indexSpace>0){
                 indexOfSpaces.push(indexSpace)
             }
             else break
         }

         let fileNamesArray=[];
         for (let i=1;i<indexOfSpaces.length;i++){

             let indi=indexOfSpaces[i];
             if (i>1){
                 if (indexOfBackslash[i-1]+20>indi){ // ignore space encodings in the hash
                    let rm=indexOfSpaces.splice(i,1)
                    console.log("Found Space encoding in Hash, ignored at index: "+rm);
                    i--;
                    continue;
                 }
             }
             let name= data.slice(indi+1,indexOfBackslash[i]).toString()
             fileNamesArray.push(name)
         }
         console.log(fileNamesArray)

         const quads:Quad[] = [];

         // We can not know if the Oid belongs to a Blob or a Tree

         // ??? Should it be like this: triple( filename , Container , OID (of filename)
         //                             triple( OID of Tree , Container, {filename, OID})
         // id =oid ??
        for(let i=0;i<oidArray.length;i++){
            const t = triple(namedNode(fileNamesArray[i]), namedNode(ldp.LDP.BasicContainer),namedNode(oidArray[i]))
            quads.push(t)
        }
        return quads;
     }


     public static commitToQuad(data:string,id:string){
         const quads:Quad[] = [];

         //loop over parents
         let parent:string="parent";
         const p = triple(namedNode(id), namedNode(AS.origin),namedNode(parent))
         quads.push(p)

         let tree:string="oidOfTreeAsString"
         let t = triple(namedNode(id), namedNode(AS.target),namedNode(tree))
         quads.push(t)
         let author="alice@git.com"
         let committer="Commit-alice@git.com"
         let event="add event"

         const a = triple(namedNode(id), namedNode(AS.author),namedNode(author))
         quads.push(a)
         const c = triple(namedNode(id), namedNode(AS.actor),namedNode(committer))
         quads.push(c)
         const m = triple(namedNode(id), namedNode(AS.Event),namedNode(event))
         quads.push(m)

         return quads
     }
}
