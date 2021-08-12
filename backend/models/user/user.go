package user

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "user"

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	Email     string             `bson:"email"`
	Password  string             `bson:"password"`
	FirstName string             `bson:"firstName"`
	LastName  string             `bson:"lastName"`
}
