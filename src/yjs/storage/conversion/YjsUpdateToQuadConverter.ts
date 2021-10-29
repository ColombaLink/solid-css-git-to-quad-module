import {
  BasicRepresentation,
  getLoggerFor, INTERNAL_QUADS,
  Representation,
  RepresentationConverterArgs,
  TypedRepresentationConverter
} from "@solid/community-server";
import {applyUpdate, Doc} from "yjs";
import {YjsUtils} from "../../../util/YjsUtil";

/**
 * Converts `application/yjs+update` to `internal/quads`.
 */
export class YjsUpdateToQuadConverter extends TypedRepresentationConverter {
  protected readonly logger = getLoggerFor(this);
  public constructor() {
    super(
        {"application/yjs+update": 1},
        {"internal/quads": 1}
    );
  }

  public async handle({ representation, identifier }: RepresentationConverterArgs): Promise<Representation> {
    this.logger.debug("Convert yjs update to quads.")
    const data: Buffer = representation.data.read();
    const doc = new Doc();
    applyUpdate(doc, data);
    const quads = YjsUtils.toQuad(doc)

    return new BasicRepresentation(quads, representation.metadata, INTERNAL_QUADS);
  }
}
