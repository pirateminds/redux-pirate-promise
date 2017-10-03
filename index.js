export default function promiseMiddleware(params) {
    let {
        request = (data, next) =>  {},
        response = (data, next) =>  next(data),
        error = (data, next) =>  next(data)
    } = params;

    return (next) => (action) => {
        let { promise, type, ...rest } = action;

        if (typeof action.then === 'function') {
            request({...rest, type: type }, next);
            // new way working with promises
            return action.then(
                (result) => {
                    response({...rest, result, type: type }, next);
                    return result;
                },
                (error) => {
                    error({...rest, error, type: type }, next);
                    return error;
                }
            );
        } else {
            if (!promise) {
                return next(action);
            }
            // old way working with promises
            request({...rest, type: type }, next);

            return promise().then(
                (result) => {
                    response({...rest, result, type: type }, next);
                    return result;
                },
                (error) => {
                    error({...rest, error, type: type }, next);
                }
            );
        }
    }
}