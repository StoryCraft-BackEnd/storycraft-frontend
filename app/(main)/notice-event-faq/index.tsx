import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import NoticeList from './NoticeList';
import EventList from './EventList';
import FAQList from './FAQList';
import styles from '@/styles/NoticeEventFAQScreen.styles';
import nightBg from '@/assets/images/background/night-bg.png';
import BackButton from '@/components/ui/BackButton';

const TABS = [
  { key: 'notice', label: '공지사항' },
  { key: 'event', label: '이벤트' },
  { key: 'faq', label: 'FAQ' },
];

const NoticeEventFAQScreen = () => {
  const [activeTab, setActiveTab] = useState('notice');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notice':
        return <NoticeList />;
      case 'event':
        return <EventList />;
      case 'faq':
        return <FAQList />;
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={nightBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <BackButton />
          <View style={styles.tabContainerInHeader}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.contentInnerContainer}
          >
            {renderTabContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NoticeEventFAQScreen;
