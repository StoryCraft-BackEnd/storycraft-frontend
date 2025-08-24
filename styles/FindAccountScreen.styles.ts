import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const findAccountScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('6%'), // 24px -> 6% of screen width
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: hp('2%'), // 16px -> 2% of screen height
    color: '#222',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'), // 16px -> 2% of screen height
  },
  smallButton: {
    borderWidth: 1,
    borderRadius: wp('5%'), // 20px -> 5% of screen width
    paddingHorizontal: wp('4%'), // 16px -> 4% of screen width
    paddingVertical: hp('0.75%'), // 6px -> 0.75% of screen height
  },
  smallButtonMarginLeft: {
    marginLeft: wp('2%'), // 8px -> 2% of screen width
  },
  mainButton: {
    borderRadius: wp('7.5%'), // 30px -> 7.5% of screen width
    padding: wp('4%'), // 16px -> 4% of screen width
    alignItems: 'center',
    marginTop: hp('2%'), // 16px -> 2% of screen height
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('4%'), // 16px -> 4% of screen width
  },
});
