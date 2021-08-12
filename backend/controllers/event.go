package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/anslee/nomad/db"
	EventModel "github.com/anslee/nomad/models/event"
	"github.com/anslee/nomad/serializers"
	"github.com/gin-gonic/gin"
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

	start, err := time.Parse(time.RFC3339, data.Start)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Start time must be in RFC3339 format",
		})

		return
	}

	end, err := time.Parse(time.RFC3339, data.End)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "End time must be in RFC3339 format",
		})

		return
	}

	if start.After(end) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Start time cannot be after the end time.",
		})

		return
	}

	userID, _ := primitive.ObjectIDFromHex(c.GetString("user"))
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
		CreatedBy:   userID,
	}

	if data.Reminder != "" {
		reminder, reminderErr := time.Parse(time.RFC3339, data.Reminder)
		if reminderErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Reminder time must be in RFC3339 format",
			})

			return
		}

		if reminder.After(start) || reminder.Equal(start) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Reminder time cannot be the same or after the start time.",
			})

			return
		}

		newEvent.Reminder = primitive.NewDateTimeFromTime(reminder.UTC())
	}

	if data.GroupID != "" {
		// TODO check if valid groupID
		groupID, groupErr := primitive.ObjectIDFromHex(data.GroupID)
		if groupErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid Group ID",
			})

			return
		}

		newEvent.GroupID = groupID
	}

	_, err = db.GetCollection(EventModel.CollectionName).
		InsertOne(context.Background(), newEvent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	// TODO maybe return the link of the event?
	c.JSON(http.StatusCreated, gin.H{
		"message": "Created a new event!",
	})
}
