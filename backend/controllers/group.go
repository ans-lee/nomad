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
	"github.com/gin-gonic/gin"
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
		Name: data.Name,
		Description: data.Description,
		IsPublic: *data.IsPublic,
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
		Role: GroupMemberConstants.RoleOwner,
		UserID: userID.(primitive.ObjectID),
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
