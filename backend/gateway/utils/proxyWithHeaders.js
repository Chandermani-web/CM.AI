import proxy from "express-http-proxy";

export const proxyWithHeaders = (serviceUrl) => {
  return proxy(serviceUrl, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Pass authenticated user ID
      if (srcReq.user?.userId) {
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }

      // IMPORTANT:
      // Do NOT force content-type.
      // The original content-type must be preserved,
      // especially for multipart/form-data uploads.

      return proxyReqOpts;
    },

    // IMPORTANT:
    // Do NOT JSON.stringify the request body.
    // Let express-http-proxy forward the original request body.
  });
};