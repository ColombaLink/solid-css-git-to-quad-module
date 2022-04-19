import {
    BasicRepresentation,
    ChainedConverter,
    INTERNAL_QUADS,
    RdfToQuadConverter,
    RepresentationMetadata,
    RepresentationPreferences,
    ResourceIdentifier
} from "@solid/community-server";
import {GitBinaryToQuadConverter} from "../../dist";
import * as fs from "fs";
import {Readable} from "stream";
import {GitObjectFactory} from "../../src/git/GitObjectFactory";
import streamifyArray = require("streamify-array");


describe('A chained converter ', (): void => {

    const converter = new ChainedConverter([
        new RdfToQuadConverter(),
        new GitBinaryToQuadConverter(),
    ]);

    it('gitConverterTesting', async (): Promise<void> => {

        let path = ".test-folder/"
        let arrayOfIds = await GitObjectFactory.createBasicGitObjects(path)

        // define which object we want here [0][x] =blob [1][x]=tree [2][x] = commit
        let stringOfIDPrefix = arrayOfIds[0][0].toString()
        let pathToGit = path + "/objects/" + stringOfIDPrefix.slice(0, 2) + "/" + stringOfIDPrefix.slice(2);

        let read = await fs.readFileSync(pathToGit);

        const metadata = new RepresentationMetadata('git/objects'); //wie findet me das use
        let identifier: ResourceIdentifier = {path: pathToGit};

        // convert Buffer to Readable
        const data = streamifyArray([read]);
        const representation = new BasicRepresentation(data, metadata);

        const preferences: RepresentationPreferences = {type: {[INTERNAL_QUADS]: 1}};
        const result = await converter.handleSafe({identifier, representation: representation, preferences});

        let something: Readable = result.data;
        let readSomething = await something.read(20);
        console.log(readSomething)

        expect(await result.data).toBeTruthy();

    });
});
