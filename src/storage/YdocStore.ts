import {
    Conditions, NotImplementedHttpError, Patch,
    Representation,
    RepresentationPreferences,
    ResourceIdentifier,
    ResourceStore
} from "@solid/community-server";

export class YdocStore implements ResourceStore {
    addResource(container: ResourceIdentifier, representation: Representation, conditions: Conditions | undefined): Promise<ResourceIdentifier> {
        throw new NotImplementedHttpError();
    }

    deleteResource(identifier: ResourceIdentifier, conditions: Conditions | undefined): Promise<ResourceIdentifier[]> {
        throw new NotImplementedHttpError();
    }

    getRepresentation(identifier: ResourceIdentifier, preferences: RepresentationPreferences, conditions: Conditions | undefined): Promise<Representation> {
        throw new NotImplementedHttpError();
    }

    modifyResource(identifier: ResourceIdentifier, patch: Patch, conditions: Conditions | undefined): Promise<ResourceIdentifier[]> {
        throw new NotImplementedHttpError();
    }

    resourceExists(identifier: ResourceIdentifier, conditions: Conditions | undefined): Promise<boolean> {
        throw new NotImplementedHttpError();
    }

    setRepresentation(identifier: ResourceIdentifier, representation: Representation, conditions: Conditions | undefined): Promise<ResourceIdentifier[]> {
        throw new NotImplementedHttpError();
    }

}
