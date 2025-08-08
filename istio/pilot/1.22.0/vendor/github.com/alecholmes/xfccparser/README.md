# xfccparser: A parser for Envoy x-forwarded-client-cert

When Envoy terminates TLS, it sends along metadata about the client certificates
in an `x-forwarded-client-cert` HTTP header. This library parses that header into
Go structs.

## Usage

```go
var req *http.Request

xfccHeader := req.Header.Get(xfccparser.ForwardedClientCertHeader)
clientCerts, err := xfccparser.ParseXFCCHeader(xfccHeader)
```

## Contributions

Thanks to [Alec Thomas](https://github.com/alecthomas) for help with the
[participle](https://github.com/alecthomas/participle) representation. 
