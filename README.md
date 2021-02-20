# About

<img src="./boil-logo.svg" height="60" />

A boilerplate template manager and generator

**Check out the full documentation here:** https://jordan-eckowitz.github.io/boil-cli-docs

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/boil-cli-tool.svg)](https://npmjs.org/package/boil-cli-tool)
[![Downloads/week](https://img.shields.io/npm/dw/boil-cli-tool.svg)](https://npmjs.org/package/boil-cli-tool)
[![License](https://img.shields.io/npm/l/boil-cli-tool.svg)](https://github.com/Jordan-Eckowitz/boil-cli/blob/master/package.json)

<!-- toc -->
* [About](#about)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g boil-cli-tool
$ boil COMMAND
running command...
$ boil (-v|--version|version)
boil-cli-tool/1.1.0 darwin-x64 node-v12.13.1
$ boil --help [COMMAND]
USAGE
  $ boil COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`boil create [NAME]`](#boil-create-name)
* [`boil create-function [NAME]`](#boil-create-function-name)
* [`boil help [COMMAND]`](#boil-help-command)
* [`boil init`](#boil-init)
* [`boil list`](#boil-list)
* [`boil up TEMPLATE`](#boil-up-template)

## `boil create [NAME]`

create a new boilerplate template

```
USAGE
  $ boil create [NAME]

ARGUMENTS
  NAME  template name

OPTIONS
  -a, --args=args  local template args
  -h, --help       show CLI help

EXAMPLES
  $ boil create person --args name,surname,age
  $ boil create person -a name,surname,age
```

_See code: [src/commands/create.ts](https://github.com/Jordan-Eckowitz/boil-cli/blob/v1.1.0/src/commands/create.ts)_

## `boil create-function [NAME]`

create a new boilerplate template function

```
USAGE
  $ boil create-function [NAME]

ARGUMENTS
  NAME  template function name

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ boil create-function timestamp
```

_See code: [src/commands/create-function.ts](https://github.com/Jordan-Eckowitz/boil-cli/blob/v1.1.0/src/commands/create-function.ts)_

## `boil help [COMMAND]`

display help for boil

```
USAGE
  $ boil help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `boil init`

create a new boilerplate directory

```
USAGE
  $ boil init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/Jordan-Eckowitz/boil-cli/blob/v1.1.0/src/commands/init.ts)_

## `boil list`

list all boil commands

```
USAGE
  $ boil list

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/list.ts](https://github.com/Jordan-Eckowitz/boil-cli/blob/v1.1.0/src/commands/list.ts)_

## `boil up TEMPLATE`

generate boilerplate from one of the templates

```
USAGE
  $ boil up TEMPLATE

ARGUMENTS
  TEMPLATE  call up a template defined in the '.boilerplate' directory

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  $ boil up component --name App --filetype js
  $ boil up component -n App -ft js

  run boil list to see all available boilerplate templates
```

_See code: [src/commands/up.ts](https://github.com/Jordan-Eckowitz/boil-cli/blob/v1.1.0/src/commands/up.ts)_
<!-- commandsstop -->
