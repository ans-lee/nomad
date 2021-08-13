package group

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "group"

type Group struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Name        string             `bson:"title"`
	Description string             `bson:"description,omitempty"`
	Visibility  string             `bson:"visibility"`
}
