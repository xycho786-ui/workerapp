const fs = require('fs');

// Patch Notifications
let notifCode = fs.readFileSync('src/app/customer/notifications/page.tsx', 'utf8');

if (!notifCode.includes('getServerLanguage')) {
  notifCode = notifCode.replace(`import Link from "next/link";`, `import Link from "next/link";\nimport { getServerLanguage } from "@/utils/serverLanguage";`);
  notifCode = notifCode.replace(
    `export default function CustomerNotifications() {`,
    `export default async function CustomerNotifications() {\n  const { t } = await getServerLanguage();`
  );
}

const notifReplacements = {
  '>Notifications<': '>{t("notificationsPage.notifications")}<',
  '>Stay updated on your bookings and activity.<': '>{t("notificationsPage.stayUpdated")}<',
  '>Mark Read<': '>{t("notificationsPage.markRead")}<',
  '>All<': '>{t("notificationsPage.all")}<',
  '>Bookings<': '>{t("notificationsPage.bookings")}<',
  '>Messages<': '>{t("notificationsPage.messages")}<',
  '>OTP<': '>{t("notificationsPage.otp")}<',
  '>Payments<': '>{t("notificationsPage.payments")}<',
  '>System<': '>{t("notificationsPage.system")}<',
  '>No Notifications Yet<': '>{t("notificationsPage.noNotificationsYet")}<',
  ">We'll notify you when new activity occurs. Keep working on bookings!<": '>{t("notificationsPage.noNotificationsDesc")}<',
  '>View Details<': '>{t("notificationsPage.viewDetails")}<'
};

for (const [key, value] of Object.entries(notifReplacements)) {
  notifCode = notifCode.split(key).join(value);
}
fs.writeFileSync('src/app/customer/notifications/page.tsx', notifCode, 'utf8');
console.log('Notifications patched');

// Patch Profile Content
let profCode = fs.readFileSync('src/app/customer/profile/CustomerProfileContent.tsx', 'utf8');

if (!profCode.includes('useLanguage')) {
  profCode = profCode.replace(`import Link from "next/link";`, `import Link from "next/link";\nimport { useLanguage } from "@/utils/language";`);
  profCode = profCode.replace(
    `export default function CustomerProfileContent({`,
    `export default function CustomerProfileContent({\n  dbUser,\n  userMetadata,\n}: { dbUser: any; userMetadata: any }) {\n  const { t } = useLanguage();`
  );
  // Remove the old destructuring
  profCode = profCode.replace(
    `export default function CustomerProfileContent({\n  dbUser,\n  userMetadata,\n}: { dbUser: any; userMetadata: any }) {\n  const { t } = useLanguage();\n  dbUser,\n  userMetadata,\n}: { dbUser: any; userMetadata: any }) {`,
    `export default function CustomerProfileContent({\n  dbUser,\n  userMetadata,\n}: { dbUser: any; userMetadata: any }) {\n  const { t } = useLanguage();`
  );
}

const profReplacements = {
  '>Verified<': '>{t("profilePage.verified")}<',
  '>Member since<': '>{t("profilePage.memberSince")}<',
  '>Edit Account Details<': '>{t("profilePage.editAccountDetails")}<',
  '>Details<': '>{t("profilePage.details")}<',
  '>Saved<': '>{t("profilePage.saved")}<',
  '>Help<': '>{t("profilePage.help")}<',
  '>About<': '>{t("profilePage.about")}<',
  '>Account Overview<': '>{t("profilePage.accountOverview")}<',
  '>Full Name<': '>{t("profilePage.fullName")}<',
  '>Account Type<': '>{t("profilePage.accountType")}<',
  '>Customer<': '>{t("profilePage.customer")}<',
  '>Registered Email<': '>{t("profilePage.registeredEmail")}<',
  '>Phone Number<': '>{t("profilePage.phoneNumber")}<',
  '>Not provided<': '>{t("profilePage.notProvided")}<',
  '>Primary Location<': '>{t("profilePage.primaryLocation")}<',
  '>Security<': '>{t("profilePage.security")}<',
  '>New Password<': '>{t("profilePage.newPassword")}<',
  '>Min 6 characters<': '>{t("profilePage.min6Chars")}<',
  '>Confirm New Password<': '>{t("profilePage.confirmNewPassword")}<',
  '>Repeat password<': '>{t("profilePage.repeatPassword")}<',
  '>Update Password<': '>{t("profilePage.updatePassword")}<',
  '>Updating...<': '>{t("profilePage.updating")}<',
  '>Rehire Previous Workers<': '>{t("profilePage.rehirePrevious")}<',
  '>General Worker<': '>{t("profilePage.generalWorker")}<',
  '>Hire Again<': '>{t("profilePage.hireAgain")}<',
  '>Saved Favorites<': '>{t("profilePage.savedFavorites")}<',
  '>Worker<': '>{t("profilePage.worker")}<',
  '>Remove<': '>{t("profilePage.remove")}<',
  '>No saved workers yet<': '>{t("profilePage.noSavedWorkers")}<',
  '>Save your favorite workers to view, rehire, and coordinate with them easily.<': '>{t("profilePage.noSavedWorkersDesc")}<',
  '>Find Workers<': '>{t("profilePage.findWorkers")}<',
  '>My Reviews & Ratings<': '>{t("profilePage.myReviewsAndRatings")}<',
  '>No reviews submitted<': '>{t("profilePage.noReviewsSubmitted")}<',
  '>Your submitted ratings and feedback for hired service professionals will appear here.<': '>{t("profilePage.noReviewsDesc")}<',
  '>App Settings<': '>{t("profilePage.appSettings")}<',
  '>Manage language preferences, appearance, privacy controls, notifications, and more.<': '>{t("profilePage.appSettingsDesc")}<',
  '>Open Full Settings Center<': '>{t("profilePage.openSettings")}<',
  '>Language & Region<': '>{t("profilePage.languageRegion")}<',
  '>Switch app language<': '>{t("profilePage.languageDesc")}<',
  '>Manage alert preferences<': '>{t("profilePage.manageAlerts")}<',
  '>Privacy & Visibility<': '>{t("profilePage.privacyVisibility")}<',
  '>Control who sees your profile<': '>{t("profilePage.privacyDesc")}<',
  '>Theme, text size, contrast<': '>{t("profilePage.appearanceDesc")}<',
  '>Password & device sessions<': '>{t("profilePage.securityDesc")}<',
  '>Notification Preferences<': '>{t("profilePage.notificationPreferences")}<',
  '>Notifications for request acceptance, schedules, and completion.<': '>{t("profilePage.bookingUpdatesDesc2")}<',
  '>Message Alerts<': '>{t("profilePage.messageAlerts")}<',
  '>Get notified when a worker sends you a direct message.<': '>{t("profilePage.messageAlertsDesc")}<',
  '>OTP Notifications<': '>{t("profilePage.otpNotificationsTitle")}<',
  '>One-Time Password alerts for secure job verification.<': '>{t("profilePage.otpNotificationsDesc")}<',
  '>Review Reminders & Promos<': '>{t("profilePage.reviewRemindersPromo")}<',
  '>Reminders to rate completed jobs and discount notifications.<': '>{t("profilePage.reviewRemindersPromoDesc")}<',
  '>Help Desk FAQ<': '>{t("profilePage.helpDeskFaq")}<',
  '>How do I request a worker?<': '>{t("profilePage.q1")}<',
  '>Navigate to the home screen or click Explore. Select your category, detail your needs, specify a budget, and submit the request. Available workers will review it.<': '>{t("profilePage.a1")}<',
  '>How is payment handled?<': '>{t("profilePage.q2")}<',
  '>Payments are processed securely through the platform. Payment is completed after the worker completes the task and you verify with the OTP.<': '>{t("profilePage.a2")}<',
  '>What if the worker does not show up?<': '>{t("profilePage.q3")}<',
  '>If a worker fails to show up for an accepted booking, you can cancel the job directly from the Bookings page and hire another provider.<': '>{t("profilePage.a3")}<',
  '>How do I verify the service starting?<': '>{t("profilePage.q4")}<',
  '>Your worker will request a starting OTP code which is displayed under the booking details screen. Share this only when they arrive at the site.<': '>{t("profilePage.a4")}<',
  '>Need Direct Support?<': '>{t("profilePage.needSupport")}<',
  '>Our customer satisfaction team is online 24/7 to resolve issues.<': '>{t("profilePage.needSupportDesc")}<',
  '>Email Support<': '>{t("profilePage.emailSupport")}<',
  '>Start Live Chat<': '>{t("profilePage.startLiveChat")}<',
  '>WBSP Platform<': '>{t("profilePage.wbspPlatform")}<',
  '>Find & Hire Skilled Workers Instantly<': '>{t("profilePage.findHire")}<',
  '>Version 0.1.0 (Stable)<': '>{t("profilePage.version")}<',
  '>Privacy Policy<': '>{t("profilePage.privacyPolicy")}<',
  '>Terms & Conditions<': '>{t("profilePage.termsConditions")}<',
  '>About the Platform<': '>{t("profilePage.aboutPlatform2")}<',
  '>Log Out<': '>{t("profilePage.logOut")}<',
  '>Cancel<': '>{t("profilePage.cancel")}<',
  '>Save Changes<': '>{t("profilePage.saveChanges")}<',
  '"Password updated successfully!"': 't("profilePage.passwordSuccess")',
  '"Passwords do not match"': 't("profilePage.passwordsNoMatch")',
  '"Password must be at least 6 characters"': 't("profilePage.passwordShort")',
  '"Profile details updated successfully!"': 't("profilePage.editDetailsSuccess")',
  '"Registered Email (Cannot be changed)"': 't("profilePage.registeredEmail") + " (Cannot be changed)"',
  '"Address (Preferred Location)"': 't("profilePage.primaryLocation") + " (Preferred Location)"',
};

for (const [key, value] of Object.entries(profReplacements)) {
  profCode = profCode.split(key).join(value);
}

fs.writeFileSync('src/app/customer/profile/CustomerProfileContent.tsx', profCode, 'utf8');
console.log('Profile patched');
