import React from 'react';
import { View, Text } from 'react-native';
import styles from '@/styles/FAQList.styles';

const dummyFAQs = [
  { id: 1, question: 'How do I track my order?' },
  { id: 2, question: 'What is the return policy?' },
  { id: 3, question: 'How can I contact customer service?' },
];

const FAQList = () => (
  <View style={styles.listContainer}>
    {dummyFAQs.map((faq) => (
      <View key={faq.id} style={styles.faqItem}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
      </View>
    ))}
  </View>
);

export default FAQList;
