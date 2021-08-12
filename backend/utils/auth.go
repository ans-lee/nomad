package utils

import (
	"crypto/rand"
	"math/big"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	"golang.org/x/crypto/bcrypt"
)

func GeneratePasswordHash(password string) string {
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(password), AuthConstants.HashCost)
	if err != nil {
		return ""
	}

	return string(hashPassword)
}

func ComparePasswordHash(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func CreateSessionToken(length int) string {
	result := make([]byte, length)

	for i := 0; i < length; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(AuthConstants.SessionTokenChars))))
		if err != nil {
			return ""
		}

		result[i] = AuthConstants.SessionTokenChars[num.Int64()]
	}

	return string(result)
}
