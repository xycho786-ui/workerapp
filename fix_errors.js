const fs = require('fs');

// Fix CustomerJobsClient.tsx import
let jobsCode = fs.readFileSync('src/app/customer/jobs/CustomerJobsClient.tsx', 'utf8');
jobsCode = jobsCode.replace(`import { useLanguage } from "@/utils/language";`, `import { useLanguage } from "@/context/LanguageContext";`);
fs.writeFileSync('src/app/customer/jobs/CustomerJobsClient.tsx', jobsCode, 'utf8');

// Fix CustomerProfileContent.tsx
let profCode = fs.readFileSync('src/app/customer/profile/CustomerProfileContent.tsx', 'utf8');
profCode = profCode.replace(`import { useLanguage } from "@/utils/language";`, `import { useLanguage } from "@/context/LanguageContext";`);
profCode = profCode.replace(
  `export default function CustomerProfileContent({\n  dbUser,\n  userMetadata,\n}: { dbUser: any; userMetadata: any }) {\n  const { t } = useLanguage();\n  const router = useRouter();`,
  `export default function CustomerProfileContent({\n  dbUser,\n  handleLogoutAction\n}: CustomerProfileContentProps) {\n  const { t } = useLanguage();\n  const router = useRouter();`
);
fs.writeFileSync('src/app/customer/profile/CustomerProfileContent.tsx', profCode, 'utf8');

// Fix chat page
let chatCode = fs.readFileSync('src/app/customer/chat/page.tsx', 'utf8');
chatCode = chatCode.replace(`placeholder=t("chatPage.askBooking")`, `placeholder={t("chatPage.askBooking")}`);
fs.writeFileSync('src/app/customer/chat/page.tsx', chatCode, 'utf8');

console.log('Fixed errors');
