import AsyncStorage from '@react-native-async-storage/async-storage';

export type ShoppingListItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: number;
};

const STORAGE_KEY = 'shopping_lists';

export const getShoppingLists = async (): Promise<ShoppingList[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving shopping lists:', error);
    return [];
  }
};

export const getShoppingListById = async (id: string): Promise<ShoppingList | null> => {
  try {
    const lists = await getShoppingLists();
    return lists.find(list => list.id === id) || null;
  } catch (error) {
    console.error('Error retrieving shopping list:', error);
    return null;
  }
};

export const createShoppingList = async (name: string, itemTexts: string[]): Promise<ShoppingList | null> => {
  try {
    const lists = await getShoppingLists();
    
    const items: ShoppingListItem[] = itemTexts.map(text => ({
      id: Math.random().toString(36).substring(2, 9),
      text,
      completed: false
    }));
    
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items,
      createdAt: Date.now(),
    };
    
    const updatedLists = [...lists, newList];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    
    return newList;
  } catch (error) {
    console.error('Error creating shopping list:', error);
    return null;
  }
};

export const deleteShoppingList = async (id: string): Promise<boolean> => {
  try {
    const lists = await getShoppingLists();
    const updatedLists = lists.filter(list => list.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
    return true;
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    return false;
  }
};

export const updateShoppingList = async (
  id: string,
  data: { name?: string; items?: ShoppingListItem[] }
): Promise<ShoppingList | null> => {
  try {
    const lists = await getShoppingLists();
    const index = lists.findIndex(list => list.id === id);
    
    if (index === -1) return null;
    
    const updatedList = {
      ...lists[index],
      ...data,
    };
    
    lists[index] = updatedList;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    
    return updatedList;
  } catch (error) {
    console.error('Error updating shopping list:', error);
    return null;
  }
};

export const toggleItemCompletion = async (
  listId: string,
  itemId: string
): Promise<ShoppingList | null> => {
  try {
    const list = await getShoppingListById(listId);
    if (!list) return null;
    
    const updatedItems = list.items.map(item => 
      item.id === itemId 
        ? { ...item, completed: !item.completed }
        : item
    );
    
    return updateShoppingList(listId, { items: updatedItems });
  } catch (error) {
    console.error('Error toggling item completion:', error);
    return null;
  }
};