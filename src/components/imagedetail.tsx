import { BlurView } from "@react-native-community/blur";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
const { width, height } = Dimensions.get("window");
interface Props {
  image: any;
  setModalVisible: (visible: boolean) => void;
}

const ImageDetail: React.FC<Props> = ({ image, setModalVisible }) => {
  const navegation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => setModalVisible(false)}
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(52, 52, 52, 0.8)",
      }}
    >
      <Image source={{ uri: image }} style={{ width: 360, height: 360 }} />
    </TouchableOpacity>
  );
};

export default ImageDetail;
