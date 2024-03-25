import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import ImageModal from "react-native-image-modal";
import ImageView from "react-native-image-viewing";
interface Props {
  image: any;
}

const ImageDetail: React.FC<Props> = ({ image }) => {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      {/* image contains */}
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
      >
        <Image
          source={{ uri: image }}
          style={{
            width: 120,
            height: 150,
          }}
        />
      </TouchableOpacity>
      <ImageView
        onRequestClose={() => setVisible(false)}
        visible={visible}
        images={[
          {
            uri: image,
          },
        ]}
        imageIndex={0}
      />
    </>
  );
};

export default ImageDetail;
