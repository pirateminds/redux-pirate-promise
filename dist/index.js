'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = promiseMiddleware;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function promiseMiddleware(params) {
    let {
        request = (data, next) => {},
        response = (data, next) => next(data),
        error = (data, next) => next(data)
    } = params;

    return next => action => {
        let { promise, type } = action,
            rest = _objectWithoutProperties(action, ['promise', 'type']);

        if (typeof action.then === 'function') {
            request(_extends({}, rest, { type: type }), next);

            return action.then(result => {
                response(_extends({}, rest, { result, type: type }), next);
                return result;
            }, err => {
                error(_extends({}, rest, { error: err, type: type }), next);
                return err;
            });
        } else {
            if (!promise) {
                return next(action);
            }

            request(_extends({}, rest, { type: type }), next);

            return promise().then(result => {
                response(_extends({}, rest, { result, type: type }), next);
                return result;
            }, err => {
                error(_extends({}, rest, { error: err, type: type }), next);
            });
        }
    };
}