import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  setIsVisebleOptions: (isVisebleOptions: boolean) => void;
  isVisebleOptions: boolean;
  onDelete: () => void;
}

const PostOptionModal: React.FC<Props> = ({
  setIsVisebleOptions,
  isVisebleOptions,
  onDelete,
}) => {
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisebleOptions}
        onRequestClose={() => {
          setIsVisebleOptions(!isVisebleOptions);
        }}
      >
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.ModalLayout}>
            <TouchableOpacity
              onPress={() => {
                onDelete();
                setIsVisebleOptions(!isVisebleOptions);
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  ModalLayout: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default PostOptionModal;
