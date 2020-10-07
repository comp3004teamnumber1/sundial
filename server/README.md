# BACK END

## DEVELOPED BY NICOLAS EL-KHOURY

### DEPENDENCIES

- python3
  - requests
  - flask
 
### USAGE

run: `python3 server.py`

### DOCUMENTATION

#### /weekly

sends: json

output:

```json
[
  {
    date: epoch_time:int,
    temp: {
      c: temp_celsius:int,
      f: temp_fahrenheit:int,
      k: temp_kelvin:int
    },
    weather: weather_description:str
  },
  {
    ... array contains 7 more consecutive days with the same info, first one being today ...
  }
]
```