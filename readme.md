# node-rdio

node-rdio is a wrapper for the rdio web service api.

[![NPM version](https://badge.fury.io/js/rdio.png)](http://badge.fury.io/js/rdio)
[![Dependency Status](https://david-dm.org/dawnerd/node-rdio.png)](https://david-dm.org/dawnerd/node-rdio.png)

## Installation

`npm install rdio --save`

## V2 notice

V2 is a complete re-write to be more modern. As such, expect everything to break. Please don't upgrade to v2 unless you're ready to change your code.

## Usage

Config during require:

```js
var rdio = require('rdio')(config);
```

Deffered config:
```js
var rdio = require('rdio');

var userRequest = new rdio(auth_token, auth_token_secret, config);
```

## Making requests

Each user will have their own auth_token and auth_token_secret. You will need an instance of `rdio` for each user (but not each request).

This example will initiate the requests to get the users auth tokens.

```js
var userRequest = new rdio();

userRequest.getPlaybackToken('http://example.com', function(err, data){
  console.log(data);
});
```

If you already have an auth_token and an auth_token_secret for the user go ahead and pass that in.

```js
var userRequest = new rdio(auth_token, auth_token_secret);

userRequest.getPlaybackToken('http://example.com', function(err, data){
  console.log(data);
});
```

## Methods

### api(access_token, secret_token, payload, callback)

 - **access_token** string - Oauth access token secret
 - **secret_token** string - Oauth access token secret
 - **payload** object - Data to sent to rdio. See [rdio web service api documentationn](http://www.rdio.com/developers/docs/web-service/index/) for properties.
 - **callback** function(err, data, response) - Called when request is completed.

### getRequestToken(callback)

 - **callback** function(error, oauth_token, oauth_token_secret, results)

### getAccessToken(auth_token, auth_token_secret, oauth_verifier, callback)

 - **auth_token** string
 - **auth_token_secret** string
 - **oauth_verifier** string
 - **callback** function(error, oauth_token, oauth_token_secret, results)

## Config

 - **rdio_api_key** string - rdio api key
 - **rdio_api_shared** string - rdio api shared secret
 - **callback_url** string - url oauth request will redirect to