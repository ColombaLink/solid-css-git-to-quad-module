import {
  BasicRepresentation,
  getLoggerFor, INTERNAL_QUADS, RDF,
  Representation,
  RepresentationConverterArgs,
  TypedRepresentationConverter
} from "@solid/community-server";
import {applyUpdate, Doc} from "yjs";
import {YjsUtils} from "../../util/YjsUtil";
import {blankNode, namedNode, triple} from "@rdfjs/data-model";
import {Keys} from "ssb-keys";

/**
 * Converts `application/yjs+update` to `internal/quads`.
 */
export class SSBIdToQuadConverter extends TypedRepresentationConverter {
  protected readonly logger = getLoggerFor(this);
  public constructor() {
    super(
        {"application/ssb+id": 1},
        {"internal/quads": 1}
    );
  }

  /**
   * @param representation
   * @param identifier
   */
  public async handle({ representation, identifier }: RepresentationConverterArgs): Promise<Representation> {
    this.logger.debug("Convert ssb update to quads.")
    const key: Keys = representation.data.read();

    // Todo: find a better vocabulary as it is not clear what encoding has been used...
    const subject = blankNode()
    const quads = [
        triple(subject, namedNode(RDF.type), namedNode("http://www.w3.org/ns/auth/cert#ed25519")),
        triple(subject, namedNode("http://www.w3.org/ns/auth/cert#privateKey"), namedNode(key.private)),
        triple(subject, namedNode("http://www.w3.org/ns/auth/cert#publicKey"), namedNode(key.public)),
        triple(subject, namedNode("http://www.w3.org/ns/auth/cert#curve"), namedNode(key.curve)),
        triple(subject, namedNode("http://www.w3.org/ns/auth/cert#identiy"), namedNode(key.id)),

    ]

    return new BasicRepresentation(quads, representation.metadata, INTERNAL_QUADS);
  }
}
