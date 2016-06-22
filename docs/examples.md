### Installing

Clone this project and install the npm modules to run the examples:

```sh
# clone the project
$ git clone https://github.com/assemble/context-workshop
# cd into the folder
$ cd context-workshop
# install npm modules
$ npm install
# install assemble globally if not already installed
$ npm install --global assemble
```

### Running

Each example may be run by using `assemble`:

```sh
$ assemble <example>
```

To view a list of examples run the default assemble command:

```sh
$ assemble
```

To interactively choose an example to run use the `-i` option:

```sh
$ assemble -i
```

{%= doc('01-app-cache-data.md') %}
{%= doc('02-render-locals.md') %}
{%= doc('03-view-locals.md') %}
{%= doc('04-view-data.md') %}
{%= doc('05-helper-locals.md') %}
