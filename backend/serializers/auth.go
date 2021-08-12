package serializers

type SignUpSchema struct {
	Email     string `json:"email" binding:"required" validate:"min=5,max=128,regexp=\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2\\,}\\b"` // nolint:lll
	Password  string `json:"password" binding:"required" validate:"min=8,max=128"`
	FirstName string `json:"firstName" binding:"required" validate:"min=1,max=128"`
	LastName  string `json:"lastName" binding:"required" validate:"min=1,max=128"`
}

type LogInSchema struct {
	Email    string `json:"email" binding:"required" validate:"min=1,max=128,regexp=\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2\\,}\\b"` // nolint:lll
	Password string `json:"password" binding:"required" validate:"min=1,max=128"`
}
