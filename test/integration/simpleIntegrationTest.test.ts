"use strict";
import fetch from "node-fetch";
import {GitObjectFactory} from "../../dist/git/GitObjectFactory";
import fs from "fs";
import {unzipSync} from "zlib";
import {
    BasicRepresentation, ChainedConverter,
    INTERNAL_QUADS, RdfToQuadConverter,
    RepresentationMetadata,
    RepresentationPreferences, ResourceIdentifier
} from "@solid/community-server";
import {Readable} from "stream";
import streamifyArray = require("streamify-array");
import {GitBinaryToQuadConverter} from "../../dist";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const community_server_1 = require("@solid/community-server");
const arrayifyStream = require("arrayify-stream");
const port = 3001;
const baseUrl = `http://localhost:${port}/`;
describe("Test", () => {
    let app:any;
    beforeAll(async () => {
        app = await Config_1.instantiateFromConfig('urn:solid-server:default:App', Config_1.getTestConfigPath('default.json'), Config_1.getDefaultVariables(port, baseUrl));
        await app.start();
        console.log("start")
    });
    afterAll(async () => {
        console.log("stop")
        await app.stop();
    });
    it("simple int test", async () => {

        //const headTest= await fetch(`${baseUrl}`,{method: 'HEAD'})
        //console.log(headTest.status)

        let path = ".test-folder/"
        let arrayOfIds = await GitObjectFactory.createBasicGitObjects(path)

        // define which object we want here [0][x] =blob [1][x]=tree [2][x] = commit
        let stringOfIDPrefix = arrayOfIds[0][0].toString()
        let pathToGit = path + "/objects/" + stringOfIDPrefix.slice(0, 2) + "/" + stringOfIDPrefix.slice(2);

        let read = await fs.readFileSync(pathToGit);

        const put1 = await fetch(`${baseUrl}git.bin`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/zip',
            },
            body:read,
        });

        console.log(put1.status)

        const getRes0 = await fetch(`${baseUrl}git.bin`, {
            method: 'GET',
        });
        console.log(getRes0.status)

        let contentType =getRes0.headers.get('content-type');
        console.log(contentType);

        let a=getRes0.body.read();
        console.log(a)
        let syncTxt = unzipSync(a).toString("utf-8")
        console.log(syncTxt)

        // Give Data to Converter
        const converter = new ChainedConverter([
            new RdfToQuadConverter(),
            new GitBinaryToQuadConverter(),
        ]);

        const metadata = new RepresentationMetadata('git/objects'); //wie findet me das use

        let identifier: ResourceIdentifier = {path: pathToGit};
        const dataReadable = streamifyArray([read]);
        const representation = new BasicRepresentation(dataReadable, metadata);

        const preferences: RepresentationPreferences = {type: {[INTERNAL_QUADS]: 1}};
        const result = await converter.handleSafe({identifier, representation: representation, preferences});

        let something: Readable = result.data;
        let readSomething = await something.read(20);
        console.log(readSomething)


        /*

        const url1 = `${baseUrl}containerPUT/x`;
            const res1 = await fetch(url1, {
                method: 'PUT',
                headers: {
                    'content-type': 'text/turtle',
                },
                body: '<a:b> <a:b> <a:b>.',
            });

            console.log(res1.status)
        let data:Uint8Array=new Uint8Array([1,2,3])
        const res = await fetch(`${baseUrl}test1.txt`, {
            method: 'PUT',
            headers: { 'content-type': 'text/plain' },
            body: 'blub',
        });
        console.log(res.status)
        expect(res.ok).toBeTruthy();
        const getRes = await fetch(`${baseUrl}/test1.txt`, {
            method: 'GET',
            headers: { 'content-type': 'text/plain' }
        });
        console.log(getRes.status)
       // expect((await arrayifyStream(getRes.body)).pop()).toStrictEqual(Buffer.from(data));

        const url2 = `${baseUrl}txt.html`;
        const res2 = await fetch(url2, {
            method: 'PUT',
            headers: {
                'content-type': 'text/html',
            },
            body: '<p> blub </p>',
        });
        console.log(res2.status)

        const getRes1 = await fetch(`${baseUrl}txt.html`, {
            method: 'GET',
            headers: { 'content-type': 'text/html' }
        });
        console.log(getRes1.status)


*/

    });

});
//# sourceMappingURL=Yjs.test.js.map
