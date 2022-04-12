import {
    RepresentationMetadata,
    readableToString,
    ChainedConverter,
    guardedStreamFrom,
    RdfToQuadConverter,
    BasicRepresentation,
    getLoggerFor,
    INTERNAL_QUADS,
    TypedRepresentationConverter, RepresentationPreferences, ResourceIdentifier
} from "@solid/community-server";
import {gitBinaryToQuadConverter} from "../../dist";
import type { Representation,
    RepresentationConverterArgs,
    Logger } from "@solid/community-server";
import * as fs from "fs";
import streamifyArray = require("streamify-array");
import {Readable} from "stream";

/*jest.mock('../../src/logging/LogUtil', (): any => {
    const logger: Logger =
        { error: jest.fn(), debug: jest.fn(), warn: jest.fn(), info: jest.fn(), log: jest.fn() } as any;
    return { getLoggerFor: (): Logger => logger };
});*/
const logger: jest.Mocked<Logger> = getLoggerFor('GuardedStream') as any;


describe('A chained converter where data gets ignored', (): void => {
    //const identifier = { path: 'http://test.com/' };
    //const rep = new BasicRepresentation('<a:b> <a:b> c!', identifier, 'text/turtle');
    const converter = new ChainedConverter([
        new RdfToQuadConverter(),
        new gitBinaryToQuadConverter(),
    ]);

    it('does not throw on async crash.', async(): Promise<void> => {


        // get some binary data from a git object
        let pathToGit= "C:\\Users\\timoc\\Desktop\\gitTestFolder\\.git\\objects\\47\\6741016695e696bb591e12c0d069268b801636";
        let read= await fs.readFileSync(pathToGit);

        const metadata = new RepresentationMetadata('git/objects');
        let identifier:ResourceIdentifier={path:pathToGit};

        // convert Buffer to Readable
        const data = streamifyArray([read]);
        const representation = new BasicRepresentation(data,metadata);

        const preferences: RepresentationPreferences = { type: { [INTERNAL_QUADS]: 1 }};

        //jest.useFakeTimers();
        const result = await converter.handleSafe({ identifier, representation: representation, preferences});

        let something:Readable = result.data;

        let readSomething=something.read(20);
        //looking good

        console.log("data  "+result.data.read)
        expect(await readableToString(result.data)).toBe('dummy');

        //jest.advanceTimersByTime(1000);
    });
});
