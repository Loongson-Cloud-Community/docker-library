package xfccparser

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"strings"

	"github.com/alecthomas/participle/v2/lexer"
)

type xfccDefinition struct {
}

var _ lexer.Definition = &xfccDefinition{}

func (x *xfccDefinition) Lex(_ string, reader io.Reader) (lexer.Lexer, error) {
	return &xfccLexer{
		reader:     bufio.NewReader(reader),
		separators: "=;,",
	}, nil
}

func (x *xfccDefinition) Symbols() map[string]lexer.TokenType {
	return map[string]lexer.TokenType{
		"EOF":    tokenEOF,
		"String": tokString,
		"Char":   tokChar,
	}
}

var (
	tokenEOF  = lexer.TokenType(0)
	tokString = lexer.TokenType(1)
	tokChar   = lexer.TokenType(2)
)

type xfccLexer struct {
	reader     *bufio.Reader
	separators string

	buf   bytes.Buffer
	start int
	pos   int
}

var _ lexer.Lexer = &xfccLexer{}

func (x *xfccLexer) Next() (lexer.Token, error) {
	quoting := false
	escaping := false

	token := func(tokenType lexer.TokenType) lexer.Token {
		tok := lexer.Token{
			Type:  tokenType,
			Value: x.buf.String(),
			Pos:   lexer.Position{Column: x.start},
		}

		x.buf.Reset()
		x.start = x.pos

		return tok
	}

	for {
		char, _, err := x.reader.ReadRune()
		if err == io.EOF {
			break
		} else if err != nil {
			return lexer.Token{}, err
		}
		x.pos++

		if escaping {
			if char == '\\' {
				if quoting {
					x.buf.WriteRune(char)
					x.buf.WriteRune(char)
				} else {
					x.buf.WriteRune(char)
				}
			} else if quoting && char == '"' {
				x.buf.WriteRune(char)
			} else if quoting && char == ',' {
				x.buf.WriteRune('\\')
				x.buf.WriteRune(char)
			} else if !quoting && strings.ContainsRune(x.separators, char) {
				x.buf.WriteRune(char)
			} else {
				return lexer.Token{}, fmt.Errorf("invalid escape character `%v` (pos %d)", char, x.pos)
			}
			escaping = false
		} else if char == '\\' {
			escaping = true
		} else if char == '"' {
			if quoting {
				quoting = false
				return token(tokString), nil
			} else {
				quoting = true
			}
		} else if !quoting && strings.ContainsRune(x.separators, char) {
			if x.buf.Len() > 0 {
				if err := x.reader.UnreadRune(); err != nil {
					return lexer.Token{}, err
				}
				return token(tokString), nil
			}
			x.buf.WriteRune(char)
			return token(tokChar), nil
		} else {
			x.buf.WriteRune(char)
		}
	}

	if quoting {
		return lexer.Token{}, fmt.Errorf("string missing end quote (pos %d)", x.pos)
	}
	if escaping {
		return lexer.Token{}, fmt.Errorf("string missing escape (pos %d)", x.pos)
	}

	if x.buf.Len() > 0 {
		return token(tokString), nil
	}

	return token(lexer.EOF), nil
}
