import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Container, Grid, Col, Row, Text } from 'native-base';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#231F29',
    minHeight: 300,
    maxHeight: 300,
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  colHeader: {
    flex: 1,
    flexShrink: 0,
    backgroundColor: '#332E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  col: {
    flex: 1,
    flexShrink: 0,
    maxWidth: 48,
    backgroundColor: '#332E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colSelected: {
    flex: 1,
    flexShrink: 0,
    maxWidth: 48,
    backgroundColor: '#FF8C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
  },
  textHeader: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
});

const headerDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarMonthView({ date, setDate }) {
  const momentObj = moment(date);
  let dayCount = 0;
  let weekCount = -1;
  const origOffset = moment(date).startOf('month').day();
  let offset = origOffset;
  const len = momentObj.daysInMonth();
  const today = momentObj.date();

  const renderMonth = () => {
    let month = [];
    while (dayCount < len) {
      month.push(renderWeek());
    }
    return month;
  };

  const handleDateChange = day => {
    const emittedDate = moment(date).date(day).toDate();
    setDate(emittedDate);
  };

  const renderWeek = () => {
    let week = [];
    for (let i = 0; i < 7; i++) {
      if (offset > 0 || dayCount >= len) {
        week.push(<Pressable style={styles.col} key={`offset${offset}`} />);
        offset -= 1;
      } else {
        let calendarDay = dayCount + 1;
        week.push(
          <Pressable
            style={calendarDay === today ? styles.colSelected : styles.col}
            key={`day${dayCount}`}
            onPress={() => {
              handleDateChange(calendarDay);
            }}
          >
            <Text style={styles.text}>{calendarDay}</Text>
          </Pressable>
        );
        dayCount += 1;
      }
    }
    weekCount += 1;
    return (
      <Row style={styles.row} key={`week${weekCount}`}>
        {week}
      </Row>
    );
  };

  return (
    <Container style={styles.container}>
      <Grid>
        <Row style={styles.row}>
          {headerDays.map(day => {
            return (
              <Col style={styles.colHeader} key={day}>
                <Text style={styles.textHeader}>{day}</Text>
              </Col>
            );
          })}
        </Row>
        {renderMonth()}
      </Grid>
    </Container>
  );
}
