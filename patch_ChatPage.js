const fs = require('fs');
let code = fs.readFileSync('src/app/customer/chat/page.tsx', 'utf8');

if (!code.includes('getServerLanguage')) {
  code = code.replace(`import Link from "next/link";`, `import Link from "next/link";\nimport { getServerLanguage } from "@/utils/serverLanguage";`);
  
  code = code.replace(
    `export default function CustomerChat() {`,
    `export default async function CustomerChat() {\n  const { t } = await getServerLanguage();`
  );
}

// Ensure the default export is `async function`
code = code.replace(`export default function CustomerChat() {`, `export default async function CustomerChat() {`);

// Replacements
const replacements = {
  // Inbox search
  '"Messages"': 't("chatPage.messages")',
  '"Inbox"': 't("chatPage.inbox")',
  '"Search messages..."': 't("chatPage.searchMessages")',
  
  // Tabs
  '"All Chats"': 't("chatPage.allChats")',
  '"Unread"': 't("chatPage.unread")',
  '"Archived"': 't("chatPage.archived")',
  
  // Empty states
  '"Loading message history..."': 't("chatPage.loadingMessages")',
  '"No messages found"': 't("chatPage.noMessagesFound")',
  '"We couldn\'t find any chats matching your search term."': 't("chatPage.noMessagesSearch")',
  '"You have no unread notifications or conversations."': 't("chatPage.noMessagesUnread")',
  '"Your active and past worker chats will be displayed here."': 't("chatPage.noMessagesAll")',
  
  // Chat list
  '"AI Support Assistant"': 't("chatPage.aiSupportAssistant")',
  '"Helper"': 't("chatPage.helper")',
  '"Click to manage bookings, ask questions & coordinate help."': 't("chatPage.aiSupportDesc")',
  '"Task:"': 't("chatPage.task") + ":"',
  '"Closed"': 't("chatPage.closed")',
  '"Active Work"': 't("chatPage.activeWork")',
  '"Accepted"': 't("chatPage.accepted")',
  
  // Active chat
  '"Support Assistant"': 't("chatPage.supportAssistant")',
  '"Online"': 't("chatPage.online")',
  '"Booking Support"': 't("chatPage.bookingSupport")',
  '"I can help you manage your active bookings, answer questions, and coordinate help."': 't("chatPage.bookingSupportDesc")',
  '"Ask about your booking..."': 't("chatPage.askBooking")',
  
  '"Chat Unavailable"': 't("chatPage.chatUnavailable")',
  '"Chat will become available once the worker accepts your booking request."': 't("chatPage.chatUnavailableDesc")',
  '"Back to My Jobs"': 't("chatPage.backToJobs")'
};

for (const [key, value] of Object.entries(replacements)) {
  code = code.split(key).join(value);
}

// Literal tag replacements
const tagReplacements = {
  '>Messages<': '>{t("chatPage.messages")}<',
  '>Inbox<': '>{t("chatPage.inbox")}<',
  '>All Chats<': '>{t("chatPage.allChats")}<',
  '>Unread<': '>{t("chatPage.unread")}<',
  '>Archived<': '>{t("chatPage.archived")}<',
  '>Loading message history...<': '>{t("chatPage.loadingMessages")}<',
  '>No messages found<': '>{t("chatPage.noMessagesFound")}<',
  '>We couldn\'t find any chats matching your search term.<': '>{t("chatPage.noMessagesSearch")}<',
  '>You have no unread notifications or conversations.<': '>{t("chatPage.noMessagesUnread")}<',
  '>Your active and past worker chats will be displayed here.<': '>{t("chatPage.noMessagesAll")}<',
  '>AI Support Assistant<': '>{t("chatPage.aiSupportAssistant")}<',
  '>Helper<': '>{t("chatPage.helper")}<',
  '>Click to manage bookings, ask questions & coordinate help.<': '>{t("chatPage.aiSupportDesc")}<',
  '>Task: ': '>{t("chatPage.task")}: ',
  '>Closed<': '>{t("chatPage.closed")}<',
  '>Active Work<': '>{t("chatPage.activeWork")}<',
  '>Accepted<': '>{t("chatPage.accepted")}<',
  '>Support Assistant<': '>{t("chatPage.supportAssistant")}<',
  '>Online<': '>{t("chatPage.online")}<',
  '>Booking Support<': '>{t("chatPage.bookingSupport")}<',
  '>I can help you manage your active bookings, answer questions, and coordinate help.<': '>{t("chatPage.bookingSupportDesc")}<',
  '>Chat Unavailable<': '>{t("chatPage.chatUnavailable")}<',
  '>Chat will become available once the worker accepts your booking request.<': '>{t("chatPage.chatUnavailableDesc")}<',
  '>Back to My Jobs<': '>{t("chatPage.backToJobs")}<',
  'placeholder="Search messages..."': 'placeholder={t("chatPage.searchMessages")}',
  'placeholder="Ask about your booking..."': 'placeholder={t("chatPage.askBooking")}'
};

for (const [key, value] of Object.entries(tagReplacements)) {
  code = code.split(key).join(value);
}

fs.writeFileSync('src/app/customer/chat/page.tsx', code, 'utf8');
console.log('Chat page patched');
