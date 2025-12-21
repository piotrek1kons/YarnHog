import { StyleSheet, Pressable, Text, View, StatusBar, Platform, ScrollView, TextInput, Modal } from 'react-native'
import { useRouter } from 'expo-router'

import React, { useState, useEffect } from 'react'
import { db, auth } from '../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import NavPanel from '../components/navPanel';

const AddMaterial = () => {
  const router = useRouter();
  const [materialType, setMaterialType] = useState<'yarn' | 'hook' | 'other'>('yarn');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [color, setColor] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [thickness, setThickness] = useState('');
  const [composition, setComposition] = useState('');
  const [material, setMaterial] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        router.back();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddMaterial = async () => {
    if (!name.trim()) {
      alert('Please enter material name');
      return;
    }

    setLoading(true);
    try {
      const materialData: any = {
        type: materialType,
        name: name,
        userId: userId,
        createdAt: new Date(),
      };

      if (materialType === 'yarn') {
        materialData.color = color;
        materialData.weight = weight;
        materialData.length = length;
        materialData.thickness = thickness;
        materialData.composition = composition;
      } else if (materialType === 'hook') {
        materialData.size = thickness;
        materialData.material = material;
        materialData.quantity = quantity;
      } else if (materialType === 'other') {
        materialData.category = category;
        materialData.quantity = quantity;
      }

      materialData.notes = notes;

      await addDoc(collection(db, 'materials'), materialData);

      alert('Material added successfully!');
      resetForm();
      router.back();
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Error adding material');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setQuantity('');
    setColor('');
    setWeight('');
    setLength('');
    setThickness('');
    setComposition('');
    setMaterial('');
    setCategory('');
    setNotes('');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Material Type */}
        <View style={styles.section}>
          <Text style={styles.label}>Material Type</Text>
          <View style={styles.typeContainer}>
            <Pressable
              onPress={() => setMaterialType('yarn')}
              style={[styles.typeButton, materialType === 'yarn' && styles.typeButtonActive]}
            >
              <Text style={[styles.typeButtonText, materialType === 'yarn' && styles.typeButtonTextActive]}>
                Yarn
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMaterialType('hook')}
              style={[styles.typeButton, materialType === 'hook' && styles.typeButtonActive]}
            >
              <Text style={[styles.typeButtonText, materialType === 'hook' && styles.typeButtonTextActive]}>
                Hook
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMaterialType('other')}
              style={[styles.typeButton, materialType === 'other' && styles.typeButtonActive]}
            >
              <Text style={[styles.typeButtonText, materialType === 'other' && styles.typeButtonTextActive]}>
                Other
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cotton Yarn"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#B0A898"
          />
        </View>

        {/* Yarn specific fields */}
        {materialType === 'yarn' && (
          <>
            <View style={styles.rowContainer}>
              <View style={[styles.section, styles.flex1]}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Blue"
                  value={color}
                  onChangeText={setColor}
                  placeholderTextColor="#B0A898"
                />
              </View>
              <View style={[styles.section, styles.flex1]}>
                <Text style={styles.label}>Thickness (mm)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 4"
                  value={thickness}
                  onChangeText={setThickness}
                  keyboardType="numeric"
                  placeholderTextColor="#B0A898"
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.section, styles.flex1]}>
                <Text style={styles.label}>Weight (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 100"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  placeholderTextColor="#B0A898"
                />
              </View>
              <View style={[styles.section, styles.flex1]}>
                <Text style={styles.label}>Length (m)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 200"
                  value={length}
                  onChangeText={setLength}
                  keyboardType="numeric"
                  placeholderTextColor="#B0A898"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Composition</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 100% cotton"
                value={composition}
                onChangeText={setComposition}
                placeholderTextColor="#B0A898"
              />
            </View>
          </>
        )}

        {/* Hook specific fields */}
        {materialType === 'hook' && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Size (mm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 3"
                value={thickness}
                onChangeText={setThickness}
                keyboardType="numeric"
                placeholderTextColor="#B0A898"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholderTextColor="#B0A898"
              />
            </View>
          </>
        )}

        {/* Other specific fields */}
        {materialType === 'other' && (
          <>
            <View style={styles.rowContainer}>
              <View style={[styles.section, styles.flex1]}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Needles"
                  value={category}
                  onChangeText={setCategory}
                  placeholderTextColor="#B0A898"
                />
              </View>
              <View style={[styles.section, styles.flex1]}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 10"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholderTextColor="#B0A898"
                />
              </View>
            </View>
          </>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Additional information..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            placeholderTextColor="#B0A898"
          />
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
            onPress={handleAddMaterial}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add Material'}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <NavPanel />
    </View>
  );
};

export default AddMaterial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#F9E7C6',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7B469',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1C',
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
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFF8DB',
    borderWidth: 1,
    borderColor: '#E7B469',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#E7B469',
    borderColor: '#D4A574',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B5E4B',
  },
  typeButtonTextActive: {
    color: '#1C1C1C',
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
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
});
