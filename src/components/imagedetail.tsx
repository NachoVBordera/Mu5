import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
const { width, height } = Dimensions.get("window");
import ImageModal from "react-native-image-modal";
interface Props {
  image: any;
  setModalVisible: (visible: boolean) => void;
}

const ImageDetail: React.FC<Props> = ({ image, setModalVisible }) => {
  return (
    <ImageModal
      onTap={() => setModalVisible(false)}
      resizeMode="contain"
      style={{
        width: 110,
        height: 110,
      }}
      source={{
        uri: image,
      }}
    />
  );
};

export default ImageDetail;
