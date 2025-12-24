import { StyleSheet, Pressable, Text, View, StatusBar, Platform, ScrollView, TextInput, Image, Alert, Modal, FlatList, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

import React, { useState, useEffect } from 'react'
import { db, auth } from '../FirebaseConfig';
import { collection, addDoc, query, orderBy, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

import NavPanel from '../components/navPanel';

const Community = () => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Anonymous');
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        
        // Pobierz username z kolekcji users
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserName(userData.username || 'Anonymous');
          }
        } catch (err) {
          console.log('Error fetching username:', err);
          setUserName('Anonymous');
        }
      } else {
        setUserId(null);
        setUserName('Anonymous');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      
      const postsData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPosts(postsData);
    } catch (err) {
      console.log('Error fetching posts:', err);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Potrzebujesz uprawnień do galerii!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string): Promise<string> => {
    try {
      console.log('Converting image to base64...');
      
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          console.log('Image converted, length:', base64.length);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image:', error);
      throw error;
    }
  };

  const handleAddPost = async () => {
    if (!title.trim()) {
      alert('Proszę wpisz tytuł postu');
      return;
    }

    if (!content.trim()) {
      alert('Proszę wpisz treść postu');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting post creation...');
      
      let imageBase64 = '';
      if (image) {
        imageBase64 = await uploadImage(image);
        console.log('Image converted to base64');
      }

      const postData = {
        title: title,
        content: content,
        image: imageBase64,
        user_id: userId,
        user_name: userName,
        createdAt: new Date(),
        likes: [],
        comments: [],
      };

      console.log('Adding to Firestore...');
      const result = await addDoc(collection(db, 'posts'), postData);
      console.log('Post added with ID:', result.id);

      alert('Post dodany pomyślnie!');
      resetForm();
      setIsModalVisible(false);
      fetchPosts();
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Błąd: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsModalVisible(false);
  };

  const handleLike = async (postId: string, likes: string[]) => {
    if (!userId) return;

    try {
      const postRef = doc(db, 'posts', postId);
      const isLiked = likes.includes(userId);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId)
        });
      }

      fetchPosts();
    } catch (err) {
      console.log('Error toggling like:', err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost) return;

    try {
      const postRef = doc(db, 'posts', selectedPost.id);
      const comment = {
        user_id: userId,
        user_name: userName,
        text: commentText,
        createdAt: new Date(),
      };

      await updateDoc(postRef, {
        comments: arrayUnion(comment)
      });

      setCommentText('');
      fetchPosts();
      
      // Update selected post
      const updatedPost = posts.find(p => p.id === selectedPost.id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    } catch (err) {
      console.log('Error adding comment:', err);
      alert('Nie udało się dodać komentarza');
    }
  };

  const openComments = (post: any) => {
    setSelectedPost(post);
    setIsCommentsModalVisible(true);
  };

  const renderPost = ({ item }: { item: any }) => {
    const isLiked = item.likes?.includes(userId);
    const likesCount = item.likes?.length || 0;
    const commentsCount = item.comments?.length || 0;

    return (
      <View style={styles.postCard}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.postAuthor}>by {item.user_name}</Text>
          <Text style={styles.postText}>{item.content}</Text>
          
          {/* Likes and Comments Section */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLike(item.id, item.likes || [])}
            >
              <Text style={[styles.actionIcon, isLiked && styles.liked]}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.actionCount}>{likesCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => openComments(item)}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>{commentsCount}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Community Posts</Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Brak postów. Bądź pierwszy!</Text>
          </View>
        }
        scrollEnabled={true}
      />

      {/* Floating Action Button */}
      <Pressable 
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      {/* Add Post Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.modalTitle}>Dodaj Post</Text>

            {/* Title */}
            <View style={styles.section}>
              <Text style={styles.label}>Tytuł Postu *</Text>
              <TextInput
                style={styles.input}
                placeholder="Wpisz tytuł postu"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#B0A898"
              />
            </View>

            {/* Content */}
            <View style={styles.section}>
              <Text style={styles.label}>Treść Postu *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Wpisz treść postu..."
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
                placeholderTextColor="#B0A898"
              />
            </View>

            {/* Image Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Zdjęcie (opcjonalne)</Text>
              <Pressable style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>
                  {image ? 'Zmień Zdjęcie' : 'Wybierz Zdjęcie'}
                </Text>
              </Pressable>
              {image && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                </View>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Anuluj</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.addButton, loading && styles.buttonDisabled]}
                onPress={handleAddPost}
                disabled={loading}
              >
                <Text style={styles.addButtonText}>{loading ? 'Dodawanie...' : 'Opublikuj Post'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={isCommentsModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsCommentsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.commentsHeader}>
            <Text style={styles.modalTitle}>Komentarze</Text>
            <Pressable onPress={() => setIsCommentsModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <FlatList
            data={selectedPost?.comments || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentCard}>
                <Text style={styles.commentAuthor}>{item.user_name}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Brak komentarzy. Dodaj pierwszy!</Text>
              </View>
            }
            contentContainerStyle={styles.commentsListContent}
          />

          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Dodaj komentarz..."
              value={commentText}
              onChangeText={setCommentText}
              placeholderTextColor="#B0A898"
              multiline
            />
            <Pressable 
              style={[styles.sendButton, !commentText.trim() && styles.buttonDisabled]}
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Text style={styles.sendButtonText}>Wyślij</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <NavPanel />
    </View>
  );
};

export default Community;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 120,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6B5E4B',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B5E4B',
    fontStyle: 'italic',
  },
  postCard: {
    backgroundColor: '#FFF8DB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E7B469',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B5E4B',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 12,
    color: '#B0A898',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    color: '#1C1C1C',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7B469',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    fontSize: 20,
  },
  liked: {
    transform: [{ scale: 1.1 }],
  },
  actionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5E4B',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E7B469',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 60,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6B5E4B',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5E4B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF8DB',
    borderWidth: 1,
    borderColor: '#E7B469',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1C',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  imagePickerButton: {
    backgroundColor: '#E7B469',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  imagePreviewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0E5D8',
    borderWidth: 1,
    borderColor: '#E7B469',
  },
  addButton: {
    backgroundColor: '#E7B469',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B5E4B',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7B469',
  },
  closeButton: {
    fontSize: 28,
    color: '#6B5E4B',
    fontWeight: '600',
  },
  commentsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  commentCard: {
    backgroundColor: '#FFF8DB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7B469',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B5E4B',
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#1C1C1C',
    lineHeight: 18,
  },
  addCommentContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E7B469',
    backgroundColor: '#FFFBF5',
    alignItems: 'flex-end',
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#FFF8DB',
    borderWidth: 1,
    borderColor: '#E7B469',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1C1C1C',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#E7B469',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
  },
});
