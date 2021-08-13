package serializers

type CreateGroupMemberSchema struct {
	Name    string `json:"name" binding:"required" validate:"min=1,max=255"`
	Role    string `json:"role" binding:"required" validate:"regexp=^(member|moderator|owner)$"`
	UserID  string `json:"userID" binding:"required" validate:"len=24"`
	GroupID string `json:"groupID" binding:"required" validate:"len=24"`
}
