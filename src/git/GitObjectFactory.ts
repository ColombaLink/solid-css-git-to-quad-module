import fs from "fs";
import {Blob, Commit, Oid, Repository, Signature, Treebuilder, TreeEntry} from "nodegit";

export class GitObjectFactory{

    /**
     *  Creates a Git Repository and Adds some Objects to it for testing
     * @param path where the git repository should be created
     *
     * returns [][] of Oid where [0][x] =blob [1][x]=tree [2][x] = commit
     */

    public static async createBasicGitObjects(path:string){

        fs.rmSync(".test-folder", {recursive: true})
        const repo = await Repository.init(path, 1);
        const sig = await Signature.default(repo);
        let x =await this.createTree(repo); //returns array of Oid first two are Blobs 3. inner tree 4. outer Tree
        let y = await this.createTree(repo);

        const author = Signature.now("alice","alice@git.com");
        let parent = "NULL"
        let parentArray: (string | Oid | Commit)[]=[];

        const commitOID0 = await repo.createCommit(
            "HEAD",
            author,
            author,
            "add firtst event",
            y[3],
            parentArray
        );
        parentArray.push(commitOID0)

        const commitOID = await repo.createCommit(
            "HEAD",
            author,
            author,
            "add event",
            x[3],
            parentArray
        );

        let gitObjectOidArray=[[x[0],x[1],y[0],y[1]],[x[2],x[3],y[2],y[3]],[commitOID0,commitOID]]

        return gitObjectOidArray;

    }
    public static async createTree(repo:Repository){

        //fs.rmSync(".test-folder/")

        //const repo = await Repository.init(".test-folder/", 1);
        const sig = await Signature.default(repo);

        let txt1=JSON.stringify({measurement:Math.random()* (9) * (1) * (1), unit: 'Celsius'})
        let blob = Buffer.from(txt1);
        let blobHash=await Blob.createFromBuffer(repo, blob, blob.length)
        let txt2=JSON.stringify({measurement:Math.random()* (10) * (1) * (1), unit: 'Celsius'})
        let blob2 = Buffer.from(txt2);
        let blobHash2=await Blob.createFromBuffer(repo, blob2, blob2.length)

        let secondTreeBuilder = await Treebuilder.create(repo,undefined)

        const currentTreeBuilder = await Treebuilder.create(repo, undefined);
        await currentTreeBuilder.insert("filename", blobHash, TreeEntry.FILEMODE.BLOB);

        await secondTreeBuilder.insert("filename2", blobHash2, 33188);
        let secondTreeHash= await secondTreeBuilder.write();
        await currentTreeBuilder.insert("treeName",secondTreeHash,TreeEntry.FILEMODE.TREE)
        const currentTreeOid = await currentTreeBuilder.write();

        let OIDArray=[blobHash,blobHash2,secondTreeHash,currentTreeOid]


        return OIDArray
    }


public static async readFromPodAsBuffer(urlToRepo:string,file:Oid): Promise<Buffer>{

    let prefix = file.toString().slice(0,2)
    let ending = file.toString().slice(3)
    let path= urlToRepo+prefix+ending;
    console.log(path)
    let tect =await fs.readFileSync(path)
    return tect;

}
}
