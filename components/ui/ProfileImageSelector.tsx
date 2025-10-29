import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { PROFILE_IMAGE_OPTIONS, ProfileImageOption } from '../../types/ProfileImageTypes';

interface ProfileImageSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (imageId: string) => void;
  currentImageId?: string;
}

const ProfileImageSelector: React.FC<ProfileImageSelectorProps> = ({
  visible,
  onClose,
  onSelectImage,
  currentImageId,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const itemSize = Math.min(100, (screenWidth - 120) / 3); // 3개씩 배치

  const handleImageSelect = (imageId: string) => {
    onSelectImage(imageId);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>프로필 이미지 선택</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 이미지 그리드 */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.imageGrid}>
              {PROFILE_IMAGE_OPTIONS.map((option: ProfileImageOption) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.imageItem,
                    { width: itemSize, height: itemSize },
                    currentImageId === option.id && styles.selectedImageItem,
                  ]}
                  onPress={() => handleImageSelect(option.id)}
                >
                  <Image
                    source={option.source}
                    style={[styles.image, { width: itemSize - 20, height: itemSize - 20 }]}
                  />
                  <Text style={styles.imageName}>{option.name}</Text>
                  {currentImageId === option.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  scrollContainer: {
    maxHeight: 400,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  imageItem: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#F8F8F8',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedImageItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E8',
  },
  image: {
    borderRadius: 50,
    marginBottom: 8,
  },
  imageName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export default ProfileImageSelector;
