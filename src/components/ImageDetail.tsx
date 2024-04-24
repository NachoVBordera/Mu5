import React from "react";
import { Image, TouchableOpacity } from "react-native";

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
