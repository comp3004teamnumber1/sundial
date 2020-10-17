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
- take the session_key you are sent and put it in the headers as `session_key` of the GET routes you want to use along, ie
  - `/daily?location=Ottawa, Ontario`
  - `headers={"session_key": "str"}`

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

PARAMS (QUERY): `/daily?location=str`
  - `location`: a location, a city, an address

PARAMS (HEADERS): `{"session_key": "str"}`
  - `session_key`: the authentication key given from `/login`

EXAMPLE: `/daily?location=Ottawa, Ontario`

SENDS: JSON

OUTPUT:

```json
{
  "days": [
    [
      {
        "date": "epoch_time:int",
        "temp": {
          "c": "temp_celsius:int",
          "f": "temp_fahrenheit:int",
          "k": "temp_kelvin:int",
        },
        "feels_like": {
          "temp": {
            "c": "temp_celsius:int",
            "f": "temp_fahrenheit:int",
            "k": "temp_kelvin:int",
          },
        },
        "pop": "pop:int",
        "humidity": "humidity:int",
        "weather_type": "weather_description:str",
      },
      {
        "__comment": "array contains 7 more consecutive days with the same info, first one being today"
      }
    ]
  ]
}
```

#### GET: /hourly

PARAMS (QUERY): `/hourly?location=str`
  - `location`: a location, a city, an address

PARAMS (HEADERS): `{"session_key": "str"}`
  - `session_key`: the authentication key given from `/login`

EXAMPLE: `/hourly?location=Ottawa, Ontario`

SENDS: JSON

OUTPUT:

```json
{
  "hours": [
    [
      {
        "date": "epoch_time:int",
        "temp": {
          "c": "temp_celsius:int",
          "f": "temp_fahrenheit:int",
          "k": "temp_kelvin:int",
        },
        "feels_like": {
          "temp": {
            "c": "temp_celsius:int",
            "f": "temp_fahrenheit:int",
            "k": "temp_kelvin:int",
          },
        },
        "pop": "pop:int",
        "humidity": "humidity:int",
        "weather_type": "weather_description:str",
      },
      {
        "__comment": "array contains 23 more consecutive hours with the same info, first one being the current hour"
      }
    ]
  ]
}
```
