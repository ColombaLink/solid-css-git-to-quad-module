import type {Quad} from "rdf-js";
import {namedNode, triple} from "@rdfjs/data-model";
import {AS} from "@inrupt/vocab-common-rdf"
import ldp = require("@inrupt/vocab-common-rdf")


import {URL} from "url";
import {Oid} from "nodegit";
import {unzipSync} from "zlib";
export class GitUtils {

    public static blobToQuad(data:string,oid:string,uri:string):Quad[]{

        let toJson= JSON.parse(data); //eigentlich binary data /
        const quads:Quad[] = [];
        const t= triple(namedNode(oid),namedNode(ldp.LDP.NonRDFSource),namedNode(uri)) //object evt utf8 string

        // Blob LDP non rdf resource
        // falls mir s umwandle bevor em witerschicke genau definiere
        //const d= triple(namedNode("Pfad/oid"),namedNode("eg JSON/Turtle"),namedNode(toJson))


        quads.push(t)
        return quads;
    }
     public static treeToQuad(data:Buffer,id:string):Quad[]{

        let stringi = data.toString()
        let x=stringi.slice(43,44)
         let indexOfType= data.indexOf("40000")
         let indexFile=data.indexOf("0644")
         console.log(indexOfType)

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

         let modeArray =[] //0644 = file  0000=Directory
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
             let mode = data.slice(indi-4,indi).toString()
             modeArray.push(mode)

         }
         console.log(fileNamesArray)

         console.log(modeArray)

         const quads:Quad[] = [];


        for(let i=0;i<oidArray.length;i++){
            if(modeArray[i]==="0644"){
                const t = triple(namedNode(fileNamesArray[i]), namedNode(ldp.LDP.NonRDFSource),namedNode(oidArray[i]))//uri anstatt oid
                quads.push(t)
            }else if (modeArray[i]==="0000"){
                const t = triple(namedNode(fileNamesArray[i]), namedNode(ldp.LDP.BasicContainer),namedNode(oidArray[i]))//uri anstatt oid
                quads.push(t)
            }
            else console.log("udefined element in tree")


        }
        return quads;
     }


     public static commitToQuad(data:string,id:string,path:string){
         const quads:Quad[] = [];

         // sting is parsed by new line = \n
         let indexOld=0;
         let indexArrayNewLine=[]
         while (true){
             let index= data.indexOf("\n",indexOld+1)
             if(index<0){
                 break;
             }
             indexArrayNewLine.push(index);
             indexOld=index;
         }
         //find out the tree this commit points to
         let startOfHash=data.indexOf("tree")+4; // +5 because its after tree and space eg"tree Hash"
         let hashOfTree:string = data.slice(startOfHash,startOfHash+41)

         // get parents (0 first commit / normally not more than 2 if there are no merges)
         let parentArray=[];
         let indexOldParent=0;
         while (true) {
             let indexParent = data.indexOf("parent",indexOldParent+1)
             if(indexParent<0){
                 break
             }
             let parentHash:string=data.slice(indexParent+7,indexParent+47)
             parentArray.push(parentHash)
             indexOldParent=indexParent;
         }
         // find Author
         let authorindex=data.indexOf("author")
         let endIndex=data.indexOf(" ",authorindex+7)
         let authorOfCommit:string = data.slice(authorindex+7,endIndex)

         // find Author Mail
         let mailIndex= data.indexOf("<",endIndex)
         let mailEnd= data.indexOf(">",endIndex)
         let mail = data.slice(mailIndex+1,mailEnd)

         // find Comitter name
         let committerStart= data.indexOf("committer")
         let committerEnd= data.indexOf(" ",committerStart+10)
         let committerOfCommit:string = data.slice(committerStart+10,committerEnd);

         //find Committer Mail
         let mailComIndex= data.indexOf("<",committerEnd)
         let mailComEnd= data.indexOf(">",committerEnd)
         let mailCom = data.slice(mailComIndex+1,mailComEnd)

         // find Commit msg
         let startCommitMsg = data.indexOf("\n\n")
         let msg = data.slice(startCommitMsg+2)


         //loop over parents
         //let parent:string="parent";
         for (let i=0;i<parentArray.length;i++) {
             const p = triple(namedNode(id), namedNode(AS.prev), namedNode(parentArray[i]))
             quads.push(p)
         }

         //let tree:string="oidOfTreeAsString"
         let t = triple(namedNode(id), namedNode(AS.target),namedNode(hashOfTree))
         quads.push(t)
         //let author="alice@git.com"
         //let committer="Commit-alice@git.com"
         //let event="add event"

         const a = triple(namedNode(id), namedNode(AS.author),namedNode(authorOfCommit))
         quads.push(a)
         const c = triple(namedNode(id), namedNode(AS.actor),namedNode(committerOfCommit))
         quads.push(c)
         const m = triple(namedNode(id), namedNode(AS.Event),namedNode(msg))
         quads.push(m)

         return quads
     }
}
