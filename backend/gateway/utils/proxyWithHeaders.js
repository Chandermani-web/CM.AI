import proxy from 'express-http-proxy';

export const proxyWithHeaders = (serviceUrl) => {
    return proxy(serviceUrl, {
        parseReqBody: false,

        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.user) {
                proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
            }

            return proxyReqOpts;
        },
    });
};