'use strict'

const { Router } = require('itty-router')
const { error } = require('../response')

const ThrowableRouter = (options = {}) => {
  const { stack = false } = options
  const { responseMiddleware = [], ...routerOptions } = options

  return new Proxy(Router(routerOptions), {
    get: (obj, prop) => (...args) =>
        {
          const response = prop === 'handle'
            ? obj[prop](...args).catch(err => error(
                err.status || 500,
                {
                  status: err.status || 500,
                  error: err.message,
                  stack: stack && err.stack || undefined
                },
              ))
            : obj[prop](...args)
          return response;
      }
  })
}


module.exports = { ThrowableRouter }
