import { StyleSheet } from 'react-native';

export const TermsAgreementStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0a7ea4',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
  required: {
    color: '#FF3B30',
  },
  termsPreview: {
    marginTop: 20,
    marginBottom: 40,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  termsContent: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  agreeButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  declineButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 14,
  },
  termsLink: {
    color: '#0a7ea4',
    textDecorationLine: 'underline',
  },
  ageNotice: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
});
