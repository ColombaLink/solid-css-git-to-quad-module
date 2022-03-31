import {
    BasicRepresentation,
    getLoggerFor, INTERNAL_QUADS,
    Representation,
    RepresentationConverterArgs,
    TypedRepresentationConverter
} from "@solid/community-server";
import {Blob, Commit, Oid, Repository, Revwalk, Signature, Tree, Treebuilder, TreeEntry} from "nodegit"
import * as url from "url";
import * as buffer from "buffer";
import fetch from "node-fetch";
import * as URL from "url";
import {open} from "fs-extra";
import fs from "fs";
import * as zlib from "zlib";

export class gitBinaryTestingPrefix {

    public static async initPodWriteBlob(){
        const repo = await Repository.init(".test-folder/", 1);
        const sig = await Signature.default(repo);

        const event = Buffer.from(JSON.stringify({mesurement: (Math.random() * (100)) * (1), unit: 'Celsius'}));
        let a=await Blob.createFromBuffer(repo, event, event.length)
        return a;
    }

    public static async initPodWriteTree(){
        const repo = await Repository.init(".test-folder/", 1);
        const sig = await Signature.default(repo);

        let blob = Buffer.from(JSON.stringify({measurement:Math.random()* (100) * (1) * (1), unit: 'Celsius'}));
        let blobHash=await Blob.createFromBuffer(repo, blob, blob.length)
        let blob2 = Buffer.from(JSON.stringify({measurement:Math.random()* (100) * (2) * (1), unit: 'Celsius'}));
        let blobHash2=await Blob.createFromBuffer(repo, blob2, blob2.length)

        let secondTreeBuilder = await Treebuilder.create(repo,undefined)

        const currentTreeBuilder = await Treebuilder.create(repo, undefined);
        await currentTreeBuilder.insert("filename", blobHash, TreeEntry.FILEMODE.BLOB);

        await secondTreeBuilder.insert("filename2", blobHash2, 33188);
        let secondTreeHash= await secondTreeBuilder.write();

        await currentTreeBuilder.insert("tree",secondTreeHash,TreeEntry.FILEMODE.TREE)

        const currentTreeOid = await currentTreeBuilder.write();


        return currentTreeOid
    }

    public static async initPodWriteCommit(parents:string){

        const repo = await Repository.init(".test-folder/", 1);
        const sig = await Signature.default(repo);

       // const event = Buffer.from(JSON.stringify({mesurement: Math.random() *  (100) * ( 1) , unit: 'Celsius'}));
        //let hashEvent=await Blob.createFromBuffer(repo, event, event.length)
        let x =await this.initPodWriteTree();
        let y = await this.initPodWriteTree()


        const author = Signature.now("alice","alice@git.com");
        let parent = "NULL"

        //let oid = repo.createCommit('HEAD', author, committer, msg, tree, [data_repo.head.target] )
        let parentArray: (string | Oid | Commit)[];
        if(parents==""){
            parentArray=[];
        }else {
            parentArray=[Oid.fromString(parents)]
        }
        const commitOID0 = await repo.createCommit(
            "HEAD",
            author,
            author,
            "add firtst event",
            y,
            parentArray
        );
        parentArray.push(commitOID0)


        const commitOID = await repo.createCommit(
            "HEAD",
            author,
            author,
            "add event",
            x,
            parentArray
        );

        return commitOID

    }

    public static async readBlobFromPod(urlToRepo:string, file:Oid){

        const repo = await Repository.openBare(urlToRepo);
        let blob;
        blob=await repo.getBlob(file)
        let bufr;
        bufr=blob.content();
        let str = bufr.toString();
        console.log(str)
        return str;
    }

    public static async readFromPod(urlToRepo:string,file:Oid){

        const repo = await Repository.openBare(urlToRepo);

        let content;
        let i=0 // 0 = Blob | 1 = Tree | 2 = Commit | 3 = Error

        let hash= file //

        if(i===0) {
            try {
                content = await repo.getBlob(hash)
                let blob;
                blob=await repo.getBlob(file)
                let bufr;
                bufr=blob.content();
                return bufr
                //let str = bufr.toString();
                //return str;
            }
            catch (error){
                i++;
            }}
        else if (i===1) {
            try {
                content = await repo.getTree(hash)
                console.log("tree " + content.entries())
                return content.entries()

            }
            catch (e){
                i++}
        }
        else if (i===2) {
            try {
                content = await repo.getCommit(hash)
                console.log(content.body())
                return content.author()
            } catch (e) {
                i++;
            }
        }
        else {

            console.log("Could not read URI might be Invalid")
        }
    }

    public static async readFromPodAsBuffer(urlToRepo:string,file:Oid): Promise<Buffer>{

        let prefix = file.toString().slice(0,2)
        let path = "../../.test-folder/objects/"+prefix+"/"+file.toString()
        let path2="C:\\Users\\timoc\\Desktop\\ssb-crdt-module\\.test-folder\\objects\\"+prefix+"\\"+file.toString().slice(2,file.toString().length);

        const fs=require('fs')
        let tect =await fs.readFileSync(path2)
        //console.log(tect)

        return tect;

    }


    }