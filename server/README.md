# BACK END

## DEVELOPED BY NICOLAS EL-KHOURY

### DEPENDENCIES

- python3
  - requests
  - flask

### USAGE

download the dependencies: `pipenv install`

open the shell: `pipenv shell`

run the server: `python3 server.py`

### DOCUMENTATION

### SHORT USAGE GUIDE
- make a POST request to /login that sends a username and password in a JSON
  - you will be sent a session_key if it was successful
- take the session_key you are sent and put it in the query string of the GET routes you want to use along with the username associated to the key
  - ie. /daily?username=naek&session_key=f44d6ca6-300d-403f-8710-35b52dc4f974

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

PARAMS (QUERY): `?username=str&session_key=str`
  - `username`: username of account
  - `session_key`: associated session_key of the username

EXAMPLE: /daily?username=naek&session_key=f44d6ca6-300d-403f-8710-35b52dc4f974

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

PARAMS (QUERY): `?username=str&session_key=str`
  - `username`: username of account
  - `session_key`: associated session_key of the username

EXAMPLE: /hourly?username=naek&session_key=f44d6ca6-300d-403f-8710-35b52dc4f974

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
