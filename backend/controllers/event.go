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

	start := getUTCDatetime(data.Start)
	end := getUTCDatetime(data.End)

	if start.After(end) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Start time cannot be after the end time.",
		})

		return
	}

	newEvent := EventModel.Event{
		Title:       data.Title,
		Location:    data.Location,
		Online:      data.Online,
		Description: data.Description,
		Category:    data.Category,
		Start:       primitive.NewDateTimeFromTime(start),
		End:         primitive.NewDateTimeFromTime(end),
		Repeat:      data.Repeat,
		Visibility:  data.Visibility,
	}

	if data.Reminder != "" {
		reminder := getUTCDatetime(data.Reminder)
		if reminder.After(start) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Reminder time cannot be after the start time.",
			})

			return
		}

		newEvent.Reminder = primitive.NewDateTimeFromTime(reminder)
	}

	if data.GroupID != "" {
		objID, err := primitive.ObjectIDFromHex(data.GroupID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Something went wrong! Please try again.",
			})

			return
		}

		newEvent.GroupID = objID
	}

	_, err := db.GetCollection(EventModel.CollectionName).
		InsertOne(context.Background(), newEvent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Something went wrong! Please try again.",
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Created a new user!",
	})
}

func getUTCDatetime(rfc3339Time string) time.Time {
	timeObj, _ := time.Parse(time.RFC3339, rfc3339Time)
	return timeObj
}
