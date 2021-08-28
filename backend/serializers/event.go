package serializers

// TODO change visibility to boolean, remove repeat? maybe
type CreateEventSchema struct {
	Title       string `json:"title" binding:"required" validate:"min=1,max=255"`
	Location    string `json:"location" validate:"min=0,max=255"`
	Online      *bool  `json:"online" binding:"required"`
	Description string `json:"description" validate:"min=0,max=512"`
	Category    string `json:"category" binding:"required" validate:"category"`
	Start       string `json:"start" binding:"required"`
	End         string `json:"end" binding:"required"`
	Reminder    string `json:"reminder"`
	Repeat      string `json:"repeat" binding:"required" validate:"regexp=^(none|day|week|month|year)$"`   // nolint:lll
	Visibility  string `json:"visibility" binding:"required" validate:"regexp=^(public|private|friends)$"` // nolint:lll
	GroupID     string `json:"groupID" validate:"min=0,max=24"`
}

type EditEventSchema struct {
	Title       string `json:"title" binding:"required" validate:"min=1,max=255"`
	Location    string `json:"location" validate:"min=0,max=255"`
	Online      *bool  `json:"online" binding:"required"`
	Description string `json:"description" validate:"min=0,max=512"`
	Category    string `json:"category" binding:"required" validate:"category"`
	Start       string `json:"start" binding:"required"`
	End         string `json:"end" binding:"required"`
	Reminder    string `json:"reminder"`
	Repeat      string `json:"repeat" binding:"required" validate:"regexp=^(none|day|week|month|year)$"`   // nolint:lll
	Visibility  string `json:"visibility" binding:"required" validate:"regexp=^(public|private|friends)$"` // nolint:lll
}
