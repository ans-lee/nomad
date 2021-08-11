package session

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "session"

type Session struct {
	Token  string             `bson:"token"`
	Expiry primitive.DateTime `bson:"expiry"`
	User   primitive.ObjectID `bson:"user"`
}
