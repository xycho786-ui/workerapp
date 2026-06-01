export type Language = 
  | 'en' | 'ta' | 'ml' | 'te' | 'kn' | 'hi' | 'bn' | 'mr' | 'gu' | 'pa' | 'or' | 'as' | 'ur';

export const defaultLanguage: Language = 'en';

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', label: 'অসমীয়া (Assamese)' },
  { code: 'ur', label: 'اردو (Urdu)' }
];

export const translations: Record<Language, Record<string, any>> = {
  en: {
    nav: { home: "Home", jobs: "Jobs", chat: "Chat", alerts: "Alerts", profile: "Profile" },
    common: { 
      save: "Save Changes", cancel: "Cancel", edit: "Edit", delete: "Delete", 
      loading: "Loading...", logout: "Log Out", back: "Back", success: "Success", error: "Error",
      online: "Online", offline: "Offline"
    },
    dashboard: {
      welcome: "Welcome back!", readyToHire: "Ready to hire someone?",
      findWorkers: "Find Workers", myBookings: "My Bookings",
      recentActivity: "Recent Activity", noBookings: "No bookings yet",
      startSearching: "Start by searching for workers near you.",
      exploreWorkers: "Explore Workers"
    },
    jobs: {
      title: "My Bookings", active: "Active", completed: "Completed", cancelled: "Cancelled",
      waitingOtp: "Waiting for OTP", inProgress: "In Progress", pendingAcceptance: "Pending Acceptance",
      copyOtp: "Copy OTP", recentCompleted: "Recently Completed", rating: "Rating",
      reviewSubmitted: "Review Submitted", cancelBooking: "Cancel Booking", submitReview: "Submit Review",
      noJobs: "No bookings found"
    },
    profile: {
      memberSince: "Member since", verified: "Verified", pro: "PRO",
      editDetails: "Edit Account Details", accountOverview: "Account Overview",
      security: "Security", newPassword: "New Password", confirmPassword: "Confirm New Password",
      updatePassword: "Update Password", rehire: "Rehire Previous Workers",
      savedWorkers: "Saved Favorites", myReviews: "My Reviews & Ratings",
      notifications: "Notification Preferences", helpfaq: "Help Desk FAQ",
      aboutPlatform: "About WBSP"
    },
    settings: {
      title: "Settings", language: "Language Settings", selectLanguage: "Select Language",
      notifications: "Notifications", appearance: "Appearance", privacy: "Privacy Settings",
      security: "Security Center", accessibility: "Accessibility", help: "Help & Support",
      about: "About", saveChanges: "Save Settings",
      workerSettings: "Worker Settings", customerSettings: "Customer Settings",
      visibility: "Profile Visibility", location: "Location Sharing", showOnline: "Show Online Status",
      textSize: "Text Size", reducedAnim: "Reduced Animations", highContrast: "High Contrast Mode",
      themeMode: "Theme Mode", workingHours: "Working Hours", serviceAvail: "Service Availability",
      areas: "Service Areas", payment: "Payment Preference"
    }
  },
  ta: {
    nav: { home: "முகப்பு", jobs: "பணிகள்", chat: "அரட்டை", alerts: "அறிவிப்புகள்", profile: "சுயவிவரம்" },
    common: { 
      save: "மாற்றங்களைச் சேமி", cancel: "ரத்து செய்", edit: "திருத்து", delete: "நீக்கு", 
      loading: "ஏற்றப்படுகிறது...", logout: "வெளியேறு", back: "பின்னால்", success: "வெற்றி", error: "பிழை",
      online: "ஆன்லைனில்", offline: "ஆஃப்லைன்"
    },
    dashboard: {
      welcome: "நல்வரவு!", readyToHire: "ஒருவரை வேலைக்கு அமர்த்த தயாரா?",
      findWorkers: "தொழிலாளர்களைக் கண்டுபிடி", myBookings: "என் பதிவுகள்",
      recentActivity: "சமீபத்திய செயல்பாடு", noBookings: "இன்னும் பதிவுகள் இல்லை",
      startSearching: "உங்களுக்கு அருகிலுள்ள தொழிலாளர்களைத் தேடித் தொடங்குங்கள்.",
      exploreWorkers: "தொழிலாளர்களை ஆராயுங்கள்"
    },
    jobs: {
      title: "என் பதிவுகள்", active: "செயலில் உள்ளவை", completed: "நிறைவடைந்தவை", cancelled: "ரத்து செய்யப்பட்டவை",
      waitingOtp: "OTP-க்காக காத்திருக்கிறது", inProgress: "செயல்பாட்டில் உள்ளது", pendingAcceptance: "ஏற்பு நிலுவையில் உள்ளது",
      copyOtp: "OTP நகலெடு", recentCompleted: "சமீபத்தில் முடிந்தவை", rating: "மதிப்பீடு",
      reviewSubmitted: "மதிப்பாய்வு சமர்ப்பிக்கப்பட்டது", cancelBooking: "பதிவை ரத்துசெய்", submitReview: "மதிப்பாய்வைச் சமர்ப்பி",
      noJobs: "பதிவுகள் எதுவும் இல்லை"
    },
    profile: {
      memberSince: "உறுப்பினர் சேர்க்கை", verified: "சரிபார்க்கப்பட்டது", pro: "புரோ",
      editDetails: "கணக்கு விவரங்களைத் திருத்து", accountOverview: "கணக்கு மேலோட்டம்",
      security: "பாதுகாப்பு", newPassword: "புதிய கடவுச்சொல்", confirmPassword: "புதிய கடவுச்சொல்லை உறுதிப்படுத்து",
      updatePassword: "கடவுச்சொல்லைப் புதுப்பி", rehire: "முந்தைய தொழிலாளர்களை மீண்டும் அமர்த்து",
      savedWorkers: "சேமிக்கப்பட்டவை", myReviews: "என் மதிப்பீடுகள்",
      notifications: "அறிவிப்பு விருப்பத்தேர்வுகள்", helpfaq: "உதவி மையம் FAQ",
      aboutPlatform: "WBSP பற்றி"
    },
    settings: {
      title: "அமைப்புகள்", language: "மொழி அமைப்புகள்", selectLanguage: "மொழியைத் தேர்வுசெய்",
      notifications: "அறிவிப்புகள்", appearance: "காட்சித் தோற்றம்", privacy: "தனியுரிமை அமைப்புகள்",
      security: "பாதுகாப்பு மையம்", accessibility: "அணுகல்தன்மை", help: "உதவி மற்றும் ஆதரவு",
      about: "பற்றி", saveChanges: "அமைப்புகளைச் சேமி",
      workerSettings: "தொழிலாளர் அமைப்புகள்", customerSettings: "வாடிக்கையாளர் அமைப்புகள்",
      visibility: "சுயவிவர தெரிவுநிலை", location: "இருப்பிடப் பகிர்வு", showOnline: "ஆன்லைன் நிலையைக் காட்டு",
      textSize: "உரை அளவு", reducedAnim: "குறைக்கப்பட்ட அசைவூட்டம்", highContrast: "உயர் மாறுபாடு முறை",
      themeMode: "தீம் முறை", workingHours: "வேலை நேரங்கள்", serviceAvail: "சேவை கிடைக்கும் தன்மை",
      areas: "சேவை பகுதிகள்", payment: "பணப்பரிமாற்ற விருப்பத்தேர்வு"
    }
  },
  ml: {
    nav: { home: "ഹോം", jobs: "ജോലികൾ", chat: "ചാറ്റ്", alerts: "അലേർട്ടുകൾ", profile: "പ്രൊഫൈൽ" },
    common: { 
      save: "മാറ്റങ്ങൾ സേവ് ചെയ്യുക", cancel: "റദ്ദാക്കുക", edit: "തിരുത്തുക", delete: "ഡിലീറ്റ് ചെയ്യുക", 
      loading: "ലോഡിംഗ്...", logout: "ലോഗ് ഔട്ട്", back: "ബാക്ക്", success: "വിജയം", error: "പിശക്",
      online: "ഓൺലൈൻ", offline: "ഓഫ്‌ലൈൻ"
    },
    dashboard: {
      welcome: "സ്വാഗതം!", readyToHire: "ഒരാളെ ജോലിക്ക് വെക്കാൻ തയ്യാറാണോ?",
      findWorkers: "തൊഴിലാളികളെ കണ്ടെത്തുക", myBookings: "എന്റെ ബുക്കിംഗുകൾ",
      recentActivity: "സമീപകാല പ്രവർത്തനങ്ങൾ", noBookings: "ബുക്കിംഗുകൾ ഒന്നും ഇല്ല",
      startSearching: "നിങ്ങളുടെ അടുത്തുള്ള തൊഴിലാളികളെ തിരഞ്ഞ് തുടങ്ങുക.",
      exploreWorkers: "തൊഴിലാളികളെ പരിശോധിക്കുക"
    },
    jobs: {
      title: "എന്റെ ബുക്കിംഗുകൾ", active: "നിലവിലുള്ളവ", completed: "പൂർത്തിയായവ", cancelled: "റദ്ദാക്കിയവ",
      waitingOtp: "OTP-യ്ക്കായി കാത്തിരിക്കുന്നു", inProgress: "നടന്നുകൊണ്ടിരിക്കുന്നു", pendingAcceptance: "അംഗീകാരത്തിനായി കാത്തിരിക്കുന്നു",
      copyOtp: "OTP പകർപ്പ്", recentCompleted: "സമീപകാലത്ത് പൂർത്തിയായവ", rating: "റേറ്റിംഗ്",
      reviewSubmitted: "അഭിപ്രായം സമർപ്പിച്ചു", cancelBooking: "ബുക്കിംഗ് റദ്ദാക്കുക", submitReview: "അഭിപ്രായം സമർപ്പിക്കുക",
      noJobs: "ബുക്കിംഗുകൾ ഒന്നും കണ്ടെത്തിയില്ല"
    },
    profile: {
      memberSince: "അംഗമായത്", verified: "സ്ഥിരീകരിച്ചു", pro: "പ്രോ",
      editDetails: "അക്കൗണ്ട് വിവരങ്ങൾ തിരുത്തുക", accountOverview: "അക്കൗണ്ട് വിവരണം",
      security: "സുരക്ഷ", newPassword: "പുതിയ പാസ്‌വേഡ്", confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
      updatePassword: "പാസ്‌വേഡ് മാറ്റുക", rehire: "മുൻപ് ജോലി ചെയ്തവരെ വീണ്ടും വെക്കുക",
      savedWorkers: "പ്രിയപ്പെട്ടവ", myReviews: "എന്റെ അഭിപ്രായങ്ങൾ",
      notifications: "നോട്ടിഫിക്കേഷൻ മുൻഗണനകൾ", helpfaq: "സഹായ കേന്ദ്രം FAQ",
      aboutPlatform: "WBSP-യെക്കുറിച്ച്"
    },
    settings: {
      title: "ക്രമീകരണങ്ങൾ", language: "ഭാഷാ ക്രമീകരണങ്ങൾ", selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      notifications: "നോട്ടിഫിക്കേഷനുകൾ", appearance: "രൂപഭാവം", privacy: "സ്വകാര്യതാ ക്രമീകരണങ്ങൾ",
      security: "സുരക്ഷാ കേന്ദ്രം", accessibility: "ആക്സസിബിലിറ്റി", help: "സഹായവും പിന്തുണയും",
      about: "വിവരങ്ങൾ", saveChanges: "ക്രമീകരണങ്ങൾ സേവ് ചെയ്യുക",
      workerSettings: "തൊഴിലാളി ക്രമീകരണങ്ങൾ", customerSettings: "ഉപഭോക്തൃ ക്രമീകരണങ്ങൾ",
      visibility: "പ്രൊഫൈൽ ദൃശ്യത", location: "ലൊക്കേഷൻ ഷെയറിംഗ്", showOnline: "ഓൺലൈൻ സ്റ്റാറ്റസ് കാണിക്കുക",
      textSize: "ടെക്സ്റ്റ് സൈസ്", reducedAnim: "കുറഞ്ഞ അനിമേഷൻ", highContrast: "ഹൈ കോൺട്രാസ്റ്റ് മോഡ്",
      themeMode: "തീം മോഡ്", workingHours: "ജോലി സമയം", serviceAvail: "സേവന ലഭ്യത",
      areas: "സേവന മേഖലകൾ", payment: "പേയ്മെന്റ് മുൻഗണന"
    }
  },
  te: {
    nav: { home: "హోమ్", jobs: "పనులు", chat: "చాట్", alerts: "అలర్ట్లు", profile: "ప్రొఫైల్" },
    common: { 
      save: "మార్పులను సేవ్ చేయి", cancel: "రద్దు చేయి", edit: "సవరించు", delete: "తొలగించు", 
      loading: "లోడ్ అవుతోంది...", logout: "లాగ్ అవుట్", back: "వెనుకకు", success: "విజయం", error: "లోపం",
      online: "ఆన్‌లైన్", offline: "ఆఫ్‌లైన్"
    },
    dashboard: {
      welcome: "స్వాగతం!", readyToHire: "ఎవరినైనా నియమించుకోవడానికి సిద్ధంగా ఉన్నారా?",
      findWorkers: "పనివారిని వెతకండి", myBookings: "నా బుకింగ్స్",
      recentActivity: "ఇటీవలి కార్యాచరణ", noBookings: "ఇంకా బుకింగ్స్ లేవు",
      startSearching: "మీకు సమీపంలో ఉన్న పనివారిని వెతకడం ప్రారంభించండి.",
      exploreWorkers: "పనివారిని అన్వేషించండి"
    },
    jobs: {
      title: "నా బుకింగ్స్", active: "క్రియాశీలకంగా ఉన్నవి", completed: "పూర్తయినవి", cancelled: "రద్దయినవి",
      waitingOtp: "OTP కోసం వేచి ఉంది", inProgress: "ప్రగతిలో ఉంది", pendingAcceptance: "ఆమోదం పెండింగ్‌లో ఉంది",
      copyOtp: "OTP కాపీ చేయి", recentCompleted: "ఇటీవల పూర్తయినవి", rating: "రేటింగ్",
      reviewSubmitted: "సమీక్ష సమర్పించబడింది", cancelBooking: "బుకింగ్ రద్దు చేయి", submitReview: "సమీక్షను సమర్పించు",
      noJobs: "బుకింగ్‌లు ఏవీ లేవు"
    },
    profile: {
      memberSince: "సభ్యత్వం నుండి", verified: "ధృవీకరించబడింది", pro: "ప్రో",
      editDetails: "ఖాతా వివరాలను సవరించు", accountOverview: "ఖాతా అవలోకనం",
      security: "భద్రత", newPassword: "కొత్త పాస్‌వర్డ్", confirmPassword: "కొత్త పాస్‌వర్డ్ నిర్ధారించండి",
      updatePassword: "పాస్‌వర్డ్ నవీకరించు", rehire: "మునుపటి పనివారిని మళ్లీ నియమించు",
      savedWorkers: "సేవ్ చేసినవి", myReviews: "నా సమీక్షలు",
      notifications: "నోటిఫికేషన్ ప్రాధాన్యతలు", helpfaq: "సహాయ కేంద్రం FAQ",
      aboutPlatform: "WBSP గురించి"
    },
    settings: {
      title: "సెట్టింగ్స్", language: "భాష సెట్టింగ్స్", selectLanguage: "భాషను ఎంచుకోండి",
      notifications: "నోటిఫికేషన్లు", appearance: "రూపం", privacy: "గోప్యతా సెట్టింగ్స్",
      security: "భద్రతా కేంద్రం", accessibility: "యాక్సెసిబిలిటీ", help: "సహాయం & మద్దతు",
      about: "గురించి", saveChanges: "సెట్టింగ్స్ సేవ్ చేయి",
      workerSettings: "పనివారి సెట్టింగ్స్", customerSettings: "కస్టమర్ సెట్టింగ్స్",
      visibility: "ప్రొఫైల్ విజిబిలిటీ", location: "లొకేషన్ షేరింగ్", showOnline: "ఆన్‌లైన్ స్థితిని చూపించు",
      textSize: "టెక్స్ట్ పరిమాణం", reducedAnim: "తగ్గించిన యానిమేషన్స్", highContrast: "హై కాంట్రాస్ట్ మోడ్",
      themeMode: "థీమ్ మోడ్", workingHours: "పని వేళలు", serviceAvail: "సేవల లభ్యత",
      areas: "సేవా ప్రాంతాలు", payment: "చెల్లింపు ప్రాధాన్యత"
    }
  },
  kn: {
    nav: { home: "ಮುಖಪುಟ", jobs: "ಕೆಲಸಗಳು", chat: "ಚಾಟ್", alerts: "ಅಲರ್ಟ್‌ಗಳು", profile: "ಪ್ರೊಫೈಲ್" },
    common: { 
      save: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ", cancel: "ರದ್ದುಗೊಳಿಸಿ", edit: "ತಿದ್ದಿ", delete: "ತೆಗೆದುಹಾಕಿ", 
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", logout: "ಲಾಗ್ ಔಟ್", back: "ಹಿಂದಕ್ಕೆ", success: "ಯಶಸ್ಸು", error: "ದೋಷ",
      online: "ಆನ್‌ಲೈನ್", offline: "ಆಫ್‌ಲೈನ್"
    },
    dashboard: {
      welcome: "ಸ್ವಾಗತ!", readyToHire: "ಕೆಲಸಕ್ಕೆ ನೇಮಿಸಿಕೊಳ್ಳಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
      findWorkers: "ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ", myBookings: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು",
      recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ", noBookings: "ಇನ್ನೂ ಯಾವುದೇ ಬುಕಿಂಗ್ ಇಲ್ಲ",
      startSearching: "ನಿಮ್ಮ ಹತ್ತಿರದ ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕುವ ಮೂಲಕ ಪ್ರಾರಂಭಿಸಿ.",
      exploreWorkers: "ಕೆಲಸಗಾರರನ್ನು ಅನ್ವೇಷಿಸಿ"
    },
    jobs: {
      title: "ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು", active: "ಸಕ್ರಿಯ", completed: "ಪೂರ್ಣಗೊಂಡಿದೆ", cancelled: "ರದ್ದುಗೊಂಡಿದೆ",
      waitingOtp: "OTP ಗಾಗಿ ಕಾಯುತ್ತಿದೆ", inProgress: "ಪ್ರಗತಿಯಲ್ಲಿದೆ", pendingAcceptance: "ಅಂಗೀಕಾರ ಬಾಕಿ ಇದೆ",
      copyOtp: "OTP ನಕಲಿಸಿ", recentCompleted: "ಇತ್ತೀಚೆಗೆ ಪೂರ್ಣಗೊಂಡಿದೆ", rating: "ರೇಟಿಂಗ್",
      reviewSubmitted: "ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲಾಗಿದೆ", cancelBooking: "ಬುಕಿಂಗ್ ರದ್ದುಮಾಡಿ", submitReview: "ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಿ",
      noJobs: "ಯಾವುದೇ ಬುಕಿಂಗ್ ಕಂಡುಬಂದಿಲ್ಲ"
    },
    profile: {
      memberSince: "ಸದಸ್ಯರಾದ ದಿನಾಂಕ", verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ", pro: "ಪ್ರೊ",
      editDetails: "ಖಾತೆ ವಿವರಗಳನ್ನು ತಿದ್ದಿ", accountOverview: "ಖಾತೆ ಅವಲೋಕನ",
      security: "ಭದ್ರತೆ", newPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್", confirmPassword: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ",
      updatePassword: "ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ", rehire: "ಹಿಂದಿನ ಕೆಲಸಗಾರರನ್ನು ಮತ್ತೆ ನೇಮಿಸಿ",
      savedWorkers: "ಉಳಿಸಿದ ಕೆಲಸಗಾರರು", myReviews: "ನನ್ನ ವಿಮರ್ಶೆಗಳು",
      notifications: "ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು", helpfaq: "ಸಹಾಯ ಕೇಂದ್ರ FAQ",
      aboutPlatform: "WBSP ಬಗ್ಗೆ"
    },
    settings: {
      title: "ಸೆಟ್ಟಿಂಗ್ಸ್", language: "ಭಾಷಾ ಸೆಟ್ಟಿಂಗ್ಸ್", selectLanguage: "ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
      notifications: "ಅಧಿಸೂಚನೆಗಳು", appearance: "ಗೋಚರತೆ", privacy: "ಗೌಪ್ಯತೆ ಸೆಟ್ಟಿಂಗ್ಸ್",
      security: "ಭದ್ರತಾ ಕೇಂದ್ರ", accessibility: "ಪ್ರವೇಶಸಾಧ್ಯತೆ", help: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
      about: "ಬಗ್ಗೆ", saveChanges: "ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ",
      workerSettings: "ಕೆಲಸಗಾರರ ಸೆಟ್ಟಿಂಗ್ಸ್", customerSettings: "ಗ್ರಾಹಕರ ಸೆಟ್ಟಿಂಗ್ಸ್",
      visibility: "ಪ್ರೊಫೈಲ್ ಗೋಚರತೆ", location: "ಸ್ಥಳ ಹಂಚಿಕೆ", showOnline: "ಆನ್‌ಲೈನ್ ಸ್ಥಿತಿಯನ್ನು ತೋರಿಸು",
      textSize: "ಅಕ್ಷರದ ಗಾತ್ರ", reducedAnim: "ಕಡಿಮೆಗೊಳಿಸಿದ ಅನಿಮೇಷನ್", highContrast: "ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್",
      themeMode: "ಥೀಮ್ ಮೋಡ್", workingHours: "ಕೆಲಸದ ಸಮಯ", serviceAvail: "ಸೇವೆಯ ಲಭ್ಯತೆ",
      areas: "ಸೇವಾ ಪ್ರದೇಶಗಳು", payment: "ಪಾವತಿ ಆದ್ಯತೆ"
    }
  },
  hi: {
    nav: { home: "होम", jobs: "काम", chat: "चैट", alerts: "अलर्ट", profile: "प्रोफ़ाइल" },
    common: { 
      save: "बदलाव सहेजें", cancel: "रद्द करें", edit: "बदलाव करें", delete: "हटाएं", 
      loading: "लोड हो रहा है...", logout: "लॉग आउट", back: "पीछे", success: "सफलता", error: "त्रुटि",
      online: "ऑनलाइन", offline: "ऑफलाइन"
    },
    dashboard: {
      welcome: "आपका स्वागत है!", readyToHire: "काम पर रखने के लिए तैयार हैं?",
      findWorkers: "कामगार खोजें", myBookings: "मेरी बुकिंग",
      recentActivity: "हाल की गतिविधि", noBookings: "अभी कोई बुकिंग नहीं है",
      startSearching: "अपने आस-पास के कामगारों को खोज कर शुरू करें।",
      exploreWorkers: "कामगारों की खोज करें"
    },
    jobs: {
      title: "मेरी बुकिंग", active: "सक्रिय", completed: "पूरा हुआ", cancelled: "रद्द किया गया",
      waitingOtp: "OTP की प्रतीक्षा है", inProgress: "प्रगति पर है", pendingAcceptance: "स्वीकृति लंबित है",
      copyOtp: "OTP कॉपी करें", recentCompleted: "हाल ही में पूरा हुआ", rating: "रेटिंग",
      reviewSubmitted: "समीक्षा सबमिट की गई", cancelBooking: "बुकिंग रद्द करें", submitReview: "समीक्षा सबमिट करें",
      noJobs: "कोई बुकिंग नहीं मिली"
    },
    profile: {
      memberSince: "सदस्यता की तिथि", verified: "सत्यापित", pro: "प्रो",
      editDetails: "खाते के विवरण बदलें", accountOverview: "खाता अवलोकन",
      security: "सुरक्षा", newPassword: "नया पासवर्ड", confirmPassword: "नया पासवर्ड कन्फर्म करें",
      updatePassword: "पासवर्ड अपडेट करें", rehire: "पुराने कामगारों को फिर से रखें",
      savedWorkers: "पसंदीदा कामगार", myReviews: "मेरी समीक्षाएं",
      notifications: "नोटिफिकेशन प्राथमिकताएं", helpfaq: "सहायता केंद्र FAQ",
      aboutPlatform: "WBSP के बारे में"
    },
    settings: {
      title: "सेटिंग्स", language: "भाषा सेटिंग्स", selectLanguage: "भाषा चुनें",
      notifications: "नोटिफिकेशन", appearance: "रूप-रंग", privacy: "गोपनीयता सेटिंग्स",
      security: "सुरक्षा केंद्र", accessibility: "पहुंच-योग्यता", help: "सहायता और सहायता",
      about: "विवरण", saveChanges: "सेटिंग्स सहेजें",
      workerSettings: "कामगार सेटिंग्स", customerSettings: "ग्राहक सेटिंग्स",
      visibility: "प्रोफ़ाइल दृश्यता", location: "लोकेशन शेयरिंग", showOnline: "ऑनलाइन स्थिति दिखाएं",
      textSize: "टेक्स्ट का आकार", reducedAnim: "कम एनिमेशन", highContrast: "हाई कंट्रास्ट मोड",
      themeMode: "थीम मोड", workingHours: "काम के घंटे", serviceAvail: "सेवा की उपलब्धता",
      areas: "सेवा क्षेत्र", payment: "भुगतान प्राथमिकता"
    }
  },
  bn: {
    nav: { home: "হোম", jobs: "কাজ", chat: "চ্যাট", alerts: "অ্যালার্ট", profile: "প্রোফাইল" },
    common: { 
      save: "পরিবর্তন সংরক্ষণ করুন", cancel: "বাতিল করুন", edit: "সম্পাদনা", delete: "মুছে ফেলুন", 
      loading: "লোড হচ্ছে...", logout: "লগ আউট", back: "ফিরে যান", success: "সফল", error: "ত্রুটি",
      online: "অনলাইন", offline: "অফলাইন"
    },
    dashboard: {
      welcome: "স্বাগতম!", readyToHire: "কাউকে কাজে নিতে প্রস্তুত?",
      findWorkers: "কর্মী খুঁজুন", myBookings: "আমার বুকিং",
      recentActivity: "সাম্প্রতিক কার্যকলাপ", noBookings: "এখনো কোনো বুকিং নেই",
      startSearching: "আপনার কাছাকাছি কর্মীদের অনুসন্ধান করে শুরু করুন।",
      exploreWorkers: "কর্মী অন্বেষণ করুন"
    },
    jobs: {
      title: "আমার বুকিং", active: "চলতি কাজ", completed: "সম্পন্ন", cancelled: "বাতিল",
      waitingOtp: "OTP-র জন্য অপেক্ষা করা হচ্ছে", inProgress: "কাজ চলছে", pendingAcceptance: "গ্রহণের অপেক্ষায়",
      copyOtp: "OTP কপি করুন", recentCompleted: "সম্প্রতি সম্পন্ন", rating: "রেটিং",
      reviewSubmitted: "পর্যালোচনা জমা দেওয়া হয়েছে", cancelBooking: "বুকিং বাতিল করুন", submitReview: "পর্যালোচনা জমা দিন",
      noJobs: "কোনো বুকিং পাওয়া যায়নি"
    },
    profile: {
      memberSince: "সদস্যপদ শুরু", verified: "যাচাইকৃত", pro: "প্রো",
      editDetails: "অ্যাকাউন্টের বিবরণ সম্পাদনা করুন", accountOverview: "অ্যাকাউন্ট ওভারভিউ",
      security: "নিরাপত্তা", newPassword: "নতুন পাসওয়ার্ড", confirmPassword: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
      updatePassword: "পাসওয়ার্ড আপডেট করুন", rehire: "আগের কর্মীদের আবার ভাড়া করুন",
      savedWorkers: "সংরক্ষিত কর্মী", myReviews: "আমার পর্যালোচনা ও রেটিং",
      notifications: "বিজ্ঞপ্তির পছন্দসমূহ", helpfaq: "সহায়তা কেন্দ্র FAQ",
      aboutPlatform: "WBSP সম্পর্কে"
    },
    settings: {
      title: "সেটিংস", language: "ভাষা সেটিংস", selectLanguage: "ভাষা নির্বাচন করুন",
      notifications: "বিজ্ঞপ্তি", appearance: "প্রদর্শন", privacy: "গোপনীয়তা সেটিংস",
      security: "নিরাপত্তা কেন্দ্র", accessibility: "সহজে ব্যবহারযোগ্যতা", help: "সাহায্য ও সহযোগিতা",
      about: "সম্পর্কে", saveChanges: "সেটিংস সংরক্ষণ করুন",
      workerSettings: "কর্মী সেটিংস", customerSettings: "গ্রাহক সেটিংস",
      visibility: "প্রোফাইল দৃশ্যমানতা", location: "লোকেশন শেয়ারিং", showOnline: "অনলাইন স্ট্যাটাস দেখান",
      textSize: "অক্ষরের আকার", reducedAnim: "কম অ্যানিমেশন", highContrast: "উচ্চ বৈসাদৃশ্য মোড",
      themeMode: "থিম মোড", workingHours: "কাজের সময়", serviceAvail: "পরিষেবা উপলব্ধতা",
      areas: "পরিষেবা এলাকা", payment: "পেমেন্ট পছন্দ"
    }
  },
  mr: {
    nav: { home: "होम", jobs: "कामे", chat: "चॅट", alerts: "अलर्ट्स", profile: "प्रोफाईल" },
    common: { 
      save: "बदल जतन करा", cancel: "रद्द करा", edit: "संपादन करा", delete: "हटवा", 
      loading: "लोड होत आहे...", logout: "लॉग आउट", back: "मागे", success: "यशस्वी", error: "त्रुटी",
      online: "ऑनलाइन", offline: "ऑफलाइन"
    },
    dashboard: {
      welcome: "स्वागत आहे!", readyToHire: "कामावर ठेवण्यास तयार आहात का?",
      findWorkers: "कामगार शोधा", myBookings: "माझ्या बुकिंग्स",
      recentActivity: "अलीकडील क्रियाकलाप", noBookings: "अद्याप कोणतीही बुकिंग नाही",
      startSearching: "तुमच्या जवळील कामगार शोधून सुरुवात करा.",
      exploreWorkers: "कामगार एक्सप्लोर करा"
    },
    jobs: {
      title: "माझ्या बुकिंग्स", active: "सक्रिय", completed: "पूर्ण झाले", cancelled: "रद्द केले",
      waitingOtp: "OTP ची वाट पाहत आहे", inProgress: "प्रगतीपथावर आहे", pendingAcceptance: "स्वीकृती प्रलंबित",
      copyOtp: "OTP कॉपी करा", recentCompleted: "अलीकडे पूर्ण झालेले", rating: "रेटिंग",
      reviewSubmitted: "पुनरावलोकन सबमिट केले", cancelBooking: "बुकिंग रद्द करा", submitReview: "पुनरावलोकन सबमिट करा",
      noJobs: "कोणतीही बुकिंग आढळली नाही"
    },
    profile: {
      memberSince: "सदस्यता तारीख", verified: "सत्यापित", pro: "प्रो",
      editDetails: "खाते तपशील संपादित करा", accountOverview: "खाते विहंगावलोकन",
      security: "सुरक्षा", newPassword: "नवीन पासवर्ड", confirmPassword: "नवीन पासवर्डची खात्री करा",
      updatePassword: "पासवर्ड अपडेट करा", rehire: "मागील कामगारांना पुन्हा कामावर ठेवा",
      savedWorkers: "जतन केलेले कामगार", myReviews: "माझी पुनरावलोकने",
      notifications: "अधिसूचना प्राधान्ये", helpfaq: "मदत केंद्र FAQ",
      aboutPlatform: "WBSP बद्दल"
    },
    settings: {
      title: "सेटिंग्ज", language: "भाषा सेटिंग्ज", selectLanguage: "भाषा निवडा",
      notifications: "अधिसूचना", appearance: "दिसणे", privacy: "गोपनीयता सेटिंग्ज",
      security: "सुरक्षा केंद्र", accessibility: "अ‍ॅक्सेसिबिलिटी", help: "मदत आणि सपोर्ट",
      about: "बद्दल", saveChanges: "सेटिंग्ज जतन करा",
      workerSettings: "कामगार सेटिंग्ज", customerSettings: "ग्राहक सेटिंग्ज",
      visibility: "प्रोफाइल दृश्यमानता", location: "लोकेशन शेअरिंग", showOnline: "ऑनलाइन स्थिती दाखवा",
      textSize: "मजकूर आकार", reducedAnim: "कमी अ‍ॅनिमेशन", highContrast: "उच्च कॉन्ट्रास्ट मोड",
      themeMode: "थीम मोड", workingHours: "कामाचे तास", serviceAvail: "सेवा उपलब्धता",
      areas: "सेवा क्षेत्रे", payment: "पेमेंट प्राधान्य"
    }
  },
  gu: {
    nav: { home: "હોમ", jobs: "કામ", chat: "ચેટ", alerts: "અલર્ટ્સ", profile: "પ્રોફાઇલ" },
    common: { 
      save: "ફેરફારો સાચવો", cancel: "રદ કરો", edit: "ફેરફાર કરો", delete: "કાઢી નાખો", 
      loading: "લોડ થઈ રહ્યું છે...", logout: "લોગ આઉટ", back: "પાછા", success: "સફળ", error: "ભૂલ",
      online: "ઓનલાઇન", offline: "ઓફલાઇન"
    },
    dashboard: {
      welcome: "આપનું સ્વાગત છે!", readyToHire: "કોઈને હાયર કરવા તૈયાર છો?",
      findWorkers: "કામદારો શોધો", myBookings: "મારી બુકિંગ્સ",
      recentActivity: "તાજેતરની પ્રવૃત્તિ", noBookings: "હજુ સુધી કોઈ બુકિંગ નથી",
      startSearching: "તમારી નજીકના કામદારો શોધીને શરૂઆત કરો.",
      exploreWorkers: "કામદારો શોધો"
    },
    jobs: {
      title: "મારી બુકિંગ્સ", active: "સક્રિય", completed: "પૂર્ણ થયેલ", cancelled: "રદ થયેલ",
      waitingOtp: "OTP ની રાહ જોવાઈ રહી છે", inProgress: "પ્રગતિમાં છે", pendingAcceptance: "સ્વીકૃતિ બાકી છે",
      copyOtp: "OTP કોપી કરો", recentCompleted: "તાજેતરમાં પૂર્ણ થયેલ", rating: "રેટિંગ",
      reviewSubmitted: "સમીક્ષા સબમિટ કરી", cancelBooking: "બુકિંગ રદ કરો", submitReview: "સમીક્ષા સબમિટ કરો",
      noJobs: "કોઈ બુકિંગ મળ્યું નથી"
    },
    profile: {
      memberSince: "સભ્યપદ તારીખ", verified: "પ્રમાણિત", pro: "પ્રો",
      editDetails: "ખાતાની વિગતો સંપાદિત કરો", accountOverview: "ખાતાની ઝાંખી",
      security: "સુરક્ષા", newPassword: "નવો પાસવર્ડ", confirmPassword: "નવા પાસવર્ડની પુષ્ટિ કરો",
      updatePassword: "પાસવર્ડ અપડેટ કરો", rehire: "અગાઉના કામદારોને ફરીથી હાયર કરો",
      savedWorkers: "સાચવેલા કામદારો", myReviews: "મારી સમીક્ષાઓ",
      notifications: "સૂચના પસંદગીઓ", helpfaq: "હેલ્પ ડેસ્ક FAQ",
      aboutPlatform: "WBSP વિશે"
    },
    settings: {
      title: "સેટિંગ્સ", language: "ભાષા સેટિંગ્સ", selectLanguage: "ભાષા પસંદ કરો",
      notifications: "સૂચનાઓ", appearance: "દેખાવ", privacy: "ગોપનીયતા સેટિંગ્સ",
      security: "સુરક્ષા કેન્દ્ર", accessibility: "એક્સેસિબિલિટી", help: "મદદ અને સપોર્ટ",
      about: "વિશે", saveChanges: "સેટિંગ્સ સાચવો",
      workerSettings: "કામદાર સેટિંગ્સ", customerSettings: "ગ્રાહક સેટિંગ્સ",
      visibility: "પ્રોફાઇલ દૃશ્યતા", location: "લોકેશન શેરિંગ", showOnline: "ઓનલાઇન સ્ટેટસ બતાવો",
      textSize: "લખાણ કદ", reducedAnim: "ઓછી એનિમેશન", highContrast: "હાઇ કોન્ટ્રાસ્ટ મોડ",
      themeMode: "થીમ મોડ", workingHours: "કામના કલાકો", serviceAvail: "સેવા ઉપલબ્ધતા",
      areas: "સેવા ક્ષેત્રો", payment: "ચુકવણી પસંદગી"
    }
  },
  pa: {
    nav: { home: "ਹੋਮ", jobs: "ਕੰਮ", chat: "ਚੈਟ", alerts: "ਅਲਰਟ", profile: "ਪ੍ਰੋਫਾਈਲ" },
    common: { 
      save: "ਤਬਦੀਲੀਆਂ ਸੁਰੱਖਿਅਤ ਕਰੋ", cancel: "ਰੱਦ ਕਰੋ", edit: "ਸੋਧੋ", delete: "ਮਿਟਾਓ", 
      loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", logout: "ਲੌਗ ਆਉਟ", back: "ਪਿੱਛੇ", success: "ਸਫਲਤਾ", error: "ਗਲਤੀ",
      online: "ਆਨਲਾਈਨ", offline: "ਆਫਲਾਈਨ"
    },
    dashboard: {
      welcome: "ਜੀ ਆਇਆਂ ਨੂੰ!", readyToHire: "ਕੰਮ ਤੇ ਰੱਖਣ ਲਈ ਤਿਆਰ ਹੋ?",
      findWorkers: "ਕਾਮੇ ਲੱਭੋ", myBookings: "ਮੇਰੀਆਂ ਬੁਕਿੰਗਜ਼",
      recentActivity: "ਤਾਜ਼ਾ ਗਤੀਵਿਧੀ", noBookings: "ਅਜੇ ਕੋਈ ਬੁਕਿੰਗ ਨਹੀਂ ਹੈ",
      startSearching: "ਆਪਣੇ ਨੇੜਲੇ ਕਾਮਿਆਂ ਦੀ ਖੋਜ ਕਰਕੇ ਸ਼ੁਰੂ ਕਰੋ।",
      exploreWorkers: "ਕਾਮਿਆਂ ਦੀ ਖੋਜ ਕਰੋ"
    },
    jobs: {
      title: "ਮੇਰੀਆਂ ਬੁਕਿੰਗਜ਼", active: "ਸਰਗਰਮ", completed: "ਪੂਰਾ ਹੋਇਆ", cancelled: "ਰੱਦ ਕੀਤਾ ਗਿਆ",
      waitingOtp: "OTP ਦੀ ਉਡੀਕ ਹੈ", inProgress: "ਪ੍ਰਗਤੀ ਅਧੀਨ", pendingAcceptance: "ਪ੍ਰਵਾਨਗੀ ਦੀ ਉਡੀਕ",
      copyOtp: "OTP ਕਾਪੀ ਕਰੋ", recentCompleted: "ਹਾਲ ਹੀ ਵਿੱਚ ਪੂਰਾ ਹੋਇਆ", rating: "ਰੇਟਿੰਗ",
      reviewSubmitted: "ਸਮੀਖਿਆ ਦਰਜ ਕੀਤੀ ਗਈ", cancelBooking: "ਬੁਕਿੰਗ ਰੱਦ ਕਰੋ", submitReview: "ਸਮੀਖਿਆ ਦਰਜ ਕਰੋ",
      noJobs: "ਕੋਈ ਬੁਕਿੰਗ ਨਹੀਂ ਮਿਲੀ"
    },
    profile: {
      memberSince: "ਮੈਂਬਰਸ਼ਿਪ ਮਿਤੀ", verified: "ਪ੍ਰਮਾਣਿਤ", pro: "ਪ੍ਰੋ",
      editDetails: "ਖਾਤੇ ਦੇ ਵੇਰਵੇ ਸੋਧੋ", accountOverview: "ਖਾਤੇ ਦੀ ਸੰਖੇਪ ਜਾਣਕਾਰੀ",
      security: "ਸੁਰੱਖਿਆ", newPassword: "ਨਵਾਂ ਪਾਸਵਰਡ", confirmPassword: "ਨਵਾਂ ਪਾਸਵਰਡ ਕਨਫਰਮ ਕਰੋ",
      updatePassword: "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਕਰੋ", rehire: "ਪੁਰਾਣੇ ਕਾਮਿਆਂ ਨੂੰ ਦੁਬਾਰਾ ਰੱਖੋ",
      savedWorkers: "ਪਸੰਦੀਦਾ ਕਾਮੇ", myReviews: "ਮੇਰੀਆਂ ਸਮੀਖਿਆਵਾਂ",
      notifications: "ਨੋਟੀਫਿਕੇਸ਼ਨ ਤਰਜੀਹਾਂ", helpfaq: "ਸਹਾਇਤਾ ਕੇਂਦਰ FAQ",
      aboutPlatform: "WBSP ਬਾਰੇ"
    },
    settings: {
      title: "ਸੈਟਿੰਗਜ਼", language: "ਭਾਸ਼ਾ ਸੈਟਿੰਗਜ਼", selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
      notifications: "ਨੋਟੀਫਿਕੇਸ਼ਨ", appearance: "ਦਿੱਖ", privacy: "ਪ੍ਰਾਈਵੇਸੀ ਸੈਟਿੰਗਜ਼",
      security: "ਸੁਰੱਖਿਆ ਕੇਂਦਰ", accessibility: "ਪਹੁੰਚਯੋਗਤਾ", help: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ",
      about: "ਬਾਰੇ", saveChanges: "ਸੈਟਿੰਗਜ਼ ਸੁਰੱਖਿਅਤ ਕਰੋ",
      workerSettings: "ਕਾਮੇ ਦੀਆਂ ਸੈਟਿੰਗਜ਼", customerSettings: "ਗਾਹਕ ਸੈਟਿੰਗਜ਼",
      visibility: "ਪ੍ਰੋਫਾਈਲ ਦਿੱਖ", location: "ਲੋਕੇਸ਼ਨ ਸ਼ੇਅਰਿੰਗ", showOnline: "ਆਨਲਾਈਨ ਸਟੇਟਸ ਦਿਖਾਓ",
      textSize: "ਅੱਖਰਾਂ ਦਾ ਆਕਾਰ", reducedAnim: "ਘਟਾਈਆਂ ਐਨੀਮੇਸ਼ਨਾਂ", highContrast: "ਹਾਈ ਕੰਟ੍ਰਾਸਟ ਮੋਡ",
      themeMode: "ਥੀਮ ਮੋਡ", workingHours: "ਕੰਮ ਦੇ ਘੰਟੇ", serviceAvail: "ਸੇਵਾ ਉਪਲਬਧਤਾ",
      areas: "ਸੇਵਾ ਖੇਤਰ", payment: "ਭੁਗਤਾਨ ਤਰਜੀਹ"
    }
  },
  or: {
    nav: { home: "ହୋମ୍", jobs: "କାମ", chat: "ଚାଟ୍", alerts: "ଆଲର୍ଟ୍ସ", profile: "ପ୍ରୋଫାଇଲ୍" },
    common: { 
      save: "ପରିବର୍ତ୍ତନ ସଂରକ୍ଷଣ କରନ୍ତୁ", cancel: "ବାତିଲ୍ କରନ୍ତୁ", edit: "ସମ୍ପାଦନ", delete: "ଲିଭାନ୍ତୁ", 
      loading: "ଲୋଡ୍ ହେଉଛି...", logout: "ଲଗ୍ ଆଉଟ୍", back: "ପଛକୁ", success: "ସଫଳତା", error: "ତ୍ରୁଟି",
      online: "ଅନ୍‌ଲାଇନ", offline: "ଅଫ୍‌ଲାଇନ"
    },
    dashboard: {
      welcome: "ସ୍ୱାଗତ!", readyToHire: "କାହାକୁ କାମରେ ରଖିବାକୁ ପ୍ରସ୍ତୁତ କି?",
      findWorkers: "କର୍ମଚାରୀ ଖୋଜନ୍ତୁ", myBookings: "ମୋର ବୁକିଂ",
      recentActivity: "ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ", noBookings: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ବୁକିଂ ନାହିଁ",
      startSearching: "ଆପଣଙ୍କ ନିକଟସ୍ଥ କର୍ମଚାରୀଙ୍କୁ ଖୋଜି ଆରମ୍ଭ କରନ୍ତୁ।",
      exploreWorkers: "କର୍ମଚାରୀ ଅନ୍ୱେଷଣ କରନ୍ତୁ"
    },
    jobs: {
      title: "ମୋର ବୁକିଂ", active: "ସକ୍ରିୟ କାର୍ଯ୍ୟ", completed: "ସମ୍ପନ୍ନ", cancelled: "ବାତିଲ୍",
      waitingOtp: "OTP ପାଇଁ ଅପେକ୍ଷା କରାଯାଇଛି", inProgress: "କାମ ଚାଲିଛି", pendingAcceptance: "ଗ୍ରହଣ ଅପେକ୍ଷାରେ",
      copyOtp: "OTP କପି କରନ୍ତୁ", recentCompleted: "ନିକଟରେ ସମ୍ପନ୍ନ", rating: "ରେଟିଂ",
      reviewSubmitted: "ସମୀକ୍ଷା ଦାଖଲ ହୋଇଛି", cancelBooking: "ବୁକିଂ ବାତିଲ୍ କରନ୍ତୁ", submitReview: "ସମୀକ୍ଷା ଦାଖଲ କରନ୍ତୁ",
      noJobs: "କୌଣସି ବୁକିଂ ମିଳିଲା ନାହିଁ"
    },
    profile: {
      memberSince: "ସଦସ୍ୟତା ତାରିଖ", verified: "ଯାଞ୍ଚ ହୋଇଛି", pro: "ପ୍ରୋ",
      editDetails: "ଖାତା ବିବରଣୀ ସମ୍ପାଦନ କରନ୍ତୁ", accountOverview: "ଖାତା ସମୀକ୍ଷା",
      security: "ସୁରକ୍ଷା", newPassword: "ନୂତନ ପାସୱାର୍ଡ", confirmPassword: "ନୂତନ ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
      updatePassword: "ପାସୱାର୍ଡ ଅପଡେଟ୍ କରନ୍ତୁ", rehire: "ପୂର୍ବ କର୍ମଚାରୀଙ୍କୁ ପୁଣି କାମରେ ରଖନ୍ତୁ",
      savedWorkers: "ସଂରକ୍ଷିତ କର୍ମଚାରୀ", myReviews: "ମୋର ସମୀକ୍ଷା ଓ ରେଟିଂ",
      notifications: "ବିଜ୍ଞପ୍ତି ପସନ୍ଦ", helpfaq: "ସହାୟତା କେନ୍ଦ୍ର FAQ",
      aboutPlatform: "WBSP ବିଷୟରେ"
    },
    settings: {
      title: "ସେଟିଂସ", language: "ଭାଷା ସେଟିଂସ", selectLanguage: "ଭାଷା ଚୟନ କରନ୍ତୁ",
      notifications: "ବିଜ୍ଞପ୍ତି", appearance: "ପ୍ରଦର୍ଶନ", privacy: "ଗୋପନୀୟତା ସେଟିଂସ",
      security: "ସୁରକ୍ଷା କେନ୍ଦ୍ର", accessibility: "ସୁଗମତା", help: "ସହାୟତା ଓ ସହଯୋଗ",
      about: "ବିଷୟରେ", saveChanges: "ସେଟିଂସ ସଂରକ୍ଷଣ କରନ୍ତୁ",
      workerSettings: "କର୍ମଚାରୀ ସେଟିଂସ", customerSettings: "ଗ୍ରାହକ ସେଟିଂସ",
      visibility: "ପ୍ରୋଫାଇଲ୍ ଦୃଶ୍ୟମାନତା", location: "ଲୋକେସନ୍ ସେୟାରିଂ", showOnline: "ଅନଲାଇନ୍ ଷ୍ଟାଟସ୍ ଦେଖାନ୍ତୁ",
      textSize: "ଅକ୍ଷର ଆକାର", reducedAnim: "କମ୍ ଆନିମେସନ୍", highContrast: "ଉଚ୍ଚ ବୈସାଦୃଶ୍ୟ ମୋଡ୍",
      themeMode: "ଥିମ୍ ମୋଡ୍", workingHours: "କାର୍ଯ୍ୟ ସମୟ", serviceAvail: "ସେବା ଉପଲବ୍ଧତା",
      areas: "ସେବା ଅଞ୍ଚଳ", payment: "ପେମେଣ୍ଟ ପସନ୍ଦ"
    }
  },
  as: {
    nav: { home: "হোম", jobs: "কাম", chat: "চ্যাট", alerts: "অ্যালার্ট", profile: "প্ৰোফাইল" },
    common: { 
      save: "পৰিবৰ্তন সংৰক্ষণ কৰক", cancel: "বাতিল কৰক", edit: "সম্পাদনা", delete: "মচি পেলাওক", 
      loading: "লোড হৈ আছে...", logout: "লগ আউট", back: "উভতি যাওক", success: "সফল", error: "ত্ৰুটি",
      online: "অনলাইন", offline: "অফলাইন"
    },
    dashboard: {
      welcome: "স্বাগতম!", readyToHire: "কাকো কামত ল’বলৈ সাজুনে?",
      findWorkers: "কৰ্মী সন্ধান কৰক", myBookings: "মোৰ বুকিং",
      recentActivity: "শেহতীয়া কাৰ্যকলাপ", noBookings: "এতিয়ালৈকে কোনো বুকিং নাই",
      startSearching: "আপোনাৰ ওচৰৰ কৰ্মীসকলক বিচাৰি আৰম্ভ কৰক।",
      exploreWorkers: "কৰ্মী অন্বেষণ কৰক"
    },
    jobs: {
      title: "মোৰ বুকিং", active: "চলতি কাম", completed: "সম্পন্ন", cancelled: "বাতিল",
      waitingOtp: "OTPৰ বাবে অপেক্ষা কৰা হৈছে", inProgress: "কাম চলি আছে", pendingAcceptance: "গ্ৰহণৰ অপেক্ষাত",
      copyOtp: "OTP কপি কৰক", recentCompleted: "শেহতীয়াকৈ সম্পন্ন", rating: "ৰেটিং",
      reviewSubmitted: "পৰ্যালোচনা জমা দিয়া হৈছে", cancelBooking: "বুকিং বাতিল কৰক", submitReview: "পৰ্যালোচনা জমা দিয়ক",
      noJobs: "কোনো বুকিং পোৱা নগ’ল"
    },
    profile: {
      memberSince: "সদস্যপদৰ তাৰিখ", verified: "যাচাইকৃত", pro: "প্ৰো",
      editDetails: "অ্যাকাউন্টৰ তথ্য সম্পাদনা কৰক", accountOverview: "অ্যাকাউন্টৰ আলোকপাত",
      security: "নিৰাপত্তা", newPassword: "নতুন পাছৱৰ্ড", confirmPassword: "নতুন পাছৱৰ্ড নিশ্চিত কৰক",
      updatePassword: "পাছৱৰ্ড আপডেট কৰক", rehire: "পূৰ্বৰ কৰ্মীক আকৌ কামত লওক",
      savedWorkers: "সংৰক্ষিত কৰ্মী", myReviews: "মোৰ পৰ্যালোচনা আৰু ৰেটিং",
      notifications: "বিজ্ঞপ্তিৰ পছন্দসমূহ", helpfaq: "সহায় কেন্দ্ৰ FAQ",
      aboutPlatform: "WBSPৰ বিষয়ে"
    },
    settings: {
      title: "ছেটিংছ", language: "ভাষা ছেটিংছ", selectLanguage: "ভাষা বাচনি কৰক",
      notifications: "বিজ্ঞপ্তি", appearance: "প্ৰদৰ্শন", privacy: "গোপনীয়তা ছেটিংছ",
      security: "নিৰাপত্তা কেন্দ্ৰ", accessibility: "সহজে ব্যৱহাৰযোগ্যতা", help: "সহায় আৰু সহযোগিতা",
      about: "বিষয়ে", saveChanges: "ছেটিংছ সংৰক্ষণ কৰক",
      workerSettings: "কৰ্মী ছেটিংছ", customerSettings: "গ্ৰাহক ছেটিংছ",
      visibility: "প্ৰফাইল দৃশ্যমানতা", location: "লোকেশন শেয়াৰিং", showOnline: "অনলাইন স্থিতি দেখুৱাওক",
      textSize: "আখৰৰ আকাৰ", reducedAnim: "কম এনিমেচন", highContrast: "উচ্চ বৈসাদৃশ্য মোড",
      themeMode: "থিম মোড", workingHours: "কামৰ সময়", serviceAvail: "সেৱা উপলব্ধতা",
      areas: "সেৱা এলেকা", payment: "পেমেন্টৰ পছন্দ"
    }
  },
  ur: {
    nav: { home: "ہوم", jobs: "کام", chat: "چیٹ", alerts: "الرٹس", profile: "پروفائل" },
    common: { 
      save: "تبدیلیاں محفوظ کریں", cancel: "منسوخ کریں", edit: "ترمیم کریں", delete: "حذف کریں", 
      loading: "لوڈ ہو رہا ہے...", logout: "لاگ آؤٹ", back: "واپس", success: "کامیابی", error: "غلطی",
      online: "آن لائن", offline: "آف لائن"
    },
    dashboard: {
      welcome: "خوش آمدید!", readyToHire: "کام پر رکھنے کے لیے تیار ہیں؟",
      findWorkers: "کامگار تلاش کریں", myBookings: "میری بکنگز",
      recentActivity: "حالیہ سرگرمی", noBookings: "ابھی کوئی بکنگ نہیں ہے",
      startSearching: "اپنے قریبی کامگاروں کو تلاش کر کے شروع کریں۔",
      exploreWorkers: "کامگاروں کو تلاش کریں"
    },
    jobs: {
      title: "میری بکنگز", active: "فعال", completed: "مکمل", cancelled: "منسوخ",
      waitingOtp: "OTP کا انتظار ہے", inProgress: "جاری ہے", pendingAcceptance: "منظوری زیر التواء",
      copyOtp: "OTP کاپی کریں", recentCompleted: "حالیہ مکمل شدہ", rating: "ریٹنگ",
      reviewSubmitted: "جائزہ جمع کرایا گیا", cancelBooking: "بکنگ منسوخ کریں", submitReview: "جائزہ جمع کریں",
      noJobs: "کوئی بکنگ نہیں ملی"
    },
    profile: {
      memberSince: "رکنیت کی تاریخ", verified: "تصدیق شدہ", pro: "پرو",
      editDetails: "اکاؤنٹ کی تفصیلات تبدیل کریں", accountOverview: "اکاؤنٹ کا جائزہ",
      security: "سیکیورٹی", newPassword: "نیا پاس ورڈ", confirmPassword: "نیا پاس ورڈ کنفرم کریں",
      updatePassword: "پاس ورڈ تبدیل کریں", rehire: "پرانے کامگاروں کو دوبارہ رکھیں",
      savedWorkers: "پسندیدہ کامگار", myReviews: "میرے جائزے",
      notifications: "نوٹیفکیشن کی ترجیحات", helpfaq: "سپورٹ سینٹر FAQ",
      aboutPlatform: "WBSP کے بارے میں"
    },
    settings: {
      title: "ترتیبات", language: "زبان کی ترتیبات", selectLanguage: "زبان منتخب کریں",
      notifications: "نوٹیفیکیشنز", appearance: "ظاہری شکل", privacy: "پرائیویسی ترتیبات",
      security: "سیکیورٹی سینٹر", accessibility: "رسائی", help: "مدد اور سپورٹ",
      about: "کے بارے میں", saveChanges: "ترتیبات محفوظ کریں",
      workerSettings: "کامگار ترتیبات", customerSettings: "کسٹمر ترतीبات",
      visibility: "پروفائل کی نمائش", location: "لوکیشن شیئرنگ", showOnline: "آن لائن اسٹیٹس دکھائیں",
      textSize: "حروف کا سائز", reducedAnim: "کم اینیمیشن", highContrast: "ہائی کنٹراسٹ موڈ",
      themeMode: "تھیم موڈ", workingHours: "کام کے اوقات", serviceAvail: "سروس کی دستیابی",
      areas: "سروس کے علاقے", payment: "ادائیگی کی ترجیح"
    }
  }
};
