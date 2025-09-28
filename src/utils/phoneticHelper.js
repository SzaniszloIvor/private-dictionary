// src/utils/phoneticHelper.js

const arpabetToIPA = {
  // Vowels
  'AA': 'ɑː', 'AE': 'æ', 'AH': 'ʌ', 'AO': 'ɔː', 'AW': 'aʊ',
  'AY': 'aɪ', 'EH': 'e', 'ER': 'ɜːr', 'EY': 'eɪ', 'IH': 'ɪ',
  'IY': 'iː', 'OW': 'oʊ', 'OY': 'ɔɪ', 'UH': 'ʊ', 'UW': 'uː',
  
  // Consonants
  'B': 'b', 'CH': 'tʃ', 'D': 'd', 'DH': 'ð', 'F': 'f',
  'G': 'g', 'HH': 'h', 'JH': 'dʒ', 'K': 'k', 'L': 'l',
  'M': 'm', 'N': 'n', 'NG': 'ŋ', 'P': 'p', 'R': 'r',
  'S': 's', 'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'V': 'v',
  'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ'
};

const convertArpabetToIPA = (arpabet) => {
  if (!arpabet) return '';
  
  const parts = arpabet.split(' ');
  let ipa = '';
  
  for (let part of parts) {
    const stress = part.match(/[012]$/);
    const phoneme = part.replace(/[012]$/, '');
    
    if (stress && stress[0] === '1') {
      ipa += 'ˈ'; // Primary stress
    } else if (stress && stress[0] === '2') {
      ipa += 'ˌ'; // Secondary stress
    }
    
    ipa += arpabetToIPA[phoneme] || phoneme.toLowerCase();
  }
  
  return ipa;
};

// Speciális karakterek tisztítása API hívás előtt
const cleanWordForAPI = (word) => {
  // Eltávolítjuk a speciális karaktereket, de megtartjuk az aposztrófot és kötőjelet
  return word
    .toLowerCase()
    .replace(/[?!.,;:]/g, '') // Írásjelek eltávolítása
    .replace(/'/g, "'") // Smart quote helyett normál aposztróf
    .trim();
};

export const fetchPhoneticFromAPI = async (word) => {
  if (!word) return '';
  
  try {
    // Ha kötőjeles összetett szó, külön dolgozzuk fel a részeket
    if (word.includes('-') && !word.startsWith('-') && !word.endsWith('-')) {
      const parts = word.split('-');
      const phoneticParts = [];
      
      for (const part of parts) {
        const cleanedPart = cleanWordForAPI(part);
        if (cleanedPart) {
          const response = await fetch(
            `https://api.datamuse.com/words?sp=${encodeURIComponent(cleanedPart)}&md=r&max=1`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].tags) {
              const pronTag = data[0].tags.find(tag => tag.startsWith('pron:'));
              if (pronTag) {
                const arpabet = pronTag.substring(5);
                phoneticParts.push(convertArpabetToIPA(arpabet));
                continue;
              }
            }
          }
          // Ha nincs API eredmény az adott részhez
          phoneticParts.push(generateAdvancedPhonetic(cleanedPart));
        }
      }
      
      return phoneticParts.join('-');
    }
    
    // Normál szó feldolgozása
    const cleanedWord = cleanWordForAPI(word);
    
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(cleanedWord)}&md=r&max=1`
    );
    
    if (!response.ok) {
      throw new Error('API hiba');
    }
    
    const data = await response.json();
    
    if (data && data.length > 0 && data[0].tags) {
      const pronTag = data[0].tags.find(tag => tag.startsWith('pron:'));
      
      if (pronTag) {
        const arpabet = pronTag.substring(5);
        return convertArpabetToIPA(arpabet);
      }
    }
    
    // Ha nincs API eredmény, használjunk fejlettebb lokális generálást
    return generateAdvancedPhonetic(word);
    
  } catch (error) {
    console.error('Fonetika API hiba:', error);
    return generateAdvancedPhonetic(word);
  }
};

// Fejlettebb lokális fonetika generálás
const generateAdvancedPhonetic = (word) => {
  if (!word) return '';
  
  let phonetic = word.toLowerCase();
  
  // Speciális karakterek eltávolítása (kivéve kötőjel)
  phonetic = phonetic.replace(/[?!.,;:]/g, '');
  
  // Ha kötőjeles összetett szó, külön dolgozzuk fel
  if (phonetic.includes('-') && !phonetic.startsWith('-') && !phonetic.endsWith('-')) {
    const parts = phonetic.split('-');
    const phoneticParts = parts.map(part => generateSingleWordPhonetic(part.trim()));
    return phoneticParts.join('-');
  }
  
  return generateSingleWordPhonetic(phonetic);
};

// Egyetlen szó fonetikájának generálása
const generateSingleWordPhonetic = (word) => {
  let phonetic = word;
  
  // Gyakori összevonások kezelése
  const contractions = {
    "don't": 'doʊnt',
    "won't": 'woʊnt',
    "can't": 'kænt',
    "i'm": 'aɪm',
    "you're": 'jʊr',
    "we're": 'wɪr',
    "they're": 'ðeər',
    "he's": 'hiːz',
    "she's": 'ʃiːz',
    "it's": 'ɪts',
    "what's": 'wʌts',
    "that's": 'ðæts',
    "there's": 'ðerz',
    "here's": 'hɪrz',
    "how's": 'haʊz',
    "let's": 'lets',
    "i've": 'aɪv',
    "you've": 'juːv',
    "we've": 'wiːv',
    "they've": 'ðeɪv',
    "i'll": 'aɪl',
    "you'll": 'juːl',
    "we'll": 'wiːl',
    "they'll": 'ðeɪl',
    "i'd": 'aɪd',
    "you'd": 'juːd',
    "we'd": 'wiːd',
    "they'd": 'ðeɪd'
  };
  
  // Ellenőrizzük, hogy összevonás-e
  for (const [contraction, ipa] of Object.entries(contractions)) {
    if (phonetic === contraction) {
      return ipa;
    }
  }
  
  // Gyakori szavak közvetlen IPA átírással
  const commonWords = {
    'the': 'ðə',
    'be': 'biː',
    'to': 'tuː',
    'of': 'ʌv',
    'and': 'ænd',
    'a': 'ə',
    'in': 'ɪn',
    'that': 'ðæt',
    'have': 'hæv',
    'i': 'aɪ',
    'it': 'ɪt',
    'for': 'fɔːr',
    'not': 'nɒt',
    'on': 'ɒn',
    'with': 'wɪð',
    'he': 'hiː',
    'as': 'æz',
    'you': 'juː',
    'do': 'duː',
    'at': 'æt',
    'this': 'ðɪs',
    'but': 'bʌt',
    'his': 'hɪz',
    'by': 'baɪ',
    'from': 'frʌm',
    'up': 'ʌp',
    'about': 'əˈbaʊt',
    'into': 'ˈɪntuː',
    'them': 'ðem',
    'can': 'kæn',
    'only': 'ˈoʊnli',
    'other': 'ˈʌðər',
    'new': 'nuː',
    'some': 'sʌm',
    'could': 'kʊd',
    'time': 'taɪm',
    'these': 'ðiːz',
    'two': 'tuː',
    'may': 'meɪ',
    'then': 'ðen',
    'now': 'naʊ',
    'look': 'lʊk',
    'more': 'mɔːr',
    'use': 'juːz',
    'her': 'hɜːr',
    'than': 'ðæn',
    'first': 'fɜːrst',
    'water': 'ˈwɔːtər',
    'been': 'biːn',
    'call': 'kɔːl',
    'who': 'huː',
    'oil': 'ɔɪl',
    'its': 'ɪts',
    'find': 'faɪnd',
    'long': 'lɔːŋ',
    'down': 'daʊn',
    'day': 'deɪ',
    'did': 'dɪd',
    'get': 'get',
    'has': 'hæz',
    'him': 'hɪm',
    'how': 'haʊ',
    'man': 'mæn',
    'go': 'goʊ',
    'going': 'ˈgoʊɪŋ',
    'what': 'wʌt',
    'are': 'ɑːr',
    'we': 'wiː',
    'like': 'laɪk',
    'when': 'wen',
    'make': 'meɪk',
    'can': 'kæn',
    'no': 'noʊ',
    'just': 'dʒʌst',
    'know': 'noʊ',
    'take': 'teɪk',
    'see': 'siː',
    'come': 'kʌm',
    'think': 'θɪŋk',
    'say': 'seɪ',
    'she': 'ʃiː',
    'which': 'wɪtʃ',
    'their': 'ðer',
    'would': 'wʊd',
    'all': 'ɔːl'
  };
  
  // Ha gyakori szó, használjuk a közvetlen átírást
  if (commonWords[phonetic]) {
    return commonWords[phonetic];
  }
  
  // Összetett szabályok alkalmazása
  
  // Végződések
  phonetic = phonetic.replace(/tion$/g, 'ʃən');
  phonetic = phonetic.replace(/sion$/g, 'ʒən');
  phonetic = phonetic.replace(/ture$/g, 'tʃər');
  phonetic = phonetic.replace(/ing$/g, 'ɪŋ');
  phonetic = phonetic.replace(/ed$/g, 'd');
  phonetic = phonetic.replace(/er$/g, 'ər');
  phonetic = phonetic.replace(/est$/g, 'ɪst');
  phonetic = phonetic.replace(/ly$/g, 'li');
  phonetic = phonetic.replace(/ness$/g, 'nəs');
  phonetic = phonetic.replace(/ment$/g, 'mənt');
  phonetic = phonetic.replace(/ful$/g, 'fʊl');
  phonetic = phonetic.replace(/less$/g, 'ləs');
  phonetic = phonetic.replace(/able$/g, 'əbəl');
  phonetic = phonetic.replace(/ible$/g, 'əbəl');
  
  // Mássalhangzó csoportok
  phonetic = phonetic.replace(/ph/g, 'f');
  phonetic = phonetic.replace(/gh/g, '');
  phonetic = phonetic.replace(/ch/g, 'tʃ');
  phonetic = phonetic.replace(/sh/g, 'ʃ');
  phonetic = phonetic.replace(/th/g, 'θ');
  phonetic = phonetic.replace(/ck/g, 'k');
  phonetic = phonetic.replace(/qu/g, 'kw');
  phonetic = phonetic.replace(/wh/g, 'w');
  phonetic = phonetic.replace(/wr/g, 'r');
  phonetic = phonetic.replace(/kn/g, 'n');
  
  // Magánhangzó kombinációk
  phonetic = phonetic.replace(/ee/g, 'iː');
  phonetic = phonetic.replace(/ea/g, 'iː');
  phonetic = phonetic.replace(/ie/g, 'iː');
  phonetic = phonetic.replace(/oo/g, 'uː');
  phonetic = phonetic.replace(/ou/g, 'aʊ');
  phonetic = phonetic.replace(/ow/g, 'oʊ');
  phonetic = phonetic.replace(/ai/g, 'eɪ');
  phonetic = phonetic.replace(/ay/g, 'eɪ');
  phonetic = phonetic.replace(/oi/g, 'ɔɪ');
  phonetic = phonetic.replace(/oy/g, 'ɔɪ');
  phonetic = phonetic.replace(/au/g, 'ɔː');
  phonetic = phonetic.replace(/aw/g, 'ɔː');
  phonetic = phonetic.replace(/ue/g, 'uː');
  phonetic = phonetic.replace(/ew/g, 'juː');
  
  // Egyszerű magánhangzók
  phonetic = phonetic.replace(/a/g, 'æ');
  phonetic = phonetic.replace(/e/g, 'e');
  phonetic = phonetic.replace(/i/g, 'ɪ');
  phonetic = phonetic.replace(/o/g, 'ɒ');
  phonetic = phonetic.replace(/u/g, 'ʌ');
  phonetic = phonetic.replace(/y/g, 'aɪ');
  
  return phonetic;
};

// Mondat szintű fonetika generálás
export const generatePhonetic = async (text) => {
  if (!text) return '';
  
  const cleanedText = text.toLowerCase().trim();
  
  // Ha mondat (több szó), akkor szavanként dolgozzuk fel
  if (cleanedText.includes(' ')) {
    // Szavakra bontás, de megőrizzük az összevonásokat és kötőjeles szavakat
    const words = cleanedText.split(/\s+/);
    const phoneticParts = [];
    
    for (const word of words) {
      // Tisztítjuk a szót, de megtartjuk a kötőjelet
      const cleanWord = word.replace(/[?!.,;:]/g, '');
      if (cleanWord) {
        const phonetic = await fetchPhoneticFromAPI(cleanWord);
        phoneticParts.push(phonetic);
      }
    }
    
    return phoneticParts.join(' ');
  }
  
  // Egyetlen szó esetén
  return fetchPhoneticFromAPI(cleanedText);
};

// Szinkron verzió fallback-hez
export const generatePhoneticSync = (text) => {
  if (!text) return '';
  
  const cleanedText = text.toLowerCase().trim();
  
  // Ha mondat, szavanként dolgozzuk fel
  if (cleanedText.includes(' ')) {
    const words = cleanedText.split(/\s+/);
    const phoneticParts = words.map(word => {
      const cleanWord = word.replace(/[?!.,;:]/g, '');
      return cleanWord ? generateAdvancedPhonetic(cleanWord) : '';
    }).filter(p => p);
    
    return phoneticParts.join(' ');
  }
  
  return generateAdvancedPhonetic(cleanedText);
};

export default generatePhonetic;
