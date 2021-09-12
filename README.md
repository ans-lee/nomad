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

The frontend was not bootstrapped with Create React App or any other toolchain. It is completely made
from scratch.

## Planned Features

Considering this project's codebase was worked on by just myself, some features had to be cut out in the
interests of polishing the product to achieve a MVP. Here were some of the features that were planned:

- Images for events (using object storage from Google or AWS)
- Mobile view
- Group system, similar to Facebook events
- End to end and unit testing
- Using Google Maps to pick an event's location

## Running the website

Requirements:

- Ubuntu or other Linux distros except WSL (tested only on Ubuntu 20.04 but should work with other versions and distros)
- Golang 1.16
- Node 16.7.0
- Yarn
- MongoDB
- A Google account with billing enabled

### Setup

1. Change into the `frontend` directory and run the below to install the frontend dependencies

```
yarn
```

2. Change into the `backend` directory and run the below to install the backend dependencies

```
go mod download
```

3. Make sure MongoDB is running on the machine if you are using it locally. If you can access
the MongoDB shell session using this command then MongoDB is running:

```
mongosh
```

4. On your Google Account, navigate to Google Cloud and enable Geocoding, Maps JavaScript and Places API
and generate a API key which has access to the APIs mentioned.

**NOTE:** Places API and Geocoding API does not have a free tier so you need to activate billing if you
aren't on a free trial to make it work.

5. Create a `.env` file in the `frontend` directory with the following details and replace `your_api_key`
and `your_mongodb_uri` with your Google API key and production API URL respectively
(You can use localhost for `PROD_API_URL` if you don't want to use it on production mode)

```
GOOGLE_API_KEY=your_api_key
DEV_API_URL=/api
PROD_API_URL=your_ip_address_or_domain/api
```

6. Create a `.env` file in the `backend` directory with the following details and replace `your_api_key`
and `your_mongodb_uri` with your Google API key and your MongoDB URI
(If you're using MongoDB locally, you can use `mongodb://localhost:27017` which is the default
URI. If it doesn't work, you may want to check whether the port number matches)

```
DB_NAME=nomad
DB_URI=your_mongodb_uri
GMAP_API_KEY=your_api_key
```

#### In Development Mode

1. Run the frontend development server while in the `frontend` directory by running the below

```
yarn dev
```

2. Run the backend development server while in the `backend` directory by running the below

```
bash run_server.sh
```

3. Visit http://localhost:8080/ to view the website

#### In Production Mode

1. Build the frontend by running the command below in the `frontend` directory

```
yarn build
```

2. Run the command below to start the frontend server in the `frontend` directory

```
node server.js
```

3. Run the backend development server while in the `backend` directory by running the below

```
bash run_server.sh production
```

4. Check the IP/domain name of the system that is running the servers on a browser
