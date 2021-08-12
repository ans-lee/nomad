package serializers

type CreateEventSchema struct {
	Title       string `json:"title" binding:"required" validate:"min=1,max=255"`
	Location    string `json:"location" binding:"required" validate:"min=1,max=255"`
	Online      bool   `json:"online" binding:"required"`
	Description string `json:"description" validate:"min=1,max=512"`
	Category    string `json:"type" binding:"required" validate:"category"`
	Start       string `json:"start" binding:"required" validate:"datetime"`
	End         string `json:"end" binding:"required" validate:"datetime"`
	Reminder    string `json:"reminder" validate:"datetime"`
	Repeat      string `json:"repeat" binding:"required" validate:"regexp=^(none|day|week|month|year)$"`         // nolint:lll
	Visibility  string `json:"visibility" binding:"required" validate:"regexp=^(public|private|friends|group)$"` // nolint:lll
	GroupID     string `json:"groupID" binding:"required" validate:"regexp=^[a-fA-F0-9]{24}$"`
}
