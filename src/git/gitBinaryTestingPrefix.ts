import {Blob, Commit, Oid, Repository, Signature, Treebuilder, TreeEntry} from "nodegit"

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

        let txt1=JSON.stringify({measurement:Math.random()* (9) * (1) * (1), unit: 'Celsius'})
        let blob = Buffer.from(txt1);
        //console.log(txt1)
        let blobHash=await Blob.createFromBuffer(repo, blob, blob.length)
        //console.log("blobHash "+ blobHash)
        let txt2=JSON.stringify({measurement:Math.random()* (10) * (1) * (1), unit: 'Celsius'})
        //console.log(txt2)
        //txt2=JSON.stringify({measurement:0.4655213867682595, unit: 'Celsius'}) // backslash in hash
        let blob2 = Buffer.from(txt2);
        let blobHash2=await Blob.createFromBuffer(repo, blob2, blob2.length)
        //console.log("blobHash2 "+ blobHash2)
        // space in hash: {"measurement":618.9727101731705,"unit":"Celsius"}
        // backslah in hash {"measurement":312.65112095170934,"unit":"Celsius"}


        let secondTreeBuilder = await Treebuilder.create(repo,undefined)

        const currentTreeBuilder = await Treebuilder.create(repo, undefined);
        await currentTreeBuilder.insert("filename", blobHash, TreeEntry.FILEMODE.BLOB);

        await secondTreeBuilder.insert("filename2", blobHash2, 33188);
        let secondTreeHash= await secondTreeBuilder.write();
        //console.log("secondTree Hash:  "+ secondTreeHash)

        await currentTreeBuilder.insert("treeName",secondTreeHash,TreeEntry.FILEMODE.TREE)

        const currentTreeOid = await currentTreeBuilder.write();


        return currentTreeOid
    }

    public static async initPodWriteCommit(parents:string){

        const repo = await Repository.init(".test-folder/", 1);
        const sig = await Signature.default(repo);

        //const event = Buffer.from(JSON.stringify({mesurement: Math.random() *  (100) * ( 1) , unit: 'Celsius'}));
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

        //let pathTest= "C:\\Users\\timoc\\Desktop\\ssb-crdt-module\\tmp\\.test-folder\\.git\\objects\\ad\\768acf7f18444f3c02ed2505bdfc28f6cbc096"
        const fs=require('fs')
        let tect =await fs.readFileSync(path2)
        //console.log(tect)

        return tect;

    }


    }
