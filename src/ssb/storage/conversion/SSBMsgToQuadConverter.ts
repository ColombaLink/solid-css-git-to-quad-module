import {
  BasicRepresentation,
  getLoggerFor, INTERNAL_QUADS, RDF,
  Representation,
  RepresentationConverterArgs,
  TypedRepresentationConverter
} from "@solid/community-server";
import {applyUpdate, Doc} from "yjs";
import {YjsUtils} from "../../../util/YjsUtil";
import {blankNode, namedNode, triple} from "@rdfjs/data-model";
import {Keys} from "ssb-keys";
import {ValidMessage} from "ssb-validate";
import {AS, XSD} from "@inrupt/vocab-common-rdf";

/**
 * Converts `application/ssb-msg` to `internal/quads`.
 */
export class SSBMsgToQuadConverter extends TypedRepresentationConverter {
  protected readonly logger = getLoggerFor(this);
  public constructor() {
    super(
        {"application/ssb-msg": 1},
        {"internal/quads": 1}
    );
  }

  /**
   * @param representation
   * @param identifier
   */
  public async handle({ representation, identifier }: RepresentationConverterArgs): Promise<Representation> {
    this.logger.debug("Convert ssb message to quads.")
    const message: ValidMessage = representation.data.read();
    const subject = blankNode();
    const digest = blankNode()
    const quads = [
        triple(subject, namedNode(RDF.type), namedNode("http://www.w3.org/ns/auth/cert#ed25519")),
        triple(subject, namedNode(AS.actor), namedNode(message.author)),
        triple(subject, namedNode(AS.content), namedNode(message.content)),
        triple(subject, namedNode(XSD.date), namedNode(message.timestamp.toString())),
        triple(subject, namedNode("https://w3id.org/security/v1#digest"), digest),

        triple(digest, namedNode(RDF.type), namedNode("https://w3id.org/security/v1#Digest")),
        triple(digest, namedNode("https://w3id.org/security/v1#digestAlgorithm"), namedNode(`http://www.w3.org/2000/09/xmldsig#${message.hash}`)),
        triple(digest, namedNode("https://w3id.org/security/v1#digestValue"), namedNode(message.signature)),
        triple(subject, namedNode("https://scuttlebutt.nz/ns/v1#sequence"), namedNode(message.sequence.toString())),
    ]

    return new BasicRepresentation(quads, representation.metadata, INTERNAL_QUADS);
  }
}
