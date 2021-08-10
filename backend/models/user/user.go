package user

const CollectionName = "user"

type User struct {
	Email     string `json:"email" binding:"required" validate:"min=5,max=128,regexp=\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2\\,}\\b"` // nolint:lll
	Password  string `json:"password" binding:"required" validate:"min=8,max=128"`
	FirstName string `json:"first_name" binding:"required" validate:"min=1,max=128"`
	LastName  string `json:"last_name" binding:"required" validate:"min=1,max=128"`
}

type LogIn struct {
	Email    string `json:"email" binding:"required" validate:"min=1,max=128,regexp=\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2\\,}\\b"` // nolint:lll
	Password string `json:"password" binding:"required" validate:"min=1,max=128"`
}
