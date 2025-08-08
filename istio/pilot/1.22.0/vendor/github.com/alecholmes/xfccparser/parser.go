package xfccparser

import (
	"crypto/x509/pkix"
	"fmt"

	"github.com/alecthomas/participle/v2"
)

const (
	// ForwardedClientCertHeader is the name of the HTTP header Envoy uses to pass metadata about certificates presented by a client
	ForwardedClientCertHeader = "x-forwarded-client-cert"
)

// ClientCert is a client certificate passed to Envoy
type ClientCert struct {
	By      string
	Hash    string
	Cert    string
	Chain   string
	Subject *pkix.Name
	URI     []string
	DNS     []string
}

// ParseXFCCHeader parses an x-forwarded-client-cert header and returns the list of certificates present.
// The format of the header is documented here: https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/headers#x-forwarded-client-cert
func ParseXFCCHeader(header string) ([]*ClientCert, error) {
	groups, err := parseRawXFCCHeader(header)
	if err != nil {
		return nil, err
	}

	if len(groups.FieldGroups) == 0 {
		return nil, nil
	}

	certs := make([]*ClientCert, 0, len(groups.FieldGroups))
	for i, group := range groups.FieldGroups {
		cert := &ClientCert{}

		for _, field := range group.Fields {
			switch field.Key {
			case "By":
				cert.By = field.Value
			case "Hash":
				cert.Hash = field.Value
			case "Cert":
				cert.Cert = field.Value
			case "Chain":
				cert.Chain = field.Value
			case "Subject":
				subject, err := ParseSubject(field.Value)
				if err != nil {
					return nil, fmt.Errorf("invalid subject in client cert %d: %v", i, err)
				}
				cert.Subject = subject
			case "URI":
				cert.URI = append(cert.URI, field.Value)
			case "DNS":
				cert.DNS = append(cert.DNS, field.Value)
			default:
				return nil, fmt.Errorf("unknown field %s in client cert %d", field.Key, i)
			}
		}
		certs = append(certs, cert)
	}

	return certs, nil
}

// ParseSubject parses the subject string that is parse of the x-forwarded-client-cert header
func ParseSubject(subject string) (*pkix.Name, error) {
	if subject == "" {
		return nil, nil
	}

	group, err := subjectParser.ParseString("", subject)
	if err != nil {
		return nil, fmt.Errorf("invalid subject: %v", err)
	}

	name := &pkix.Name{}
	for _, field := range group.Fields {
		switch field.Key {
		case "C":
			name.Country = append(name.Country, field.Value)
		case "O":
			name.Organization = append(name.Organization, field.Value)
		case "OU":
			name.OrganizationalUnit = append(name.OrganizationalUnit, field.Value)
		case "CN":
			name.CommonName = field.Value
		case "SERIALNUMBER":
			name.SerialNumber = field.Value
		case "L":
			name.Locality = append(name.Locality, field.Value)
		case "ST":
			name.Province = append(name.Province, field.Value)
		case "STREET":
			name.StreetAddress = append(name.StreetAddress, field.Value)
		case "POSTALCODE":
			name.PostalCode = append(name.PostalCode, field.Value)
		default:
			return nil, fmt.Errorf("unknown subject DN `%s`", field.Key)
		}
	}

	return name, nil
}

// parseRawXFCCHeader parses a x-forwarded-client-cert header header but does not marshal it into ClientCerts.
func parseRawXFCCHeader(header string) (*certs, error) {
	if header == "" {
		return &certs{}, nil
	}
	groups, err := parser.ParseString("", header)
	if err != nil {
		return nil, fmt.Errorf("invalid header format: %v", err)
	}

	return groups, nil
}

// certs
type certs struct {
	FieldGroups []certFields `parser:"(@@ ( ',' @@ )* )?"`
}

type certFields struct {
	Fields []field `parser:"(@@ ( ';' @@ )* )?"`
}

type field struct {
	Key   string `parser:"@String '='"`
	Value string `parser:"(@String)?"`
}

var parser = participle.MustBuild[certs](participle.Lexer(&xfccDefinition{}))

type subjectFields struct {
	Fields []field `parser:"(@@ ( ',' @@ )* )?"`
}

var subjectParser = participle.MustBuild[subjectFields](participle.Lexer(&xfccDefinition{}))
