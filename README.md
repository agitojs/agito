# Agito [![NPM version][npm-img]][npm]

[![Build Status][travis-img]][travis]
[![Test Coverage][codeclimate-coverage-img]][codeclimate]
[![Code Climate][codeclimate-gpa-img]][codeclimate]
[![Dependency Status][daviddm-dep-img]][daviddm-dep]
[![devDependency Status][daviddm-devdep-img]][daviddm-devdep]
[![Stories in Ready][waffle-img]][waffle]

Agito is a middleware-based Node.js redirection engine. Its flexible nature
makes it protocol agnostic and highly configurable.

## Installation

```bash
npm install agito
```

## Getting Started

Let's dig into a simple example. Say we want to redirect every single HTTP
request from `example.net` to `example.com`. This can simply be done via the
following code:

```javascript
var agito = require('agito');
var jsonLoader = require('agito-json-loader');
var httpProtocol = require('agito-http-protocol');

agito
  .use(jsonLoader([
    { from: 'http://example.net', to: 'http://example.com' }
  ])
  .use(httpProtocol())
  .run()
;
```

_Note: you need to run this code on the server receiving the `example.net`
requests._

## Plugins

Agito relies on a middleware architecture, by doing so it remains lightweight
and exactly fits your needs.

There is two types of plugins:
- **[loader][agito-loaders-npm]**: load redirections from different sources like
  JSON or databases
- **[protocols][agito-protocols-npm]**: identify which protocol is used during
  each request. Also handle how the redirection will be actually done


## Under the hood

Agito will first initialized itself, by:

1. Storing the middlewares passed to the `Agito#use()` method
2. Sequentially running all of them one by one
3. Normalizing the redirections
4. Aggregating the redirections by port and by protocol
5. Running the TCP servers to listen on all the ports present in the `from`
   fields

Then it will wait for a request. Once one arrives, it:

1. Identifies the protocol
2. Finds a matching entry in the redirection pool
3. Redirect the request to its new destination

## Issue tracker

Please feel free to report issues and bugs or to submit patches by the
[issue tracker][issue-tracker].

## Authors

[Read AUTHORS](AUTHORS)

## License

[Read LICENSE](LICENSE)

[npm]: http://badge.fury.io/js/agito
[npm-img]: https://badge.fury.io/js/agito.svg
[travis]: https://travis-ci.org/agitojs/agito
[travis-img]: https://travis-ci.org/agitojs/agito.svg?branch=master
[codeclimate]: https://codeclimate.com/github/agitojs/agito
[codeclimate-coverage-img]: https://codeclimate.com/github/agitojs/agito/coverage.png
[codeclimate-gpa-img]: https://codeclimate.com/github/agitojs/agito.png
[daviddm-dep]: https://david-dm.org/agitojs/agito#info=dependencies
[daviddm-dep-img]: https://david-dm.org/agitojs/agito.png
[daviddm-devdep-img]: https://david-dm.org/agitojs/agito/dev-status.png
[daviddm-devdep]: https://david-dm.org/agitojs/agito#info=devDependencies
[waffle]: (http://waffle.io/agitojs/agito)
[waffle-img]: https://badge.waffle.io/agitojs/agito.png

[issue-tracker]: https://github.com/agitojs/agito/issues

[agito-loaders-npm]: https://www.npmjs.org/search?q=agito-*-loader
[agito-protocols-npm]: https://www.npmjs.org/search?q=agito-*-protocol
