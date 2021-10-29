import {getDefaultVariables, getTestConfigPath, instantiateFromConfig} from "../Config";
import {App, APPLICATION_OCTET_STREAM} from "@solid/community-server";
import {stringify} from "querystring";
import fetch from "node-fetch";
import {Doc, encodeStateAsUpdate, Map} from "yjs";
import arrayifyStream = require("arrayify-stream");
import type {Readable} from "stream";

const port = 6000;
const baseUrl = `http://localhost:${port}/`;

describe("Yjs Test", () => {
    let app: App;

    beforeAll(async(): Promise<void> => {

        app = await instantiateFromConfig(
            'urn:solid-server:default:App',
            getTestConfigPath('default.json'),
            getDefaultVariables(port, baseUrl),
        ) as App;
        await app.start();
    });

    afterAll(async(): Promise<void> => {
        await app.stop();
    });

    it("can create a ydoc on the server", async () => {
        const doc = new Doc();
        doc.getMap("test").set("a", "test")

        const data = encodeStateAsUpdate(doc)
        const res = await fetch(`${baseUrl}y/doc1`, {
            method: 'PUT',
            headers: { 'content-type':  APPLICATION_OCTET_STREAM },
            body: data,
        });

        expect(res.ok).toBeTruthy()


        const getRes = await fetch(`${baseUrl}y/doc1`, {
            method: 'GET',
            headers: { 'content-type':  APPLICATION_OCTET_STREAM }
        });

        expect((await arrayifyStream(getRes.body as Readable)).pop()).toStrictEqual(Buffer.from(data))
    })






})

