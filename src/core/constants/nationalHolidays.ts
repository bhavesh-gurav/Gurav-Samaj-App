export interface NationalHoliday {
    month: number; // 0-indexed (0 = January)
    day: number;
    key: string;   // Maps to i18n translation key
    name: string;  // Marathi display name for calendar cell
}

/**
 * Comprehensive Indian holidays and festivals for the year 2026.
 * Dates for lunar/movable festivals are approximate for 2026.
 * Month is 0-indexed (0 = January, 11 = December).
 */
export const INDIAN_NATIONAL_HOLIDAYS: NationalHoliday[] = [
    // ──────────── जानेवारी (January) ────────────
    { month: 0, day: 1, key: 'new_year', name: 'नववर्ष' },
    { month: 0, day: 6, key: 'angarak_chaturthi', name: 'अंगारक चतुर्थी' },
    { month: 0, day: 14, key: 'makar_sankranti', name: 'मकर संक्रांती' },
    { month: 0, day: 15, key: 'pongal', name: 'पोंगल' },
    { month: 0, day: 23, key: 'netaji_subhashchandra_bose_jayanti', name: 'नेताजी सुभाषचंद्र बोस जयंती' },
    { month: 0, day: 26, key: 'republic_day', name: 'प्रजासत्ताक दिन' },
    { month: 0, day: 29, key: 'jay_ekadashi', name: 'जय एकादशी' },

    // ──────────── फेब्रुवारी (February) ────────────
    { month: 1, day: 3, key: 'basant_panchami', name: 'बसंत पंचमी' },
    { month: 1, day: 6, key: 'sankashti_chaturthi', name: 'संकष्ट चतुर्थी' },
    { month: 1, day: 14, key: 'valentine_day', name: 'व्हॅलेंटाइन दिन' },
    { month: 1, day: 15, key: 'maha_shivaratri', name: 'महाशिवरात्री' },
    { month: 1, day: 19, key: 'shivaji_jayanti', name: 'छत्रपती शिवाजी महाराज जयंती' },
    { month: 1, day: 27, key: 'marathi_bhasha_din', name: 'मराठी भाषा दिन' },

    // ──────────── मार्च (March) ────────────
    { month: 2, day: 2, key: 'maharashtra_din_false', name: 'होळी' },  // Holi approximate
    { month: 2, day: 3, key: 'holi', name: 'धुलिवंदन' },
    { month: 2, day: 6, key: 'shivaji_maharaj_jayanti_tithipramane', name: 'छत्रपती शिवाजी महाराज जयंती (तिथीप्रमाने)' },
    { month: 2, day: 14, key: 'sant_kashiba_maharaj_punyatithi', name: 'श्री संत काशिबा महाराज पुण्यतिथी' },
    { month: 2, day: 19, key: 'gudi_padwa', name: 'गुढीपाडवा' },
    { month: 2, day: 21, key: 'ramzan_eid', name: 'रमजान ईद' },
    { month: 2, day: 26, key: 'ram_navami', name: 'रामनवमी' },

    // ──────────── एप्रिल (April) ────────────
    { month: 3, day: 2, key: 'hanuman_janmotsav', name: 'हनुमान जन्मोत्सव' },
    { month: 3, day: 3, key: 'good_friday', name: 'गुड फ्रायडे' },
    { month: 3, day: 5, key: 'easter_sankashti_chaturthi', name: 'ईस्टर संडे & संकष्ट चतुर्थी' },
    { month: 3, day: 14, key: 'ambedkar_jayanti', name: 'डॉ. आंबेडकर जयंती' },
    { month: 3, day: 17, key: 'darsh_amavasya', name: 'दर्श अमावस्या' },
    { month: 3, day: 19, key: 'akshaya_trutiya_parshuram_jayanti', name: 'अक्षय तृतिया & परशुराम जयंती' },

    // ──────────── मे (May) ────────────
    { month: 4, day: 1, key: 'may_day', name: 'महाराष्ट्र दिन / कामगार दिन' },
    { month: 4, day: 1, key: 'buddha_purnima', name: 'बुद्ध पौर्णिमा' },
    { month: 4, day: 5, key: 'angarak_chaturthi', name: 'अंगारक चतुर्थी' },
    { month: 4, day: 14, key: 'dharmaveer_sambhaji_maharaj_jayanti', name: 'धर्मवीर संभाजी महाराज जयंती' },
    { month: 4, day: 16, key: 'darsh_amavasya', name: 'दर्श अमावस्या' },
    { month: 4, day: 17, key: 'bakri_eid', name: 'बकरी ईद' },

    // ──────────── जून (June) ────────────
    { month: 5, day: 3, key: 'sankashti_chaturthi', name: 'संकष्ट चतुर्थी' },
    { month: 5, day: 3, key: 'nirjala_ekadashi', name: 'निर्जला एकादशी' },
    { month: 5, day: 21, key: 'yoga_day', name: 'आंतरराष्ट्रीय योग दिन' },
    { month: 5, day: 26, key: 'muharram', name: 'मोहरम' },

    // ──────────── जुलै (July) ────────────
    { month: 6, day: 3, key: 'sankashti_chaturthi', name: 'संकष्ट चतुर्थी' },
    { month: 6, day: 11, key: 'guru_purnima', name: 'गुरुपौर्णिमा' },
    { month: 6, day: 25, key: 'devshayan_ashadhi_ekadashi', name: 'देवशयनी आषाढी एकादशी' },
    { month: 6, day: 29, key: 'gurupurnima', name: 'गुरुपौर्णिमा' },

    // ──────────── ऑगस्ट (August) ────────────
    { month: 7, day: 15, key: 'independence_day', name: 'स्वातंत्र्य दिन' },
    { month: 7, day: 17, key: 'nag_panchami', name: 'नागपंचमी' },
    { month: 7, day: 26, key: 'milad_un_nabi', name: 'ईद-ए-मिलाद' },
    { month: 7, day: 27, key: 'narali_purnima', name: 'नारळी पर्णिमा' },
    { month: 7, day: 28, key: 'raksha_bandhan', name: 'रक्षाबंधन' },

    // ──────────── सप्टेंबर (September) ────────────.
    { month: 8, day: 4, key: 'krishna_jayanti', name: 'श्रीकृष्ण जयंती' },
    { month: 8, day: 5, key: 'teacher_day', name: 'शिक्षक दिन & गोपालकाला' },
    { month: 8, day: 15, key: 'haritalika_chaturthi', name: 'हरितालिका आणि श्रीगणेश चतुर्थी' },
    { month: 8, day: 18, key: 'anant_chaturthi', name: 'अनंत चतुर्थी' },

    // ──────────── ऑक्टोबर (October) ────────────
    { month: 9, day: 2, key: 'gandhi_jayanti', name: 'गांधी जयंती' },
    { month: 9, day: 11, key: 'navratri_start', name: 'नवरात्री प्रारंभ & घटस्थापना' },
    { month: 9, day: 20, key: 'dussehra', name: 'दसरा / विजयादशमी' },
    { month: 9, day: 25, key: 'kojagiri_purnima', name: 'कोजागिरी पौर्णिमा' },

    // ──────────── नोव्हेंबर (November) ────────────
    { month: 10, day: 6, key: 'dhantrayodashi', name: 'धनत्रयोदशी' },
    { month: 10, day: 8, key: 'diwali_lakshmi_puja', name: 'लक्ष्मीपूजन / दिवाळी / नरक चतुर्दशी' },
    { month: 10, day: 10, key: 'diwali_padwa', name: 'बलिप्रतिपदा / पाडवा' },
    { month: 10, day: 11, key: 'bhau_beej', name: 'भाऊबीज' },
    { month: 10, day: 24, key: 'guru_nanak_jayanti', name: 'गुरुनानक जयंती' },

    // ──────────── डिसेंबर (December) ────────────
    { month: 11, day: 20, key: 'gita_jayanti', name: 'गीता जयंती' },
    { month: 11, day: 25, key: 'christmas', name: 'ख्रिसमस' },
    { month: 11, day: 31, key: 'new_year_eve', name: 'नववर्ष पूर्वसंध्या' },
];
