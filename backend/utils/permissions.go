package utils

import (
	"context"

	GroupMemberConstants "github.com/anslee/nomad/constants/group_member"
	"github.com/anslee/nomad/db"
	GroupMemberModel "github.com/anslee/nomad/models/group_member"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func UserInGroup(userID, groupID primitive.ObjectID) bool {
	filter := bson.M{"userID": userID, "groupID": groupID}

	err := db.GetCollection(GroupMemberModel.CollectionName).
		FindOne(context.Background(), filter).Err()

	return err != nil
}

func UserHasPermission(userID, groupID primitive.ObjectID) bool {
	var groupMember GroupMemberModel.GroupMember

	filter := bson.M{"userID": userID, "groupID": groupID}

	err := db.GetCollection(GroupMemberModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&groupMember)

	return err == nil && groupMember.Role != GroupMemberConstants.RoleMember
}
