package event

import "go.mongodb.org/mongo-driver/bson/primitive"

const (
	VisibilityPublic  = iota
	VisibilityPrivate = iota
	VisibilityFriends = iota
	VisibilityGroup   = iota
)

const (
	CategoryNone       = iota
	CategoryArt        = iota
	CategoryComedy     = iota
	CategoryDrinks     = iota
	CategoryFilm       = iota
	CategoryFitness    = iota
	CategoryFood       = iota
	CategoryGardening  = iota
	CategoryHealth     = iota
	CategoryLiterature = iota
	CategoryMusic      = iota
	CategoryNetworking = iota
	CategoryParty      = iota
	CategoryReligion   = iota
	CategoryShopping   = iota
	CategoryTheatre    = iota
	CategoryOther      = iota
)

const CollectionName = "event"

type Event struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	Title       string             `bson:"title"`
	Location    string             `bson:"location"`
	Online      bool               `bson:"online"`
	Description string             `bson:"description"`
	Category    string             `bson:"type"`
	Start       primitive.DateTime `bson:"start"`
	End         primitive.DateTime `bson:"end"`
	Reminder    primitive.DateTime `bson:"reminder"`
	Repeat      int                `bson:"repeat"`
	Visibility  int                `bson:"visibility"`
	GroupID     primitive.ObjectID `bson:"groupID"`
	CreatedBy   primitive.ObjectID `bson:"createdBy"`
}

/*
	JSON Schemas
*/

type CreateEventSchema struct {
	Title       string `json:"title" binding:"required" validate:"min=1,max=255"`
	Location    string `json:"location" binding:"required" validate:"min=1,max=255"`
	Online      bool   `json:"online" binding:"required"`
	Description string `json:"description" validate:"min=1,max=512"`
	Category    int    `json:"type" binding:"required" validate:"min=0,max=16"`
	Start       string `json:"start" binding:"required"`
	End         string `json:"end" binding:"required"`
	Reminder    string `json:"reminder"`
	Repeat      int    `json:"repeat"`
	Visibility  int    `json:"visibility" binding:"required" validate:"min=0,max=3"`
	GroupID     string `json:"groupID" binding:"required"`
}
