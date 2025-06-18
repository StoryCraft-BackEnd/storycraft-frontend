import React from 'react';
import { View, Text } from 'react-native';
import styles from '@/styles/EventList.styles';

const dummyEvents = [
  { id: 1, title: '이벤트 1', period: '2024.02.15 - 2024.03.15' },
  { id: 2, title: '이벤트 2', period: '2024.03.01 - 2024.03.31' },
  { id: 3, title: '이벤트 3', period: '2024.03.10 - 2024.03.20' },
];

const EventList = () => (
  <View style={styles.listContainer}>
    {dummyEvents.map((event) => (
      <View key={event.id} style={styles.eventItem}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventPeriod}>{event.period}</Text>
      </View>
    ))}
  </View>
);

export default EventList;
