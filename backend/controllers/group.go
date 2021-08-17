package controllers

import (
	"context"
	"net/http"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	GroupMemberConstants "github.com/anslee/nomad/constants/group_member"
	"github.com/anslee/nomad/db"
	GroupModel "github.com/anslee/nomad/models/group"
	GroupMemberModel "github.com/anslee/nomad/models/group_member"
	"github.com/anslee/nomad/serializers"
	"github.com/anslee/nomad/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/validator.v2"
)

func CreateGroup(c *gin.Context) {
	var data serializers.CreateGroupSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are not in the correct format.",
		})

		return
	}

	newGroup := GroupModel.Group{
		Name:        data.Name,
		Description: data.Description,
		IsPublic:    *data.IsPublic,
	}
	userID, _ := c.Get(AuthConstants.ContextAuthKey)

	result, err := db.GetCollection(GroupModel.CollectionName).
		InsertOne(context.Background(), newGroup)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	newGroupMember := GroupMemberModel.GroupMember{
		Role:    GroupMemberConstants.RoleOwner,
		UserID:  userID.(primitive.ObjectID),
		GroupID: result.InsertedID.(primitive.ObjectID),
	}

	_, err = db.GetCollection(GroupMemberModel.CollectionName).
		InsertOne(context.Background(), newGroupMember)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"groupID": result.InsertedID,
	})
}

func EditGroup(c *gin.Context) {
	var data serializers.CreateGroupSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are not in the correct format.",
		})

		return
	}

	var group GroupModel.Group

	groupID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": groupID}

	err := db.GetCollection(GroupModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&group)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Group ID.",
		})

		return
	}

	userID, _ := c.Get(AuthConstants.ContextAuthKey)

	if !utils.UserHasPermission(userID.(primitive.ObjectID), groupID) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You do not have permission to edit the group.",
		})

		return
	}

	updateFields := bson.D{
		{Key: "name", Value: data.Name},
		{Key: "isPublic", Value: data.IsPublic},
	}
	removeFields := bson.D{}

	if data.Description == "" {
		removeFields = append(removeFields, bson.E{Key: "description", Value: ""})
	} else {
		updateFields = append(updateFields, bson.E{Key: "description", Value: data.Description})
	}

	_, _ = db.GetCollection(GroupModel.CollectionName).
		UpdateOne(
			context.Background(),
			filter,
			bson.D{
				{Key: "$set", Value: updateFields},
				{Key: "$unset", Value: removeFields},
			},
		)

	c.JSON(http.StatusOK, gin.H{
		"message": "Group updated!",
	})
}

func GetGroup(c *gin.Context) {
	var group GroupModel.Group

	groupID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": groupID}

	err := db.GetCollection(GroupModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&group)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Group ID.",
		})

		return
	}

	userID, exists := c.Get(AuthConstants.ContextAuthKey)
	if !group.IsPublic {
		if !exists || !utils.UserInGroup(userID.(primitive.ObjectID), groupID) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "You do not have permission to view this group.",
			})

			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"name":        group.Name,
		"description": group.Description,
		"isPublic":    group.IsPublic,
	})
}
