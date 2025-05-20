import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import { createShoppingList } from '@/utils/storage';

export default function CreateListScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [listName, setListName] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [currentItem, setCurrentItem] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    const trimmedItem = currentItem.trim().toLowerCase(); // Convert to lowercase for case-insensitive comparison
    if (trimmedItem) {
      if (items.some(item => item.toLowerCase() === trimmedItem)) {
        Alert.alert('Duplicate Item', 'This item is already in your list.');
        return;
      }

      if (editingIndex !== null) {
        const newItems = [...items];
        newItems[editingIndex] = currentItem.trim();
        setItems(newItems);
        setEditingIndex(null);
      } else {
        setItems([...items, currentItem.trim()]);
      }
      setCurrentItem('');
      inputRef.current?.blur();
    }
  };

  const handleEditItem = (index: number) => {
    setCurrentItem(items[index]);
    setEditingIndex(index);
    inputRef.current?.focus();
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentItem('');
    }
  };

  const handleSaveList = async () => {
    const trimmedListName = listName.trim();
    if (!trimmedListName) {
      Alert.alert('List Name Required', 'Please enter a name for your shopping list.');
      return;
    }

    if (trimmedListName.length > 50) {
      Alert.alert('List Name Too Long', 'Please enter a shorter name (maximum 50 characters).');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Empty List', 'Please add at least one item to your shopping list.');
      return;
    }

    try {
      setIsSaving(true);
      await createShoppingList(trimmedListName, items);
      Alert.alert('Success', 'Your shopping list has been saved!', [
        {
          text: 'OK',
          onPress: () => {
            setListName('');
            setItems([]);
            setCurrentItem('');
            setEditingIndex(null);
            router.push('/(tabs)/lists');
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving list:', error);
      Alert.alert('Error', 'Failed to save your shopping list. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Shopping List</Text>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.label}>List Name</Text>
          <TextInput
            style={styles.nameInput}
            value={listName}
            onChangeText={setListName}
            placeholder="Enter list name..."
            placeholderTextColor="#A7A7A7"
            maxLength={50}
          />
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.label}>Items</Text>
          <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={currentItem}
              onChangeText={setCurrentItem}
              placeholder={editingIndex !== null ? "Edit item..." : "Add an item..."}
              placeholderTextColor="#A7A7A7"
              onSubmitEditing={handleAddItem}
              blurOnSubmit={false}
              returnKeyType="done"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          
          <ScrollView style={styles.itemsList}>
            {items.map((item, index) => (
              <Animated.View
                key={`${item}-${index}`}
                style={styles.itemRow}
                entering={FadeInRight.springify().damping(15)}
                exiting={FadeOutRight.springify().damping(15)}
              >
                <TouchableOpacity
                  style={styles.itemTextContainer}
                  onPress={() => handleEditItem(index)}
                >
                  <Text style={[
                    styles.itemText,
                    editingIndex === index && styles.itemTextEditing
                  ]}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(index)}
                >
                  <X color="#FF3B30" size={20} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveList}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save List'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000000',
  },
  nameContainer: {
    marginBottom: 24,
  },
  itemsContainer: {
    flex: 1,
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  nameInput: {
    fontFamily: 'Inter-Regular',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#000000',
  },
  inputContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: '#0073FF',
    padding: 12, // Adjust padding to maintain same size with border
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
  itemsList: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
  },
  itemTextEditing: {
    color: '#0073FF',
  },
  removeButton: {
    padding: 4,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#0073FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0073FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#A7A7A7',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});