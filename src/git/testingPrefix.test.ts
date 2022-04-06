//import {GDocController} from "./GDocController";
import * as fs from "fs";
//import {GDocFactory} from "../../test/unit/factories/GdocFactory";
import {Blob, Oid, Repository, Signature} from "nodegit";
import {gitBinaryTestingPrefix} from "./gitBinaryTestingPrefix";
import {getLoggerFor} from "@solid/community-server";

describe("A Git Doc Controller GDocController", () => {
    beforeEach(() => {
        // Clean up
        fs.rmSync(".test-folder", {recursive: true})
    })

    it("write/ read Blob", async () => {

        for(let i=0;i<10;i++) {
            let x = await gitBinaryTestingPrefix.initPodWriteBlob();
            //console.log(x+" hash of written blob")

            let y = await gitBinaryTestingPrefix.readFromPodAsBuffer(".test-folder", x)
            console.log(" Blob "+i);
            console.log(" Blob oid"+y);

        }

        //console.log(y + "  content of Blob")

        for(let j=0;j<10;j++) {
            let xx = await gitBinaryTestingPrefix.initPodWriteTree();
            //console.log("hashtree  "+ xx[1])

            let xy = await gitBinaryTestingPrefix.readFromPodAsBuffer(".test-folder", xx)
            console.log(" tree "+ j);
            console.log(" tree oid  "+ xy);

        }

        //console.log( xy + " tree")

        let parents=""
        for (let k=0;k<10;k++) {


            let yy = await gitBinaryTestingPrefix.initPodWriteCommit(parents)
            parents=yy.toString();

            console.log(yy.toString())
            //let arrayNewTree[k]=yy[]
            let yyx = await gitBinaryTestingPrefix.readFromPodAsBuffer(".test-folder", yy)
            console.log(" commit "+ k);
            //console.log( yyx + " commit")
        }


    })



})

/*



        const doc = await GDocController.init(".test-folder/")
        const participantsBranchRef =  fs.readFileSync('.test-folder/refs/heads/state').toString('utf-8')
        expect(participantsBranchRef.length).toBe(41)

        const stateReference = await doc.repo.getReference("refs/heads/state");
        const stateCommit = await doc.repo.getCommit(stateReference.target());
        const stateTree = await stateCommit.getEntry("participants/");
        expect(stateTree).toBeDefined();

        const snapshotEntry = await stateCommit.getEntry("snapshot");
        const snapshot = await snapshotEntry.getBlob();
        expect(snapshot.content()).toStrictEqual(Buffer.from([0,0]));
        // Clean up
        fs.rmdirSync(".test-folder", { recursive: true });


    })


    it("should load a empty Document", async () => {
        await GDocFactory.createEmptyDocument(".test-folder/")

        const doc = await GDocController.load(".test-folder/")
        const participantsBranchRef =  fs.readFileSync('.test-folder/refs/heads/state').toString('utf-8')
        expect(participantsBranchRef.length).toBe(41)

        // Clean up
        fs.rmdirSync(".test-folder", {recursive: true})
    })


    it("should load a empty Document with one participant and no updates", async () => {
        const userId = "user1";
        await GDocFactory.createAndLoadEmptyDocumentWithOneParticipant(".test-folder/", userId)

        const doc = await GDocController.load(".test-folder/")
        const participantsBranchRef =  fs.readFileSync('.test-folder/refs/heads/state').toString('utf-8')
        expect(participantsBranchRef.length).toBe(41)

        // Clean up
        fs.rmdirSync(".test-folder", {recursive: true})
    })

    it("should handle updates", async () => {
        const userId = "user-1";
        const doc = await GDocFactory.createAndLoadEmptyDocumentWithOneParticipant(".test-folder/", userId)
        const promises = GDocController.addListener(doc, "user-1")
        doc.state!.getMap("yjs").set("say hello", "git");
        await Promise.all(promises);

        const updatedDoc = await GDocController.load(".test-folder/")
        expect(updatedDoc.state?.getMap("yjs").get("say hello")).toBe("git")
        // Clean up
        //  fs.rmdirSync(".test-folder", {recursive: true})
    })


})
*/
