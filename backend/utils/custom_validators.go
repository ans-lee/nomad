package utils

import (
	"errors"
	"fmt"
	"log"
	"reflect"
	"regexp"

	EventConstants "github.com/anslee/nomad/constants/event"
)

const (
	ValidatorDatetimeTag = "datetime"
	ValidatorCategoryTag = "category"
)

func ValidateRFC3339(v interface{}, param string) error {
	field := reflect.ValueOf(v)
	if field.Kind() != reflect.String {
		return fmt.Errorf("%s only validates strings", ValidatorDatetimeTag)
	}

	str := field.String()
	match, err := regexp.MatchString(
		"^\\d{4}-\\d{2}-\\d{2}T\\d{2}%3A\\d{2}%3A\\d{2}(?:%2E\\d+)?[A-Z]?(?:[+.-](?:08%3A\\d{2}|\\d{2}[A-Z]))?", // nolint: lll
		str,
	)

	if err != nil {
		log.Fatal("Could not use regexp!")
	}

	if !match {
		return errors.New("value is not in RFC3339 format")
	}

	return nil
}

func ValidateCategory(v interface{}, param string) error {
	field := reflect.ValueOf(v)
	if field.Kind() != reflect.String {
		return fmt.Errorf("%s only validates strings", ValidatorCategoryTag)
	}

	str := field.String()
	switch str {
	case EventConstants.CategoryNone:
	case EventConstants.CategoryArt:
	case EventConstants.CategoryComedy:
	case EventConstants.CategoryDrinks:
	case EventConstants.CategoryFilm:
	case EventConstants.CategoryFitness:
	case EventConstants.CategoryFood:
	case EventConstants.CategoryGardening:
	case EventConstants.CategoryHealth:
	case EventConstants.CategoryLiterature:
	case EventConstants.CategoryMusic:
	case EventConstants.CategoryNetworking:
	case EventConstants.CategoryParty:
	case EventConstants.CategoryReligion:
	case EventConstants.CategoryShopping:
	case EventConstants.CategoryTheatre:
	case EventConstants.CategoryOther:
		return nil
	default:
	}

	return errors.New("value does not match an existing category")
}
