# Agito [![NPM version][npm-img]][npm]

[![Build Status][travis-img]][travis]
[![Test Coverage][codeclimate-coverage-img]][codeclimate]
[![Code Climate][codeclimate-gpa-img]][codeclimate]
[![Dependencies Status][daviddm-dep-img]][daviddm-dep]

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
var httpProtocol = require('agito-http-protocol');

agito
  .use(function() {
    this.redirections.push(
      { from: 'http://example.net', to: 'http://example.com' }
    );
    this.done();
  })
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

## Changelog

See [`CHANGELOG.md`](CHANGELOG.md)

## Authors

See [`package.json`](package.json)

## License

See [`LICENSE`](LICENSE)

[npm]: https://www.npmjs.org/package/agito
[npm-img]: http://img.shields.io/npm/v/agito.svg?style=flat
[travis]: https://travis-ci.org/agitojs/agito
[travis-img]: http://img.shields.io/travis/agitojs/agito/master.svg?style=flat
[codeclimate]: https://codeclimate.com/github/agitojs/agito
[codeclimate-coverage-img]: http://img.shields.io/codeclimate/coverage/github/agitojs/agito.svg?style=flat
[codeclimate-gpa-img]: http://img.shields.io/codeclimate/github/agitojs/agito.svg?style=flat
[daviddm-dep]: https://david-dm.org/agitojs/agito
[daviddm-dep-img]: http://img.shields.io/david/agitojs/agito.svg?style=flat

[issue-tracker]: https://github.com/agitojs/agito/issues

[agito-loaders-npm]: https://www.npmjs.org/search?q=agito-*-loader
[agito-protocols-npm]: https://www.npmjs.org/search?q=agito-*-protocol
