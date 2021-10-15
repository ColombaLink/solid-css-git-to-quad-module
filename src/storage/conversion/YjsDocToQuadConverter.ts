import type { Representation,
  RepresentationConverterArgs } from '@solid/community-server';
import {
  APPLICATION_OCTET_STREAM,
  INTERNAL_QUADS, NotImplementedHttpError,
  TypedRepresentationConverter,
} from '@solid/community-server';

/**
 * Converts most major RDF serializations to `internal/quads`.
 */
export class YjsDocToQuadConverter extends TypedRepresentationConverter {
  public constructor() {
    super(APPLICATION_OCTET_STREAM, INTERNAL_QUADS);
  }

  public async handle({representation, identifier}: RepresentationConverterArgs): Promise<Representation> {
    throw new NotImplementedHttpError();
  }
}
