import { StyleSheet, Pressable, Text, View, StatusBar, Platform, ScrollView, TextInput, Image, Alert, Switch } from 'react-native'
import { useRouter } from 'expo-router'

import React, { useState, useEffect } from 'react'
import { db, auth } from '../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';

import NavPanel from '../components/navPanel';

const AddProjects = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [materialsNeeded, setMaterialsNeeded] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
      } else {
        setUserId(null);
        setUserEmail(null);
        router.back();
      }
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to upload images!');
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
      
      // Convert URI to blob then to base64
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

  const handleAddProject = async () => {
    if (!title.trim()) {
      alert('Please enter project title');
      return;
    }

    if (!image) {
      alert('Please select an image');
      return;
    }

    setLoading(true);
    try {
      console.log('Starting project creation...');
      console.log('Title:', title);
      console.log('Has image:', !!image);
      
      const imageBase64 = await uploadImage(image);
      console.log('Image converted to base64');

      const projectData = {
        title: title,
        description: description,
        image: imageBase64,
        user_id: userId,
        is_public: isPublic,
        materials: materialsNeeded,
      };

      console.log('Adding to Firestore...');
      const result = await addDoc(collection(db, 'projects'), projectData);
      console.log('Project added with ID:', result.id);

      alert('Project added successfully!');
      resetForm();
      router.back();
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setIsPublic(true);
    setMaterialsNeeded('');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Project Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. My Crochet Blanket"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Materials Needed */}
        <View style={styles.section}>
          <Text style={styles.label}>Materials Needed</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Cotton yarn (4mm), 6mm crochet hook, stitch markers"
            value={materialsNeeded}
            onChangeText={setMaterialsNeeded}
            multiline
            numberOfLines={3}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Project description..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Image Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>Project Image *</Text>
          <Pressable style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerButtonText}>
              {image ? 'Change Image' : 'Select Image'}
            </Text>
          </Pressable>
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
            </View>
          )}
        </View>

        {/* Public Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Public Project</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: '#E7B469', true: '#E7B469' }}
              thumbColor={isPublic ? '#6B5E4B' : '#B0A898'}
            />
          </View>
          <Text style={styles.toggleDescription}>
            {isPublic ? 'This project is visible to everyone' : 'This project is private'}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.addButton, loading && styles.buttonDisabled]}
            onPress={handleAddProject}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add Project'}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <NavPanel />
    </View>
  );
};

export default AddProjects;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 120,
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
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  imagePickerButton: {
    backgroundColor: '#E7B469',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6B5E4B',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
