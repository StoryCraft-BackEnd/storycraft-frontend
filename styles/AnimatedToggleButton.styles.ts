import { StyleSheet } from 'react-native';

export const animatedToggleButtonStyles = StyleSheet.create({
  // 애니메이션 컨테이너 - 위아래 움직임 애니메이션을 담당
  animatedContainer: {
    alignItems: 'center', // 자식 요소들을 가로축 중앙 정렬
    justifyContent: 'center', // 자식 요소들을 세로축 중앙 정렬
  },

  // 메인 버튼 컨테이너 - 터치 이벤트와 레이아웃 담당
  button: {
    width: 'auto', // 내용물 크기에 맞춰 자동 조정 (고정 크기 제거)
    height: 'auto', // 내용물 크기에 맞춰 자동 조정 (고정 크기 제거)
    backgroundColor: 'transparent', // 배경색 투명 (동그란 원 제거)
    alignItems: 'center', // 버튼 내부 요소들을 가로축 중앙 정렬
    justifyContent: 'center', // 버튼 내부 요소들을 세로축 중앙 정렬
  },

  // 활성 상태일 때 표시되는 텍스트 (예: 📖 아이콘)
  buttonText: {
    fontSize: 28, // 텍스트 크기 28px
    color: '#333', // 텍스트 색상 (진한 회색)
    fontWeight: 'bold', // 텍스트 굵기 (굵게)
    marginTop: 0, // 위아래 위치 조절 (양수: 아래로, 음수: 위로)
  },

  // 비활성 상태일 때 표시되는 별 이미지 (boxstar.png)
  starImage: {
    width: 38, // 이미지 너비 35px
    height: 38, // 이미지 높이 35px
    resizeMode: 'contain', // 이미지 비율 유지하며 컨테이너에 맞춤
    marginLeft: 5, // 오른쪽으로 21px 이동 (음수에서 양수로 변경)
    marginTop: 0, // 위아래 위치 조절 (양수: 아래로, 음수: 위로)
  },
});

export default animatedToggleButtonStyles;
