// src/utils/phoneticHelper.js

const arpabetToIPA = {

  'AA': 'ɑː', 'AE': 'æ', 'AH': 'ʌ', 'AO': 'ɔː', 'AW': 'aʊ',
  'AY': 'aɪ', 'EH': 'e', 'ER': 'ɜːr', 'EY': 'eɪ', 'IH': 'ɪ',
  'IY': 'iː', 'OW': 'oʊ', 'OY': 'ɔɪ', 'UH': 'ʊ', 'UW': 'uː',
  
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
  let primaryStressNext = false;
  
  for (let part of parts) {
    const stress = part.match(/[012]$/);
    const phoneme = part.replace(/[012]$/, '');
    
    if (stress && stress[0] === '1') {
      ipa += 'ˈ'; 
    } else if (stress && stress[0] === '2') {
      ipa += 'ˌ'; 
    }
    
    ipa += arpabetToIPA[phoneme] || phoneme.toLowerCase();
  }
  
  return ipa;
};

export const fetchPhoneticFromAPI = async (word) => {
  if (!word) return '';
  
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=r&max=1`
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
    
    return generateBasicPhonetic(word);
    
  } catch (error) {
    console.error('Fonetika API hiba:', error);
    return generateBasicPhonetic(word);
  }
};

const generateBasicPhonetic = (word) => {
  if (!word) return '';
  
  let phonetic = word.toLowerCase();
  
  phonetic = phonetic.replace(/tion$/g, 'ʃən');
  phonetic = phonetic.replace(/sion$/g, 'ʒən');
  phonetic = phonetic.replace(/ture$/g, 'tʃər');
  phonetic = phonetic.replace(/ing$/g, 'ɪŋ');
  phonetic = phonetic.replace(/ed$/g, 'd');
  phonetic = phonetic.replace(/er$/g, 'ər');
  phonetic = phonetic.replace(/ly$/g, 'li');
  
  phonetic = phonetic.replace(/ph/g, 'f');
  phonetic = phonetic.replace(/ch/g, 'tʃ');
  phonetic = phonetic.replace(/sh/g, 'ʃ');
  phonetic = phonetic.replace(/th/g, 'θ');
  phonetic = phonetic.replace(/ck/g, 'k');
  
  phonetic = phonetic.replace(/ee/g, 'iː');
  phonetic = phonetic.replace(/ea/g, 'iː');
  phonetic = phonetic.replace(/oo/g, 'uː');
  phonetic = phonetic.replace(/ou/g, 'aʊ');
  
  return phonetic;
};

export const generatePhonetic = async (text) => {
  if (!text) return '';
  
  const words = text.toLowerCase().trim().split(' ');
  
  if (words.length > 1) {
    const phoneticParts = await Promise.all(
      words.map(word => fetchPhoneticFromAPI(word))
    );
    return phoneticParts.join(' ');
  }

  return fetchPhoneticFromAPI(text);
};


export const generatePhoneticSync = (text) => {
  return generateBasicPhonetic(text);
};

export default generatePhonetic;
