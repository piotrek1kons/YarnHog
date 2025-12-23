# Instrukcja Migracji Zdjęć z Firebase Storage do Firestore

## Krok 1: Pobierz Service Account Key

1. Otwórz Firebase Console: https://console.firebase.google.com/
2. Wybierz projekt `yarnhog-5feac`
3. Idź do **Project Settings** (ikona koła zębatego)
4. Zakładka **Service Accounts**
5. Kliknij **Generate New Private Key**
6. Zapisz plik JSON jako `serviceAccountKey.json` w folderze głównym projektu (obok `migrate-images.js`)

## Krok 2: Zainstaluj wymagane pakiety

Otwórz terminal w folderze projektu i uruchom:

```bash
npm install firebase-admin node-fetch
```

## Krok 3: Uruchom migrację

```bash
node migrate-images.js
```

## Co robi skrypt?

1. **Tutorials**: 
   - Pobiera zdjęcia z Storage (ścieżka w `image.symbol`)
   - Konwertuje na base64
   - Zapisuje w polu `image` jako string
   - Zachowuje oryginalną ścieżkę w `image_original_path`

2. **Projects**:
   - Pobiera zdjęcia z Storage (jeśli są)
   - Konwertuje na base64
   - Zapisuje w polu `image`

## Po migracji

1. Usuń `serviceAccountKey.json` (zawiera wrażliwe dane!)
2. Dodaj do `.gitignore`:
   ```
   serviceAccountKey.json
   migrate-images.js
   ```

3. Zaktualizuj kod aplikacji aby nie używał Storage:
   - `tutorials.tsx` - usuń `getStorage`, `ref`, `getDownloadURL`
   - Bezpośrednio użyj `item.image` jako URI

## UWAGA

- Firestore ma limit 1MB na dokument
- Jeśli zdjęcia są większe, będzie błąd
- Skrypt pomija już zmigrowane dokumenty (sprawdza czy `image` zaczyna się od `data:`)
