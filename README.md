# [Community Solid Server (CSS)](https://github.com/CommunitySolidServer/CommunitySolidServer) [GIT](https://git-scm.com/) to Quad Module 


The Community Solid Server Git-to-Quad-Module (CSS-GtQ-M) is a sub-module for the Community Solid Server, that can be integrated into the modulare structure of the CSS with help of the component.js dependency injection framework. The following Figure shows where the module is integrated into the Solid architecture.

![Overview](./ClassDiagramOverviewGitToQuad.drawio.svg)

The standard [CSS](https://github.com/CommunitySolidServer/CommunitySolidServer) does not support converting Git objects, which is not a problem for the standard CSS since normally no Git objects are used. But with another sub-module called [CSS-Git-Http-Backend-Module](https://gitlab.com/ColombaLink/dev/dapsi/public/css/modules/css-git-http-backend-module) the CSS gets extended to support Git, which allows users to write git commands to push and pull data to and from the CSS. Therefore Git objects are often present on the CSS and therefore a conversion module is required.

This module allows to retrieve Git objects in different [RDF](https://www.w3.org/RDF/) formats. This can be done by making a GET request with a desired content type in the Accept header, to the CSS. The CSS will then return the Git objects in the desired data format.

### Running and Testing

To get started simply clone this repository and run ``npm i`` and ``npm start``. 
To test this module one can either create some Git objects on their own on the CSS or run the Unit test in: *test/unit/GitToQuadConverter.test.ts* which will create some different Git Objects (Commit, Tree, Blob) which can be seen in the *.test-folder* under objects. The easiest way to test the conversion is to make a GET request on one of those objects for example with curl: ``curl -H "Accept: application/ld+json -X GET http://localhost/.test-folder/objects/xx/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`` where the **x**'s have to be replaced with an existing Git object from the .test-folder.  

## Detailed Description

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

Examples of the conversion of the three different Git objects into JSON-LD:

- Commit:
    - Git:\
        tree 86465fc6334e8a7a6b53ca8c538f7f2496f6a44b\
        parent 1fa8a88f867edfdc252c762b8975cd886ce9e25a\
        author fuubi <fuubi@protonmail.ch> 1654716381 +0200\
        committer fuubi <fuubi@protonmail.ch> 1654716381 +0200



    - JSON-LD:

  ```json
  {
    "@id": "https://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/1a/5c659770fda3da8a5f6346433eb37a0436cdc3",
    "https://www.w3.org/ns/activitystreams#prev": [
      {
        "@id": "https://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/1f/a8a88f867edfdc252c762b8975cd886ce9e25a"
      }
    ],
    "https://www.w3.org/ns/activitystreams#target": [
      {
        "@id": "https://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/86/465fc6334e8a7a6b53ca8c538f7f2496f6a44b"
      }
    ],
    "https://www.w3.org/ns/activitystreams#author": [
      {
        "@id": "fuubi"
      }
    ],
    "https://www.w3.org/ns/activitystreams#actor": [
      {
        "@id": "fuubi"
      }
    ],
    "https://www.w3.org/ns/activitystreams#summary": [
      {
        "@value": "add event."
      }
    ]
  }

  ```



- Tree:
    - Git:\
       040000 tree 8ae26f84a29b72e9611f1439f829f89664aaca40	orgs


    - JSON-LD:
  ```json
     {
    "@id": "http://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/1a/1d7028da939437f8d51a44f27dbf7f64bb5936",
    "http://www.w3.org/ns/ldp#contains": [
      {
        "@id": "http://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/8a/e26f84a29b72e9611f1439f829f89664aaca40"
      }
    ],
    "@type": [
      "http://www.w3.org/ns/ldp#Container"
    ]
  },
  {
    "@id": "http://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/8a/e26f84a29b72e9611f1439f829f89664aaca40",
    "http://purl.org/dc/terms/description": [
      {
        "@value": "orgs"
      }
    ]
  }

  ```




- Blob (Data of the Blob is ignored in the Quad only Metadata is provided since the Data could be anything)
    - Git:\
        "any DATA"

    - JSON-LD:
  ```json
   {
    "@id": "1a1f51f4a9194d5f010fe0c6e6bd395b09486061",
    "http://www.w3.org/ns/ldp#NonRDFSource": [
      {
        "@id": "http://localhost:3000/orgs/south-summit/iotdot-mini/.dybli/objects/1a/1f51f4a9194d5f010fe0c6e6bd395b09486061"
      }
    ]
  }

  ```

    





