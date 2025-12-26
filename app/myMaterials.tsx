import { StyleSheet, Pressable, Image, Text, View, StatusBar, Platform, ScrollView, TextInput, Modal } from 'react-native'
import React, {useEffect, useState} from 'react'
import { db, auth } from '../FirebaseConfig';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import NavPanel from '../components/navPanel';
import Materials from '../assets/img/materials.png';

const myMaterials = () => {     
  const [activeTab, setActiveTab] = useState<'yarn' | 'hook' | 'other'>('yarn');
  const [materials, setMaterials] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchMaterials(user.uid);
      } else {
        setUserId(null);
        setMaterials([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchMaterials = async (uid: string) => {
    try {
      setLoading(true);
      const q = query(collection(db, 'materials'), where('userId', '==', uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async () => {
    if (!name.trim()) {
      alert('Please enter material name');
      return;
    }
    setSubmitting(true);
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
      setIsModalVisible(false);
      fetchMaterials(userId!);
    } catch (error) {
      console.error('Error adding material:', error);
      alert('Error adding material');
    } finally {
      setSubmitting(false);
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
    setMaterialType('yarn');
  };

  const handleCancel = () => {
    resetForm();
    setIsModalVisible(false);
  };

  const filteredMaterials = materials.filter((material) => material.type === activeTab);

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={handleCancel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Material</Text>
          </View>
          
          <ScrollView contentContainerStyle={styles.modalContent}>
            <View style={styles.section}>
              <Text style={styles.label}>Material Type</Text>
              <View style={styles.typeContainer}>
                <Pressable onPress={() => setMaterialType('yarn')} style={[styles.typeButton, materialType === 'yarn' && styles.typeButtonActive]}>
                  <Text style={[styles.typeButtonText, materialType === 'yarn' && styles.typeButtonTextActive]}>Yarn</Text>
                </Pressable>
                <Pressable onPress={() => setMaterialType('hook')} style={[styles.typeButton, materialType === 'hook' && styles.typeButtonActive]}>
                  <Text style={[styles.typeButtonText, materialType === 'hook' && styles.typeButtonTextActive]}>Hook</Text>
                </Pressable>
                <Pressable onPress={() => setMaterialType('other')} style={[styles.typeButton, materialType === 'other' && styles.typeButtonActive]}>
                  <Text style={[styles.typeButtonText, materialType === 'other' && styles.typeButtonTextActive]}>Other</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Name *</Text>
              <TextInput style={styles.input} placeholder="e.g. Cotton Yarn" value={name} onChangeText={setName} placeholderTextColor="#B0A898" />
            </View>

            {materialType === 'yarn' && (
              <>
                <View style={styles.rowContainer}>
                  <View style={[styles.section, styles.flex1]}>
                    <Text style={styles.label}>Color</Text>
                    <TextInput style={styles.input} placeholder="e.g. Blue" value={color} onChangeText={setColor} placeholderTextColor="#B0A898" />
                  </View>
                  <View style={[styles.section, styles.flex1]}>
                    <Text style={styles.label}>Thickness (mm)</Text>
                    <TextInput style={styles.input} placeholder="e.g. 4" value={thickness} onChangeText={setThickness} keyboardType="numeric" placeholderTextColor="#B0A898" />
                  </View>
                </View>

                <View style={styles.rowContainer}>
                  <View style={[styles.section, styles.flex1]}>
                    <Text style={styles.label}>Weight (g)</Text>
                    <TextInput style={styles.input} placeholder="e.g. 100" value={weight} onChangeText={setWeight} keyboardType="numeric" placeholderTextColor="#B0A898" />
                  </View>
                  <View style={[styles.section, styles.flex1]}>
                    <Text style={styles.label}>Length (m)</Text>
                    <TextInput style={styles.input} placeholder="e.g. 200" value={length} onChangeText={setLength} keyboardType="numeric" placeholderTextColor="#B0A898" />
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Composition</Text>
                  <TextInput style={styles.input} placeholder="e.g. 100% cotton" value={composition} onChangeText={setComposition} placeholderTextColor="#B0A898" />
                </View>
              </>
            )}

            {materialType === 'hook' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.label}>Size (mm)</Text>
                  <TextInput style={styles.input} placeholder="e.g. 3" value={thickness} onChangeText={setThickness} keyboardType="numeric" placeholderTextColor="#B0A898" />
                </View>
                <View style={styles.section}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput style={styles.input} placeholder="e.g. 5" value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholderTextColor="#B0A898" />
                </View>
              </>
            )}

            {materialType === 'other' && (
              <>
                <View style={styles.rowContainer}>
                  <View style={[styles.section, styles.flex1]}>
                    <Text style={styles.label}>Category</Text>
                    <TextInput style={styles.input} placeholder="e.g. Needles" value={category} onChangeText={setCategory} placeholderTextColor="#B0A898" />
                  </View>
                  <View style={[styles.section, styles.flex1]}>
                    <Text style={styles.label}>Quantity</Text>
                    <TextInput style={styles.input} placeholder="e.g. 10" value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholderTextColor="#B0A898" />
                  </View>
                </View>
              </>
            )}

            <View style={styles.section}>
              <Text style={styles.label}>Notes</Text>
              <TextInput style={[styles.input, styles.textArea]} placeholder="Additional information..." value={notes} onChangeText={setNotes} multiline numberOfLines={4} placeholderTextColor="#B0A898" />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel} disabled={submitting}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.addButton, submitting && styles.buttonDisabled]} onPress={handleAddMaterial} disabled={submitting}>
                <Text style={styles.addButtonText}>{submitting ? 'Adding...' : 'Add Material'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.tabsContainer}>
        <Pressable onPress={() => setActiveTab('yarn')} style={[styles.tabButton, activeTab === 'yarn' && styles.tabButtonActive]}>
          <Text style={[styles.tabText, activeTab === 'yarn' && styles.tabTextActive]}>yarn</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('hook')} style={[styles.tabButton, activeTab === 'hook' && styles.tabButtonActive]}>
          <Text style={[styles.tabText, activeTab === 'hook' && styles.tabTextActive]}>hook</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('other')} style={[styles.tabButton, activeTab === 'other' && styles.tabButtonActive]}>
          <Text style={[styles.tabText, activeTab === 'other' && styles.tabTextActive]}>other</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {loading ? (
          <Text style={styles.emptyText}>Loading materials...</Text>
        ) : filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <View key={material.id} style={styles.material}>
              <Image style={{width: 160, height:160}} source={Materials} />
              <View style={{justifyContent: 'center', paddingLeft: 12, flex: 1}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>{material.name}</Text>
                {activeTab === 'yarn' && (
                  <>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Color: {material.color || 'N/A'}</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Weight: {material.weight || 'N/A'}g</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Length: {material.length || 'N/A'}m</Text>
                  </>
                )}
                {activeTab === 'hook' && (
                  <>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Size: {material.size || 'N/A'}mm</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Qty: {material.quantity || 0}</Text>
                  </>
                )}
                {activeTab === 'other' && (
                  <>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Category: {material.category || 'N/A'}</Text>
                    <Text style={{fontSize: 14, color: '#6B5E4B'}}>Qty: {material.quantity || 0}</Text>
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No materials in this category</Text>
        )}
      </ScrollView>

      <Pressable 
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>

      <NavPanel />
    </View>
  );
};

export default myMaterials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFBF5',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#F9E7C6',
    borderBottomWidth: 1,
    borderBottomColor: '#E7B469'
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  tabButtonActive: {
    backgroundColor: '#E7B469',
  },
  tabText: {
    fontSize: 16,
    color: '#6B5E4B',
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#1C1C1C',
    fontWeight: '700'
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    paddingBottom: 100
  },
  material: {
    width: "95%",
    flexDirection: "row",
  },
  emptyText: {
    marginTop: 24,
    fontSize: 16,
    color: '#6B5E4B'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFBF5',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9E7C6',
    borderBottomWidth: 1,
    borderBottomColor: '#E7B469',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1C',
    textAlign: 'center',
  },
  modalContent: {
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
});
