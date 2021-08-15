package utils

import (
	"context"

	GroupModel "github.com/anslee/nomad/models/group"
	"github.com/anslee/nomad/db"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UserInGroup(userID, groupID primitive.ObjectID) bool {
	filter := bson.M{"userID": userID, "groupID": groupID}

	err := db.GetCollection(GroupModel.CollectionName).
		FindOne(context.Background(), filter).Err()

	return err != nil
}
