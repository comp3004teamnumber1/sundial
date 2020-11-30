# BACK END

## DEVELOPED BY NICOLAS EL-KHOURY

### DEPENDENCIES

- python3
  - pipenv
    - requests
    - flask
    - geopy
    - passlib
    - pytest

install the dependencies on Ubuntu 20.04 with the following command

- `sudo apt install python3 python3-pip`
- `sudo pip install pipenv`

everything *should* work with these installed

### SETUP & RUNNING

go to the server directory `$ cd /server`

download the dependencies: `$ pipenv install`

open the shell: `$ pipenv shell`

run the server: `$ python3 server.py`

run tests: `$ pytest`

### DOCUMENTATION

### SHORT USAGE GUIDE

- make a POST request to /register that sends the username and password to the server, once registered
- make a POST request to /login that sends a username and password to the server, you will be sent a session_key if it was successful
- take the session_key you are sent and put it in the headers as `Session-Key` of the GET routes you want to use along, ie
  - `/daily?location=Ottawa, Ontario`
  - `headers={"Session-Key": "str"}`

### POST: /register

PARAMS (JSON): `{"username": "str", "password": "str"}`

EXAMPLE: `{"username": "naek", "password": "naek_pass"}`

SENDS: JSON

OUTPUT:

```json
{
  "status": 200
}
```

### POST: /login

PARAMS (JSON): `{"username": "str", "password": "str"}`

EXAMPLE: `{"username": "naek", "password": "naek_pass"}`

SENDS: JSON

OUTPUT:

```json
{
  "status": 200,
  "session_key": "f44d6ca6-300d-403f-8710-35b52dc4f974"
}
```

#### GET: /daily

PARAMS (QUERY): `/daily?location=str&units=str`

- `location`: a location, a city, an address (required)
- `units`: metric or imperial, will give the temperature and wind speed in these (optional)
  - if nothing given, will be in metric

PARAMS (HEADERS): `{"Session-Key": "str"}`

- `Session-Key`: the authentication key given from `/login`

EXAMPLE: `/daily?location=Ottawa, Ontario`

SENDS: JSON

OUTPUT:

```json
{
  "days": [
    {
      "date": "epoch_time:int",
      "temp": "temp:int",
      "feels_like_temp": "temp:int",
      "pop": "pop:int",
      "wind_speed": "speed:float",
      "wind_deg": "deg:int",
      "humidity": "humidity:int",
      "weather_type": "weather_description:str",
      "uvi": "uv_index:float",
    },
    {
      "__comment": "array contains 7 more consecutive days with the same info, first one being today"
    }
  ]
}
```

#### GET: /hourly

PARAMS (QUERY): `/hourly?location=str&units=str`

- `location`: a location, a city, an address
- `units`: metric or imperial, will give the temperature and wind speed in these

PARAMS (HEADERS): `{"Session-Key": "str"}`

- `Session-Key`: the authentication key given from `/login`

EXAMPLE: `/hourly?location=Ottawa, Ontario`

SENDS: JSON

OUTPUT:

```json
{
  "hours": [
    {
      "date": "epoch_time:int",
      "temp": "temp:int",
      "feels_like_temp": "temp:int",
      "pop": "pop:int",
      "wind_speed": "speed:float",
      "wind_deg": "deg:int",
      "humidity": "humidity:int",
      "weather_type": "weather_description:str",
      "uvi": "uv_index:float",
    },
    {
      "__comment": "array contains 23 more consecutive hours with the same info, first one being the current hour"
    }
  ]
}
```

#### POST: /task

PARAMS (JSON): `{"task": "description:str", "date": "epoch_time:int", "ideal_weather": "weather_description:str", "location": "location:str"}`

- `location`: a location, a city, an address

PARAMS (HEADERS): `{"Session-Key": "str"}`

- `Session-Key`: the authentication key given from `/login`

EXAMPLE: `{"task": "Finish 3004", "date": 1604253175, "ideal_weather": "Clear", "location": "Ottawa, Ontario"}`

SENDS: JSON

OUTPUT:

```json
{
  "status": 200,
  "id": "uuid for the task"
}
```

#### POST: /task/<task_id>

NOTE: This will update the task with task_id as long as the Session-Key sent matches the username that created the task.

PARAMS (JSON): `{"task": "description:str", "date": "epoch_time:int", "ideal_weather": "weather_description:str", "location": "location:str"}`

- `location`: a location, a city, an address

PARAMS (HEADERS): `{"Session-Key": "str"}`

- `Session-Key`: the authentication key given from `/login`

EXAMPLE: `{"task": "Finish 3004", "date": 1604253175, "ideal_weather": "Clear", "location": "Ottawa, Ontario"}`

SENDS: JSON

OUTPUT:

```json
{
  "status": 200
}
```

#### DELETE: /task/<task_id>

NOTE: This will delete the task with the task_id if the Session-Key matches the username that created the taks.

PARAMS (HEADERS): `{"Session-Key": "str"}`

- `Session-Key`: the authentication key given from `/login`

SENDS: JSON

OUTPUT:

```json
{
  "status": 200
}
```

#### GET: /task

PARAMS (HEADERS): `{"Session-Key": "str"}`

SENDS: JSON

OUTPUT:

```json
{
  "tasks": [
    {
      "id": "uuid:str",
      "task": "description:str",
      "date": "epoch_time:int",
      "ideal_weather": "weather_description:str",
      "location": "location:str"
    },
    {
      "__comment": "array containing all the tasks for the user that requested them."
    }
  ]
}
```

#### GET: /consecutive

PARAMS (QUERY): `/consecutive?location=str&weather=str&time=str`

- `location`: a location, a city, an address
- `weather`: ideal weather
- `time`: how long the weather should last in days

PARAMS (HEADERS): `{"Session-Key": "str"}`

EXAMPLE: `/consecutive?location=Ottawa&weather=Clouds&time=2`

SENDS: JSON

200 - If it can find the consecutive days
204 - If it can't find the consecutive days

```json
{
  "start_date": "epoch_time:int",
  "days": [
    {
      "date": "epoch_time:int",
      "temp": "temp:int",
      "feels_like_temp": "temp:int",
      "pop": "pop:int",
      "wind_speed": "speed:float",
      "wind_deg": "deg:int",
      "humidity": "humidity:int",
      "weather_type": "weather_description:str",
      "uvi": "uv_index:float",
    },
    {
      "__comment": "array contains 7 more consecutive days with the same info, first one being today"
    }
  ],
  "status": "status:int"
}
```
#### POST: /password

Changes the users password.

PARAMS (HEADERS): `{"Session-Key": "str"}

PARAMS (JSON): `{"old_password": "str", "new_password": "str"}`

SENDS: JSON

OUTPUT:

```json
{"status": 200}
```

#### POST: /notification/day

PARAMS (HEADERS): `{"Session-Key": "str"}`

PARAMS (JSON): `{"date": "epoch_time:int", "ideal_weather": "ideal_weather:str", "location": "location:str", "offset": "offset:str"}`

SENDS: JSON

OUTPUT:

```json
{
  "notification_day_id": "uuid:str",
  "status": 200
}
```

#### GET: /notification/day

PARAMS (HEADERS): `{"Session-Key": "str"}

SENDS: JSON

OUTPUT:

```json
{
  "notification_days": [
    {
      "id": "uuid:str",
      "date": "epoch_time:int",
      "ideal_weather": "weather_description:str",
      "location": "location:str"
    },
    {
      "__comment": "more notification days in this array"
    }
  ],
  "status": 200
}
```

#### DELETE: /notification/day

PARAMS (HEADERS): `{"Session-Key": "str"}`

PARAMS(JSON): 

```json
{
  "notification_day_id": "uuid:str"
}
```

SENDS: JSON

OUTPUT:

```json
{"status": 200}
```
