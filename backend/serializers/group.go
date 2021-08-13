package serializers

type CreateGroupSchema struct {
	Name        string `json:"name" binding:"required" validate:"min=1,max=255"`
	Description string `json:"description" validate:"min=0,max=512"`
	IsPublic    *bool  `json:"isPublic" binding:"required"`
}
