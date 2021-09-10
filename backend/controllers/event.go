package controllers

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	EventConstants "github.com/anslee/nomad/constants/event"
	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	EventModel "github.com/anslee/nomad/models/event"
	"github.com/anslee/nomad/serializers"
	"github.com/anslee/nomad/service/gmap"
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

//TODO check whether user was the person who created the event
func EditEvent(c *gin.Context) {
	var data serializers.EditEventSchema
	if c.ShouldBindJSON(&data) != nil || validator.Validate(data) != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": ResponseConstants.InvalidJSONPayloadMessage,
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
	filter := bson.M{"visibility": EventConstants.VisibilityPublic}
	var neLat float64
	var neLng float64
	var swLat float64
	var swLng float64
	var err error

	if ne, exist := c.GetQuery("ne"); exist {
		neLat, err = strconv.ParseFloat(strings.Split(ne, ",")[0], 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": ResponseConstants.InternalServerErrorMessage,
			})

			return
		}

		neLng, err = strconv.ParseFloat(strings.Split(ne, ",")[1], 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": ResponseConstants.InternalServerErrorMessage,
			})

			return
		}
	}

	if sw, exist := c.GetQuery("sw"); exist {
		swLat, err = strconv.ParseFloat(strings.Split(sw, ",")[0], 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": ResponseConstants.InternalServerErrorMessage,
			})

			return
		}

		swLng, err = strconv.ParseFloat(strings.Split(sw, ",")[1], 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": ResponseConstants.InternalServerErrorMessage,
			})

			return
		}
	}

	category := c.Query("category")
	title := c.Query("title")
	hideOnline := c.Query("hideOnline")
	hasLocation := c.Query("hasLocation")

	cursor, err := db.GetCollection(EventModel.CollectionName).
		Find(context.Background(), filter)
	// TODO check whether no events returns error or not
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
			ID: result["_id"].(primitive.ObjectID).Hex(),
			Title: result["title"].(string),
			Online: result["online"].(bool),
			Category: result["category"].(string),
			Start: result["start"].
				(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			End: result["end"].
				(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			Visibility: result["visibility"].(string),
		}

		if val, exist := result["location"]; exist {
			event.Location = val.(string)
			req := &maps.GeocodingRequest{
				Address: result["location"].(string),
			}

			coords, err := gmap.GetClient().Geocode(context.Background(), req)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error": ResponseConstants.InternalServerErrorMessage,
				})
			}

			if (len(coords) > 0) {
				event.Lat = coords[0].Geometry.Location.Lat
				event.Lng = coords[0].Geometry.Location.Lng

				if !withinBounds(swLng, swLat, neLng, neLat, event.Lng, event.Lat) {
					continue
				}
			} else {
				continue
			}
		}

		// Filtering
		if hideOnline == "true" && event.Online {
			continue
		} else if hasLocation == "true" && event.Location == "" {
			continue
		} else if category != "" && category != EventConstants.CategoryNone && category != event.Category {
			continue
		} else if title != "" && !strings.Contains(strings.ToLower(event.Title), strings.ToLower(title)) {
			continue
		} else if time.Now().After(result["end"].(primitive.DateTime).Time()) {
			continue
		}

		if val, exist := result["description"]; exist {
			event.Description = val.(string)
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
	// TODO check whether no events returns error or not
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
			ID: result["_id"].(primitive.ObjectID).Hex(),
			Title: result["title"].(string),
			Online: result["online"].(bool),
			Category: result["category"].(string),
			Start: result["start"].
				(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			End: result["end"].
				(primitive.DateTime).
				Time().
				UTC().
				Format(time.RFC3339),
			Visibility: result["visibility"].(string),
		}

		if time.Now().After(result["end"].(primitive.DateTime).Time()) {
			continue
		}

		if val, exist := result["location"]; exist {
			event.Location = val.(string)
		}

		if val, exist := result["description"]; exist {
			event.Description = val.(string)
		}

		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
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

	start = time.Date(
		start.Year(),
		start.Month(),
		start.Day(),
		start.Hour(),
		start.Minute(),
		0,
		0,
		start.Location(),
	)
	end = time.Date(
		end.Year(),
		end.Month(),
		end.Day(),
		end.Hour(),
		end.Minute(),
		0,
		0,
		end.Location(),
	)

	return start, end, ""
}

func withinBounds(x1, y1, x2, y2, pointX, pointY float64) bool {
	// If all bounds are 0
	if (x1 + y1 + x2 + y2 == 0) {
		return true
	}

	withinX := pointX > x1 && pointX < x2
	withinY := pointY > y1 && pointY < y2
	return withinX && withinY
}
