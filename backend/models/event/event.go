package event

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "event"

type Event struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Title       string             `bson:"title"`
	Location    string             `bson:"location,omitempty"`
	Online      bool               `bson:"online"`
	Description string             `bson:"description,omitempty"`
	Category    string             `bson:"category"`
	Start       primitive.DateTime `bson:"start"`
	End         primitive.DateTime `bson:"end"`
	Visibility  string             `bson:"visibility"`
	GroupID     primitive.ObjectID `bson:"groupID,omitempty"`
	CreatedBy   primitive.ObjectID `bson:"createdBy"`
}
