
import { v4 as uuidv4 } from 'uuid';
import { Chat, Message, MessageRole } from '@/types/chat';

// LocalStorage keys
const CHATS_STORAGE_KEY = 'medzen-chats';
const ACTIVE_CHAT_ID_KEY = 'medzen-active-chat-id';

// Create a new chat
export function createChat(title: string = 'New Chat'): Chat {
  const id = uuidv4();
  const now = new Date();
  
  const newChat: Chat = {
    id,
    title,
    messages: [],
    createdAt: now,
    updatedAt: now
  };
  
  // Save to localStorage
  const existingChats = getChats();
  const updatedChats = [...existingChats, newChat];
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
  localStorage.setItem(ACTIVE_CHAT_ID_KEY, id);
  
  return newChat;
}

// Get all chats
export function getChats(): Chat[] {
  const chatsJson = localStorage.getItem(CHATS_STORAGE_KEY);
  if (!chatsJson) return [];
  
  try {
    const chats = JSON.parse(chatsJson) as Chat[];
    // Convert string dates to Date objects
    return chats.map(chat => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt)
      }))
    }));
  } catch (error) {
    console.error('Error parsing chats from localStorage:', error);
    return [];
  }
}

// Get active chat
export function getActiveChat(): Chat | null {
  const activeChatId = localStorage.getItem(ACTIVE_CHAT_ID_KEY);
  if (!activeChatId) return null;
  
  const chats = getChats();
  return chats.find(chat => chat.id === activeChatId) || null;
}

// Set active chat
export function setActiveChat(chatId: string): Chat | null {
  localStorage.setItem(ACTIVE_CHAT_ID_KEY, chatId);
  
  const chats = getChats();
  return chats.find(chat => chat.id === chatId) || null;
}

// Add message to chat
export function addMessage(chatId: string, content: string, role: MessageRole): Chat | null {
  const chats = getChats();
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) return null;
  
  const updatedChat = { ...chats[chatIndex] };
  const now = new Date();
  
  const newMessage: Message = {
    id: uuidv4(),
    content,
    role,
    createdAt: now
  };
  
  updatedChat.messages = [...updatedChat.messages, newMessage];
  updatedChat.updatedAt = now;
  
  // If it's the first user message, update the title
  if (role === 'user' && updatedChat.messages.filter(m => m.role === 'user').length === 1) {
    updatedChat.title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
  }
  
  chats[chatIndex] = updatedChat;
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  
  return updatedChat;
}

// Delete a chat
export function deleteChat(chatId: string): boolean {
  const chats = getChats();
  const updatedChats = chats.filter(chat => chat.id !== chatId);
  
  if (updatedChats.length === chats.length) return false;
  
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
  
  // If active chat was deleted, set a new active chat or null
  const activeChatId = localStorage.getItem(ACTIVE_CHAT_ID_KEY);
  if (activeChatId === chatId) {
    if (updatedChats.length > 0) {
      localStorage.setItem(ACTIVE_CHAT_ID_KEY, updatedChats[0].id);
    } else {
      localStorage.removeItem(ACTIVE_CHAT_ID_KEY);
    }
  }
  
  return true;
}

// Mock AI response generator
export async function generateAIResponse(messages: Message[]): Promise<string> {
  // In a real implementation, this would call the Groq API
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
      
      // Simple response logic based on keywords
      if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi')) {
        resolve("Hello! I'm your AI health assistant. How can I help you today?");
      } 
      else if (lastUserMessage.includes('symptom') || lastUserMessage.includes('pain')) {
        resolve("I notice you're mentioning symptoms. Could you describe what you're experiencing in more detail? Remember, I can provide information but not medical diagnoses.");
      }
      else if (lastUserMessage.includes('medicine') || lastUserMessage.includes('medication') || lastUserMessage.includes('drug')) {
        resolve("Medications are an important part of many treatment plans. Is there a specific medication you'd like to learn more about?");
      }
      else if (lastUserMessage.includes('diet') || lastUserMessage.includes('food') || lastUserMessage.includes('nutrition')) {
        resolve("Nutrition plays a vital role in overall health. A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. Would you like specific information about nutrition for a particular health condition?");
      }
      else if (lastUserMessage.includes('exercise') || lastUserMessage.includes('workout')) {
        resolve("Regular physical activity is beneficial for both physical and mental health. The general recommendation is at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, along with muscle-strengthening exercises twice weekly. What type of exercise are you interested in?");
      }
      else if (lastUserMessage.includes('stress') || lastUserMessage.includes('anxiety') || lastUserMessage.includes('depression')) {
        resolve("Mental health is just as important as physical health. Stress, anxiety, and depression can impact overall wellbeing. There are various strategies that can help, including mindfulness practices, regular exercise, adequate sleep, and professional support when needed. Would you like more information about mental health resources?");
      }
      else if (lastUserMessage.includes('sleep') || lastUserMessage.includes('insomnia')) {
        resolve("Quality sleep is essential for health. Adults typically need 7-9 hours of sleep per night. Good sleep hygiene includes maintaining a regular sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and large meals close to bedtime. Are you experiencing sleep difficulties?");
      }
      else if (lastUserMessage.includes('thank')) {
        resolve("You're welcome! If you have any other health-related questions, feel free to ask. I'm here to help.");
      }
      else {
        resolve("Thank you for your message. As an AI health assistant, I can provide general health information and resources. However, for personalized medical advice, diagnosis, or treatment, it's important to consult with a qualified healthcare professional. Is there something specific about your health that you'd like to discuss?");
      }
    }, 1500);
  });
}
