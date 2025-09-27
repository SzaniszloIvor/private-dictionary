// src/components/AddWordsModal/AddWordsModal.jsx
import React, { useState } from 'react';
import { styles } from '../../styles/styles';

const AddWordsModal = ({ isOpen, onClose, dictionary, setDictionary }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [phoneticWord, setPhoneticWord] = useState('');
  const [hungarianWord, setHungarianWord] = useState('');
  const [wordsToAdd, setWordsToAdd] = useState([]);
  const [addMode, setAddMode] = useState('single');
  const [wordList, setWordList] = useState('');

  if (!isOpen) return null;

  const handleAddWord = () => {
    if (!englishWord || !phoneticWord || !hungarianWord) {
      alert('Kérjük töltse ki az összes mezőt!');
      return;
    }
    
    const newWord = {
      english: englishWord,
      phonetic: phoneticWord,
      hungarian: hungarianWord
    };
    
    setWordsToAdd([...wordsToAdd, newWord]);
    setEnglishWord('');
    setPhoneticWord('');
    setHungarianWord('');
  };

  const processWordList = () => {
    const listText = wordList.trim();
    if (!listText) {
      alert('❌ Kérjük írjon be szavakat a listába!');
      return;
    }

    const lines = listText.split('\n').filter(line => line.trim());
    const processedWords = [];
    const errorLines = [];
    
    const maxWords = 20;
    const linesToProcess = lines.slice(0, maxWords);
    
    linesToProcess.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const parts = trimmedLine.split(/\s*[-–—]\s*/);
      
      if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
        errorLines.push(index + 1);
        return;
      }

      processedWords.push({
        english: parts[0].trim(),
        phonetic: generatePhonetic(parts[0].trim()),
        hungarian: parts[1].trim()
      });
    });
    
    if (errorLines.length > 0) {
      alert(`❌ Hibás formátum a következő sorokban: ${errorLines.join(', ')}\n\nHelyes formátum: "angol szó - magyar jelentés"`);
      return;
    }
    
    if (processedWords.length === 0) {
      alert('❌ Nem található feldolgozható szó a listában!');
      return;
    }
    
    if (wordsToAdd.length + processedWords.length > maxWords) {
      const availableSlots = maxWords - wordsToAdd.length;
      alert(`⚠️ Maximum ${maxWords} szót adhatsz hozzá egyszerre. Még ${availableSlots} szót adhatsz hozzá.`);
      return;
    }
    
    setWordsToAdd([...wordsToAdd, ...processedWords]);
    setWordList('');
    
    if (lines.length > maxWords) {
      alert(`✅ ${processedWords.length} szó sikeresen feldolgozva!\n⚠️ Figyelem: csak az első ${maxWords} sor került feldolgozásra.`);
    } else {
      alert(`✅ ${processedWords.length} szó sikeresen feldolgozva!`);
    }
  };

  const generatePhonetic = (word) => {
    let phonetic = word.toLowerCase();
    phonetic = phonetic.replace(/tion/g, 'ʃən');
    phonetic = phonetic.replace(/th/g, 'θ');
    return phonetic;
  };

  const handleSave = () => {
    if (!selectedLesson || wordsToAdd.length === 0) {
      alert('Válasszon leckét és adjon hozzá szavakat!');
      return;
    }

    const updatedDictionary = { ...dictionary };
    
    if (!updatedDictionary[selectedLesson]) {
      if (!newLessonTitle) {
        alert('Adja meg az új lecke címét!');
        return;
      }
      updatedDictionary[selectedLesson] = {
        title: newLessonTitle,
        words: []
      };
    }
    
    updatedDictionary[selectedLesson].words = [
      ...updatedDictionary[selectedLesson].words,
      ...wordsToAdd
    ];
    
    setDictionary(updatedDictionary);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedLesson(null);
    setNewLessonTitle('');
    setEnglishWord('');
    setPhoneticWord('');
    setHungarianWord('');
    setWordsToAdd([]);
    setAddMode('single');
    setWordList('');
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <span style={styles.closeBtn} onClick={onClose}>×</span>
          <h2>📚 Szavak hozzáadása</h2>
        </div>
        <div style={styles.modalBody}>
          <div style={styles.formGroup}>
            <label>Válaszd ki a leckét:</label>
            <div style={styles.lessonSelector}>
              {Array.from({ length: 60 }, (_, i) => i + 1).map(num => (
                <div
                  key={num}
                  style={{
                    ...styles.lessonOption,
                    ...(selectedLesson === num ? styles.lessonOptionSelected : {}),
                    ...(dictionary[num] ? styles.lessonOptionCompleted : {})
                  }}
                  onClick={() => setSelectedLesson(num)}
                >
                  <strong>{num}. óra</strong>
                  {dictionary[num] && <br />}
                  {dictionary[num] && `${dictionary[num].words.length} szó`}
                </div>
              ))}
            </div>
          </div>

          {selectedLesson && !dictionary[selectedLesson] && (
            <div style={styles.formGroup}>
              <label>Új lecke címe:</label>
              <input
                type="text"
                style={styles.formInput}
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="pl. Családi kapcsolatok"
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#495057' }}>
              Szavak hozzáadása módja:
            </label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#495057' }}>
                <input
                  type="radio"
                  checked={addMode === 'single'}
                  onChange={() => setAddMode('single')}
                  style={{ marginRight: '8px' }}
                />
                Egyedi szó hozzáadása
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#495057' }}>
                <input
                  type="radio"
                  checked={addMode === 'bulk'}
                  onChange={() => setAddMode('bulk')}
                  style={{ marginRight: '8px' }}
                />
                Lista feltöltése
              </label>
            </div>
          </div>

          {addMode === 'single' ? (
            <div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Angol szó:</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={englishWord}
                    onChange={(e) => setEnglishWord(e.target.value)}
                    placeholder="pl. family"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Fonetika:</label>
                  <input
                    type="text"
                    style={styles.formInput}
                    value={phoneticWord}
                    onChange={(e) => setPhoneticWord(e.target.value)}
                    placeholder="pl. ˈfæm.ə.li"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label>Magyar jelentés:</label>
                <input
                  type="text"
                  style={styles.formInput}
                  value={hungarianWord}
                  onChange={(e) => setHungarianWord(e.target.value)}
                  placeholder="pl. család"
                />
              </div>
              <button style={styles.btnSecondary} onClick={handleAddWord}>
                ➕ Szó hozzáadása
              </button>
            </div>
          ) : (
            <div style={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#495057' }}>
                Szavak listája (angol - magyar, soronként):
              </label>
              <textarea
                style={styles.formTextarea}
                rows="10"
                value={wordList}
                onChange={(e) => setWordList(e.target.value)}
                placeholder="tick - pipa
                  reliable - megbízható
                  resourceful - találékony
                  passion - szenvedély
                  determination - eltökéltség"
              />
              <small style={{ display: 'block', marginTop: '5px', color: '#6c757d' }}>
                Maximum 20 szó adható hozzá egyszerre. Formátum: "angol szó - magyar jelentés"
              </small>
              <div style={{ marginTop: '10px' }}>
                <button style={styles.btnSecondary} onClick={processWordList}>
                  🔄 Lista feldolgozása
                </button>
              </div>
            </div>
          )}

          {wordsToAdd.length > 0 && (
            <div style={styles.wordPreview}>
              <h4 style={{ marginBottom: '15px', color: '#495057' }}>
                Hozzáadandó szavak: ({wordsToAdd.length}/20)
              </h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {wordsToAdd.map((word, index) => (
                  <div key={index} style={styles.previewWord}>
                    <span style={{ color: '#495057' }}>
                      <strong>{word.english}</strong> 
                      <em style={{ color: '#e74c3c', marginLeft: '8px' }}>{word.phonetic}</em> 
                      <span style={{ margin: '0 8px' }}>→</span>
                      <span style={{ color: '#27ae60' }}>{word.hungarian}</span>
                    </span>
                    <button
                      onClick={() => setWordsToAdd(wordsToAdd.filter((_, i) => i !== index))}
                      style={styles.removeBtn}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button style={styles.btnSuccess} onClick={handleSave}>💾 Mentés</button>
            <button style={styles.btnSecondary} onClick={onClose}>❌ Mégse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWordsModal;
