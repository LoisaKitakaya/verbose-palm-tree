const getErrorMessage = (status) => {
  switch (status) {
    case 400:
      return "Bad Request: The server could not understand the request.";
    case 401:
      return "Unauthorized: Authentication is required and has failed or has not yet been provided.";
    case 402:
      return "Payment Required: The request cannot be processed until payment is made.";
    case 403:
      return "Forbidden: The server understood the request, but refuses to authorize it.";
    case 404:
      return "Not Found: The server has not found anything matching the request URI.";
    case 405:
      return "Method Not Allowed: The method specified in the request is not allowed for the resource identified by the request URI.";
    case 406:
      return "Not Acceptable: The server cannot generate a response that the client will accept.";
    case 407:
      return "Proxy Authentication Required: The client must authenticate itself with the proxy.";
    case 408:
      return "Request Timeout: The server timed out waiting for the request.";
    case 409:
      return "Conflict: The request could not be completed due to a conflict with the current state of the resource.";
    case 410:
      return "Gone: The requested resource is no longer available at the server and no forwarding address is known.";
    case 411:
      return "Length Required: The server requires a content-length in the request.";
    case 412:
      return "Precondition Failed: The server does not meet one of the preconditions specified by the client.";
    case 413:
      return "Payload Too Large: The request is larger than the server is willing or able to process.";
    case 414:
      return "URI Too Long: The URI provided was too long for the server to process.";
    case 415:
      return "Unsupported Media Type: The server does not support the media type of the request.";
    case 416:
      return "Range Not Satisfiable: The requested range cannot be satisfied by the server.";
    case 417:
      return "Expectation Failed: The server cannot meet the requirements of the Expect request-header field.";
    case 418:
      return "I'm a teapot: The server refuses the attempt to brew coffee with a teapot.";
    case 500:
      return "Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request.";
    case 501:
      return "Not Implemented: The server does not support the functionality required to fulfill the request.";
    case 502:
      return "Bad Gateway: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.";
    case 503:
      return "Service Unavailable: The server is currently unable to handle the request due to a temporary overload or maintenance of the server.";
    case 504:
      return "Gateway Timeout: The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.";
    case 505:
      return "HTTP Version Not Supported: The server does not support the HTTP protocol version used in the request.";
    default:
      return "An error occurred: Status code " + status;
  }
};

const getSuccessMessage = (status) => {
  switch (status) {
    case 200:
      return "OK: The request has succeeded.";
    case 201:
      return "Created: The request has been fulfilled and has resulted in a new resource being created.";
    case 202:
      return "Accepted: The request has been accepted for processing, but the processing has not been completed.";
    case 203:
      return "Non-Authoritative Information: The server successfully processed the request, but is returning information from another source.";
    case 204:
      return "No Content: The server successfully processed the request and is not returning any content.";
    case 205:
      return "Reset Content: The server successfully processed the request, but is not returning any content.";
    case 206:
      return "Partial Content: The server is delivering only part of the resource due to a range header sent by the client.";
    case 207:
      return "Multi-Status: The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.";
    case 208:
      return "Already Reported: The members of a DAV binding have already been enumerated in a preceding part of the (multi-status) response, and are not being included again.";
    case 226:
      return "IM Used: The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.";
    default:
      return "Unknown success status code: " + status;
  }
};

export { getErrorMessage, getSuccessMessage };
