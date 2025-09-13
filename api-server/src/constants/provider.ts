export enum Provider {
  GOOGLE = "google",
  CREDENTIALS = "credentials",
  GITHUB = "github",
  FACEBOOK = "facebook",
  TWITTER = "twitter",
  LINKEDIN = "linkedin",
  MICROSOFT = "microsoft",
  DISCORD = "discord",
}

export const languages = [
  { code: "ab", language: "Abkhaz" },
  { code: "ace", language: "Acehnese" },
  { code: "ach", language: "Acholi" },
  { code: "af", language: "Afrikaans" },
  { code: "sq", language: "Albanian" },
  { code: "alz", language: "Alur" },
  { code: "am", language: "Amharic" },
  { code: "ar", language: "Arabic" },
  { code: "hy", language: "Armenian" },
  { code: "as", language: "Assamese" },
  { code: "awa", language: "Awadhi" },
  { code: "ay", language: "Aymara" },
  { code: "az", language: "Azerbaijani" },
  { code: "ban", language: "Balinese" },
  { code: "bm", language: "Bambara" },
  { code: "ba", language: "Bashkir" },
  { code: "eu", language: "Basque" },
  { code: "btx", language: "Batak Karo" },
  { code: "bts", language: "Batak Simalungun" },
  { code: "bbc", language: "Batak Toba" },
  { code: "be", language: "Belarusian" },
  { code: "bem", language: "Bemba" },
  { code: "bn", language: "Bengali" },
  { code: "bew", language: "Betawi" },
  { code: "bho", language: "Bhojpuri" },
  { code: "bik", language: "Bikol" },
  { code: "bs", language: "Bosnian" },
  { code: "br", language: "Breton" },
  { code: "bg", language: "Bulgarian" },
  { code: "bua", language: "Buryat" },
  { code: "yue", language: "Cantonese" },
  { code: "ca", language: "Catalan" },
  { code: "ceb", language: "Cebuano" },
  { code: "ny", language: "Chichewa (Nyanja)" },
  { code: "zh-CN", language: "Chinese (Simplified)" },
  { code: "zh-TW", language: "Chinese (Traditional)" },
  { code: "cv", language: "Chuvash" },
  { code: "co", language: "Corsican" },
  { code: "crh", language: "Crimean Tatar" },
  { code: "hr", language: "Croatian" },
  { code: "cs", language: "Czech" },
  { code: "da", language: "Danish" },
  { code: "din", language: "Dinka" },
  { code: "dv", language: "Divehi" },
  { code: "doi", language: "Dogri" },
  { code: "dov", language: "Dombe" },
  { code: "nl", language: "Dutch" },
  { code: "dz", language: "Dzongkha" },
  { code: "en", language: "English" },
  { code: "eo", language: "Esperanto" },
  { code: "et", language: "Estonian" },
  { code: "ee", language: "Ewe" },
  { code: "fj", language: "Fijian" },
  { code: "fil", language: "Filipino (Tagalog)" },
  { code: "fi", language: "Finnish" },
  { code: "fr", language: "French" },
  { code: "fr-FR", language: "French (French)" },
  { code: "fr-CA", language: "French (Canadian)" },
  { code: "fy", language: "Frisian" },
  { code: "ff", language: "Fulfulde" },
  { code: "gaa", language: "Ga" },
  { code: "gl", language: "Galician" },
  { code: "lg", language: "Ganda (Luganda)" },
  { code: "ka", language: "Georgian" },
  { code: "de", language: "German" },
  { code: "el", language: "Greek" },
  { code: "gn", language: "Guarani" },
  { code: "gu", language: "Gujarati" },
  { code: "ht", language: "Haitian Creole" },
  { code: "cnh", language: "Hakha Chin" },
  { code: "ha", language: "Hausa" },
  { code: "haw", language: "Hawaiian" },
  { code: "he", language: "Hebrew" },
  { code: "hil", language: "Hiligaynon" },
  { code: "hi", language: "Hindi" },
  { code: "hmn", language: "Hmong" },
  { code: "hu", language: "Hungarian" },
  { code: "hrx", language: "Hunsrik" },
  { code: "is", language: "Icelandic" },
  { code: "ig", language: "Igbo" },
  { code: "ilo", language: "Iloko" },
  { code: "id", language: "Indonesian" },
  { code: "ga", language: "Irish" },
  { code: "it", language: "Italian" },
  { code: "ja", language: "Japanese" },
  { code: "jv", language: "Javanese" },
  { code: "kn", language: "Kannada" },
  { code: "pam", language: "Kapampangan" },
  { code: "kk", language: "Kazakh" },
  { code: "km", language: "Khmer" },
  { code: "cgg", language: "Kiga" },
  { code: "rw", language: "Kinyarwanda" },
  { code: "ktu", language: "Kituba" },
  { code: "gom", language: "Konkani" },
  { code: "ko", language: "Korean" },
  { code: "kri", language: "Krio" },
  { code: "ku", language: "Kurdish (Kurmanji)" },
  { code: "ckb", language: "Kurdish (Sorani)" },
  { code: "ky", language: "Kyrgyz" },
  { code: "lo", language: "Lao" },
  { code: "ltg", language: "Latgalian" },
  { code: "la", language: "Latin" },
  { code: "lv", language: "Latvian" },
  { code: "lij", language: "Ligurian" },
  { code: "li", language: "Limburgan" },
  { code: "ln", language: "Lingala" },
  { code: "lt", language: "Lithuanian" },
  { code: "lmo", language: "Lombard" },
  { code: "luo", language: "Luo" },
  { code: "lb", language: "Luxembourgish" },
  { code: "mk", language: "Macedonian" },
  { code: "mai", language: "Maithili" },
  { code: "mak", language: "Makassar" },
  { code: "mg", language: "Malagasy" },
  { code: "ms", language: "Malay" },
  { code: "ms-Arab", language: "Malay (Jawi)" },
  { code: "ml", language: "Malayalam" },
  { code: "mt", language: "Maltese" },
  { code: "mi", language: "Maori" },
  { code: "mr", language: "Marathi" },
  { code: "chm", language: "Meadow Mari" },
  { code: "mni-Mtei", language: "Meiteilon (Manipuri)" },
  { code: "min", language: "Minang" },
  { code: "lus", language: "Mizo" },
  { code: "mn", language: "Mongolian" },
  { code: "my", language: "Myanmar (Burmese)" },
  { code: "nr", language: "Ndebele (South)" },
  { code: "new", language: "Nepalbhasa (Newari)" },
  { code: "ne", language: "Nepali" },
  { code: "nso", language: "Northern Sotho (Sepedi)" },
  { code: "no", language: "Norwegian" },
  { code: "nus", language: "Nuer" },
  { code: "oc", language: "Occitan" },
  { code: "or", language: "Odia (Oriya)" },
  { code: "om", language: "Oromo" },
  { code: "pag", language: "Pangasinan" },
  { code: "pap", language: "Papiamento" },
  { code: "ps", language: "Pashto" },
  { code: "fa", language: "Persian" },
  { code: "pl", language: "Polish" },
  { code: "pt", language: "Portuguese" },
  { code: "pt-PT", language: "Portuguese (Portugal)" },
  { code: "pt-BR", language: "Portuguese (Brazil)" },
  { code: "pa", language: "Punjabi" },
  { code: "pa-Arab", language: "Punjabi (Shahmukhi)" },
  { code: "qu", language: "Quechua" },
  { code: "rom", language: "Romani" },
  { code: "ro", language: "Romanian" },
  { code: "rn", language: "Rundi" },
  { code: "ru", language: "Russian" },
  { code: "sm", language: "Samoan" },
  { code: "sg", language: "Sango" },
  { code: "sa", language: "Sanskrit" },
  { code: "gd", language: "Scots Gaelic" },
  { code: "sr", language: "Serbian" },
  { code: "st", language: "Sesotho" },
  { code: "crs", language: "Seychellois Creole" },
  { code: "shn", language: "Shan" },
  { code: "sn", language: "Shona" },
  { code: "scn", language: "Sicilian" },
  { code: "szl", language: "Silesian" },
  { code: "sd", language: "Sindhi" },
  { code: "si", language: "Sinhala (Sinhalese)" },
  { code: "sk", language: "Slovak" },
  { code: "sl", language: "Slovenian" },
  { code: "so", language: "Somali" },
  { code: "es", language: "Spanish" },
  { code: "su", language: "Sundanese" },
  { code: "sw", language: "Swahili" },
  { code: "ss", language: "Swati" },
  { code: "sv", language: "Swedish" },
  { code: "tg", language: "Tajik" },
  { code: "ta", language: "Tamil" },
  { code: "tt", language: "Tatar" },
  { code: "te", language: "Telugu" },
  { code: "tet", language: "Tetum" },
  { code: "th", language: "Thai" },
  { code: "ti", language: "Tigrinya" },
  { code: "ts", language: "Tsonga" },
  { code: "tn", language: "Tswana" },
  { code: "tr", language: "Turkish" },
  { code: "tk", language: "Turkmen" },
  { code: "ak", language: "Twi (Akan)" },
  { code: "uk", language: "Ukrainian" },
  { code: "ur", language: "Urdu" },
  { code: "ug", language: "Uyghur" },
  { code: "uz", language: "Uzbek" },
  { code: "vi", language: "Vietnamese" },
  { code: "cy", language: "Welsh" },
  { code: "xh", language: "Xhosa" },
  { code: "yi", language: "Yiddish" },
  { code: "yo", language: "Yoruba" },
  { code: "yua", language: "Yucatec Maya" },
  { code: "zu", language: "Zulu" }
];

export const voices = [
  {
    "name": "af-ZA-AdriNeural",
    "gender": "Female",
    "language": "Afrikaans (South Africa)"
  },
  {
    "name": "af-ZA-WillemNeural",
    "gender": "Male",
    "language": "Afrikaans (South Africa)"
  },
  {
    "name": "sq-AL-AnilaNeural",
    "gender": "Female",
    "language": "Albanian (Albania)"
  },
  {
    "name": "sq-AL-IlirNeural",
    "gender": "Male",
    "language": "Albanian (Albania)"
  },
  {
    "name": "am-ET-AmehaNeural",
    "gender": "Male",
    "language": "Amharic (Ethiopia)"
  },
  {
    "name": "am-ET-MekdesNeural",
    "gender": "Female",
    "language": "Amharic (Ethiopia)"
  },
  {
    "name": "ar-DZ-AminaNeural",
    "gender": "Female",
    "language": "Arabic (Algeria)"
  },
  {
    "name": "ar-DZ-IsmaelNeural",
    "gender": "Male",
    "language": "Arabic (Algeria)"
  },
  {
    "name": "ar-BH-AliNeural",
    "gender": "Male",
    "language": "Arabic (Bahrain)"
  },
  {
    "name": "ar-BH-LailaNeural",
    "gender": "Female",
    "language": "Arabic (Bahrain)"
  },
  {
    "name": "ar-EG-SalmaNeural",
    "gender": "Female",
    "language": "Arabic (Egypt)"
  },
  {
    "name": "ar-EG-ShakirNeural",
    "gender": "Male",
    "language": "Arabic (Egypt)"
  },
  {
    "name": "ar-IQ-BasselNeural",
    "gender": "Male",
    "language": "Arabic (Iraq)"
  },
  {
    "name": "ar-IQ-RanaNeural",
    "gender": "Female",
    "language": "Arabic (Iraq)"
  },
  {
    "name": "ar-JO-SanaNeural",
    "gender": "Female",
    "language": "Arabic (Jordan)"
  },
  {
    "name": "ar-JO-TaimNeural",
    "gender": "Male",
    "language": "Arabic (Jordan)"
  },
  {
    "name": "ar-KW-FahedNeural",
    "gender": "Male",
    "language": "Arabic (Kuwait)"
  },
  {
    "name": "ar-KW-NouraNeural",
    "gender": "Female",
    "language": "Arabic (Kuwait)"
  },
  {
    "name": "ar-LB-LaylaNeural",
    "gender": "Female",
    "language": "Arabic (Lebanon)"
  },
  {
    "name": "ar-LB-RamiNeural",
    "gender": "Male",
    "language": "Arabic (Lebanon)"
  },
  {
    "name": "ar-LY-ImanNeural",
    "gender": "Female",
    "language": "Arabic (Libya)"
  },
  {
    "name": "ar-LY-OmarNeural",
    "gender": "Male",
    "language": "Arabic (Libya)"
  },
  {
    "name": "ar-MA-JamalNeural",
    "gender": "Male",
    "language": "Arabic (Morocco)"
  },
  {
    "name": "ar-MA-MounaNeural",
    "gender": "Female",
    "language": "Arabic (Morocco)"
  },
  {
    "name": "ar-OM-AbdullahNeural",
    "gender": "Male",
    "language": "Arabic (Oman)"
  },
  {
    "name": "ar-OM-AyshaNeural",
    "gender": "Female",
    "language": "Arabic (Oman)"
  },
  {
    "name": "ar-QA-AmalNeural",
    "gender": "Female",
    "language": "Arabic (Qatar)"
  },
  {
    "name": "ar-QA-MoazNeural",
    "gender": "Male",
    "language": "Arabic (Qatar)"
  },
  {
    "name": "ar-SA-HamedNeural",
    "gender": "Male",
    "language": "Arabic (Saudi Arabia)"
  },
  {
    "name": "ar-SA-ZariyahNeural",
    "gender": "Female",
    "language": "Arabic (Saudi Arabia)"
  },
  {
    "name": "ar-SY-AmanyNeural",
    "gender": "Female",
    "language": "Arabic (Syria)"
  },
  {
    "name": "ar-SY-LaithNeural",
    "gender": "Male",
    "language": "Arabic (Syria)"
  },
  {
    "name": "ar-TN-HediNeural",
    "gender": "Male",
    "language": "Arabic (Tunisia)"
  },
  {
    "name": "ar-TN-ReemNeural",
    "gender": "Female",
    "language": "Arabic (Tunisia)"
  },
  {
    "name": "ar-AE-FatimaNeural",
    "gender": "Female",
    "language": "Arabic (United Arab Emirates)"
  },
  {
    "name": "ar-AE-HamdanNeural",
    "gender": "Male",
    "language": "Arabic (United Arab Emirates)"
  },
  {
    "name": "ar-YE-MaryamNeural",
    "gender": "Female",
    "language": "Arabic (Yemen)"
  },
  {
    "name": "ar-YE-SalehNeural",
    "gender": "Male",
    "language": "Arabic (Yemen)"
  },
  {
    "name": "az-AZ-BabekNeural",
    "gender": "Male",
    "language": "Azerbaijani (Azerbaijan)"
  },
  {
    "name": "az-AZ-BanuNeural",
    "gender": "Female",
    "language": "Azerbaijani (Azerbaijan)"
  },
  {
    "name": "bn-BD-NabanitaNeural",
    "gender": "Female",
    "language": "Bengali (Bangladesh)"
  },
  {
    "name": "bn-BD-PradeepNeural",
    "gender": "Male",
    "language": "Bengali (Bangladesh)"
  },
  {
    "name": "bn-IN-BashkarNeural",
    "gender": "Male",
    "language": "Bengali (India)"
  },
  {
    "name": "bn-IN-TanishaaNeural",
    "gender": "Female",
    "language": "Bengali (India)"
  },
  {
    "name": "bs-BA-GoranNeural",
    "gender": "Male",
    "language": "Bosnian (Bosnia and Herzegovina)"
  },
  {
    "name": "bs-BA-VesnaNeural",
    "gender": "Female",
    "language": "Bosnian (Bosnia and Herzegovina)"
  },
  {
    "name": "bg-BG-BorislavNeural",
    "gender": "Male",
    "language": "Bulgarian (Bulgaria)"
  },
  {
    "name": "bg-BG-KalinaNeural",
    "gender": "Female",
    "language": "Bulgarian (Bulgaria)"
  },
  {
    "name": "my-MM-NilarNeural",
    "gender": "Female",
    "language": "Burmese (Myanmar)"
  },
  {
    "name": "my-MM-ThihaNeural",
    "gender": "Male",
    "language": "Burmese (Myanmar)"
  },
  {
    "name": "ca-ES-EnricNeural",
    "gender": "Male",
    "language": "Catalan (Spain)"
  },
  {
    "name": "ca-ES-JoanaNeural",
    "gender": "Female",
    "language": "Catalan (Spain)"
  },
  {
    "name": "zh-HK-HiuGaaiNeural",
    "gender": "Female",
    "language": "Chinese (Cantonese, Hong Kong)"
  },
  {
    "name": "zh-HK-HiuMaanNeural",
    "gender": "Female",
    "language": "Chinese (Cantonese, Hong Kong)"
  },
  {
    "name": "zh-HK-WanLungNeural",
    "gender": "Male",
    "language": "Chinese (Cantonese, Hong Kong)"
  },
  {
    "name": "zh-CN-XiaoxiaoNeural",
    "gender": "Female",
    "language": "Chinese (Mandarin, Simplified)"
  },
  {
    "name": "zh-CN-XiaoyiNeural",
    "gender": "Female",
    "language": "Chinese (Mandarin, Simplified)"
  },
  {
    "name": "zh-CN-YunjianNeural",
    "gender": "Male",
    "language": "Chinese (Mandarin, Simplified)"
  },
  {
    "name": "zh-CN-YunxiNeural",
    "gender": "Male",
    "language": "Chinese (Mandarin, Simplified)"
  },
  {
    "name": "zh-CN-YunxiaNeural",
    "gender": "Male",
    "language": "Chinese (Mandarin, Simplified)"
  },
  {
    "name": "zh-CN-YunyangNeural",
    "gender": "Male",
    "language": "Chinese (Mandarin, Simplified)"
  },
  {
    "name": "zh-CN-liaoning-XiaobeiNeural",
    "gender": "Female",
    "language": "Chinese (Liaoning Mandarin)"
  },
  {
    "name": "zh-TW-HsiaoChenNeural",
    "gender": "Female",
    "language": "Chinese (Taiwanese Mandarin)"
  },
  {
    "name": "zh-TW-YunJheNeural",
    "gender": "Male",
    "language": "Chinese (Taiwanese Mandarin)"
  },
  {
    "name": "zh-TW-HsiaoYuNeural",
    "gender": "Female",
    "language": "Chinese (Taiwanese Mandarin)"
  },
  {
    "name": "zh-CN-shaanxi-XiaoniNeural",
    "gender": "Female",
    "language": "Chinese (Shaanxi Mandarin)"
  },
  {
    "name": "hr-HR-GabrijelaNeural",
    "gender": "Female",
    "language": "Croatian (Croatia)"
  },
  {
    "name": "hr-HR-SreckoNeural",
    "gender": "Male",
    "language": "Croatian (Croatia)"
  },
  {
    "name": "cs-CZ-AntoninNeural",
    "gender": "Male",
    "language": "Czech (Czech Republic)"
  },
  {
    "name": "cs-CZ-VlastaNeural",
    "gender": "Female",
    "language": "Czech (Czech Republic)"
  },
  {
    "name": "da-DK-ChristelNeural",
    "gender": "Female",
    "language": "Danish (Denmark)"
  },
  {
    "name": "da-DK-JeppeNeural",
    "gender": "Male",
    "language": "Danish (Denmark)"
  },
  {
    "name": "nl-BE-ArnaudNeural",
    "gender": "Male",
    "language": "Dutch (Belgium)"
  },
  {
    "name": "nl-BE-DenaNeural",
    "gender": "Female",
    "language": "Dutch (Belgium)"
  },
  {
    "name": "nl-NL-ColetteNeural",
    "gender": "Female",
    "language": "Dutch (Netherlands)"
  },
  {
    "name": "nl-NL-FennaNeural",
    "gender": "Female",
    "language": "Dutch (Netherlands)"
  },
  {
    "name": "nl-NL-MaartenNeural",
    "gender": "Male",
    "language": "Dutch (Netherlands)"
  },
  {
    "name": "en-AU-NatashaNeural",
    "gender": "Female",
    "language": "English (Australia)"
  },
  {
    "name": "en-AU-WilliamNeural",
    "gender": "Male",
    "language": "English (Australia)"
  },
  {
    "name": "en-CA-ClaraNeural",
    "gender": "Female",
    "language": "English (Canada)"
  },
  {
    "name": "en-CA-LiamNeural",
    "gender": "Male",
    "language": "English (Canada)"
  },
  {
    "name": "en-HK-SamNeural",
    "gender": "Male",
    "language": "English (Hong Kong)"
  },
  {
    "name": "en-HK-YanNeural",
    "gender": "Female",
    "language": "English (Hong Kong)"
  },
  {
    "name": "en-IN-NeerjaNeural",
    "gender": "Female",
    "language": "English (India)"
  },
  {
    "name": "en-IN-PrabhatNeural",
    "gender": "Male",
    "language": "English (India)"
  },
  {
    "name": "en-IE-ConnorNeural",
    "gender": "Male",
    "language": "English (Ireland)"
  },
  {
    "name": "en-IE-EmilyNeural",
    "gender": "Female",
    "language": "English (Ireland)"
  },
  {
    "name": "en-KE-AsiliaNeural",
    "gender": "Female",
    "language": "English (Kenya)"
  },
  {
    "name": "en-KE-ChilembaNeural",
    "gender": "Male",
    "language": "English (Kenya)"
  },
  {
    "name": "en-NZ-MitchellNeural",
    "gender": "Male",
    "language": "English (New Zealand)"
  },
  {
    "name": "en-NZ-MollyNeural",
    "gender": "Female",
    "language": "English (New Zealand)"
  },
  {
    "name": "en-NG-AbeoNeural",
    "gender": "Male",
    "language": "English (Nigeria)"
  },
  {
    "name": "en-NG-EzinneNeural",
    "gender": "Female",
    "language": "English (Nigeria)"
  },
  {
    "name": "en-PH-JamesNeural",
    "gender": "Male",
    "language": "English (Philippines)"
  },
  {
    "name": "en-PH-RosaNeural",
    "gender": "Female",
    "language": "English (Philippines)"
  },
  {
    "name": "en-SG-LunaNeural",
    "gender": "Female",
    "language": "English (Singapore)"
  },
  {
    "name": "en-SG-WayneNeural",
    "gender": "Male",
    "language": "English (Singapore)"
  },
  {
    "name": "en-ZA-LeahNeural",
    "gender": "Female",
    "language": "English (South Africa)"
  },
  {
    "name": "en-ZA-LukeNeural",
    "gender": "Male",
    "language": "English (South Africa)"
  },
  {
    "name": "en-TZ-ElimuNeural",
    "gender": "Male",
    "language": "English (Tanzania)"
  },
  {
    "name": "en-TZ-ImaniNeural",
    "gender": "Female",
    "language": "English (Tanzania)"
  },
  {
    "name": "en-GB-LibbyNeural",
    "gender": "Female",
    "language": "English (United Kingdom)"
  },
  {
    "name": "en-GB-MaisieNeural",
    "gender": "Female",
    "language": "English (United Kingdom)"
  },
  {
    "name": "en-GB-RyanNeural",
    "gender": "Male",
    "language": "English (United Kingdom)"
  },
  {
    "name": "en-GB-SoniaNeural",
    "gender": "Female",
    "language": "English (United Kingdom)"
  },
  {
    "name": "en-GB-ThomasNeural",
    "gender": "Male",
    "language": "English (United Kingdom)"
  },
  {
    "name": "en-US-AriaNeural",
    "gender": "Female",
    "language": "English (United States)"
  },
  {
    "name": "en-US-AnaNeural",
    "gender": "Female",
    "language": "English (United States)"
  },
  {
    "name": "en-US-ChristopherNeural",
    "gender": "Male",
    "language": "English (United States)"
  },
  {
    "name": "en-US-EricNeural",
    "gender": "Male",
    "language": "English (United States)"
  },
  {
    "name": "en-US-GuyNeural",
    "gender": "Male",
    "language": "English (United States)"
  },
  {
    "name": "en-US-JennyNeural",
    "gender": "Female",
    "language": "English (United States)"
  },
  {
    "name": "en-US-MichelleNeural",
    "gender": "Female",
    "language": "English (United States)"
  },
  {
    "name": "en-US-RogerNeural",
    "gender": "Male",
    "language": "English (United States)"
  },
  {
    "name": "en-US-SteffanNeural",
    "gender": "Male",
    "language": "English (United States)"
  },
  {
    "name": "et-EE-AnuNeural",
    "gender": "Female",
    "language": "Estonian (Estonia)"
  },
  {
    "name": "et-EE-KertNeural",
    "gender": "Male",
    "language": "Estonian (Estonia)"
  },
  {
    "name": "fil-PH-AngeloNeural",
    "gender": "Male",
    "language": "Filipino (Philippines)"
  },
  {
    "name": "fil-PH-BlessicaNeural",
    "gender": "Female",
    "language": "Filipino (Philippines)"
  },
  {
    "name": "fi-FI-HarriNeural",
    "gender": "Male",
    "language": "Finnish (Finland)"
  },
  {
    "name": "fi-FI-NooraNeural",
    "gender": "Female",
    "language": "Finnish (Finland)"
  },
  {
    "name": "fr-BE-CharlineNeural",
    "gender": "Female",
    "language": "French (Belgium)"
  },
  {
    "name": "fr-BE-GerardNeural",
    "gender": "Male",
    "language": "French (Belgium)"
  },
  {
    "name": "fr-CA-AntoineNeural",
    "gender": "Male",
    "language": "French (Canada)"
  },
  {
    "name": "fr-CA-JeanNeural",
    "gender": "Male",
    "language": "French (Canada)"
  },
  {
    "name": "fr-CA-SylvieNeural",
    "gender": "Female",
    "language": "French (Canada)"
  },
  {
    "name": "fr-FR-DeniseNeural",
    "gender": "Female",
    "language": "French (France)"
  },
  {
    "name": "fr-FR-EloiseNeural",
    "gender": "Female",
    "language": "French (France)"
  },
  {
    "name": "fr-FR-HenriNeural",
    "gender": "Male",
    "language": "French (France)"
  },
  {
    "name": "fr-CH-ArianeNeural",
    "gender": "Female",
    "language": "French (Switzerland)"
  },
  {
    "name": "fr-CH-FabriceNeural",
    "gender": "Male",
    "language": "French (Switzerland)"
  },
  {
    "name": "gl-ES-RoiNeural",
    "gender": "Male",
    "language": "Galician (Spain)"
  },
  {
    "name": "gl-ES-SabelaNeural",
    "gender": "Female",
    "language": "Galician (Spain)"
  },
  {
    "name": "ka-GE-EkaNeural",
    "gender": "Female",
    "language": "Georgian (Georgia)"
  },
  {
    "name": "ka-GE-GiorgiNeural",
    "gender": "Male",
    "language": "Georgian (Georgia)"
  },
  {
    "name": "de-AT-IngridNeural",
    "gender": "Female",
    "language": "German (Austria)"
  },
  {
    "name": "de-AT-JonasNeural",
    "gender": "Male",
    "language": "German (Austria)"
  },
  {
    "name": "de-DE-AmalaNeural",
    "gender": "Female",
    "language": "German (Germany)"
  },
  {
    "name": "de-DE-ConradNeural",
    "gender": "Male",
    "language": "German (Germany)"
  },
  {
    "name": "de-DE-KatjaNeural",
    "gender": "Female",
    "language": "German (Germany)"
  },
  {
    "name": "de-DE-KillianNeural",
    "gender": "Male",
    "language": "German (Germany)"
  },
  {
    "name": "de-CH-JanNeural",
    "gender": "Male",
    "language": "German (Switzerland)"
  },
  {
    "name": "de-CH-LeniNeural",
    "gender": "Female",
    "language": "German (Switzerland)"
  },
  {
    "name": "el-GR-AthinaNeural",
    "gender": "Female",
    "language": "Greek (Greece)"
  },
  {
    "name": "el-GR-NestorasNeural",
    "gender": "Male",
    "language": "Greek (Greece)"
  },
  {
    "name": "gu-IN-DhwaniNeural",
    "gender": "Female",
    "language": "Gujarati (India)"
  },
  {
    "name": "gu-IN-NiranjanNeural",
    "gender": "Male",
    "language": "Gujarati (India)"
  },
  {
    "name": "he-IL-AvriNeural",
    "gender": "Male",
    "language": "Hebrew (Israel)"
  },
  {
    "name": "he-IL-HilaNeural",
    "gender": "Female",
    "language": "Hebrew (Israel)"
  },
  {
    "name": "hi-IN-MadhurNeural",
    "gender": "Male",
    "language": "Hindi (India)"
  },
  {
    "name": "hi-IN-SwaraNeural",
    "gender": "Female",
    "language": "Hindi (India)"
  },
  {
    "name": "hu-HU-NoemiNeural",
    "gender": "Female",
    "language": "Hungarian (Hungary)"
  },
  {
    "name": "hu-HU-TamasNeural",
    "gender": "Male",
    "language": "Hungarian (Hungary)"
  },
  {
    "name": "is-IS-GudrunNeural",
    "gender": "Female",
    "language": "Icelandic (Iceland)"
  },
  {
    "name": "is-IS-GunnarNeural",
    "gender": "Male",
    "language": "Icelandic (Iceland)"
  },
  {
    "name": "id-ID-ArdiNeural",
    "gender": "Male",
    "language": "Indonesian (Indonesia)"
  },
  {
    "name": "id-ID-GadisNeural",
    "gender": "Female",
    "language": "Indonesian (Indonesia)"
  },
  {
    "name": "ga-IE-ColmNeural",
    "gender": "Male",
    "language": "Irish (Ireland)"
  },
  {
    "name": "ga-IE-OrlaNeural",
    "gender": "Female",
    "language": "Irish (Ireland)"
  },
  {
    "name": "it-IT-DiegoNeural",
    "gender": "Male",
    "language": "Italian (Italy)"
  },
  {
    "name": "it-IT-ElsaNeural",
    "gender": "Female",
    "language": "Italian (Italy)"
  },
  {
    "name": "it-IT-IsabellaNeural",
    "gender": "Female",
    "language": "Italian (Italy)"
  },
  {
    "name": "ja-JP-KeitaNeural",
    "gender": "Male",
    "language": "Japanese (Japan)"
  },
  {
    "name": "ja-JP-NanamiNeural",
    "gender": "Female",
    "language": "Japanese (Japan)"
  },
  {
    "name": "jv-ID-DimasNeural",
    "gender": "Male",
    "language": "Javanese (Indonesia)"
  },
  {
    "name": "jv-ID-SitiNeural",
    "gender": "Female",
    "language": "Javanese (Indonesia)"
  },
  {
    "name": "kn-IN-GaganNeural",
    "gender": "Male",
    "language": "Kannada (India)"
  },
  {
    "name": "kn-IN-SapnaNeural",
    "gender": "Female",
    "language": "Kannada (India)"
  },
  {
    "name": "kk-KZ-AigulNeural",
    "gender": "Female",
    "language": "Kazakh (Kazakhstan)"
  },
  {
    "name": "kk-KZ-DauletNeural",
    "gender": "Male",
    "language": "Kazakh (Kazakhstan)"
  },
  {
    "name": "km-KH-PisethNeural",
    "gender": "Male",
    "language": "Khmer (Cambodia)"
  },
  {
    "name": "km-KH-SreymomNeural",
    "gender": "Female",
    "language": "Khmer (Cambodia)"
  },
  {
    "name": "ko-KR-InJoonNeural",
    "gender": "Male",
    "language": "Korean (Korea)"
  },
  {
    "name": "ko-KR-SunHiNeural",
    "gender": "Female",
    "language": "Korean (Korea)"
  },
  {
    "name": "lo-LA-ChanthavongNeural",
    "gender": "Male",
    "language": "Lao (Laos)"
  },
  {
    "name": "lo-LA-KeomanyNeural",
    "gender": "Female",
    "language": "Lao (Laos)"
  },
  {
    "name": "lv-LV-EveritaNeural",
    "gender": "Female",
    "language": "Latvian (Latvia)"
  },
  {
    "name": "lv-LV-NilsNeural",
    "gender": "Male",
    "language": "Latvian (Latvia)"
  },
  {
    "name": "lt-LT-LeonasNeural",
    "gender": "Male",
    "language": "Lithuanian (Lithuania)"
  },
  {
    "name": "lt-LT-OnaNeural",
    "gender": "Female",
    "language": "Lithuanian (Lithuania)"
  },
  {
    "name": "mk-MK-AleksandarNeural",
    "gender": "Male",
    "language": "Macedonian (North Macedonia)"
  },
  {
    "name": "mk-MK-MarijaNeural",
    "gender": "Female",
    "language": "Macedonian (North Macedonia)"
  },
  {
    "name": "ms-MY-OsmanNeural",
    "gender": "Male",
    "language": "Malay (Malaysia)"
  },
  {
    "name": "ms-MY-YasminNeural",
    "gender": "Female",
    "language": "Malay (Malaysia)"
  },
  {
    "name": "ml-IN-MidhunNeural",
    "gender": "Male",
    "language": "Malayalam (India)"
  },
  {
    "name": "ml-IN-SobhanaNeural",
    "gender": "Female",
    "language": "Malayalam (India)"
  },
  {
    "name": "mt-MT-GraceNeural",
    "gender": "Female",
    "language": "Maltese (Malta)"
  },
  {
    "name": "mt-MT-JosephNeural",
    "gender": "Male",
    "language": "Maltese (Malta)"
  },
  {
    "name": "mr-IN-AarohiNeural",
    "gender": "Female",
    "language": "Marathi (India)"
  },
  {
    "name": "mr-IN-ManoharNeural",
    "gender": "Male",
    "language": "Marathi (India)"
  },
  {
    "name": "mn-MN-BataaNeural",
    "gender": "Male",
    "language": "Mongolian (Mongolia)"
  },
  {
    "name": "mn-MN-YesuiNeural",
    "gender": "Female",
    "language": "Mongolian (Mongolia)"
  },
  {
    "name": "ne-NP-HemkalaNeural",
    "gender": "Female",
    "language": "Nepali (Nepal)"
  },
  {
    "name": "ne-NP-SagarNeural",
    "gender": "Male",
    "language": "Nepali (Nepal)"
  },
  {
    "name": "nb-NO-FinnNeural",
    "gender": "Male",
    "language": "Norwegian Bokmål (Norway)"
  },
  {
    "name": "nb-NO-PernilleNeural",
    "gender": "Female",
    "language": "Norwegian Bokmål (Norway)"
  },
  {
    "name": "ps-AF-GulNawazNeural",
    "gender": "Male",
    "language": "Pashto (Afghanistan)"
  },
  {
    "name": "ps-AF-LatifaNeural",
    "gender": "Female",
    "language": "Pashto (Afghanistan)"
  },
  {
    "name": "fa-IR-DilaraNeural",
    "gender": "Female",
    "language": "Persian (Iran)"
  },
  {
    "name": "fa-IR-FaridNeural",
    "gender": "Male",
    "language": "Persian (Iran)"
  },
  {
    "name": "pl-PL-MarekNeural",
    "gender": "Male",
    "language": "Polish (Poland)"
  },
  {
    "name": "pl-PL-ZofiaNeural",
    "gender": "Female",
    "language": "Polish (Poland)"
  },
  {
    "name": "pt-BR-AntonioNeural",
    "gender": "Male",
    "language": "Portuguese (Brazil)"
  },
  {
    "name": "pt-BR-FranciscaNeural",
    "gender": "Female",
    "language": "Portuguese (Brazil)"
  },
  {
    "name": "pt-PT-DuarteNeural",
    "gender": "Male",
    "language": "Portuguese (Portugal)"
  },
  {
    "name": "pt-PT-RaquelNeural",
    "gender": "Female",
    "language": "Portuguese (Portugal)"
  },
  {
    "name": "ro-RO-AlinaNeural",
    "gender": "Female",
    "language": "Romanian (Romania)"
  },
  {
    "name": "ro-RO-EmilNeural",
    "gender": "Male",
    "language": "Romanian (Romania)"
  },
  {
    "name": "ru-RU-DmitryNeural",
    "gender": "Male",
    "language": "Russian (Russia)"
  },
  {
    "name": "ru-RU-SvetlanaNeural",
    "gender": "Female",
    "language": "Russian (Russia)"
  },
  {
    "name": "sr-RS-NicholasNeural",
    "gender": "Male",
    "language": "Serbian (Serbia)"
  },
  {
    "name": "sr-RS-SophieNeural",
    "gender": "Female",
    "language": "Serbian (Serbia)"
  },
  {
    "name": "si-LK-SameeraNeural",
    "gender": "Male",
    "language": "Sinhala (Sri Lanka)"
  },
  {
    "name": "si-LK-ThiliniNeural",
    "gender": "Female",
    "language": "Sinhala (Sri Lanka)"
  },
  {
    "name": "sk-SK-LukasNeural",
    "gender": "Male",
    "language": "Slovak (Slovakia)"
  },
  {
    "name": "sk-SK-ViktoriaNeural",
    "gender": "Female",
    "language": "Slovak (Slovakia)"
  },
  {
    "name": "sl-SI-PetraNeural",
    "gender": "Female",
    "language": "Slovenian (Slovenia)"
  },
  {
    "name": "sl-SI-RokNeural",
    "gender": "Male",
    "language": "Slovenian (Slovenia)"
  },
  {
    "name": "so-SO-MuuseNeural",
    "gender": "Male",
    "language": "Somali (Somalia)"
  },
  {
    "name": "so-SO-UbaxNeural",
    "gender": "Female",
    "language": "Somali (Somalia)"
  },
  {
    "name": "es-AR-ElenaNeural",
    "gender": "Female",
    "language": "Spanish (Argentina)"
  },
  {
    "name": "es-AR-TomasNeural",
    "gender": "Male",
    "language": "Spanish (Argentina)"
  },
  {
    "name": "es-BO-MarceloNeural",
    "gender": "Male",
    "language": "Spanish (Bolivia)"
  },
  {
    "name": "es-BO-SofiaNeural",
    "gender": "Female",
    "language": "Spanish (Bolivia)"
  },
  {
    "name": "es-CL-CatalinaNeural",
    "gender": "Female",
    "language": "Spanish (Chile)"
  },
  {
    "name": "es-CL-LorenzoNeural",
    "gender": "Male",
    "language": "Spanish (Chile)"
  },
  {
    "name": "es-CO-GonzaloNeural",
    "gender": "Male",
    "language": "Spanish (Colombia)"
  },
  {
    "name": "es-CO-SalomeNeural",
    "gender": "Female",
    "language": "Spanish (Colombia)"
  },
  {
    "name": "es-CR-JuanNeural",
    "gender": "Male",
    "language": "Spanish (Costa Rica)"
  },
  {
    "name": "es-CR-MariaNeural",
    "gender": "Female",
    "language": "Spanish (Costa Rica)"
  },
  {
    "name": "es-CU-BelkysNeural",
    "gender": "Female",
    "language": "Spanish (Cuba)"
  },
  {
    "name": "es-CU-ManuelNeural",
    "gender": "Male",
    "language": "Spanish (Cuba)"
  },
  {
    "name": "es-DO-EmilioNeural",
    "gender": "Male",
    "language": "Spanish (Dominican Republic)"
  },
  {
    "name": "es-DO-RamonaNeural",
    "gender": "Female",
    "language": "Spanish (Dominican Republic)"
  },
  {
    "name": "es-EC-AndreaNeural",
    "gender": "Female",
    "language": "Spanish (Ecuador)"
  },
  {
    "name": "es-EC-LuisNeural",
    "gender": "Male",
    "language": "Spanish (Ecuador)"
  },
  {
    "name": "es-SV-LorenaNeural",
    "gender": "Female",
    "language": "Spanish (El Salvador)"
  },
  {
    "name": "es-SV-RodrigoNeural",
    "gender": "Male",
    "language": "Spanish (El Salvador)"
  },
  {
    "name": "es-GQ-JavierNeural",
    "gender": "Male",
    "language": "Spanish (Equatorial Guinea)"
  },
  {
    "name": "es-GQ-TeresaNeural",
    "gender": "Female",
    "language": "Spanish (Equatorial Guinea)"
  },
  {
    "name": "es-GT-AndresNeural",
    "gender": "Male",
    "language": "Spanish (Guatemala)"
  },
  {
    "name": "es-GT-MartaNeural",
    "gender": "Female",
    "language": "Spanish (Guatemala)"
  },
  {
    "name": "es-HN-CarlosNeural",
    "gender": "Male",
    "language": "Spanish (Honduras)"
  },
  {
    "name": "es-HN-KarlaNeural",
    "gender": "Female",
    "language": "Spanish (Honduras)"
  },
  {
    "name": "es-MX-DaliaNeural",
    "gender": "Female",
    "language": "Spanish (Mexico)"
  },
  {
    "name": "es-MX-JorgeNeural",
    "gender": "Male",
    "language": "Spanish (Mexico)"
  },
  {
    "name": "es-NI-FedericoNeural",
    "gender": "Male",
    "language": "Spanish (Nicaragua)"
  },
  {
    "name": "es-NI-YolandaNeural",
    "gender": "Female",
    "language": "Spanish (Nicaragua)"
  },
  {
    "name": "es-PA-MargaritaNeural",
    "gender": "Female",
    "language": "Spanish (Panama)"
  },
  {
    "name": "es-PA-RobertoNeural",
    "gender": "Male",
    "language": "Spanish (Panama)"
  },
  {
    "name": "es-PY-MarioNeural",
    "gender": "Male",
    "language": "Spanish (Paraguay)"
  },
  {
    "name": "es-PY-TaniaNeural",
    "gender": "Female",
    "language": "Spanish (Paraguay)"
  },
  {
    "name": "es-PE-AlexNeural",
    "gender": "Male",
    "language": "Spanish (Peru)"
  },
  {
    "name": "es-PE-CamilaNeural",
    "gender": "Female",
    "language": "Spanish (Peru)"
  },
  {
    "name": "es-PR-KarinaNeural",
    "gender": "Female",
    "language": "Spanish (Puerto Rico)"
  },
  {
    "name": "es-PR-VictorNeural",
    "gender": "Male",
    "language": "Spanish (Puerto Rico)"
  },
  {
    "name": "es-ES-AlvaroNeural",
    "gender": "Male",
    "language": "Spanish (Spain)"
  },
  {
    "name": "es-ES-ElviraNeural",
    "gender": "Female",
    "language": "Spanish (Spain)"
  },
  {
    "name": "es-US-AlonsoNeural",
    "gender": "Male",
    "language": "Spanish (United States)"
  },
  {
    "name": "es-US-PalomaNeural",
    "gender": "Female",
    "language": "Spanish (United States)"
  },
  {
    "name": "es-UY-MateoNeural",
    "gender": "Male",
    "language": "Spanish (Uruguay)"
  },
  {
    "name": "es-UY-ValentinaNeural",
    "gender": "Female",
    "language": "Spanish (Uruguay)"
  },
  {
    "name": "es-VE-PaolaNeural",
    "gender": "Female",
    "language": "Spanish (Venezuela)"
  },
  {
    "name": "es-VE-SebastianNeural",
    "gender": "Male",
    "language": "Spanish (Venezuela)"
  },
  {
    "name": "su-ID-JajangNeural",
    "gender": "Male",
    "language": "Sundanese (Indonesia)"
  },
  {
    "name": "su-ID-TutiNeural",
    "gender": "Female",
    "language": "Sundanese (Indonesia)"
  },
  {
    "name": "sw-KE-RafikiNeural",
    "gender": "Male",
    "language": "Swahili (Kenya)"
  },
  {
    "name": "sw-KE-ZuriNeural",
    "gender": "Female",
    "language": "Swahili (Kenya)"
  },
  {
    "name": "sw-TZ-DaudiNeural",
    "gender": "Male",
    "language": "Swahili (Tanzania)"
  },
  {
    "name": "sw-TZ-RehemaNeural",
    "gender": "Female",
    "language": "Swahili (Tanzania)"
  },
  {
    "name": "sv-SE-MattiasNeural",
    "gender": "Male",
    "language": "Swedish (Sweden)"
  },
  {
    "name": "sv-SE-SofieNeural",
    "gender": "Female",
    "language": "Swedish (Sweden)"
  },
  {
    "name": "ta-IN-PallaviNeural",
    "gender": "Female",
    "language": "Tamil (India)"
  },
  {
    "name": "ta-IN-ValluvarNeural",
    "gender": "Male",
    "language": "Tamil (India)"
  },
  {
    "name": "ta-MY-KaniNeural",
    "gender": "Female",
    "language": "Tamil (Malaysia)"
  },
  {
    "name": "ta-MY-SuryaNeural",
    "gender": "Male",
    "language": "Tamil (Malaysia)"
  },
  {
    "name": "ta-SG-AnbuNeural",
    "gender": "Male",
    "language": "Tamil (Singapore)"
  },
  {
    "name": "ta-SG-VenbaNeural",
    "gender": "Female",
    "language": "Tamil (Singapore)"
  },
  {
    "name": "ta-LK-KumarNeural",
    "gender": "Male",
    "language": "Tamil (Sri Lanka)"
  },
  {
    "name": "ta-LK-SaranyaNeural",
    "gender": "Female",
    "language": "Tamil (Sri Lanka)"
  },
  {
    "name": "te-IN-MohanNeural",
    "gender": "Male",
    "language": "Telugu (India)"
  },
  {
    "name": "te-IN-ShrutiNeural",
    "gender": "Female",
    "language": "Telugu (India)"
  },
  {
    "name": "th-TH-NiwatNeural",
    "gender": "Male",
    "language": "Thai (Thailand)"
  },
  {
    "name": "th-TH-PremwadeeNeural",
    "gender": "Female",
    "language": "Thai (Thailand)"
  },
  {
    "name": "tr-TR-AhmetNeural",
    "gender": "Male",
    "language": "Turkish (Turkey)"
  },
  {
    "name": "tr-TR-EmelNeural",
    "gender": "Female",
    "language": "Turkish (Turkey)"
  },
  {
    "name": "uk-UA-OstapNeural",
    "gender": "Male",
    "language": "Ukrainian (Ukraine)"
  },
  {
    "name": "uk-UA-PolinaNeural",
    "gender": "Female",
    "language": "Ukrainian (Ukraine)"
  },
  {
    "name": "ur-IN-GulNeural",
    "gender": "Female",
    "language": "Urdu (India)"
  },
  {
    "name": "ur-IN-SalmanNeural",
    "gender": "Male",
    "language": "Urdu (India)"
  },
  {
    "name": "ur-PK-AsadNeural",
    "gender": "Male",
    "language": "Urdu (Pakistan)"
  },
  {
    "name": "ur-PK-UzmaNeural",
    "gender": "Female",
    "language": "Urdu (Pakistan)"
  },
  {
    "name": "uz-UZ-MadinaNeural",
    "gender": "Female",
    "language": "Uzbek (Uzbekistan)"
  },
  {
    "name": "uz-UZ-SardorNeural",
    "gender": "Male",
    "language": "Uzbek (Uzbekistan)"
  },
  {
    "name": "vi-VN-HoaiMyNeural",
    "gender": "Female",
    "language": "Vietnamese (Vietnam)"
  },
  {
    "name": "vi-VN-NamMinhNeural",
    "gender": "Male",
    "language": "Vietnamese (Vietnam)"
  },
  {
    "name": "cy-GB-AledNeural",
    "gender": "Male",
    "language": "Welsh (United Kingdom)"
  },
  {
    "name": "cy-GB-NiaNeural",
    "gender": "Female",
    "language": "Welsh (United Kingdom)"
  },
  {
    "name": "zu-ZA-ThandoNeural",
    "gender": "Female",
    "language": "Zulu (South Africa)"
  },
  {
    "name": "zu-ZA-ThembaNeural",
    "gender": "Male",
    "language": "Zulu (South Africa)"
  }
]