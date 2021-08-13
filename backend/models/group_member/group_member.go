package group_member

import "go.mongodb.org/mongo-driver/bson/primitive"

const CollectionName = "groupMember"

type GroupMember struct {
	ID      primitive.ObjectID `bson:"_id,omitempty"`
	Role    string             `bson:"role"`
	UserID  primitive.ObjectID `bson:"userID"`
	GroupID primitive.ObjectID `bson:"groupID"`
}
