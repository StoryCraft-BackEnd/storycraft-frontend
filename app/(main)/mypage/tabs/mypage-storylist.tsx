import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import nightBg from '../../../../assets/images/background/night-bg.png';
import styles from '../../../../styles/StoryListTabScreen.styles';

const TABS = [
  { key: 'all', label: '전체 동화', iconName: 'book-outline' as const },
  { key: 'bookmark', label: '북마크', iconName: 'bookmark-outline' as const },
  { key: 'like', label: '좋아요', iconName: 'heart-outline' as const },
];

const DUMMY_STORIES = [
  {
    id: '1',
    title: '마법의 용과 공주님',
    date: '2024-01-15',
    tags: ['dragon', 'princess', 'castle'],
    summary: 'Once upon a time, there was a brave princess who met a friendly dragon...',
  },
  {
    id: '2',
    title: '숲 속의 요정 친구들',
    date: '2024-01-14',
    tags: ['fairy', 'forest', 'friendship'],
    summary: 'In a magical forest, little fairies lived together in harmony...',
  },
  {
    id: '3',
    title: '별빛 모험',
    date: '2024-01-13',
    tags: ['star', 'adventure', 'night'],
    summary: 'On a starry night, a young explorer discovered a magical path...',
  },
];

export default function StoryListScreen() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <ImageBackground source={nightBg} style={styles.bg} resizeMode="cover">
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && styles.activeTabBtn]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={tab.iconName}
                size={18}
                color={isActive ? '#fff' : '#b3b3ff'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <FlatList
        data={DUMMY_STORIES}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.tagRow}>
              {item.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.summary}>{item.summary}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>읽기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="share-social-outline" size={22} color="#B6AFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="delete-outline" size={22} color="#B6AFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ImageBackground>
  );
}
