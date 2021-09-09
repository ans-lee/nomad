package serializers

type CreateEventSchema struct {
	Title       string `json:"title" binding:"required" validate:"min=1,max=255"`
	Location    string `json:"location" validate:"min=0,max=255"`
	Online      *bool  `json:"online" binding:"required"`
	Description string `json:"description" validate:"min=0,max=20000"`
	Category    string `json:"category" binding:"required" validate:"category"`
	Start       string `json:"start" binding:"required"`
	End         string `json:"end" binding:"required"`
	Visibility  string `json:"visibility" binding:"required" validate:"regexp=^(public|private)$"` // nolint:lll
	GroupID     string `json:"groupID" validate:"min=0,max=24"`
}

type EditEventSchema struct {
	Title       string `json:"title" binding:"required" validate:"min=1,max=255"`
	Location    string `json:"location" validate:"min=0,max=255"`
	Online      *bool  `json:"online" binding:"required"`
	Description string `json:"description" validate:"min=0,max=20000"`
	Category    string `json:"category" binding:"required" validate:"category"`
	Start       string `json:"start" binding:"required"`
	End         string `json:"end" binding:"required"`
	Visibility  string `json:"visibility" binding:"required" validate:"regexp=^(public|private|friends)$"` // nolint:lll
}

type GetEventSchema struct {
	ID 			string `json:"id"`
	Title       string `json:"title"`
	Location    string `json:"location"`
	Lat         float64 `json:"lat"`
	Lng         float64 `json:"lng"`
	Online      bool   `json:"online"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Start       string `json:"start"`
	End         string `json:"end"`
	Visibility  string `json:"visibility"`
	GroupID     string `json:"groupID"`
}

type EventCoordsSchema struct {
	ID 			string  `json:"id"`
	Title       string  `json:"title"`
	Category    string  `json:"category"`
	Lat         float64 `json:"lat"`
	Lng         float64 `json:"lng"`
}
