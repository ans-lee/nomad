package utils

import (
	"errors"
	"fmt"
	"reflect"

	EventConstants "github.com/anslee/nomad/constants/event"
)

const ValidatorCategoryTag = "category"

func ValidateCategory(v interface{}, param string) error {
	field := reflect.ValueOf(v)
	if field.Kind() != reflect.String {
		return fmt.Errorf("%s only validates strings", ValidatorCategoryTag)
	}

	str := field.String()
	categories := []string{
		EventConstants.CategoryNone,
		EventConstants.CategoryArt,
		EventConstants.CategoryComedy,
		EventConstants.CategoryDrinks,
		EventConstants.CategoryFilm,
		EventConstants.CategoryFitness,
		EventConstants.CategoryFood,
		EventConstants.CategoryHealth,
		EventConstants.CategoryMusic,
		EventConstants.CategoryParty,
		EventConstants.CategoryShopping,
		EventConstants.CategoryTheatre,
		EventConstants.CategoryOther,
	}

	for i := 0; i < len(categories); i++ {
		if str == categories[i] {
			return nil
		}
	}

	return errors.New("value does not match an existing category")
}
