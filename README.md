# disclose

Disclose is a library that helps you display notifications to the user in a
generic way.

## Usage

```bash
$ npm install disclose.js
```

```js
var Disclose = require('disclose.js');
var disclose = new Disclose({ anchor: 'bottomright' });

disclose.success('Hurray! Something good happened!');
disclose.info('Hey this thing happened. We just thought you should know');
disclose.warning('Something\'s not entirey right buuuut okay.');
disclose.error('Hurray! Something good happened!', { sticky: true });
```
