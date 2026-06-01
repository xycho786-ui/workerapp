const fs = require('fs');
let content = fs.readFileSync('src/locales/index.ts', 'utf8');

const enNew = `
    },
    chatPage: {
      messages: 'Messages', inbox: 'Inbox', searchMessages: 'Search messages...',
      allChats: 'All Chats', unread: 'Unread', archived: 'Archived',
      aiSupportAssistant: 'AI Support Assistant', helper: 'Helper',
      aiSupportDesc: 'Click to manage bookings, ask questions & coordinate help.',
      loadingMessages: 'Loading message history...', noMessagesFound: 'No messages found',
      noMessagesSearch: 'We couldn\\'t find any chats matching your search term.',
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
      noActiveJobs: 'No Active Jobs Yet', noActiveJobsDesc: 'You haven\\'t booked any services yet. Browse trusted professionals and get started.',
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
      noNotificationsDesc: 'We\\'ll notify you when new activity occurs. Keep working on bookings!',
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
  },`;

const taNew = `
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
  },`;

const mlNew = `
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
  },`;

content = content.replace(`      categories: {
        Plumbing: "Plumbing",
        Electrical: "Electrical",
        Cleaning: "Cleaning",
        "AC Repair": "AC Repair",
        Painting: "Painting",
        Carpentry: "Carpentry",
        "Pest Control": "Pest Control",
        Salon: "Salon"
      }
    }
  },`, `      categories: {
        Plumbing: "Plumbing",
        Electrical: "Electrical",
        Cleaning: "Cleaning",
        "AC Repair": "AC Repair",
        Painting: "Painting",
        Carpentry: "Carpentry",
        "Pest Control": "Pest Control",
        Salon: "Salon"
      }
` + enNew);

content = content.replace(`      categories: {
        Plumbing: "பிளம்பிங்",
        Electrical: "மின்சாரம்",
        Cleaning: "சுத்தம்",
        "AC Repair": "ஏசி பழுது",
        Painting: "ஓவியம்",
        Carpentry: "தச்சுவேலை",
        "Pest Control": "பூச்சி கட்டுப்பாடு",
        Salon: "சலூன்"
      }
    }
  },`, `      categories: {
        Plumbing: "பிளம்பிங்",
        Electrical: "மின்சாரம்",
        Cleaning: "சுத்தம்",
        "AC Repair": "ஏசி பழுது",
        Painting: "ஓவியம்",
        Carpentry: "தச்சுவேலை",
        "Pest Control": "பூச்சி கட்டுப்பாடு",
        Salon: "சலூன்"
      }
` + taNew);

content = content.replace(`      categories: {
        Plumbing: "പ്ലംബിംഗ്",
        Electrical: "ഇലക്ട്രിക്കൽ",
        Cleaning: "ക്ലീനിംഗ്",
        "AC Repair": "എസി റിപ്പയർ",
        Painting: "പെയിന്റിംഗ്",
        Carpentry: "മരപ്പണി",
        "Pest Control": "പെസ്റ്റ് കൺട്രോൾ",
        Salon: "സലൂൺ"
      }
    }
  },`, `      categories: {
        Plumbing: "പ്ലംബിംഗ്",
        Electrical: "ഇലക്ട്രിക്കൽ",
        Cleaning: "ക്ലീനിംഗ്",
        "AC Repair": "എസി റിപ്പയർ",
        Painting: "പെയിന്റിംഗ്",
        Carpentry: "മരപ്പണി",
        "Pest Control": "പെസ്റ്റ് കൺട്രോൾ",
        Salon: "സലൂൺ"
      }
` + mlNew);

fs.writeFileSync('src/locales/index.ts', content, 'utf8');
console.log('Done!');
