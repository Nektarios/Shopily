import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { getShoppingListById, deleteShoppingList, toggleItemCompletion, ShoppingList } from '@/utils/storage';
import { formatDate } from '@/utils/helpers';
import ListItem from '@/components/ListItem';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function ListDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    if (!id) {
      setError('No list ID provided');
      setLoading(false);
      return;
    }
    
    try {
      const data = await getShoppingListById(id);
      if (!data) {
        setError('Shopping list not found');
        return;
      }
      setList(data);
      setError(null);
    } catch (error) {
      console.error('Error loading list details:', error);
      setError('Failed to load shopping list details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleToggleComplete = async (itemId: string) => {
    if (!id) return;
    
    try {
      const updatedList = await toggleItemCompletion(id, itemId);
      if (updatedList) {
        setList(updatedList);
      }
    } catch (error) {
      console.error('Error toggling item completion:', error);
      Alert.alert('Error', 'Failed to update item status.');
    }
  };

  const handleDeleteList = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteShoppingList(id);
      router.replace('/(tabs)/lists');  // Navigate to lists tab after deletion
    } catch (error) {
      console.error('Error deleting list:', error);
      Alert.alert('Error', 'Failed to delete shopping list.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0073FF" />
      </SafeAreaView>
    );
  }

  if (error || !list) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error || 'Shopping list not found.'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft color="#0073FF" size={28} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.date}>
              Created on {formatDate(new Date(list.createdAt))}
            </Text>
            <Text style={styles.itemCount}>
              {list.items.filter((item: { completed: boolean }) => item.completed).length} of {list.items.length} items completed
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={isDeleting}
          >
            <Trash2 color="#FF3B30" size={22} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={list.items}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(index * 50)}>
              <ListItem 
                item={item}
                onToggleComplete={handleToggleComplete}
              />
            </Animated.View>
          )}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>This list has no items</Text>
            </View>
          }
        />
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete List"
        message="Are you sure you want to delete this shopping list?"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmColor="#FF3B30"
        onConfirm={handleDeleteList}
        onCancel={() => setShowDeleteModal(false)}
      />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#0073FF',
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#000000',
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
});