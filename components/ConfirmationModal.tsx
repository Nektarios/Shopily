import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = '#0073FF',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text
                    style={[
                      styles.confirmButtonText,
                      { color: confirmColor },
                    ]}
                  >
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  button: {
    padding: 12,
    minWidth: 100,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#FFEEEE',
    marginLeft: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8E8E93',
  },
  confirmButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});

export default ConfirmationModal;