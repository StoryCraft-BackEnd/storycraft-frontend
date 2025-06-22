import React from 'react';
import { View, Text } from 'react-native';
import styles from '@/styles/NoticeList.styles';

const dummyNotices = [
  { id: 1, title: '공지사항 1', date: '2024.01.01' },
  { id: 2, title: '공지사항 2', date: '2023.12.20' },
  { id: 3, title: '공지사항 3', date: '2023.12.10' },
];

const NoticeList = () => (
  <View style={styles.listContainer}>
    {dummyNotices.map((notice) => (
      <View key={notice.id} style={styles.noticeItem}>
        <Text style={styles.noticeTitle}>{notice.title}</Text>
        <Text style={styles.noticeDate}>{notice.date}</Text>
      </View>
    ))}
  </View>
);

export default NoticeList;
