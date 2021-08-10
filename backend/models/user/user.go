package user

const COLLECTION_NAME = "user"

type User struct {
    Username string `json:"username" validate:"min=1,max=16,regexp=^[a-zA-Z]*$"`
    Password string `json:"password" validate:"min=8,max=128"`
    Email string `json:"email" validate:"min=5,max=128,regexp=^\\S+@\\S+$"`
    FirstName string `json:"first_name" validate:"min:1,max=128"`
    LastName string `json:"last_name" validate:"min:1,max=128"`
}
