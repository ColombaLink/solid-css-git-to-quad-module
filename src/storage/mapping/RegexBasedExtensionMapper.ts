/**
 * Supports the behaviour described in https://www.w3.org/DesignIssues/HTTPFilenameMapping.html
 * Determines content-type based on the file extension.
 * In case an identifier does not end on an extension matching its content-type,
 * the corresponding file will be appended with the correct extension, preceded by $.
 */
import type { FileIdentifierMapperFactory, ResourceIdentifier, ResourceLink } from '@solid/community-server';
import { APPLICATION_OCTET_STREAM, ExtensionBasedMapper } from '@solid/community-server';
import { promises as fsPromises } from 'fs';

export class RegexBasedExtensionMapper extends ExtensionBasedMapper {
  public constructor(
    base: string,
    rootFilepath: string,
    customTypes?: Record<string, string>,
  ) {
    super(base, rootFilepath, customTypes);
  }

  protected async mapUrlToDocumentPath(identifier: ResourceIdentifier, filePath: string, contentType?: string):
  Promise<ResourceLink> {
    const resourceLink = await super.mapUrlToDocumentPath(identifier, filePath, contentType);
    // Existing file
    if (resourceLink.contentType === APPLICATION_OCTET_STREAM) {
      // Find a matching file
      const regex = /\d\d\/\d$/u;
      const match = regex.exec(filePath);
      // eslint-disable-next-line no-console
      if (match && match[0]) {
        resourceLink.contentType = 'regex/suffix-type';
      }
    }

    return resourceLink;
  }
}

export class RegexBasedExtensionMapperFactory implements FileIdentifierMapperFactory<RegexBasedExtensionMapper> {
  public async create(base: string, rootFilePath: string): Promise<RegexBasedExtensionMapper> {
    return new RegexBasedExtensionMapper(base, rootFilePath);
  }
}
