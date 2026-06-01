const fs = require('fs');
let code = fs.readFileSync('src/app/customer/jobs/CustomerJobsClient.tsx', 'utf8');

// Add import
if (!code.includes('useLanguage')) {
  code = code.replace(`import Link from "next/link";`, `import Link from "next/link";\nimport { useLanguage } from "@/utils/language";`);
}

// Add hook
if (!code.includes('const { t } = useLanguage();')) {
  code = code.replace(
    `export default function CustomerJobsClient({`, 
    `export default function CustomerJobsClient({\n  initialBookings = [],\n  initialRequests = [],\n  userName,\n  userEmail,\n}: CustomerJobsClientProps) {\n  const { t } = useLanguage();`
  );
  // remove the original props destructuring
  code = code.replace(
    `export default function CustomerJobsClient({\n  initialBookings = [],\n  initialRequests = [],\n  userName,\n  userEmail,\n}: CustomerJobsClientProps) {\n  const { t } = useLanguage();\n  initialBookings = [],\n  initialRequests = [],\n  userName,\n  userEmail,\n}: CustomerJobsClientProps) {`,
    `export default function CustomerJobsClient({\n  initialBookings = [],\n  initialRequests = [],\n  userName,\n  userEmail,\n}: CustomerJobsClientProps) {\n  const { t } = useLanguage();`
  );
}

// Replacements
const replacements = {
  // Empty State
  '"No Active Jobs Yet"': 't("jobsPage.noActiveJobs")',
  '"You haven\'t booked any services yet. Browse trusted professionals and get started."': 't("jobsPage.noActiveJobsDesc")',
  '"Browse Services"': 't("jobsPage.browseServices")',
  '"Find Workers"': 't("jobsPage.findWorkers")',
  
  // Section Headers
  '"My Jobs"': 't("jobsPage.myJobs")',
  '"Manage your service requests, track active workers, and rate past experiences."': 't("jobsPage.jobsDesc")',
  '"Active Bookings ("': 't("jobsPage.activeBookings") + " ("',
  '"Searching for nearby Pros..."': 't("jobsPage.searchingNearby")',
  '"PENDING ACCEPTANCE"': 't("jobsPage.pendingAcceptance")',
  
  // Booking status text
  '>Sent<': '>{t("jobsPage.sent")}<',
  '>Accepted<': '>{t("jobsPage.accepted")}<',
  '>Verify<': '>{t("jobsPage.verify")}<',
  '>Active<': '>{t("jobsPage.active")}<',
  '>Done<': '>{t("jobsPage.done")}<',
  '>View Request<': '>{t("jobsPage.viewRequest")}<',
  '>Cancel<': '>{t("jobsPage.cancel")}<',
  '>Service Pro<': '>{t("jobsPage.servicePro")}<',
  
  // OTP and Progress
  '"IN PROGRESS"': 't("jobsPage.inProgress")',
  '"WAITING FOR OTP"': 't("jobsPage.waitingOtp")',
  '"Your Verification Code"': 't("jobsPage.verificationCode")',
  '"Share this OTP with the worker only when they arrive at your location."': 't("jobsPage.shareOtpMsg")',
  '"Service started at "': 't("jobsPage.serviceStartedAt") + " "',
  '"Chat With Worker"': 't("jobsPage.chatWithWorker")',
  '"Details"': 't("jobsPage.details")',
  '"Track Progress"': 't("jobsPage.trackProgress")',
  '>Chat<': '>{t("jobsPage.chat")}<',
  
  // Completed Bookings
  '"Recently Completed"': 't("jobsPage.recentlyCompleted")',
  '"Rate Experience"': 't("jobsPage.rateExperience")',
  '"Hire Again"': 't("jobsPage.hireAgain")',
  
  // Modal Texts
  '"Booking Details"': 't("jobsPage.bookingDetails")',
  '"Close"': 't("jobsPage.close")',
  '"Cancel Booking"': 't("jobsPage.cancelBooking")',
  '"Cancel Request"': 't("jobsPage.cancelRequest")',
  '"Specialist"': 't("jobsPage.specialist")',
  '"reviews"': 't("jobsPage.reviews")',
  '"Job Requirements"': 't("jobsPage.jobRequirements")',
  '"Scheduled For"': 't("jobsPage.scheduledFor")',
  '"Estimated Cost"': 't("jobsPage.estimatedCost")',
  '"Current Status"': 't("jobsPage.currentStatus")',
  '"Hourly Rate / Custom"': 't("jobsPage.hourlyRateCustom")',
  '"Service Request Details"': 't("jobsPage.serviceRequestDetails")',
  '"Service Category"': 't("jobsPage.serviceCategory")',
  '"Task Description"': 't("jobsPage.taskDescription")',
  '"Posted On"': 't("jobsPage.postedOn")',
  '"Max Budget"': 't("jobsPage.maxBudget")',
  '"No preference"': 't("jobsPage.noPreference")',
  
  // Ratings Modal
  '"How was your service?"': 't("jobsPage.howWasService")',
  '"Your rating helps other clients hire the best pros."': 't("jobsPage.ratingHelpMsg")',
  '"Write a brief comment (optional)"': 't("jobsPage.writeComment")',
  'placeholder="Describe your experience with the service provider..."': 'placeholder={t("jobsPage.commentPlaceholder")}',
  '"Submitting..."': 't("jobsPage.submitting")',
  '"Submit Review"': 't("jobsPage.submitReview")',
};

for (const [key, value] of Object.entries(replacements)) {
  code = code.split(key).join(value);
}

// Special cases that need literal tags inside code
code = code.replace(
  />My Jobs</g, 
  '>{t("jobsPage.myJobs")}<'
);
code = code.replace(
  />Manage your service requests, track active workers, and rate past experiences.</g, 
  '>{t("jobsPage.jobsDesc")}<'
);
code = code.replace(
  />No Active Jobs Yet</g, 
  '>{t("jobsPage.noActiveJobs")}<'
);
code = code.replace(
  />You haven't booked any services yet. Browse trusted professionals and get started.</g, 
  '>{t("jobsPage.noActiveJobsDesc")}<'
);
code = code.replace(
  />Browse Services</g, 
  '>{t("jobsPage.browseServices")}<'
);
code = code.replace(
  />Find Workers</g, 
  '>{t("jobsPage.findWorkers")}<'
);
code = code.replace(
  />Searching for nearby Pros...</g, 
  '>{t("jobsPage.searchingNearby")}<'
);
code = code.replace(
  />PENDING ACCEPTANCE</g, 
  '>{t("jobsPage.pendingAcceptance")}<'
);
code = code.replace(
  />WAITING FOR OTP</g, 
  '>{t("jobsPage.waitingOtp")}<'
);
code = code.replace(
  />IN PROGRESS</g, 
  '>{t("jobsPage.inProgress")}<'
);
code = code.replace(
  />Your Verification Code</g, 
  '>{t("jobsPage.verificationCode")}<'
);
code = code.replace(
  />Share this OTP with the worker only when they arrive at your location.</g, 
  '>{t("jobsPage.shareOtpMsg")}<'
);
code = code.replace(
  />Service started at /g, 
  '>{t("jobsPage.serviceStartedAt")} '
);
code = code.replace(
  />Chat With Worker</g, 
  '>{t("jobsPage.chatWithWorker")}<'
);
code = code.replace(
  />Details</g, 
  '>{t("jobsPage.details")}<'
);
code = code.replace(
  />Track Progress</g, 
  '>{t("jobsPage.trackProgress")}<'
);
code = code.replace(
  />Recently Completed</g, 
  '>{t("jobsPage.recentlyCompleted")}<'
);
code = code.replace(
  />Rate Experience</g, 
  '>{t("jobsPage.rateExperience")}<'
);
code = code.replace(
  />Hire Again</g, 
  '>{t("jobsPage.hireAgain")}<'
);
code = code.replace(
  />Booking Details</g, 
  '>{t("jobsPage.bookingDetails")}<'
);
code = code.replace(
  />Close</g, 
  '>{t("jobsPage.close")}<'
);
code = code.replace(
  />Cancel Booking</g, 
  '>{t("jobsPage.cancelBooking")}<'
);
code = code.replace(
  />Cancel Request</g, 
  '>{t("jobsPage.cancelRequest")}<'
);
code = code.replace(
  />Specialist</g, 
  '>{t("jobsPage.specialist")}<'
);
code = code.replace(
  />reviews</g, 
  '>{t("jobsPage.reviews")}<'
);
code = code.replace(
  />Job Requirements</g, 
  '>{t("jobsPage.jobRequirements")}<'
);
code = code.replace(
  />Scheduled For</g, 
  '>{t("jobsPage.scheduledFor")}<'
);
code = code.replace(
  />Estimated Cost</g, 
  '>{t("jobsPage.estimatedCost")}<'
);
code = code.replace(
  />Current Status</g, 
  '>{t("jobsPage.currentStatus")}<'
);
code = code.replace(
  />Hourly Rate \/ Custom</g, 
  '>{t("jobsPage.hourlyRateCustom")}<'
);
code = code.replace(
  />Service Request Details</g, 
  '>{t("jobsPage.serviceRequestDetails")}<'
);
code = code.replace(
  />Service Category</g, 
  '>{t("jobsPage.serviceCategory")}<'
);
code = code.replace(
  />Task Description</g, 
  '>{t("jobsPage.taskDescription")}<'
);
code = code.replace(
  />Posted On</g, 
  '>{t("jobsPage.postedOn")}<'
);
code = code.replace(
  />Max Budget</g, 
  '>{t("jobsPage.maxBudget")}<'
);
code = code.replace(
  />No preference</g, 
  '>{t("jobsPage.noPreference")}<'
);
code = code.replace(
  />How was your service?</g, 
  '>{t("jobsPage.howWasService")}<'
);
code = code.replace(
  />Your rating helps other clients hire the best pros.</g, 
  '>{t("jobsPage.ratingHelpMsg")}<'
);
code = code.replace(
  />Write a brief comment \(optional\)</g, 
  '>{t("jobsPage.writeComment")}<'
);
code = code.replace(
  />Submitting...</g, 
  '>{t("jobsPage.submitting")}<'
);
code = code.replace(
  />Submit Review</g, 
  '>{t("jobsPage.submitReview")}<'
);

fs.writeFileSync('src/app/customer/jobs/CustomerJobsClient.tsx', code, 'utf8');
console.log('CustomerJobsClient patched');
