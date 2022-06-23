# [Community Solid Server (CSS)](https://github.com/CommunitySolidServer/CommunitySolidServer) [GIT](https://git-scm.com/) Converter Component ([Component.js](https://componentjs.com/))

## General Description

[CSS](https://github.com/CommunitySolidServer/CommunitySolidServer) Module which allows requesting Git Objects from the CSS in any any available format.

Backend Module which allows Clients to make GET request to the CSS to retrieve Git Objects in all available formats.

The git folder consists of of three classes:

* *GitToQuadConverter*: is the main part of the Module it receives a representation and defines based on a prefix what kind of Git object it is (Blob, Tree, Commit) and forwards it.

* *GitUtils*: Converts the different Git Objects to Quads.

* *GitObjectFactory*: Helper class to create some Git Objects for testing.

In Storage/mapping

* *RegexBasedExtensionMapper*: is an Extension of the ExtensionBasedMapper of the CSS which recognizes Git objects based on regex whithout a given content-type.





Examples:

get content type = internal/quads

get content type = text/html

## Getting Started

To get started in seconds, clone the repo and:
```
npm i
npm start
```

## Integration into CSS

* *GitToQuadConverter*: can be configured into the CSS in config/util/representation-conversion/ an example configuration here can be found in config/representation-conversion.json

* *RegexBasedExtensionMapper*: can be configured into the CSS in config/util/identifiers/ an example configuration can be found in this config/util/identifiers/suffix.json





