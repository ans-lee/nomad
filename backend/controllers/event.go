package controllers

import (
	"context"
	"net/http"
	"time"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	"github.com/anslee/nomad/db"
	EventModel "github.com/anslee/nomad/models/event"
	GroupModel "github.com/anslee/nomad/models/group"
	"github.com/anslee/nomad/serializers"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/validator.v2"
)

func CreateEvent(c *gin.Context) {
	var data serializers.CreateEventSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Fields are not in the correct format.",
		})

		return
	}

	start, end, errStr := getStartEndTimes(data.Start, data.End)
	if errStr != "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errStr,
		})

		return
	}

	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	newEvent := EventModel.Event{
		Title:       data.Title,
		Location:    data.Location,
		Online:      *data.Online,
		Description: data.Description,
		Category:    data.Category,
		Start:       primitive.NewDateTimeFromTime(start.UTC()),
		End:         primitive.NewDateTimeFromTime(end.UTC()),
		Repeat:      data.Repeat,
		Visibility:  data.Visibility,
		CreatedBy:   userID.(primitive.ObjectID),
	}

	if data.Reminder != "" {
		reminder, errStr := getReminderTime(data.Reminder, start)
		if errStr != "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": errStr,
			})

			return
		}

		newEvent.Reminder = primitive.NewDateTimeFromTime(reminder.UTC())
	}

	if data.GroupID != "" {
		groupID, groupErr := getGroupID(data.GroupID)
		if groupErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid Group ID",
			})

			return
		}

		newEvent.GroupID = groupID
	}

	result, err := db.GetCollection(EventModel.CollectionName).
		InsertOne(context.Background(), newEvent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"eventID": result.InsertedID,
	})
}

func getStartEndTimes(startStr, endStr string) (start, end time.Time, errStr string) {
	start, err := time.Parse(time.RFC3339, startStr)
	if err != nil {
		return start, start, "Start time must be in RFC3339 format."
	}

	end, err = time.Parse(time.RFC3339, endStr)
	if err != nil {
		return start, end, "End time must be in RFC3339 format."
	}

	if start.After(end) {
		return start, end, "Start time cannot be after the end time."
	}

	return start, end, ""
}

func getReminderTime(reminderStr string, startTime time.Time) (reminder time.Time, errStr string) {
	reminder, err := time.Parse(time.RFC3339, reminderStr)
	if err != nil {
		return reminder, "Reminder time must be in RFC3339 format."
	}

	if reminder.After(startTime) || reminder.Equal(startTime) {
		return reminder, "Reminder time cannot be the same or after the start time."
	}

	return reminder, ""
}

func getGroupID(idStr string) (primitive.ObjectID, error) {
	groupID, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		return groupID, err
	}

	var group GroupModel.Group

	filter := bson.M{"_id": groupID}

	err = db.GetCollection(GroupModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&group)
	if err != nil {
		return groupID, err
	}

	return groupID, nil
}
