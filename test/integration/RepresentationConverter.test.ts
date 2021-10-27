import {
  APPLICATION_JSON,
  BasicRepresentation,
  ChainedConverter, INTERNAL_QUADS, QuadToRdfConverter, readableToString, RepresentationMetadata, ResourceIdentifier
} from "@solid/community-server";
import {YjsUpdateToQuadConverter} from "../../src/storage/conversion/YjsUpdateToQuadConverter";
import {YjsFactory} from "../util/YjsFactory";

describe('A ChainedConverter', (): void => {
  const converters = [
      new YjsUpdateToQuadConverter(),
      new QuadToRdfConverter()
  ];
  const converter = new ChainedConverter(converters);

  it('can convert from turtle to JSON-LD.', async(): Promise<void> => {
    const representation = new BasicRepresentation(
      YjsFactory.createSimpleDocStream(),
      'application/yjs+update',
    );
    const result = await converter.handleSafe({
      representation,
      preferences: { type: { 'application/ld+json': 1 }},
      identifier: { path: 'path' },
    });
    const data = await readableToString(result.data)
    expect(JSON.parse(data)).toStrictEqual([{"@id": "http://t.co/s1", "http://t.co/p1": [{"@id": "http://t.co/o1"}, {"@id": "http://t.co/o2"}]}])
  });
});
