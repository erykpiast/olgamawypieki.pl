import { parse as parseQuery } from 'query-string';

const identity = (a) => a;

const FACEBOOK_URL = 'https://www.facebook.com/olgamawypieki/';
const queryParams = parseQuery(window.location.search);
const redirectUrl = [
  FACEBOOK_URL,
  queryParams.ref && `ref=${queryParams.ref}`,
].filter(identity).join('?');

setTimeout(() => {
  window.location = redirectUrl;
}, 1000);
