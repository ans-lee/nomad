package controllers

import (
	"context"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	AuthConstants "github.com/anslee/nomad/constants/auth"
	EventConstants "github.com/anslee/nomad/constants/event"
	ResponseConstants "github.com/anslee/nomad/constants/response"
	"github.com/anslee/nomad/db"
	EventModel "github.com/anslee/nomad/models/event"
	GroupModel "github.com/anslee/nomad/models/group"
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

	if data.GroupID != "" {
		groupID, groupErr := getGroupID(data.GroupID)
		if groupErr != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": ResponseConstants.InvalidGroupIDMessage,
			})

			return
		}

		if !utils.UserInGroup(userID.(primitive.ObjectID), groupID) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "You do not have permission to create an event on this group.",
			})

			return
		}

		if data.Visibility == EventConstants.VisibilityPublic && !groupIsPublic(groupID) {
			// Event is private if group is private
			newEvent.Visibility = EventConstants.VisibilityPrivate
		}

		newEvent.GroupID = groupID
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

	if !event.GroupID.IsZero() {
		userID, _ := c.Get(AuthConstants.ContextAuthKey)

		if !utils.UserInGroup(userID.(primitive.ObjectID), event.GroupID) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "You do not have permission to edit the event.",
			})

			return
		}

		if !groupIsPublic(event.GroupID) && data.Visibility != EventConstants.VisibilityPrivate {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Event can only be private if the group is private.",
			})

			return
		}
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

	if event.Visibility == EventConstants.VisibilityPrivate {
		userID, exists := c.Get(AuthConstants.ContextAuthKey)

		if !exists || !userCanAccessEvent(userID.(primitive.ObjectID), event.GroupID) {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "You do not have permission to view this event.",
			})

			return
		}
	}

	groupIDStr := ""
	if !event.GroupID.IsZero() {
		groupIDStr = event.GroupID.Hex()
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
		"groupID":     groupIDStr,
	})
}

func GetAllEvents(c *gin.Context) {
	filter := bson.M{"visibility": EventConstants.VisibilityPublic}
	/*
	category := c.Param("category")
	*/
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

	var events []serializers.GetEventSchema
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

		// Check if category matches
		if category != "" && category != EventConstants.CategoryNone && category != event.Category {
			continue
		} else if title != "" && !strings.Contains(strings.ToLower(event.Title), strings.ToLower(title)) {
			continue
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
					log.Println(event.Title)
					continue
				}
			} else {
				continue
			}
		}

		if val, exist := result["description"]; exist {
			event.Description = val.(string)
		}

		if val, exist := result["groupID"]; exist {
			event.GroupID = val.(primitive.ObjectID).Hex()
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

func groupIsPublic(groupID primitive.ObjectID) bool {
	var group GroupModel.Group

	filter := bson.M{"_id": groupID}

	err := db.GetCollection(GroupModel.CollectionName).
		FindOne(context.Background(), filter).
		Decode(&group)
	if err != nil {
		return false
	}

	return group.IsPublic
}

func userCanAccessEvent(userID, groupID primitive.ObjectID) bool {
	if groupID.IsZero() {
		return true
	}

	if !utils.UserInGroup(userID, groupID) {
		return false
	}

	return true
}

func withinBounds(x1, y1, x2, y2, pointX, pointY float64) bool {
	withinX := pointX > x1 && pointX < x2
	withinY := pointY > y1 && pointY < y2
	return withinX && withinY
}
