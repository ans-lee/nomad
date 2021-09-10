package utils

import (
	"strings"
	"time"

	EventConstants "github.com/anslee/nomad/constants/event"
	"github.com/anslee/nomad/serializers"
)

func GetStartEndTimes(startStr, endStr string) (start, end time.Time, errStr string) {
	start, err := time.Parse(time.RFC3339, startStr)
	if err != nil {
		return start, start, "Start time must be in RFC3339 format."
	}

	end, err = time.Parse(time.RFC3339, endStr)
	if err != nil {
		return start, end, "End time must be in RFC3339 format."
	}

	if start.After(end) {
		return start, end, "Start time cannot be after the end time."
	}

	start = time.Date(
		start.Year(),
		start.Month(),
		start.Day(),
		start.Hour(),
		start.Minute(),
		0,
		0,
		start.Location(),
	)
	end = time.Date(
		end.Year(),
		end.Month(),
		end.Day(),
		end.Hour(),
		end.Minute(),
		0,
		0,
		end.Location(),
	)

	return start, end, ""
}

func FilteredEvent(
	event serializers.GetEventSchema,
	hideOnline, hasLocation bool,
	category, title string,
	endTime time.Time,
) bool {
	if hideOnline && event.Online {
		return false
	} else if hasLocation && event.Location == "" {
		return false
	} else if category != "" && category != EventConstants.CategoryNone && category != event.Category {
		return false
	} else if title != "" && !strings.Contains(strings.ToLower(event.Title), strings.ToLower(title)) {
		return false
	} else if time.Now().After(endTime) {
		return false
	}
	return true
}
