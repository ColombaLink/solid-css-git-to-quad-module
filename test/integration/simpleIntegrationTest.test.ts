"use strict";
var __importDefault:any = (this && this.__importDefault) || function (mod:any) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const community_server_1 = require("@solid/community-server");
const node_fetch_1 = __importDefault(require("node-fetch"));
const yjs_1 = require("yjs");
const arrayifyStream = require("arrayify-stream");
const port = 6000;
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

        let data:Uint8Array=new Uint8Array([1,2,3])
        const res = await node_fetch_1.default(`${baseUrl}git/objects/`, {
            method: 'PUT',
            headers: { 'content-type': community_server_1.APPLICATION_OCTET_STREAM },
            body: data,
        });
        console.log(await res)
        expect(res.ok).toBeTruthy();
        const getRes = await node_fetch_1.default(`${baseUrl}git/objects/`, {
            method: 'GET',
            headers: { 'content-type': community_server_1.APPLICATION_OCTET_STREAM }
        });
        expect((await arrayifyStream(getRes.body)).pop()).toStrictEqual(Buffer.from(data));
    });

});
//# sourceMappingURL=Yjs.test.js.map