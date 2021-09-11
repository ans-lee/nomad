![Nomad Logo](frontend/src/assets/logo/logo.png)

# Nomad

Visit the website: https://nomadexplore.xyz

Nomad is a webapp that provides users with an interface to find events upcoming, either in person
or online as well as allowing users to create events for others to participate. This features
a map displaying upcoming events in a similar fashion to finding places to rent on Airbnb.

## Features

- Sign Up and Login
- Log Out
- Viewing events on a map
- Viewing events without the map
- Creating events
- Editing events
- Deleting events
- Editing user details

## Using the website

Simply visit the website [here](https://nomadexplore.xyz) and click on "Find Events" on the header to
find upcoming events. You can drag around the map to check other areas for events or use the filters
to search for specific events or jump to a location on the map. To view all of an event's details, either
click the marker or click on one of the items on the events list underneath the filters.

Additionally you can create an event. However, you must first sign up with your name, email and password.
There is no email verification to keep things simple so you can use whatever email you wish.

After signing up and logging in, you can create an event by clicking on "Create Events" on the header,
which will present a form for you to enter the details of the event. If you entered a location for this
event, it will show up on the map at that specific location.

In case you want to edit or delete your event, you can do that by clicking "My Profile" when logged in and then
click on "Created Events" on the sidebar on the left. This will show you all the events you have created
and by clicking on one of them, you will see the event's details but also an "Edit" or "Delete" button
if you are the creator of the event. Clicking "Delete" will delete the event permanently, while "Edit"
will take you to a form that looks similar to when creating an event. Simply change the details as you would
when creating an event and click "Edit Event" to save the new details.

On the page redirected by the "My Profile" button earlier, you can also change your details there in
case you made a mistake when signing up.

**NOTE:** For events where their end date and time past, they will no longer show up on the map or in your
Created Events page. This is not a bug.

## Technology

This project uses React with Typescript for the frontend, and Golang with Gin Gonic Web Framework for
the backend REST API.

Here's a list of most of the technology used:

- React with Typescript
- Golang with Gin Gonic Web Framework
- MongoDB
- Google Maps API
- Google Places API
- Google Geocoding API

## Planned Features

Considering this project's codebase was worked on by just myself, some features had to be cut out in the
interests of polishing the product to achieve a MVP. Here were some of the features that were planned:

- Images for events
- Group system, similar to Facebook events
- End to end and unit testing
- Using Google Maps to pick an event's location
