package group

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "group"

type Group struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Name        string             `bson:"name"`
	Description string             `bson:"description,omitempty"`
	IsPublic    bool               `bson:"isPublic"`
}
