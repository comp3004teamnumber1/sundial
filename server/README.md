# BACK END

## DEVELOPED BY NICOLAS EL-KHOURY

### DEPENDENCIES

- python3
  - requests
  - flask
 
### USAGE

run: `python3 server.py`

### DOCUMENTATION

#### GET:/daily

sends: json

output:

```
[
  {
    date: epoch_time:int,
    temp: {
      c: temp_celsius:int,
      f: temp_fahrenheit:int,
      k: temp_kelvin:int,
    },
    feels_like: {
      temp: {
        c: temp_celsius:int,
        f: temp_fahrenheit:int,
        k: temp_kelvin:int,
      },
    },
    pop: pop:int,
    humidity: humidity:int,
    weather_type: weather_description:str,
  },
  {
    ... array contains 7 more consecutive days with the same info, first one being today ...
  }
]
```

#### GET:/hourly

sends: json

output:

```
[
  {
    date: epoch_time:int,
    temp: {
      c: temp_celsius:int,
      f: temp_fahrenheit:int,
      k: temp_kelvin:int,
    },
    feels_like: {
      temp: {
        c: temp_celsius:int,
        f: temp_fahrenheit:int,
        k: temp_kelvin:int,
      },
    },
    pop: pop:int,
    humidity: humidity:int,
    weather_type: weather_description:str,
  },
  {
    ... array contains 23 more consecutive hours with the same info, first one being the current hour ...
  }
]
```
