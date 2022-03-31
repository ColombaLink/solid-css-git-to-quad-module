import {
    BasicRepresentation,
    getLoggerFor, INTERNAL_QUADS,
    Representation,
    RepresentationConverterArgs,
    TypedRepresentationConverter
} from "@solid/community-server";
import {GitUtils} from "./GitUtils";
import * as buffer from "buffer";
import * as util from "util";
import {Blob} from "nodegit";
import {Quad} from "rdf-js";
const {unzip,unzipSync} = require('zlib')


// @ts-ignore
//import {Blob, Buffer} from 'buffer';

export class gitBinaryToQuadConverter extends TypedRepresentationConverter {
    protected readonly logger = getLoggerFor(this);

    public constructor() {
        super(
            {"git/objects": 1}, //? not sure yet
            {"internal/quads": 1}
        );
    }

    public async handle({representation, identifier}: RepresentationConverterArgs): Promise<Representation> {

        this.logger.debug("Convert git to quads.")
        //since the readable is in object mode the "size" we read does not matter
        const data: Buffer = representation.data.read();

        let syncTxt = unzipSync(data).toString("utf-8")
        console.log(syncTxt)


        //remove prefix eg: Blob 50/{JSON DATA used}


        let quad:Quad[];

        let compare = data.readUInt8(2);
        if(compare===75){
            console.log(" Found a Blob")
            let txtNoPrefix = syncTxt.slice(8,syncTxt.length);
            console.log(txtNoPrefix);
            quad=GitUtils.blobToQuad(txtNoPrefix)
        }else if (compare===43){
            console.log("Found a Tree")
            quad=GitUtils.treeToQuad(syncTxt)
        }else if (compare===141){
            console.log("Found a Commit")
            quad=GitUtils.commitToQuad(syncTxt)
        }else {
            console.log("undefined")
        }

        // @ts-ignore
        return new BasicRepresentation(quad, representation.metadata, INTERNAL_QUADS);

    }
}
