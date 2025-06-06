import { StyleSheet } from 'react-native';

export const ProfileEditScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#222',
  },
  landscapeWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  profileLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#6b7280',
    marginBottom: 24,
  },
  profileRight: {
    flex: 2,
    padding: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    minWidth: 100,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
  },
});
