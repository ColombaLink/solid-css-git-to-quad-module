import {
    BasicRepresentation,
    getLoggerFor, INTERNAL_QUADS,
    Representation,
    RepresentationConverterArgs,
    TypedRepresentationConverter
} from "@solid/community-server";
import {GitUtils} from "./GitUtils";
import {Quad} from "rdf-js";
const {unzipSync} = require('zlib')



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

        // parse identifier/path to an OID

        let pathOfIdentifier = identifier.path;
        let index = pathOfIdentifier.lastIndexOf("/objects/"); // might not work if it is windows encoded path
        let oID = "";
        if (index < 0) {
            console.log("invalid identifier path")
        } else {
            oID = pathOfIdentifier.slice(index + 9, index + 11) + pathOfIdentifier.slice(index + 12)
        }


        //since the readable is in object mode the "size" argument we read does not matter
        const data: Buffer = representation.data.read();
        let syncTxt = unzipSync(data).toString("utf-8")
        let unzip: Buffer = unzipSync(data);
        let quad: Quad[];
        console.log(syncTxt)

        // figure out the type of Git Object we are dealing with
        let compare = data.readUInt8(2);
        if (compare === 75) {
            console.log(" Found a Blob")
            let txtNoPrefix = syncTxt.slice(8, syncTxt.length);
            console.log(txtNoPrefix);
            quad = GitUtils.blobToQuad(txtNoPrefix,oID, pathOfIdentifier)
        } else if (compare === 43) {
            console.log("Found a Tree")
            quad = GitUtils.treeToQuad(unzip, pathOfIdentifier)
        } else if (compare === 141) {
            console.log("Found a Commit")
            quad = GitUtils.commitToQuad(syncTxt, oID,pathOfIdentifier)
        } else {
            quad=[];
            console.log("undefined")
        }

        return new BasicRepresentation(quad, representation.metadata, INTERNAL_QUADS);

    }

    /*
    public async canHandle

        Blob  nid


     */
}
