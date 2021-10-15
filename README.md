# Community Solid Server (CSS) Demo Module

This repository can be used as a reference to get started with your own
custom CSS module.

To get started in seconds, run [this](https://github.com/FUUbi/solid-crdt-module/blob/main/bin/init-css-module) script with the following command.
The script assumes to be executed in an empty directory and using the directory name as a project name.
```
mkdir project-name
cd project-name 
wget -O - https://raw.githubusercontent.com/FUUbi/solid-crdt-module/main/bin/init-css-module | bash
```


*The scripts depends on: Bash, Git, Sed*

Of course, you can also just run the commands manually or clone the repo.

TODO: add links to CSS and Components.js documentation

Clients write the full yjs doc as binary to the serve with post and put 

but for reading there are two options: 

get content type = binary 
get content type = RDF -> then we read the bianry file parse it and transform it to RDF
