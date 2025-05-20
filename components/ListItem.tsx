import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag, Check } from 'lucide-react-native';
import { ShoppingListItem } from '@/utils/storage';

type ListItemProps = {
  item: ShoppingListItem;
  onToggleComplete: (itemId: string) => void;
};

const ListItem = ({ item, onToggleComplete }: ListItemProps) => {
  return (
    <View style={[styles.container, item.completed && styles.containerCompleted]}>
      <TouchableOpacity
        onPress={() => onToggleComplete(item.id)}
        style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
      >
        {item.completed && <Check size={16} color="#FFFFFF" />}
      </TouchableOpacity>
      
      <ShoppingBag 
        color={item.completed ? "#A7A7A7" : "#0073FF"} 
        size={20} 
        style={styles.icon} 
      />
      
      <Text 
        style={[styles.text, item.completed && styles.textCompleted]} 
        numberOfLines={2}
      >
        {item.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  containerCompleted: {
    opacity: 0.8,
    backgroundColor: '#F2F2F7',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#0073FF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#0073FF',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  textCompleted: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
});

export default ListItem;