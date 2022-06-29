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


## Git Conversion Examples

Examples of the conversion of the three different Git objects:

- Commit:
    - Git:\
        tree 53c1ea3779eb7d4f014d541f0236619c07ddf2de\
        author alice <alice@git.com> 1656495445 +0200\
        committer alice <alice@git.com> 1656495445 +0200


    - JSON-LD:\
        [
  {
    "@id": "7d11dac8c7177b68ab0a22d26b67b7a95be3335e",\
    "https://www.w3.org/ns/activitystreams#target": [
      {
        "@id": " 53c1ea3779eb7d4f014d541f0236619c07ddf2de"
      }
    ],\
    "https://www.w3.org/ns/activitystreams#author": [
      {
        "@id": "alice"
      }
    ],\
    "https://www.w3.org/ns/activitystreams#actor": [
      {
        "@id": "alice"
      }
    ],\
    "https://www.w3.org/ns/activitystreams#Event": [
      {
        "@id": "add firtst event"
      }
    ]
  }
]



- Tree:
    - Git:\
        100644 blob c367386a67cdcff6f43cd560f4bf21f82f9593a1    filename\
        040000 tree ad1aab27425bace3d27e932d09684ce10be1907a    treeName

    - JSON-LD:\
        [
  {
    "@id": "filename",\
    "http://www.w3.org/ns/ldp#NonRDFSource": [
      {
        "@id": "http://localhost:3000/objects/c3/67386a67cdcff6f43cd560f4bf21f82f9593a1"
      }
    ]\
  },
  {
    "@id": "treeName",\
    "http://www.w3.org/ns/ldp#BasicContainer": [
      {
        "@id": "http://localhost:3000/objects/ad/1aab27425bace3d27e932d09684ce10be1907a"
      }
    ]
  }
]




- Blob (Data of the Blob is ignored in the Quad only Metadata is provided since the Data could be anything)
    
    - Git:\ 
        "any DATA"

    - JSON-LD:\
        [
  {
    "@id": "bed8945cb011eb0246d2ff6957518bee03e54fc0",\
    "http://www.w3.org/ns/ldp#NonRDFSource": [
      {
        "@id": "http://localhost:3000/objects/be/d8945cb011eb0246d2ff6957518bee03e54fc0"
      }
    ]
  }
]




    





