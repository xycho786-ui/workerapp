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
    nav: { home: "Home", bookings: "Bookings", jobs: "Jobs", chat: "Chat", messages: "Messages", wallet: "Wallet", alerts: "Alerts", profile: "Profile" },
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
    },
    settingsNotifications: {
      bookingUpdates: "Booking Updates",
      bookingUpdatesDesc: "Alerts for request matches, accepts, and verification OTPs.",
      directMessages: "Direct Messages",
      directMessagesDesc: "Get notified when a client/worker sends a chat message.",
      securityOtps: "Security OTPs",
      securityOtpsDesc: "One-Time Password prompts during check-in/out.",
      reviewReminders: "Review Reminders",
      reviewRemindersDesc: "Prompt notifications to rate completed work.",
      promosDiscounts: "Promos & Discounts",
      promosDiscountsDesc: "Marketing notifications, voucher codes, and special campaigns.",
      systemBulletins: "System Bulletins",
      systemBulletinsDesc: "Important platform downtime or guidelines notices."
    },
    settingsTheme: {
      light: "LIGHT",
      dark: "DARK",
      system: "SYSTEM"
    },
    explore: {
      currentLocation: "Current Location",
      searchPlaceholder: "Try: Fix my leaky tap",
      ongoingBooking: "Ongoing Booking",
      plumberArriving: "Plumber arriving in 12 mins",
      helpWith: "What do you need help with?",
      seasonalServices: "Seasonal Services",
      limitedOffer: "Limited Offer",
      roofCheckup: "Monsoon Roof Leak Checkup",
      startingFrom: "Starting from $49",
      sale: "Sale",
      acService: "AC Service & Maintenance",
      flatOff: "Flat 20% off",
      relevance: "Relevance",
      verified: "Verified",
      expertPro: "Expert Professional",
      years: "Years",
      away: "1.2 km away",
      from: "From",
      bookNow: "Book Now",
      noProfessionals: "No professionals found",
      adjustFilters: "Try adjusting your filters or search term to find more results.",
      clearSearch: "Clear Search",
      professionalsFound: "Professionals found in",
      filters: {
        Nearby: "Nearby",
        "Top Rated": "Top Rated",
        Budget: "Budget",
        Specialist: "Specialist",
        "Available Now": "Available Now",
        Verified: "Verified"
      },
      categories: {
        Plumbing: "Plumbing",
        Electrical: "Electrical",
        Cleaning: "Cleaning",
        "AC Repair": "AC Repair",
        Painting: "Painting",
        Carpentry: "Carpentry",
        "Pest Control": "Pest Control",
        Salon: "Salon"
      }

    },
    chatPage: {
      messages: 'Messages', inbox: 'Inbox', searchMessages: 'Search messages...',
      allChats: 'All Chats', unread: 'Unread', archived: 'Archived',
      aiSupportAssistant: 'AI Support Assistant', helper: 'Helper',
      aiSupportDesc: 'Click to manage bookings, ask questions & coordinate help.',
      loadingMessages: 'Loading message history...', noMessagesFound: 'No messages found',
      noMessagesSearch: 'We couldn\'t find any chats matching your search term.',
      noMessagesUnread: 'You have no unread notifications or conversations.',
      noMessagesAll: 'Your active and past worker chats will be displayed here.',
      task: 'Task', closed: 'Closed', activeWork: 'Active Work', accepted: 'Accepted',
      supportAssistant: 'Support Assistant', online: 'Online',
      bookingSupport: 'Booking Support',
      bookingSupportDesc: 'I can help you manage your active bookings, answer questions, and coordinate help.',
      askBooking: 'Ask about your booking...', chatUnavailable: 'Chat Unavailable',
      chatUnavailableDesc: 'Chat will become available once the worker accepts your booking request.',
      backToJobs: 'Back to My Jobs'
    },
    jobsPage: {
      myJobs: 'My Jobs', jobsDesc: 'Manage your service requests, track active workers, and rate past experiences.',
      noActiveJobs: 'No Active Jobs Yet', noActiveJobsDesc: 'You haven\'t booked any services yet. Browse trusted professionals and get started.',
      browseServices: 'Browse Services', findWorkers: 'Find Workers', activeBookings: 'Active Bookings',
      searchingNearby: 'Searching for nearby Pros...', pendingAcceptance: 'PENDING ACCEPTANCE',
      sent: 'Sent', accepted: 'Accepted', verify: 'Verify', active: 'Active', done: 'Done',
      viewRequest: 'View Request', cancel: 'Cancel', servicePro: 'Service Pro',
      inProgress: 'IN PROGRESS', waitingOtp: 'WAITING FOR OTP', verificationCode: 'Your Verification Code',
      shareOtpMsg: 'Share this OTP with the worker only when they arrive at your location.',
      serviceStartedAt: 'Service started at', chatWithWorker: 'Chat With Worker', details: 'Details',
      trackProgress: 'Track Progress', chat: 'Chat', recentlyCompleted: 'Recently Completed',
      rateExperience: 'Rate Experience', hireAgain: 'Hire Again', bookingDetails: 'Booking Details',
      close: 'Close', cancelBooking: 'Cancel Booking', cancelRequest: 'Cancel Request', specialist: 'Specialist', reviews: 'reviews',
      jobRequirements: 'Job Requirements', scheduledFor: 'Scheduled For', estimatedCost: 'Estimated Cost',
      currentStatus: 'Current Status', hourlyRateCustom: 'Hourly Rate / Custom', serviceRequestDetails: 'Service Request Details',
      serviceCategory: 'Service Category', taskDescription: 'Task Description', postedOn: 'Posted On',
      maxBudget: 'Max Budget', noPreference: 'No preference', howWasService: 'How was your service?',
      ratingHelpMsg: 'Your rating helps other clients hire the best pros.', writeComment: 'Write a brief comment (optional)',
      commentPlaceholder: 'Describe your experience with the service provider...', submitting: 'Submitting...', submitReview: 'Submit Review'
    },
    notificationsPage: {
      notifications: 'Notifications', stayUpdated: 'Stay updated on your bookings and activity.',
      markRead: 'Mark Read', all: 'All', bookings: 'Bookings', otp: 'OTP', payments: 'Payments',
      system: 'System', noNotificationsYet: 'No Notifications Yet',
      noNotificationsDesc: 'We\'ll notify you when new activity occurs. Keep working on bookings!',
      viewDetails: 'View Details', messages: 'Messages', reviews: 'Reviews'
    },
    profilePage: {
      verified: 'Verified', memberSince: 'Member since', editAccountDetails: 'Edit Account Details',
      details: 'Details', saved: 'Saved', help: 'Help', about: 'About', accountOverview: 'Account Overview',
      fullName: 'Full Name', accountType: 'Account Type', customer: 'Customer', registeredEmail: 'Registered Email',
      phoneNumber: 'Phone Number', notProvided: 'Not provided', primaryLocation: 'Primary Location',
      security: 'Security', newPassword: 'New Password', min6Chars: 'Min 6 characters',
      confirmNewPassword: 'Confirm New Password', repeatPassword: 'Repeat password', updatePassword: 'Update Password',
      updating: 'Updating...', passwordSuccess: 'Password updated successfully!',
      passwordsNoMatch: 'Passwords do not match', passwordShort: 'Password must be at least 6 characters',
      rehirePrevious: 'Rehire Previous Workers', generalWorker: 'General Worker', hireAgain: 'Hire Again',
      savedFavorites: 'Saved Favorites', worker: 'Worker', remove: 'Remove', noSavedWorkers: 'No saved workers yet',
      noSavedWorkersDesc: 'Save your favorite workers to view, rehire, and coordinate with them easily.',
      findWorkers: 'Find Workers', myReviewsAndRatings: 'My Reviews & Ratings', noReviewsSubmitted: 'No reviews submitted',
      noReviewsDesc: 'Your submitted ratings and feedback for hired service professionals will appear here.',
      appSettings: 'App Settings', appSettingsDesc: 'Manage language preferences, appearance, privacy controls, notifications, and more.',
      openSettings: 'Open Full Settings Center', languageRegion: 'Language & Region', languageDesc: 'Switch app language',
      manageAlerts: 'Manage alert preferences', privacyVisibility: 'Privacy & Visibility', privacyDesc: 'Control who sees your profile',
      appearanceDesc: 'Theme, text size, contrast', securityDesc: 'Password & device sessions',
      notificationPreferences: 'Notification Preferences', bookingUpdatesDesc2: 'Notifications for request acceptance, schedules, and completion.',
      messageAlerts: 'Message Alerts', messageAlertsDesc: 'Get notified when a worker sends you a direct message.',
      otpNotificationsTitle: 'OTP Notifications', otpNotificationsDesc: 'One-Time Password alerts for secure job verification.',
      reviewRemindersPromo: 'Review Reminders & Promos', reviewRemindersPromoDesc: 'Reminders to rate completed jobs and discount notifications.',
      helpDeskFaq: 'Help Desk FAQ', q1: 'How do I request a worker?',
      a1: 'Navigate to the home screen or click Explore. Select your category, detail your needs, specify a budget, and submit the request. Available workers will review it.',
      q2: 'How is payment handled?', a2: 'Payments are processed securely through the platform. Payment is completed after the worker completes the task and you verify with the OTP.',
      q3: 'What if the worker does not show up?', a3: 'If a worker fails to show up for an accepted booking, you can cancel the job directly from the Bookings page and hire another provider.',
      q4: 'How do I verify the service starting?', a4: 'Your worker will request a starting OTP code which is displayed under the booking details screen. Share this only when they arrive at the site.',
      needSupport: 'Need Direct Support?', needSupportDesc: 'Our customer satisfaction team is online 24/7 to resolve issues.',
      emailSupport: 'Email Support', startLiveChat: 'Start Live Chat', wbspPlatform: 'WBSP Platform',
      findHire: 'Find & Hire Skilled Workers Instantly', version: 'Version 0.1.0 (Stable)', privacyPolicy: 'Privacy Policy',
      termsConditions: 'Terms & Conditions', aboutPlatform2: 'About the Platform', logOut: 'Log Out',
      editDetailsSuccess: 'Profile details updated successfully!', cancel: 'Cancel', saveChanges: 'Save Changes'
    }
  },
  ta: {
    nav: { home: "முகப்பு", bookings: "பதிவுகள்", jobs: "பணிகள்", chat: "அரட்டை", messages: "செய்திகள்", wallet: "பணப்பை", alerts: "அறிவிப்புகள்", profile: "சுயவிவரம்" },
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
    },
    settingsNotifications: {
      bookingUpdates: "முன்பதிவு புதுப்பிப்புகள்",
      bookingUpdatesDesc: "கோரிக்கை பொருத்தம், ஏற்பு மற்றும் OTP சரிபார்ப்புகளுக்கான அறிவிப்புகள்.",
      directMessages: "நேரடி செய்திகள்",
      directMessagesDesc: "வாடிக்கையாளர்/தொழிலாளி செய்தி அனுப்பும் போது அறிவிப்பைப் பெறுக.",
      securityOtps: "பாதுகாப்பு OTPகள்",
      securityOtpsDesc: "உள்நுழைவு/வெளியேற்றத்தின் போது ஒருமுறை கடவுச்சொல் அறிவிப்புகள்.",
      reviewReminders: "மதிப்பாய்வு நினைவூட்டல்கள்",
      reviewRemindersDesc: "முடிந்த பணிகளை மதிப்பிட நினைவூட்டல்கள்.",
      promosDiscounts: "சலுகைகள் & தள்ளுபடிகள்",
      promosDiscountsDesc: "சந்தைப்படுத்தல் அறிவிப்புகள், வவுச்சர் குறியீடுகள் மற்றும் சிறப்பு பிரச்சாரங்கள்.",
      systemBulletins: "கணினி அறிவிப்புகள்",
      systemBulletinsDesc: "முக்கிய தள வேலையில்லா நேரம் அல்லது வழிகாட்டுதல்கள் அறிவிப்புகள்."
    },
    settingsTheme: {
      light: "வெளிர்",
      dark: "இருண்ட",
      system: "கணினி"
    },
    explore: {
      currentLocation: "தற்போதைய இடம்",
      searchPlaceholder: "முயற்சிக்கவும்: எனது குழாயை சரிசெய்யவும்",
      ongoingBooking: "தொடரும் முன்பதிவு",
      plumberArriving: "12 நிமிடங்களில் பிளம்பர் வருகிறார்",
      helpWith: "உங்களுக்கு என்ன உதவி தேவை?",
      seasonalServices: "பருவகால சேவைகள்",
      limitedOffer: "குறைந்த சலுகை",
      roofCheckup: "பருவமழை கூரை கசிவு பரிசோதனை",
      startingFrom: "$49 முதல்",
      sale: "விற்பனை",
      acService: "ஏசி சேவை & பராமரிப்பு",
      flatOff: "20% தள்ளுபடி",
      relevance: "பொருத்தம்",
      verified: "சரிபார்க்கப்பட்டது",
      expertPro: "நிபுணத்துவ வல்லுநர்",
      years: "ஆண்டுகள்",
      away: "1.2 கிமீ தொலைவில்",
      from: "முதல்",
      bookNow: "முன்பதிவு செய்",
      noProfessionals: "வல்லுநர்கள் எவரும் கிடைக்கவில்லை",
      adjustFilters: "மேலும் முடிவுகளைக் கண்டறிய உங்கள் வடிப்பான்களை அல்லது தேடலை சரிசெய்யவும்.",
      clearSearch: "தேடலை அழி",
      professionalsFound: "வல்லுநர்கள் உள்ளனர்",
      filters: {
        Nearby: "அருகில்",
        "Top Rated": "சிறந்தவை",
        Budget: "பட்ஜெட்",
        Specialist: "நிபுணர்",
        "Available Now": "கிடைக்கிறது",
        Verified: "உறுதிப்படுத்தியது"
      },
      categories: {
        Plumbing: "பிளம்பிங்",
        Electrical: "மின்சாரம்",
        Cleaning: "சுத்தம்",
        "AC Repair": "ஏசி பழுது",
        Painting: "ஓவியம்",
        Carpentry: "தச்சுவேலை",
        "Pest Control": "பூச்சி கட்டுப்பாடு",
        Salon: "சலூன்"
      }

    },
    chatPage: {
      messages: 'செய்திகள்', inbox: 'உள்பெட்டி', searchMessages: 'செய்திகளைத் தேடு...',
      allChats: 'அனைத்து அரட்டைகள்', unread: 'படிக்காதவை', archived: 'காப்பகப்படுத்தப்பட்டது',
      aiSupportAssistant: 'AI ஆதரவு உதவியாளர்', helper: 'உதவியாளர்',
      aiSupportDesc: 'முன்பதிவுகளை நிர்வகிக்க, கேள்விகளைக் கேட்க மற்றும் உதவியை ஒருங்கிணைக்க கிளிக் செய்யவும்.',
      loadingMessages: 'செய்தி வரலாற்றை ஏற்றுகிறது...', noMessagesFound: 'செய்திகள் எதுவும் கிடைக்கவில்லை',
      noMessagesSearch: 'உங்கள் தேடல் சொல்லுடன் பொருந்தும் அரட்டைகளை எங்களால் கண்டுபிடிக்க முடியவில்லை.',
      noMessagesUnread: 'உங்களுக்கு படிக்காத அறிவிப்புகள் அல்லது உரையாடல்கள் எதுவும் இல்லை.',
      noMessagesAll: 'உங்கள் செயலில் உள்ள மற்றும் கடந்தகால தொழிலாளர் அரட்டைகள் இங்கே காட்டப்படும்.',
      task: 'பணி', closed: 'மூடப்பட்டது', activeWork: 'செயலில் உள்ள வேலை', accepted: 'ஏற்றுக்கொள்ளப்பட்டது',
      supportAssistant: 'ஆதரவு உதவியாளர்', online: 'ஆன்லைன்',
      bookingSupport: 'முன்பதிவு ஆதரவு',
      bookingSupportDesc: 'உங்கள் செயலில் உள்ள முன்பதிவுகளை நிர்வகிக்கவும், கேள்விகளுக்கு பதிலளிக்கவும் மற்றும் உதவியை ஒருங்கிணைக்கவும் நான் உதவ முடியும்.',
      askBooking: 'உங்கள் முன்பதிவு பற்றி கேளுங்கள்...', chatUnavailable: 'அரட்டை கிடைக்கவில்லை',
      chatUnavailableDesc: 'உங்கள் முன்பதிவு கோரிக்கையை பணியாளர் ஏற்றுக்கொண்டவுடன் அரட்டை கிடைக்கும்.',
      backToJobs: 'என் பணிகளுக்குத் திரும்பு'
    },
    jobsPage: {
      myJobs: 'என் பணிகள்', jobsDesc: 'உங்கள் சேவை கோரிக்கைகளை நிர்வகிக்கவும், செயலில் உள்ள தொழிலாளர்களைக் கண்காணிக்கவும், கடந்த கால அனுபவங்களை மதிப்பிடவும்.',
      noActiveJobs: 'செயலில் உள்ள பணிகள் எதுவும் இல்லை', noActiveJobsDesc: 'நீங்கள் இன்னும் எந்த சேவைகளையும் முன்பதிவு செய்யவில்லை. நம்பகமான நிபுணர்களை உலாவி தொடங்கவும்.',
      browseServices: 'சேவைகளை உலாவு', findWorkers: 'தொழிலாளர்களைக் கண்டுபிடி', activeBookings: 'செயலில் உள்ள முன்பதிவுகள்',
      searchingNearby: 'அருகிலுள்ள நிபுணர்களைத் தேடுகிறது...', pendingAcceptance: 'ஏற்பு நிலுவையில் உள்ளது',
      sent: 'அனுப்பப்பட்டது', accepted: 'ஏற்றுக்கொள்ளப்பட்டது', verify: 'சரிபார்', active: 'செயலில்', done: 'முடிந்தது',
      viewRequest: 'கோரிக்கையைக் காண்', cancel: 'ரத்துசெய்', servicePro: 'சேவை நிபுணர்',
      inProgress: 'செயல்பாட்டில் உள்ளது', waitingOtp: 'OTP க்காக காத்திருக்கிறது', verificationCode: 'உங்கள் சரிபார்ப்புக் குறியீடு',
      shareOtpMsg: 'தொழிலாளி உங்கள் இருப்பிடத்திற்கு வரும்போது மட்டுமே இந்த OTP ஐப் பகிரவும்.',
      serviceStartedAt: 'சேவை தொடங்கியது', chatWithWorker: 'தொழிலாளியுடன் அரட்டை அடி', details: 'விவரங்கள்',
      trackProgress: 'முன்னேற்றத்தைக் கண்காணிக்கவும்', chat: 'அரட்டை', recentlyCompleted: 'சமீபத்தில் முடிந்தது',
      rateExperience: 'அனுபவத்தை மதிப்பிடு', hireAgain: 'மீண்டும் அமர்த்து', bookingDetails: 'முன்பதிவு விவரங்கள்',
      close: 'மூடு', cancelBooking: 'முன்பதிவை ரத்துசெய்', cancelRequest: 'கோரிக்கையை ரத்துசெய்', specialist: 'நிபுணர்', reviews: 'விமர்சனங்கள்',
      jobRequirements: 'வேலை தேவைகள்', scheduledFor: 'திட்டமிடப்பட்டது', estimatedCost: 'மதிப்பிடப்பட்ட செலவு',
      currentStatus: 'தற்போதைய நிலை', hourlyRateCustom: 'மணிநேர கட்டணம் / தனிப்பயன்', serviceRequestDetails: 'சேவை கோரிக்கை விவரங்கள்',
      serviceCategory: 'சேவை வகை', taskDescription: 'பணி விளக்கம்', postedOn: 'பதிவிடப்பட்டது',
      maxBudget: 'அதிகபட்ச பட்ஜெட்', noPreference: 'விருப்பம் இல்லை', howWasService: 'உங்கள் சேவை எப்படி இருந்தது?',
      ratingHelpMsg: 'உங்கள் மதிப்பீடு மற்ற வாடிக்கையாளர்களுக்கு சிறந்த நிபுணர்களை நியமிக்க உதவுகிறது.', writeComment: 'ஒரு சிறிய கருத்தை எழுதுங்கள் (விரும்பினால்)',
      commentPlaceholder: 'சேவை வழங்குநருடனான உங்கள் அனுபவத்தை விவரிக்கவும்...', submitting: 'சமர்ப்பிக்கிறது...', submitReview: 'மதிப்பாய்வைச் சமர்ப்பி'
    },
    notificationsPage: {
      notifications: 'அறிவிப்புகள்', stayUpdated: 'உங்கள் முன்பதிவுகள் மற்றும் செயல்பாடுகள் குறித்த புதுப்பிப்புகளைப் பெறவும்.',
      markRead: 'படித்ததாகக் குறி', all: 'அனைத்து', bookings: 'முன்பதிவுகள்', otp: 'OTP', payments: 'கொடுப்பனவுகள்',
      system: 'அமைப்பு', noNotificationsYet: 'அறிவிப்புகள் எதுவும் இல்லை',
      noNotificationsDesc: 'புதிய செயல்பாடு நிகழும்போது உங்களுக்கு அறிவிப்போம். முன்பதிவுகளில் தொடர்ந்து வேலை செய்யுங்கள்!',
      viewDetails: 'விவரங்களைக் காண்', messages: 'செய்திகள்', reviews: 'விமர்சனங்கள்'
    },
    profilePage: {
      verified: 'சரிபார்க்கப்பட்டது', memberSince: 'உறுப்பினர்', editAccountDetails: 'கணக்கு விவரங்களைத் திருத்து',
      details: 'விவரங்கள்', saved: 'சேமிக்கப்பட்டது', help: 'உதவி', about: 'பற்றி', accountOverview: 'கணக்கு மேலோட்டம்',
      fullName: 'முழு பெயர்', accountType: 'கணக்கு வகை', customer: 'வாடிக்கையாளர்', registeredEmail: 'பதிவு செய்யப்பட்ட மின்னஞ்சல்',
      phoneNumber: 'தொலைபேசி எண்', notProvided: 'வழங்கப்படவில்லை', primaryLocation: 'முதன்மை இடம்',
      security: 'பாதுகாப்பு', newPassword: 'புதிய கடவுச்சொல்', min6Chars: 'குறைந்தபட்சம் 6 எழுத்துக்கள்',
      confirmNewPassword: 'புதிய கடவுச்சொல்லை உறுதிப்படுத்து', repeatPassword: 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்', updatePassword: 'கடவுச்சொல்லைப் புதுப்பி',
      updating: 'புதுப்பிக்கிறது...', passwordSuccess: 'கடவுச்சொல் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது!',
      passwordsNoMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை', passwordShort: 'கடவுச்சொல் குறைந்தது 6 எழுத்துக்களைக் கொண்டிருக்க வேண்டும்',
      rehirePrevious: 'முந்தைய தொழிலாளர்களை மீண்டும் அமர்த்து', generalWorker: 'பொது தொழிலாளி', hireAgain: 'மீண்டும் அமர்த்து',
      savedFavorites: 'சேமிக்கப்பட்ட பிடித்தவை', worker: 'தொழிலாளி', remove: 'அகற்று', noSavedWorkers: 'சேமிக்கப்பட்ட தொழிலாளர்கள் இல்லை',
      noSavedWorkersDesc: 'உங்களுக்குப் பிடித்த தொழிலாளர்களைக் காண, மீண்டும் பணியமர்த்த மற்றும் அவர்களுடன் எளிதாக ஒருங்கிணைக்க சேமிக்கவும்.',
      findWorkers: 'தொழிலாளர்களைக் கண்டுபிடி', myReviewsAndRatings: 'எனது விமர்சனங்கள் & மதிப்பீடுகள்', noReviewsSubmitted: 'விமர்சனங்கள் எதுவும் சமர்ப்பிக்கப்படவில்லை',
      noReviewsDesc: 'பணியமர்த்தப்பட்ட சேவை நிபுணர்களுக்காக நீங்கள் சமர்ப்பித்த மதிப்பீடுகள் மற்றும் கருத்துகள் இங்கே தோன்றும்.',
      appSettings: 'பயன்பாட்டு அமைப்புகள்', appSettingsDesc: 'மொழி விருப்பத்தேர்வுகள், தோற்றம், தனியுரிமைக் கட்டுப்பாடுகள், அறிவிப்புகள் மற்றும் பலவற்றை நிர்வகிக்கவும்.',
      openSettings: 'முழு அமைப்புகள் மையத்தைத் திற', languageRegion: 'மொழி & பகுதி', languageDesc: 'பயன்பாட்டு மொழியை மாற்றவும்',
      manageAlerts: 'விழிப்பூட்டல் விருப்பங்களை நிர்வகிக்கவும்', privacyVisibility: 'தனியுரிமை & பார்வைத் திறன்', privacyDesc: 'உங்கள் சுயவிவரத்தை யார் பார்க்கிறார்கள் என்பதைக் கட்டுப்படுத்தவும்',
      appearanceDesc: 'தீம், உரை அளவு, மாறுபாடு', securityDesc: 'கடவுச்சொல் & சாதன அமர்வுகள்',
      notificationPreferences: 'அறிவிப்பு விருப்பத்தேர்வுகள்', bookingUpdatesDesc2: 'கோரிக்கை ஏற்பு, அட்டவணைகள் மற்றும் நிறைவுக்கான அறிவிப்புகள்.',
      messageAlerts: 'செய்தி விழிப்பூட்டல்கள்', messageAlertsDesc: 'தொழிலாளி உங்களுக்கு நேரடி செய்தியை அனுப்பும்போது அறிவிப்பைப் பெறவும்.',
      otpNotificationsTitle: 'OTP அறிவிப்புகள்', otpNotificationsDesc: 'பாதுகாப்பான வேலை சரிபார்ப்பிற்கான ஒரு முறை கடவுச்சொல் விழிப்பூட்டல்கள்.',
      reviewRemindersPromo: 'மதிப்பாய்வு நினைவூட்டல்கள் & சலுகைகள்', reviewRemindersPromoDesc: 'முடிக்கப்பட்ட பணிகளை மதிப்பிடுவதற்கான நினைவூட்டல்கள் மற்றும் தள்ளுபடி அறிவிப்புகள்.',
      helpDeskFaq: 'உதவி மைய FAQ', q1: 'ஒரு தொழிலாளியை நான் எவ்வாறு கோருவது?',
      a1: 'முகப்புத் திரைக்குச் செல்லவும் அல்லது Explore ஐக் கிளிக் செய்யவும். உங்கள் வகையைத் தேர்ந்தெடுக்கவும், உங்கள் தேவைகளை விவரிக்கவும், பட்ஜெட்டைக் குறிப்பிடவும் மற்றும் கோரிக்கையைச் சமர்ப்பிக்கவும். கிடைக்கக்கூடிய தொழிலாளர்கள் அதை மதிப்பாய்வு செய்வார்கள்.',
      q2: 'கட்டணம் எவ்வாறு கையாளப்படுகிறது?', a2: 'கட்டணங்கள் தளம் மூலம் பாதுகாப்பாக செயல்படுத்தப்படுகின்றன. தொழிலாளி பணியை முடித்த பிறகு நீங்கள் OTP உடன் சரிபார்த்தவுடன் கட்டணம் நிறைவடைகிறது.',
      q3: 'தொழிலாளி வரவில்லை என்றால் என்ன செய்வது?', a3: 'ஏற்றுக்கொள்ளப்பட்ட முன்பதிவுக்கு ஒரு தொழிலாளி வரத் தவறினால், முன்பதிவு பக்கத்திலிருந்து நேரடியாக வேலையை ரத்து செய்துவிட்டு மற்றொரு வழங்குநரை நியமிக்கலாம்.',
      q4: 'சேவை தொடங்குவதை நான் எவ்வாறு சரிபார்க்கலாம்?', a4: 'உங்கள் பணியாளர் தொடக்க OTP குறியீட்டைக் கேட்பார், இது முன்பதிவு விவரங்கள் திரையின் கீழ் காட்டப்படும். அவர்கள் தளத்திற்கு வரும்போது மட்டுமே இதைப் பகிரவும்.',
      needSupport: 'நேரடி ஆதரவு தேவையா?', needSupportDesc: 'சிக்கல்களைத் தீர்க்க எங்கள் வாடிக்கையாளர் திருப்தி குழு 24/7 ஆன்லைனில் உள்ளது.',
      emailSupport: 'மின்னஞ்சல் ஆதரவு', startLiveChat: 'நேரடி அரட்டையைத் தொடங்கு', wbspPlatform: 'WBSP தளம்',
      findHire: 'திறமையான தொழிலாளர்களை உடனடியாக கண்டுபிடித்து அமர்த்தவும்', version: 'பதிப்பு 0.1.0 (நிலையானது)', privacyPolicy: 'தனியுரிமைக் கொள்கை',
      termsConditions: 'விதிமுறைகள் & நிபந்தனைகள்', aboutPlatform2: 'தளத்தைப் பற்றி', logOut: 'வெளியேறு',
      editDetailsSuccess: 'சுயவிவர விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!', cancel: 'ரத்துசெய்', saveChanges: 'மாற்றங்களைச் சேமி'
    }
  },
  ml: {
    nav: { home: "ഹോം", bookings: "ബുക്കിംഗുകൾ", jobs: "ജോലികൾ", chat: "ചാറ്റ്", messages: "സന്ദേശങ്ങൾ", wallet: "വാലറ്റ്", alerts: "അലേർട്ടുകൾ", profile: "പ്രൊഫൈൽ" },
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
    },
    settingsNotifications: {
      bookingUpdates: "ബുക്കിംഗ് വിവരങ്ങൾ",
      bookingUpdatesDesc: "അഭ്യർത്ഥനകൾക്കും അംഗീകാരങ്ങൾക്കും OTP പരിശോധനകൾക്കുമുള്ള അറിയിപ്പുകൾ.",
      directMessages: "നേരിട്ടുള്ള സന്ദേശങ്ങൾ",
      directMessagesDesc: "ഒരു ക്ലയന്റ്/തൊഴിലാളി ചാറ്റ് സന്ദേശം അയക്കുമ്പോൾ അറിയിപ്പ് നേടുക.",
      securityOtps: "സുരക്ഷാ OTP-കൾ",
      securityOtpsDesc: "ചെക്ക്-ഇൻ/ചെക്ക്-ഔട്ട് സമയത്ത് വൺ-ടൈം പാസ്‌വേഡ് നിർദ്ദേശങ്ങൾ.",
      reviewReminders: "അവലോകന ഓർമ്മപ്പെടുത്തലുകൾ",
      reviewRemindersDesc: "പൂർത്തിയാക്കിയ ജോലി വിലയിരുത്തുന്നതിനുള്ള അറിയിപ്പുകൾ.",
      promosDiscounts: "പ്രൊമോകളും ഡിസ്കൗണ്ടുകളും",
      promosDiscountsDesc: "മാർക്കറ്റിംഗ് അറിയിപ്പുകൾ, വൗച്ചർ കോഡുകൾ, പ്രത്യേക കാമ്പെയ്‌നുകൾ.",
      systemBulletins: "സിസ്റ്റം ബുള്ളറ്റിനുകൾ",
      systemBulletinsDesc: "പ്രധാനപ്പെട്ട പ്ലാറ്റ്ഫോം ഡൗൺടൈം അല്ലെങ്കിൽ മാർഗ്ഗനിർദ്ദേശ അറിയിപ്പുകൾ."
    },
    settingsTheme: {
      light: "ലൈറ്റ്",
      dark: "ഡാർക്ക്",
      system: "സിസ്റ്റം"
    },
    explore: {
      currentLocation: "നിലവിലെ സ്ഥലം",
      searchPlaceholder: "ശ്രമിക്കുക: എന്റെ ടാപ്പ് ശരിയാക്കുക",
      ongoingBooking: "നടന്നുകൊണ്ടിരിക്കുന്ന ബുക്കിംഗ്",
      plumberArriving: "പ്ലംബർ 12 മിനിറ്റിനുള്ളിൽ എത്തും",
      helpWith: "നിങ്ങൾക്ക് എന്താണ് സഹായം വേണ്ടത്?",
      seasonalServices: "സീസണൽ സേവനങ്ങൾ",
      limitedOffer: "ലിമിറ്റഡ് ഓഫർ",
      roofCheckup: "മൺസൂൺ റൂഫ് ലീക്ക് ചെക്കപ്പ്",
      startingFrom: "$49 മുതൽ",
      sale: "സെയിൽ",
      acService: "എസി സർവീസ് & മെയിന്റനൻസ്",
      flatOff: "20% കിഴിവ്",
      relevance: "പ്രസക്തി",
      verified: "സ്ഥിരീകരിച്ചു",
      expertPro: "വിദഗ്ദ്ധ പ്രൊഫഷണൽ",
      years: "വർഷങ്ങൾ",
      away: "1.2 കി.മീ അകലെ",
      from: "മുതൽ",
      bookNow: "ബുക്ക് ചെയ്യുക",
      noProfessionals: "പ്രൊഫഷണലുകളെ ആരെയും കണ്ടെത്തിയില്ല",
      adjustFilters: "കൂടുതൽ ഫലങ്ങൾ കണ്ടെത്താൻ ഫിൽട്ടറുകൾ അല്ലെങ്കിൽ തിരയൽ ക്രമീകരിക്കുക.",
      clearSearch: "തിരയൽ മായ്ക്കുക",
      professionalsFound: "പ്രൊഫഷണലുകൾ ഉണ്ട്",
      filters: {
        Nearby: "അടുത്ത്",
        "Top Rated": "മികച്ചവ",
        Budget: "ബജറ്റ്",
        Specialist: "വിദഗ്ദ്ധൻ",
        "Available Now": "ലഭ്യമാണ്",
        Verified: "സ്ഥിരീകരിച്ചവ"
      },
      categories: {
        Plumbing: "പ്ലംബിംഗ്",
        Electrical: "ഇലക്ട്രിക്കൽ",
        Cleaning: "ക്ലീനിംഗ്",
        "AC Repair": "എസി റിപ്പയർ",
        Painting: "പെയിന്റിംഗ്",
        Carpentry: "മരപ്പണി",
        "Pest Control": "പെസ്റ്റ് കൺട്രോൾ",
        Salon: "സലൂൺ"
      }

    },
    chatPage: {
      messages: 'സന്ദേശങ്ങൾ', inbox: 'ഇൻബോക്സ്', searchMessages: 'സന്ദേശങ്ങൾ തിരയുക...',
      allChats: 'എല്ലാ ചാറ്റുകളും', unread: 'വായിക്കാത്തവ', archived: 'ആർക്കൈവ് ചെയ്തവ',
      aiSupportAssistant: 'AI സപ്പോർട്ട് അസിസ്റ്റന്റ്', helper: 'സഹായി',
      aiSupportDesc: 'ബുക്കിംഗുകൾ നിയന്ത്രിക്കാനും ചോദ്യങ്ങൾ ചോദിക്കാനും സഹായം ഏകോപിപ്പിക്കാനും ക്ലിക്ക് ചെയ്യുക.',
      loadingMessages: 'സന്ദേശ ചരിത്രം ലോഡ് ചെയ്യുന്നു...', noMessagesFound: 'സന്ദേശങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
      noMessagesSearch: 'നിങ്ങളുടെ തിരയലുമായി പൊരുത്തപ്പെടുന്ന ചാറ്റുകളൊന്നും കണ്ടെത്താനായില്ല.',
      noMessagesUnread: 'നിങ്ങൾക്ക് വായിക്കാത്ത അറിയിപ്പുകളോ സംഭാഷണങ്ങളോ ഇല്ല.',
      noMessagesAll: 'നിങ്ങളുടെ സജീവമായതും പഴയതുമായ വർക്കർ ചാറ്റുകൾ ഇവിടെ ദൃശ്യമാകും.',
      task: 'ചുമതല', closed: 'അടച്ചു', activeWork: 'സജീവമായ ജോലി', accepted: 'അംഗീകരിച്ചു',
      supportAssistant: 'സപ്പോർട്ട് അസിസ്റ്റന്റ്', online: 'ഓൺലൈൻ',
      bookingSupport: 'ബുക്കിംഗ് സപ്പോർട്ട്',
      bookingSupportDesc: 'നിങ്ങളുടെ സജീവ ബുക്കിംഗുകൾ നിയന്ത്രിക്കാനും ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകാനും സഹായം ഏകോപിപ്പിക്കാനും എനിക്ക് കഴിയും.',
      askBooking: 'നിങ്ങളുടെ ബുക്കിംഗിനെക്കുറിച്ച് ചോദിക്കുക...', chatUnavailable: 'ചാറ്റ് ലഭ്യമല്ല',
      chatUnavailableDesc: 'തൊഴിലാളി നിങ്ങളുടെ ബുക്കിംഗ് അഭ്യർത്ഥന അംഗീകരിച്ചുകഴിഞ്ഞാൽ ചാറ്റ് ലഭ്യമാകും.',
      backToJobs: 'എന്റെ ജോലികളിലേക്ക് മടങ്ങുക'
    },
    jobsPage: {
      myJobs: 'എന്റെ ജോലികൾ', jobsDesc: 'നിങ്ങളുടെ സേവന അഭ്യർത്ഥനകൾ നിയന്ത്രിക്കുക, സജീവ തൊഴിലാളികളെ ട്രാക്ക് ചെയ്യുക, മുൻകാല അനുഭവങ്ങൾ വിലയിരുത്തുക.',
      noActiveJobs: 'സജീവ ജോലികളൊന്നുമില്ല', noActiveJobsDesc: 'നിങ്ങൾ ഇതുവരെ സേവനങ്ങളൊന്നും ബുക്ക് ചെയ്തിട്ടില്ല. വിശ്വസ്തരായ പ്രൊഫഷണലുകളെ ബ്രൗസ് ചെയ്ത് ആരംഭിക്കുക.',
      browseServices: 'സേവനങ്ങൾ ബ്രൗസ് ചെയ്യുക', findWorkers: 'തൊഴിലാളികളെ കണ്ടെത്തുക', activeBookings: 'സജീവ ബുക്കിംഗുകൾ',
      searchingNearby: 'സമീപത്തെ പ്രൊഫഷണലുകൾക്കായി തിരയുന്നു...', pendingAcceptance: 'അംഗീകാരത്തിനായി കാത്തിരിക്കുന്നു',
      sent: 'അയച്ചു', accepted: 'അംഗീകരിച്ചു', verify: 'പരിശോധിക്കുക', active: 'സജീവം', done: 'പൂർത്തിയായി',
      viewRequest: 'അഭ്യർത്ഥന കാണുക', cancel: 'റദ്ദാക്കുക', servicePro: 'സർവീസ് പ്രോ',
      inProgress: 'നടന്നുകൊണ്ടിരിക്കുന്നു', waitingOtp: 'OTP-ക്കായി കാത്തിരിക്കുന്നു', verificationCode: 'നിങ്ങളുടെ വെരിഫിക്കേഷൻ കോഡ്',
      shareOtpMsg: 'തൊഴിലാളി നിങ്ങളുടെ സ്ഥലത്ത് എത്തുമ്പോൾ മാത്രം ഈ OTP പങ്കിടുക.',
      serviceStartedAt: 'സേവനം ആരംഭിച്ചത്', chatWithWorker: 'തൊഴിലാളിയുമായി ചാറ്റ് ചെയ്യുക', details: 'വിവരങ്ങൾ',
      trackProgress: 'പുരോഗതി ട്രാക്ക് ചെയ്യുക', chat: 'ചാറ്റ്', recentlyCompleted: 'അടുത്തിടെ പൂർത്തിയായവ',
      rateExperience: 'അനുഭവം വിലയിരുത്തുക', hireAgain: 'വീണ്ടും വിളിക്കുക', bookingDetails: 'ബുക്കിംഗ് വിവരങ്ങൾ',
      close: 'അടയ്ക്കുക', cancelBooking: 'ബുക്കിംഗ് റദ്ദാക്കുക', cancelRequest: 'അഭ്യർത്ഥന റദ്ദാക്കുക', specialist: 'സ്പെഷ്യലിസ്റ്റ്', reviews: 'അവലോകനങ്ങൾ',
      jobRequirements: 'ജോലി ആവശ്യകതകൾ', scheduledFor: 'ഷെഡ്യൂൾ ചെയ്തത്', estimatedCost: 'കണക്കാക്കിയ ചിലവ്',
      currentStatus: 'നിലവിലെ അവസ്ഥ', hourlyRateCustom: 'മണിക്കൂർ നിരക്ക് / കസ്റ്റം', serviceRequestDetails: 'സേവന അഭ്യർത്ഥന വിവരങ്ങൾ',
      serviceCategory: 'സേവന വിഭാഗം', taskDescription: 'ചുമതല വിവരണം', postedOn: 'പോസ്റ്റ് ചെയ്തത്',
      maxBudget: 'പരമാവധി ബജറ്റ്', noPreference: 'മുൻഗണനയില്ല', howWasService: 'നിങ്ങളുടെ സേവനം എങ്ങനെയുണ്ടായിരുന്നു?',
      ratingHelpMsg: 'മികച്ച പ്രൊഫഷണലുകളെ തിരഞ്ഞെടുക്കാൻ മറ്റ് ഉപഭോക്താക്കളെ നിങ്ങളുടെ റേറ്റിംഗ് സഹായിക്കുന്നു.', writeComment: 'ഒരു ചെറിയ അഭിപ്രായം എഴുതുക (നിർബന്ധമില്ല)',
      commentPlaceholder: 'സേവന ദാതാവുമായുള്ള നിങ്ങളുടെ അനുഭവം വിവരിക്കുക...', submitting: 'സമർപ്പിക്കുന്നു...', submitReview: 'അവലോകനം സമർപ്പിക്കുക'
    },
    notificationsPage: {
      notifications: 'അറിയിപ്പുകൾ', stayUpdated: 'നിങ്ങളുടെ ബുക്കിംഗുകളെയും പ്രവർത്തനങ്ങളെയും കുറിച്ച് അപ്ഡേറ്റ് ചെയ്യുക.',
      markRead: 'വായിച്ചതായി അടയാളപ്പെടുത്തുക', all: 'എല്ലാം', bookings: 'ബുക്കിംഗുകൾ', otp: 'OTP', payments: 'പേയ്‌മെന്റുകൾ',
      system: 'സിസ്റ്റം', noNotificationsYet: 'അറിയിപ്പുകളൊന്നുമില്ല',
      noNotificationsDesc: 'പുതിയ പ്രവർത്തനം നടക്കുമ്പോൾ ഞങ്ങൾ നിങ്ങളെ അറിയിക്കും. ബുക്കിംഗുകളിൽ പ്രവർത്തിക്കുന്നത് തുടരുക!',
      viewDetails: 'വിവരങ്ങൾ കാണുക', messages: 'സന്ദേശങ്ങൾ', reviews: 'അവലോകനങ്ങൾ'
    },
    profilePage: {
      verified: 'സ്ഥിരീകരിച്ചു', memberSince: 'അംഗമായത്', editAccountDetails: 'അക്കൗണ്ട് വിവരങ്ങൾ തിരുത്തുക',
      details: 'വിവരങ്ങൾ', saved: 'സേവ് ചെയ്തു', help: 'സഹായം', about: 'കുറിച്ച്', accountOverview: 'അക്കൗണ്ട് വിവരണം',
      fullName: 'മുഴുവൻ പേര്', accountType: 'അക്കൗണ്ട് തരം', customer: 'ഉപഭോക്താവ്', registeredEmail: 'രജിസ്റ്റർ ചെയ്ത ഇമെയിൽ',
      phoneNumber: 'ഫോൺ നമ്പർ', notProvided: 'നൽകിയിട്ടില്ല', primaryLocation: 'പ്രാഥമിക സ്ഥലം',
      security: 'സുരക്ഷ', newPassword: 'പുതിയ പാസ്‌വേഡ്', min6Chars: 'കുറഞ്ഞത് 6 പ്രതീകങ്ങൾ',
      confirmNewPassword: 'പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക', repeatPassword: 'പാസ്‌വേഡ് ആവർത്തിക്കുക', updatePassword: 'പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക',
      updating: 'അപ്‌ഡേറ്റ് ചെയ്യുന്നു...', passwordSuccess: 'പാസ്‌വേഡ് വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!',
      passwordsNoMatch: 'പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല', passwordShort: 'പാസ്‌വേഡിന് കുറഞ്ഞത് 6 പ്രതീകങ്ങൾ ഉണ്ടായിരിക്കണം',
      rehirePrevious: 'മുൻ തൊഴിലാളികളെ വീണ്ടും വിളിക്കുക', generalWorker: 'ജനറൽ വർക്കർ', hireAgain: 'വീണ്ടും വിളിക്കുക',
      savedFavorites: 'സേവ് ചെയ്ത പ്രിയപ്പെട്ടവ', worker: 'തൊഴിലാളി', remove: 'നീക്കംചെയ്യുക', noSavedWorkers: 'സേവ് ചെയ്ത തൊഴിലാളികളില്ല',
      noSavedWorkersDesc: 'നിങ്ങളുടെ പ്രിയപ്പെട്ട തൊഴിലാളികളെ കാണാനും വീണ്ടും വിളിക്കാനും അവരുമായി എളുപ്പത്തിൽ ഏകോപിപ്പിക്കാനും സേവ് ചെയ്യുക.',
      findWorkers: 'തൊഴിലാളികളെ കണ്ടെത്തുക', myReviewsAndRatings: 'എന്റെ അവലോകനങ്ങളും റേറ്റിംഗുകളും', noReviewsSubmitted: 'അവലോകനങ്ങളൊന്നും സമർപ്പിച്ചിട്ടില്ല',
      noReviewsDesc: 'നിങ്ങൾ സമർപ്പിച്ച റേറ്റിംഗുകളും ഫീഡ്‌ബാക്കും ഇവിടെ ദൃശ്യമാകും.',
      appSettings: 'ആപ്പ് ക്രമീകരണങ്ങൾ', appSettingsDesc: 'ഭാഷാ മുൻഗണനകൾ, രൂപം, സ്വകാര്യതാ നിയന്ത്രണങ്ങൾ, അറിയിപ്പുകൾ എന്നിവയും അതിലേറെയും നിയന്ത്രിക്കുക.',
      openSettings: 'മുഴുവൻ ക്രമീകരണ കേന്ദ്രം തുറക്കുക', languageRegion: 'ഭാഷയും പ്രദേശവും', languageDesc: 'ആപ്പ് ഭാഷ മാറ്റുക',
      manageAlerts: 'അലർട്ട് മുൻഗണനകൾ നിയന്ത്രിക്കുക', privacyVisibility: 'സ്വകാര്യതയും ദൃശ്യതയും', privacyDesc: 'നിങ്ങളുടെ പ്രൊഫൈൽ ആരൊക്കെ കാണുന്നുവെന്ന് നിയന്ത്രിക്കുക',
      appearanceDesc: 'തീം, ടെക്സ്റ്റ് വലുപ്പം, കോൺട്രാസ്റ്റ്', securityDesc: 'പാസ്‌വേഡും ഉപകരണ സെഷനുകളും',
      notificationPreferences: 'അറിയിപ്പ് മുൻഗണനകൾ', bookingUpdatesDesc2: 'അഭ്യർത്ഥന അംഗീകാരം, ഷെഡ്യൂളുകൾ, പൂർത്തീകരണം എന്നിവയ്ക്കുള്ള അറിയിപ്പുകൾ.',
      messageAlerts: 'സന്ദേശ അലർട്ടുകൾ', messageAlertsDesc: 'ഒരു തൊഴിലാളി നിങ്ങൾക്ക് നേരിട്ടുള്ള സന്ദേശം അയക്കുമ്പോൾ അറിയിപ്പ് നേടുക.',
      otpNotificationsTitle: 'OTP അറിയിപ്പുകൾ', otpNotificationsDesc: 'സുരക്ഷിതമായ ജോലി പരിശോധനയ്ക്കുള്ള വൺ-ടൈം പാസ്‌വേഡ് അലർട്ടുകൾ.',
      reviewRemindersPromo: 'അവലോകന ഓർമ്മപ്പെടുത്തലുകളും പ്രൊമോകളും', reviewRemindersPromoDesc: 'പൂർത്തിയാക്കിയ ജോലികൾ വിലയിരുത്തുന്നതിനുള്ള ഓർമ്മപ്പെടുത്തലുകളും കിഴിവ് അറിയിപ്പുകളും.',
      helpDeskFaq: 'ഹെൽപ്പ് ഡെസ്ക് FAQ', q1: 'ഞാൻ എങ്ങനെ ഒരു തൊഴിലാളിയെ അഭ്യർത്ഥിക്കും?',
      a1: 'ഹോം സ്ക്രീനിലേക്ക് നാവിഗേറ്റ് ചെയ്യുക അല്ലെങ്കിൽ Explore ക്ലിക്ക് ചെയ്യുക. നിങ്ങളുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക, ആവശ്യങ്ങൾ വിവരിക്കുക, ബജറ്റ് വ്യക്തമാക്കുക, തുടർന്ന് അഭ്യർത്ഥന സമർപ്പിക്കുക. ലഭ്യമായ തൊഴിലാളികൾ ഇത് അവലോകനം ചെയ്യും.',
      q2: 'പേയ്‌മെന്റ് എങ്ങനെ കൈകാര്യം ചെയ്യുന്നു?', a2: 'പ്ലാറ്റ്ഫോമിലൂടെ സുരക്ഷിതമായി പേയ്‌മെന്റുകൾ പ്രോസസ്സ് ചെയ്യുന്നു. തൊഴിലാളി ടാസ്ക് പൂർത്തിയാക്കുകയും നിങ്ങൾ OTP ഉപയോഗിച്ച് പരിശോധിച്ചുറപ്പിക്കുകയും ചെയ്ത ശേഷം പേയ്‌മെന്റ് പൂർത്തിയാകും.',
      q3: 'തൊഴിലാളി വന്നില്ലെങ്കിലോ?', a3: 'അംഗീകരിച്ച ഒരു ബുക്കിംഗിനായി ഒരു തൊഴിലാളി വരുന്നതിൽ പരാജയപ്പെട്ടാൽ, ബുക്കിംഗ് പേജിൽ നിന്ന് നിങ്ങൾക്ക് നേരിട്ട് ജോലി റദ്ദാക്കുകയും മറ്റൊരു ദാതാവിനെ വിളിക്കുകയും ചെയ്യാം.',
      q4: 'സേവനം ആരംഭിക്കുന്നത് ഞാൻ എങ്ങനെ പരിശോധിക്കും?', a4: 'നിങ്ങളുടെ തൊഴിലാളി ഒരു ആരംഭ OTP കോഡ് അഭ്യർത്ഥിക്കും, അത് ബുക്കിംഗ് വിശദാംശ സ്ക്രീനിൽ പ്രദർശിപ്പിക്കും. അവർ സൈറ്റിൽ എത്തുമ്പോൾ മാത്രം ഇത് പങ്കിടുക.',
      needSupport: 'നേരിട്ടുള്ള സഹായം ആവശ്യമുണ്ടോ?', needSupportDesc: 'പ്രശ്നങ്ങൾ പരിഹരിക്കാൻ ഞങ്ങളുടെ ഉപഭോക്തൃ സംതൃപ്തി ടീം 24/7 ഓൺലൈനിലാണ്.',
      emailSupport: 'ഇമെയിൽ സപ്പോർട്ട്', startLiveChat: 'ലൈവ് ചാറ്റ് ആരംഭിക്കുക', wbspPlatform: 'WBSP പ്ലാറ്റ്ഫോം',
      findHire: 'വിദഗ്ദ്ധരായ തൊഴിലാളികളെ ഉടനടി കണ്ടെത്തുകയും വിളിക്കുകയും ചെയ്യുക', version: 'പതിപ്പ് 0.1.0 (സ്റ്റേബിൾ)', privacyPolicy: 'സ്വകാര്യതാ നയം',
      termsConditions: 'നിബന്ധനകളും വ്യവസ്ഥകളും', aboutPlatform2: 'പ്ലാറ്റ്ഫോമിനെക്കുറിച്ച്', logOut: 'ലോഗ് ഔട്ട്',
      editDetailsSuccess: 'പ്രൊഫൈൽ വിവരങ്ങൾ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!', cancel: 'റദ്ദാക്കുക', saveChanges: 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക'
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
