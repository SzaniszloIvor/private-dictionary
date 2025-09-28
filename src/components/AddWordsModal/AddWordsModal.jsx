// src/components/AddWordsModal/AddWordsModal.jsx
import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { generatePhonetic, generatePhoneticSync } from '../../utils/phoneticHelper';

const AddWordsModal = ({ isOpen, onClose, dictionary, setDictionary }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [phoneticWord, setPhoneticWord] = useState('');
  const [hungarianWord, setHungarianWord] = useState('');
  const [wordsToAdd, setWordsToAdd] = useState([]);
  const [addMode, setAddMode] = useState('single');
  const [wordList, setWordList] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const generatePhoneticForCurrent = async () => {
    if (!englishWord) {
      alert('Írjon be egy angol szót először!');
      return;
    }
    
    setIsGenerating(true);
    try {
      const phonetic = await generatePhonetic(englishWord);
      setPhoneticWord(phonetic);
    } catch (error) {
      console.error('Fonetika generálási hiba:', error);
      // Fallback
      const phonetic = generatePhoneticSync(englishWord);
      setPhoneticWord(phonetic);
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateAllPhonetics = async () => {
    if (wordsToAdd.length === 0) return;
    
    setIsGenerating(true);
    try {
      const updatedWords = await Promise.all(
        wordsToAdd.map(async (word) => ({
          ...word,
          phonetic: await generatePhonetic(word.english)
        }))
      );
      setWordsToAdd(updatedWords);
      alert('✅ Fonetika sikeresen újragenerálva az API-ból!');
    } catch (error) {
      console.error('Fonetika újragenerálási hiba:', error);
      // Fallback
      const updatedWords = wordsToAdd.map(word => ({
        ...word,
        phonetic: generatePhoneticSync(word.english)
      }));
      setWordsToAdd(updatedWords);
      alert('✅ Fonetika újragenerálva (offline módban)!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddWord = async () => {
    if (!englishWord || !hungarianWord) {
      alert('❌ Kérjük töltse ki az angol és magyar mezőket!');
      return;
    }
    
    let finalPhonetic = phoneticWord;
    
    if (!finalPhonetic) {
      setIsGenerating(true);
      try {
        finalPhonetic = await generatePhonetic(englishWord);
      } catch (error) {
        // Fallback
        finalPhonetic = generatePhoneticSync(englishWord);
      } finally {
        setIsGenerating(false);
      }
    }
    
    const newWord = {
      english: englishWord,
      phonetic: finalPhonetic,
      hungarian: hungarianWord
    };
    
    setWordsToAdd([...wordsToAdd, newWord]);
    setEnglishWord('');
    setPhoneticWord('');
    setHungarianWord('');
  };

  const processWordList = async () => {
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
    
    setIsGenerating(true);
    
    try {
      for (let i = 0; i < linesToProcess.length; i++) {
        const line = linesToProcess[i];
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        const parts = trimmedLine.split(/\s*[-–—]\s*/);
        
        if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
          errorLines.push(i + 1);
          continue;
        }
        
        const englishWord = parts[0].trim();
        const hungarianWord = parts[1].trim();
        
        try {
          const phonetic = await generatePhonetic(englishWord);
          processedWords.push({
            english: englishWord,
            phonetic: phonetic,
            hungarian: hungarianWord
          });
        } catch (error) {
          // Fallback
          processedWords.push({
            english: englishWord,
            phonetic: generatePhoneticSync(englishWord),
            hungarian: hungarianWord
          });
        }
      }
      
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
        alert(`✅ ${processedWords.length} szó sikeresen feldolgozva pontos fonetikával!\n⚠️ Figyelem: csak az első ${maxWords} sor került feldolgozásra.`);
      } else {
        alert(`✅ ${processedWords.length} szó sikeresen feldolgozva pontos fonetikával!`);
      }
    } finally {
      setIsGenerating(false);
    }
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
    setIsGenerating(false);
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
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      style={{ ...styles.formInput, flex: '1' }}
                      value={phoneticWord}
                      onChange={(e) => setPhoneticWord(e.target.value)}
                      placeholder="Automatikusan generálódik API-ból"
                    />
                    <button 
                      style={{
                        ...styles.btnSecondary,
                        background: isGenerating 
                          ? '#6c757d'
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '10px 15px',
                        minWidth: '100px',
                        cursor: isGenerating ? 'wait' : 'pointer'
                      }}
                      onClick={generatePhoneticForCurrent}
                      disabled={isGenerating}
                      type="button"
                    >
                      {isGenerating ? '⏳...' : '🪄 API'}
                    </button>
                  </div>
                  <small style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Pontos kiejtés a Datamuse API-ból
                  </small>
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
              <button 
                style={{
                  ...styles.btnSecondary,
                  cursor: isGenerating ? 'wait' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1
                }} 
                onClick={handleAddWord}
                disabled={isGenerating}
              >
                {isGenerating ? '⏳ Generálás...' : '➕ Szó hozzáadása'}
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
                disabled={isGenerating}
              />
              <small style={{ display: 'block', marginTop: '5px', color: '#6c757d' }}>
                Maximum 20 szó adható hozzá egyszerre. Formátum: "angol szó - magyar jelentés"
                <br />
                <strong>🌐 Pontos fonetika a Datamuse API-ból minden szóhoz!</strong>
              </small>
              <div style={{ marginTop: '10px' }}>
                <button 
                  style={{
                    ...styles.btnSecondary,
                    cursor: isGenerating ? 'wait' : 'pointer',
                    opacity: isGenerating ? 0.7 : 1
                  }} 
                  onClick={processWordList}
                  disabled={isGenerating}
                >
                  {isGenerating ? '⏳ Feldolgozás...' : '🔄 Lista feldolgozása (API fonetika)'}
                </button>
              </div>
            </div>
          )}

          {wordsToAdd.length > 0 && (
            <div style={styles.wordPreview}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ color: '#495057', margin: 0 }}>
                  Hozzáadandó szavak: ({wordsToAdd.length}/20)
                </h4>
                <button 
                  style={{
                    background: isGenerating 
                      ? '#6c757d'
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: isGenerating ? 'wait' : 'pointer',
                    fontSize: '14px'
                  }}
                  onClick={regenerateAllPhonetics}
                  disabled={isGenerating}
                >
                  {isGenerating ? '⏳ Frissítés...' : '🌐 API újralekérés'}
                </button>
              </div>
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

          {/* Loading indicator */}
          {isGenerating && (
            <div style={{ 
              textAlign: 'center', 
              padding: '10px', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              marginTop: '10px'
            }}>
              <span style={{ color: '#667eea' }}>⏳ Fonetika lekérése az API-ból...</span>
            </div>
          )}

          <div style={styles.modalFooter}>
            <button 
              style={{
                ...styles.btnSuccess,
                cursor: isGenerating ? 'wait' : 'pointer',
                opacity: isGenerating ? 0.7 : 1
              }}
              onClick={handleSave}
              disabled={isGenerating}
            >
              💾 Mentés
            </button>
            <button style={styles.btnSecondary} onClick={onClose}>❌ Mégse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWordsModal;
