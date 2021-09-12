package controllers

import (
	"context"
	"net/http"
	"time"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	EventConstants "github.com/anslee/nomad/constants/event"
	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	EventModel "github.com/anslee/nomad/models/event"
	"github.com/anslee/nomad/models/geolocation"
	"github.com/anslee/nomad/serializers"
	"github.com/anslee/nomad/service/gmap"
	"github.com/anslee/nomad/utils"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"googlemaps.github.io/maps"
	"gopkg.in/validator.v2"
)

func CreateEvent(c *gin.Context) {
	var data serializers.CreateEventSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidJSONPayloadMessage,
		})

		return
	}

	start, end, errStr := utils.GetStartEndTimes(data.Start, data.End)
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
		Visibility:  data.Visibility,
		CreatedBy:   userID.(primitive.ObjectID),
	}

	result, err := db.GetCollection(EventModel.CollectionName).
		InsertOne(context.Background(), newEvent)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"eventID": result.InsertedID,
	})
}

func EditEvent(c *gin.Context) {
	var data serializers.EditEventSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidJSONPayloadMessage,
		})

		return
	}

	start, end, errStr := utils.GetStartEndTimes(data.Start, data.End)
	if errStr != "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": errStr,
		})

		return
	}

	var event EventModel.Event

	eventID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": eventID}

	err := db.GetCollection(EventModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&event)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidEventIDMessage,
		})

		return
	}

	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	if event.CreatedBy != userID.(primitive.ObjectID) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You do not have permission to edit the event.",
		})

		return
	}

	updateFields := bson.D{
		{Key: "title", Value: data.Title},
		{Key: "online", Value: data.Online},
		{Key: "category", Value: data.Category},
		{Key: "start", Value: primitive.NewDateTimeFromTime(start.UTC())},
		{Key: "end", Value: primitive.NewDateTimeFromTime(end.UTC())},
		{Key: "visibility", Value: data.Visibility},
	}
	removeFields := bson.D{}

	if data.Location == "" {
		removeFields = append(removeFields, bson.E{Key: "location", Value: ""})
	} else {
		updateFields = append(updateFields, bson.E{Key: "location", Value: data.Location})
	}

	if data.Description == "" {
		removeFields = append(removeFields, bson.E{Key: "description", Value: ""})
	} else {
		updateFields = append(updateFields, bson.E{Key: "description", Value: data.Description})
	}

	_, _ = db.GetCollection(EventModel.CollectionName).
		UpdateOne(
			context.Background(),
			filter,
			bson.D{
				{Key: "$set", Value: updateFields},
				{Key: "$unset", Value: removeFields},
			},
		)

	c.JSON(http.StatusOK, gin.H{
		"message": "Event updated!",
	})
}

func DeleteEvent(c *gin.Context) {
	var event EventModel.Event

	eventID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": eventID}

	err := db.GetCollection(EventModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&event)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidEventIDMessage,
		})

		return
	}

	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	if userID.(primitive.ObjectID) != event.CreatedBy {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "You do not have permission to delete this event.",
		})

		return
	}

	result, err := db.GetCollection(EventModel.CollectionName).
		DeleteOne(context.Background(), filter)
	if err != nil || result.DeletedCount != 1 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidEventIDMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Event deleted!",
	})
}

func GetEvent(c *gin.Context) {
	var event EventModel.Event

	eventID, _ := primitive.ObjectIDFromHex(c.Param("id"))
	filter := bson.M{"_id": eventID}

	err := db.GetCollection(EventModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&event)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidEventIDMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"title":       event.Title,
		"location":    event.Location,
		"online":      event.Online,
		"description": event.Description,
		"category":    event.Category,
		"start":       event.Start.Time().UTC(),
		"end":         event.End.Time().UTC(),
		"visibility":  event.Visibility,
		"createdBy":   event.CreatedBy.Hex(),
	})
}

func GetAllEvents(c *gin.Context) {
	var err error

	filter := bson.M{"visibility": EventConstants.VisibilityPublic}
	ne, neExist := c.GetQuery("ne")
	sw, swExist := c.GetQuery("sw")

	if !neExist || !swExist {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Coordinates are missing in the query strings",
		})

		return
	}

	newBounds, err := utils.GetBounds(ne, sw)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	cursor, err := db.GetCollection(EventModel.CollectionName).
		Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	category := c.Query("category")
	title := c.Query("title")
	hideOnline := c.Query("hideOnline")
	hasLocation := c.Query("hasLocation")

	events := make([]serializers.GetEventSchema, 0)

	for _, result := range results {
		event := serializers.GetEventSchema{
			ID:       result["_id"].(primitive.ObjectID).Hex(),
			Title:    result["title"].(string),
			Online:   result["online"].(bool),
			Category: result["category"].(string),
			Start: result["start"].(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			End: result["end"].(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			Visibility: result["visibility"].(string),
		}

		// Find coordinates of the location if the event has one and check if
		// its within the bounds
		if val, exist := result["location"]; exist {
			event.Location, _ = val.(string)

			req := &maps.GeocodingRequest{
				Address: result["location"].(string),
			}

			coords, err := gmap.GetClient().Geocode(context.Background(), req)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": ResponseConstants.InternalServerErrorMessage,
				})

				return
			}

			if len(coords) > 0 {
				event.Lat = coords[0].Geometry.Location.Lat
				event.Lng = coords[0].Geometry.Location.Lng
				eventCoords := geolocation.Coords{
					Lat: event.Lat,
					Lng: event.Lng,
				}

				if !utils.WithinBounds(newBounds, eventCoords) {
					continue
				}
			} else {
				continue
			}
		}

		if !utils.FilteredEvent(
			&event,
			hideOnline == "true",
			hasLocation == "true",
			category,
			title,
			result["end"].(primitive.DateTime).Time(),
		) {
			continue
		}

		if val, exist := result["description"]; exist {
			event.Description, _ = val.(string)
		}

		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
	})
}

func GetLocationCoords(c *gin.Context) {
	input, exist := c.GetQuery("input")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	req := &maps.GeocodingRequest{
		Address: input,
	}

	coords, err := gmap.GetClient().Geocode(context.Background(), req)
	if err != nil || len(coords) < 1 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"lat": coords[0].Geometry.Location.Lat,
		"lng": coords[0].Geometry.Location.Lng,
	})
}

func GetLocationSuggestions(c *gin.Context) {
	req := &maps.PlaceAutocompleteRequest{
		Input: c.Query("input"),
	}

	locations, err := gmap.GetClient().PlaceAutocomplete(context.Background(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	var result []string
	for i := 0; i < len(locations.Predictions); i++ {
		result = append(result, locations.Predictions[i].Description)
	}

	c.JSON(http.StatusOK, gin.H{
		"locations": result,
	})
}

func GetUserCreatedEvents(c *gin.Context) {
	userID, _ := c.Get(AuthConstants.ContextAuthKey)
	filter := bson.M{"createdBy": userID}

	cursor, err := db.GetCollection(EventModel.CollectionName).
		Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidEventIDMessage,
		})

		return
	}

	var results []bson.M
	if err = cursor.All(context.Background(), &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": ResponseConstants.InternalServerErrorMessage,
		})

		return
	}

	events := make([]serializers.GetEventSchema, 0)

	for _, result := range results {
		event := serializers.GetEventSchema{
			ID:       result["_id"].(primitive.ObjectID).Hex(),
			Title:    result["title"].(string),
			Online:   result["online"].(bool),
			Category: result["category"].(string),
			Start: result["start"].(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			End: result["end"].(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			Visibility: result["visibility"].(string),
		}

		if time.Now().After(result["end"].(primitive.DateTime).Time()) {
			continue
		}

		if val, exist := result["location"]; exist {
			event.Location, _ = val.(string)
		}

		if val, exist := result["description"]; exist {
			event.Description, _ = val.(string)
		}

		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
	})
}
