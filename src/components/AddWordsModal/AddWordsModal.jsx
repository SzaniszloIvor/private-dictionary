// src/components/AddWordsModal/AddWordsModal.jsx
import React, { useState, useEffect } from 'react';
import { generatePhonetic, generatePhoneticSync } from '../../utils/phoneticHelper';

const AddWordsModal = ({ isOpen, onClose, dictionary, setDictionary, isDemo, getNextLessonNumber }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [englishWord, setEnglishWord] = useState('');
  const [phoneticWord, setPhoneticWord] = useState('');
  const [hungarianWord, setHungarianWord] = useState('');
  const [wordsToAdd, setWordsToAdd] = useState([]);
  const [addMode, setAddMode] = useState('single');
  const [wordList, setWordList] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isDemo) {
        setSelectedLesson(1);
      } else {
        const existingLessons = Object.keys(dictionary).map(num => parseInt(num));
        if (existingLessons.length === 0) {
          setSelectedLesson(1);
        } else {
          setSelectedLesson(null);
        }
      }
    }
  }, [isOpen, dictionary, isDemo]);

  if (!isOpen) return null;

  // Generate phonetic for current word using API
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
      console.error('Phonetic generation error:', error);
      const phonetic = generatePhoneticSync(englishWord);
      setPhoneticWord(phonetic);
    } finally {
      setIsGenerating(false);
    }
  };

  // Regenerate all phonetics from API
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
      console.error('Phonetic regeneration error:', error);
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

  // Add single word
  const handleAddWord = async () => {
    if (!englishWord || !hungarianWord) {
      alert('⌚ Kérjük töltse ki az angol és magyar mezőket!');
      return;
    }
    
    let finalPhonetic = phoneticWord;
    
    if (!finalPhonetic) {
      setIsGenerating(true);
      try {
        finalPhonetic = await generatePhonetic(englishWord);
      } catch (error) {
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

  // Process bulk word list
  const processWordList = async () => {
    const listText = wordList.trim();
    if (!listText) {
      alert('⌚ Kérjük írjon be szavakat a listába!');
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
          processedWords.push({
            english: englishWord,
            phonetic: generatePhoneticSync(englishWord),
            hungarian: hungarianWord
          });
        }
      }
      
      if (errorLines.length > 0) {
        alert(`⌚ Hibás formátum a következő sorokban: ${errorLines.join(', ')}\n\nHelyes formátum: "angol szó - magyar jelentés"`);
        return;
      }
      
      if (processedWords.length === 0) {
        alert('⌚ Nem található feldolgozható szó a listában!');
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

  // Save words to lesson
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
    
    // Demo limit: Max 20 words per lesson
    const currentWords = updatedDictionary[selectedLesson].words.length;
    const totalWords = currentWords + wordsToAdd.length;
    
    if (isDemo && totalWords > 20) {
      alert(`⚠️ Demo módban maximum 20 szó adható egy órához!\n\nJelenleg: ${currentWords} szó\nHozzáadni próbált: ${wordsToAdd.length} szó\nMaximum: 20 szó`);
      return;
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

  const getLessonOptions = () => {
    if (isDemo) {
      return [1, 2];
    }
    
    const existingLessons = Object.keys(dictionary)
      .map(num => parseInt(num))
      .sort((a, b) => a - b);
    
    const nextLesson = getNextLessonNumber();
    
    return [...existingLessons, nextLesson];
  };

  const lessonOptions = getLessonOptions();

  return (
    <div className="
      fixed inset-0 z-50
      bg-black bg-opacity-50
      flex items-center justify-center
      p-4 animate-fade-in
    ">
      <div className="
        bg-white dark:bg-gray-800
        rounded-2xl shadow-2xl
        w-full max-w-2xl max-h-[90vh]
        overflow-y-auto
        animate-slide-in-up
      ">
        {/* Header */}
        <div className="
          bg-gradient-to-r from-blue-500 to-cyan-400
          dark:from-blue-600 dark:to-cyan-500
          text-white p-5 rounded-t-2xl
          relative text-center
        ">
          <button
            onClick={onClose}
            className="
              absolute right-5 top-4
              text-white text-3xl font-bold
              hover:scale-110 transition-transform
              leading-none
            "
          >
            ×
          </button>
          <h2 className="text-2xl font-bold">📚 Szavak hozzáadása</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Lesson selector */}
          <div className="mb-5">
            <label className="block mb-3 font-medium text-gray-700 dark:text-gray-300">
              {isDemo 
                ? 'Válaszd ki a demo órát:' 
                : 'Válaszd ki vagy hozz létre új órát:'}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {lessonOptions.map(num => {
                const hasContent = dictionary[num];
                const isNewLesson = !hasContent && !isDemo;
                
                return (
                  <div
                    key={num}
                    onClick={() => setSelectedLesson(num)}
                    className={`
                      p-3 rounded-lg text-center cursor-pointer
                      transition-all duration-200
                      border-2
                      ${selectedLesson === num 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'}
                      ${hasContent && selectedLesson !== num 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700' 
                        : ''}
                      ${isNewLesson 
                        ? 'bg-green-50 dark:bg-green-900/20 border-dashed border-green-500 dark:border-green-700' 
                        : ''}
                      hover:shadow-md hover:scale-105
                    `}
                  >
                    <strong className="block">{num}. óra</strong>
                    {hasContent && (
                      <span className="text-xs">
                        {hasContent.words.length} szó
                        {isDemo && ` / 20`}
                      </span>
                    )}
                    {isNewLesson && (
                      <span className="text-xs text-green-600 dark:text-green-400">+ Új óra</span>
                    )}
                  </div>
                );
              })}
            </div>
            {isDemo && (
              <div className="
                mt-3 p-3 rounded-lg
                bg-yellow-50 dark:bg-yellow-900/20
                border border-yellow-300 dark:border-yellow-700
                text-xs text-yellow-800 dark:text-yellow-300
              ">
                ⚠️ Demo módban csak az 1. és 2. órához adhatsz szavakat (max 20 szó/óra)
              </div>
            )}
          </div>

          {/* New lesson title input */}
          {selectedLesson && !dictionary[selectedLesson] && !isDemo && (
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Új lecke címe:
              </label>
              <input
                type="text"
                className="
                  w-full px-4 py-3 rounded-lg
                  border-2 border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:border-blue-500 dark:focus:border-blue-400
                  focus:outline-none
                  transition-colors duration-200
                "
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="pl. Családi kapcsolatok"
              />
            </div>
          )}

          {/* Add mode selector */}
          <div className="mb-5">
            <label className="block mb-3 font-bold text-gray-700 dark:text-gray-300">
              Szavak hozzáadása módja:
            </label>
            <div className="flex gap-5">
              <label className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  checked={addMode === 'single'}
                  onChange={() => setAddMode('single')}
                  className="mr-2 w-4 h-4 accent-blue-500"
                />
                Egyedi szó hozzáadása
              </label>
              <label className="flex items-center cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  checked={addMode === 'bulk'}
                  onChange={() => setAddMode('bulk')}
                  className="mr-2 w-4 h-4 accent-blue-500"
                />
                Lista feltöltése
              </label>
            </div>
          </div>

          {/* Single word mode */}
          {addMode === 'single' ? (
            <div>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Angol szó:
                  </label>
                  <input
                    type="text"
                    className="
                      w-full px-4 py-3 rounded-lg
                      border-2 border-gray-300 dark:border-gray-600
                      bg-white dark:bg-gray-700
                      text-gray-900 dark:text-gray-100
                      focus:border-blue-500 dark:focus:border-blue-400
                      focus:outline-none
                    "
                    value={englishWord}
                    onChange={(e) => setEnglishWord(e.target.value)}
                    placeholder="pl. family"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Fonetika:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="
                        flex-1 px-4 py-3 rounded-lg
                        border-2 border-gray-300 dark:border-gray-600
                        bg-white dark:bg-gray-700
                        text-gray-900 dark:text-gray-100
                        focus:border-blue-500 dark:focus:border-blue-400
                        focus:outline-none
                      "
                      value={phoneticWord}
                      onChange={(e) => setPhoneticWord(e.target.value)}
                      placeholder="Auto API-ból"
                    />
                    <button 
                      onClick={generatePhoneticForCurrent}
                      disabled={isGenerating}
                      className={`
                        px-4 py-3 rounded-lg
                        text-white font-medium
                        min-w-[100px]
                        transition-all duration-200
                        ${isGenerating 
                          ? 'bg-gray-500 cursor-wait' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-105'}
                      `}
                    >
                      {isGenerating ? '⏳...' : '🪄 API'}
                    </button>
                  </div>
                  <small className="block mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Pontos kiejtés a Datamuse API-ból
                  </small>
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Magyar jelentés:
                </label>
                <input
                  type="text"
                  className="
                    w-full px-4 py-3 rounded-lg
                    border-2 border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    focus:border-blue-500 dark:focus:border-blue-400
                    focus:outline-none
                  "
                  value={hungarianWord}
                  onChange={(e) => setHungarianWord(e.target.value)}
                  placeholder="pl. család"
                />
              </div>
              <button 
                onClick={handleAddWord}
                disabled={isGenerating}
                className={`
                  px-6 py-3 rounded-lg
                  text-white font-medium
                  transition-all duration-200
                  ${isGenerating 
                    ? 'bg-gray-500 cursor-wait opacity-70' 
                    : 'bg-gray-600 hover:bg-gray-700 hover:shadow-md'}
                `}
              >
                {isGenerating ? '⏳ Generálás...' : '➕ Szó hozzáadása'}
              </button>
            </div>
          ) : (
            /* Bulk mode */
            <div>
              <label className="block mb-3 font-bold text-gray-700 dark:text-gray-300">
                Szavak listája (angol - magyar, soronként):
              </label>
              <textarea
                rows="10"
                className="
                  w-full px-4 py-3 rounded-lg
                  border-2 border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:border-blue-500 dark:focus:border-blue-400
                  focus:outline-none
                  font-mono text-sm
                  resize-y
                "
                value={wordList}
                onChange={(e) => setWordList(e.target.value)}
                disabled={isGenerating}
                placeholder="tick - pipa
reliable - megbízható
resourceful - találékony
passion - szenvedély
determination - eltökéltség"
              />
              <small className="block mt-2 text-xs text-gray-600 dark:text-gray-400">
                Maximum 20 szó adható hozzá egyszerre. Formátum: "angol szó - magyar jelentés"
                <br />
                <strong>🌐 Pontos fonetika a Datamuse API-ból minden szóhoz!</strong>
              </small>
              <button 
                onClick={processWordList}
                disabled={isGenerating}
                className={`
                  mt-3 px-6 py-3 rounded-lg
                  text-white font-medium
                  transition-all duration-200
                  ${isGenerating 
                    ? 'bg-gray-500 cursor-wait opacity-70' 
                    : 'bg-gray-600 hover:bg-gray-700 hover:shadow-md'}
                `}
              >
                {isGenerating ? '⏳ Feldolgozás...' : '🔄 Lista feldolgozása (API fonetika)'}
              </button>
            </div>
          )}

          {/* Words preview */}
          {wordsToAdd.length > 0 && (
            <div className="
              mt-5 p-4 rounded-lg
              bg-gray-50 dark:bg-gray-900
              border border-gray-200 dark:border-gray-700
            ">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-gray-700 dark:text-gray-300 font-medium">
                  Hozzáadandó szavak: ({wordsToAdd.length}/20)
                </h4>
                <button 
                  onClick={regenerateAllPhonetics}
                  disabled={isGenerating}
                  className={`
                    px-3 py-1.5 rounded text-sm
                    text-white font-medium
                    transition-all duration-200
                    ${isGenerating 
                      ? 'bg-gray-500 cursor-wait' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-md'}
                  `}
                >
                  {isGenerating ? '⏳ Frissítés...' : '🌐 API újralekérés'}
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {wordsToAdd.map((word, index) => (
                  <div 
                    key={index} 
                    className="
                      flex justify-between items-center
                      p-3 rounded
                      bg-white dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                    "
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      <strong>{word.english}</strong>
                      <em className="text-red-500 dark:text-red-400 ml-2">{word.phonetic}</em>
                      <span className="mx-2">→</span>
                      <span className="text-green-600 dark:text-green-400">{word.hungarian}</span>
                    </span>
                    <button
                      onClick={() => setWordsToAdd(wordsToAdd.filter((_, i) => i !== index))}
                      className="
                        bg-red-500 text-white
                        rounded px-2 py-1 text-sm
                        hover:bg-red-600
                        transition-colors duration-200
                      "
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generating indicator */}
          {isGenerating && (
            <div className="
              mt-4 text-center p-3 rounded-lg
              bg-gray-100 dark:bg-gray-900
            ">
              <span className="text-indigo-500 dark:text-indigo-400">
                ⏳ Fonetika lekérése az API-ból...
              </span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-center gap-3 mt-8">
            <button 
              onClick={handleSave}
              disabled={isGenerating}
              className={`
                px-6 py-3 rounded-lg
                text-white font-medium
                transition-all duration-200
                ${isGenerating 
                  ? 'bg-gray-500 cursor-wait opacity-70' 
                  : 'bg-green-500 hover:bg-green-600 hover:shadow-md'}
              `}
            >
              💾 Mentés
            </button>
            <button 
              onClick={onClose}
              className="
                px-6 py-3 rounded-lg
                bg-gray-600 text-white font-medium
                hover:bg-gray-700 hover:shadow-md
                transition-all duration-200
              "
            >
              ❌ Mégse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWordsModal;
