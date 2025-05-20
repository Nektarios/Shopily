import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatDate } from '@/utils/helpers';
import { getShoppingLists, ShoppingList } from '@/utils/storage';

export default function ListsScreen() {
  const router = useRouter();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLists = useCallback(async () => {
    try {
      const savedLists = await getShoppingLists();
      setLists(savedLists.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Failed to load shopping lists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLists();
  }, [loadLists]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleListPress = (id: string) => {
    router.push(`/list-details?id=${id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0073FF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Shopping Lists</Text>
      </View>

      {lists.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No shopping lists yet</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.createButtonText}>Create New List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listCard}
              onPress={() => handleListPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.listInfo}>
                <Text style={styles.listName}>{item.name}</Text>
                <Text style={styles.listDate}>
                  {formatDate(new Date(item.createdAt))}
                </Text>
                <Text style={styles.listItemCount}>
                  {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0073FF']} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#0073FF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  createButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  listCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  listDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  listItemCount: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0073FF',
  },
});