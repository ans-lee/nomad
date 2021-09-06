package serializers

type UpdateUserSchema struct {
	Email     string `json:"email" binding:"required" validate:"min=5,max=128,regexp=\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2\\,}\\b"` // nolint:lll
	FirstName string `json:"firstName" binding:"required" validate:"min=1,max=128"`
	LastName  string `json:"lastName" binding:"required" validate:"min=1,max=128"`
}
