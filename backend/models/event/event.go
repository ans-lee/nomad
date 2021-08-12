package event

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "event"

type Event struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Title       string             `bson:"title"`
	Location    string             `bson:"location"`
	Online      bool               `bson:"online"`
	Description string             `bson:"description"`
	Category    string             `bson:"type"`
	Start       primitive.DateTime `bson:"start"`
	End         primitive.DateTime `bson:"end"`
	Reminder    primitive.DateTime `bson:"reminder"`
	Repeat      string             `bson:"repeat"`
	Visibility  string             `bson:"visibility"`
	GroupID     primitive.ObjectID `bson:"groupID"`
	CreatedBy   primitive.ObjectID `bson:"createdBy"`
}
