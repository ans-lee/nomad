package utils

import (
	"context"

	"github.com/anslee/nomad/db"
	GroupModel "github.com/anslee/nomad/models/group"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UserInGroup(userID, groupID primitive.ObjectID) bool {
	filter := bson.M{"userID": userID, "groupID": groupID}

	err := db.GetCollection(GroupModel.CollectionName).
		FindOne(context.Background(), filter).Err()

	return err != nil
}
