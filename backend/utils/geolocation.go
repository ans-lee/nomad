package utils

import (
	"strconv"
	"strings"

	"github.com/anslee/nomad/models/geolocation"
)

func GetBounds(neStr, swStr string) (geolocation.Bounds, error) {
	newBounds := geolocation.Bounds{}
	var err error

	newBounds.NeLat, err = strconv.ParseFloat(strings.Split(neStr, ",")[0], 64)
	if err != nil {
		return newBounds, err
	}

	newBounds.NeLng, err = strconv.ParseFloat(strings.Split(neStr, ",")[1], 64)
	if err != nil {
		return newBounds, err
	}

	newBounds.SwLat, err = strconv.ParseFloat(strings.Split(swStr, ",")[0], 64)
	if err != nil {
		return newBounds, err
	}

	newBounds.SwLng, err = strconv.ParseFloat(strings.Split(swStr, ",")[1], 64)
	if err != nil {
		return newBounds, err
	}

	return newBounds, nil
}

func WithinBounds(bounds geolocation.Bounds, coords geolocation.Coords) bool {
	// If all bounds are 0
	if bounds.NeLat + bounds.NeLng + bounds.SwLat + bounds.SwLng == 0 {
		return true
	}

	withinX := coords.Lng > bounds.SwLng && coords.Lng < bounds.NeLng
	withinY := coords.Lat > bounds.SwLat && coords.Lat < bounds.NeLat
	return withinX && withinY
}
