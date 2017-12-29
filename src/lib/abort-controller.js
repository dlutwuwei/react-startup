
import 'babel-polyfill';
import 'whatwg-fetch';
import Emitter from './emitter';

class AbortSignal extends Emitter {
  constructor() {
    super();

    this.aborted = false;
  }
  toString() {
    return '[object AbortSignal]';
  }
}

class AbortController {
  constructor() {
    this.signal = new AbortSignal();
  }
  abort = () => {
    this.signal.aborted = true;
    this.signal.dispatchEvent('abort');
  }
  toString() {
    return '[object AbortController]';
  }
}

if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
  // These are necessary to make sure that we get correct output for:
  // Object.prototype.toString.call(new AbortController())
  AbortController.prototype[Symbol.toStringTag] = 'AbortController';
  AbortSignal.prototype[Symbol.toStringTag] = 'AbortSignal';
}

const realFetch = window.fetch;
const abortableFetch = (input, init) => {
  if(init && init.signal) {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    abortError.isAborted = true;

    // Return early if already aborted, thus avoiding making an HTTP request
    if(init.signal.aborted) {
      return Promise.reject(abortError);
    }
    // Turn an event into a promise, reject it once `abort` is dispatched
    const cancellation = new Promise((_, reject) => {
      init.signal.addEventListener('abort', () => {
        reject(abortError);
      },
      { once: true });
    });

    delete init.signal;

    // Return the fastest promise (don't need to wait for request to finish)
    return Promise.race([cancellation, realFetch(input, init)]);
  }

  return realFetch(input, init);
};
export default {
  abortableFetch,
  AbortController,
  AbortSignal
};
