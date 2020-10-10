# BACK END

## DEVELOPED BY NICOLAS EL-KHOURY

### DEPENDENCIES

- python3
  - requests
  - flask

### USAGE

run: `python3 server.py`

### DOCUMENTATION

### POST: /login

PARAMS (JSON): username:str, password:str

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

PARAMS (QUERY): username:str, session_key:str

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
        "__comment": "... array contains 7 more consecutive days with the same info, first one being today ..."
      }
    ]
  ]
}
```

#### GET: /hourly

PARAMS (QUERY): username:str, session_key:str

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
        "__comment": "... array contains 23 more consecutive hours with the same info, first one being the current hour ..."
      }
    ]
  ]
}
```
