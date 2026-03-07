/**
 * Translates Panchang field values to Marathi.
 * Covers all 30 Tithis, 27 Nakshatras, Pakshas, Hindu months, Yogas, and Karanas.
 */

const TITHI_MAP: Record<string, string> = {
    'Pratipada': 'प्रतिपदा',
    'Dwitiya': 'द्वितीया',
    'Tritiya': 'तृतीया',
    'Chaturthi': 'चतुर्थी',
    'Panchami': 'पंचमी',
    'Shashthi': 'षष्ठी',
    'Saptami': 'सप्तमी',
    'Ashtami': 'अष्टमी',
    'Navami': 'नवमी',
    'Dashami': 'दशमी',
    'Ekadashi': 'एकादशी',
    'Dwadashi': 'द्वादशी',
    'Trayodashi': 'त्रयोदशी',
    'Chaturdashi': 'चतुर्दशी',
    'Purnima': 'पौर्णिमा',
    'Amavasya': 'अमावस्या',
};

const NAKSHATRA_MAP: Record<string, string> = {
    'Ashwini': 'अश्विनी',
    'Bharani': 'भरणी',
    'Krittika': 'कृत्तिका',
    'Rohini': 'रोहिणी',
    'Mrigashira': 'मृगशीर्ष',
    'Ardra': 'आर्द्रा',
    'Punarvasu': 'पुनर्वसू',
    'Pushya': 'पुष्य',
    'Ashlesha': 'आश्लेषा',
    'Magha': 'मघा',
    'Purva Phalguni': 'पूर्वा फाल्गुनी',
    'Uttara Phalguni': 'उत्तरा फाल्गुनी',
    'Hasta': 'हस्त',
    'Chitra': 'चित्रा',
    'Swati': 'स्वाती',
    'Vishakha': 'विशाखा',
    'Anuradha': 'अनुराधा',
    'Jyeshtha': 'ज्येष्ठा',
    'Mula': 'मूळ',
    'Purva Ashadha': 'पूर्वाषाढा',
    'Uttara Ashadha': 'उत्तराषाढा',
    'Shravana': 'श्रवण',
    'Dhanishtha': 'धनिष्ठा',
    'Shatabhisha': 'शतभिषा',
    'Purva Bhadrapada': 'पूर्वा भाद्रपद',
    'Uttara Bhadrapada': 'उत्तरा भाद्रपद',
    'Revati': 'रेवती',
};

const PAKSHA_MAP: Record<string, string> = {
    'Shukla Paksha': 'शुक्ल पक्ष',
    'Krishna Paksha': 'कृष्ण पक्ष',
};

const MONTH_MAP: Record<string, string> = {
    'Chaitra': 'चैत्र',
    'Vaishakha': 'वैशाख',
    'Jyeshtha': 'ज्येष्ठ',
    'Ashadha': 'आषाढ',
    'Shravana': 'श्रावण',
    'Bhadrapada': 'भाद्रपद',
    'Ashwin': 'आश्विन',
    'Kartik': 'कार्तिक',
    'Margashirsha': 'मार्गशीर्ष',
    'Pausha': 'पौष',
    'Magha': 'माघ',
    'Phalguna': 'फाल्गुन',
};

const YOGA_MAP: Record<string, string> = {
    'Vishkumbha': 'विष्कंभ', 'Priti': 'प्रीति', 'Ayushman': 'आयुष्मान',
    'Saubhagya': 'सौभाग्य', 'Shobhana': 'शोभन', 'Atiganda': 'अतिगंड',
    'Sukarma': 'सुकर्मा', 'Dhriti': 'धृति', 'Shula': 'शूल',
    'Ganda': 'गंड', 'Vriddhi': 'वृद्धी', 'Dhruva': 'ध्रुव',
    'Vyaghata': 'व्याघात', 'Harshana': 'हर्षण', 'Vajra': 'वज्र',
    'Siddhi': 'सिद्धी', 'Vyatipata': 'व्यतिपात', 'Variyan': 'वरियान',
    'Parigha': 'परिघ', 'Shiva': 'शिव', 'Siddha': 'सिद्ध',
    'Sadhya': 'साध्य', 'Shubha': 'शुभ', 'Shukla': 'शुक्ल',
    'Brahma': 'ब्रह्म', 'Indra': 'इंद्र', 'Vaidhriti': 'वैधृति',
};

const KARANA_MAP: Record<string, string> = {
    'Bava': 'बव', 'Balava': 'बालव', 'Kaulava': 'कौलव',
    'Taitila': 'तैतिल', 'Garaja': 'गरज', 'Vanija': 'वणिज',
    'Vishti': 'विष्टी', 'Shakuni': 'शकुनी', 'Chatushpada': 'चतुष्पद',
    'Nagava': 'नागव', 'Kimstughna': 'किंस्तुघ्न',
};

export const translatePanchangField = (value: string, languageCode: string): string => {
    if (languageCode === 'en' || !languageCode) return value;

    // Check all maps
    if (TITHI_MAP[value]) return TITHI_MAP[value];
    if (NAKSHATRA_MAP[value]) return NAKSHATRA_MAP[value];
    if (PAKSHA_MAP[value]) return PAKSHA_MAP[value];
    if (MONTH_MAP[value]) return MONTH_MAP[value];
    if (YOGA_MAP[value]) return YOGA_MAP[value];
    if (KARANA_MAP[value]) return KARANA_MAP[value];

    // Paksha short: 'S' = शु, 'K' = कृ
    if (value === 'S') return 'शु';
    if (value === 'K') return 'कृ';

    return value;
};
