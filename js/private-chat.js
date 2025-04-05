// بيانات المستخدمين والمحادثات (في تطبيق حقيقي ستستخدم قاعدة بيانات)
let contacts = [
    { id: 2, name: "أحمد", avatar: "avatar2.jpg", online: true },
    { id: 3, name: "علي", avatar: "avatar3.jpg", online: false },
    { id: 4, name: "سارة", avatar: "avatar4.jpg", online: true }
];

let privateMessages = {
    '2': [
        { id: 1, sender: currentUser.id, content: "مرحباً أحمد!", time: "9:00 ص" },
        { id: 2, sender: 2, content: "أهلاً وسهلاً!", time: "9:05 ص" }
    ],
    '3': [
        { id: 1, sender: 3, content: "كيف الحال؟", time: "أمس 8:00 م" }
    ]
};

let currentContact = null;

// تحميل البيانات عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
    renderContacts();
    
    // إرسال رسالة خاصة
    document.getElementById('sendPrivateMessage').addEventListener('click', sendPrivateMessage);
    document.getElementById('privateMessageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendPrivateMessage();
        }
    });
});

// عرض قائمة الأصدقاء
function renderContacts() {
    const contactsContainer = document.getElementById('contactsContainer');
    contactsContainer.innerHTML = '';
    
    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact';
        if (currentContact && currentContact.id === contact.id) {
            contactElement.classList.add('active');
        }
        
        contactElement.innerHTML = `
            <div>${contact.name}</div>
            <small>${contact.online ? 'متصل الآن' : 'غير متصل'}</small>
        `;
        
        contactElement.addEventListener('click', () => {
            currentContact = contact;
            renderContacts();
            renderPrivateMessages();
        });
        
        contactsContainer.appendChild(contactElement);
    });
}

// عرض رسائل الدردشة الخاصة
function renderPrivateMessages() {
    const messagesContainer = document.getElementById('privateMessagesContainer');
    messagesContainer.innerHTML = '';
    
    if (!currentContact) {
        messagesContainer.innerHTML = '<p>اختر شخصاً لبدء الدردشة</p>';
        return;
    }
    
    const messages = privateMessages[currentContact.id] || [];
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `<p>لا توجد رسائل مع ${currentContact.name}</p>`;
        return;
    }
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === currentUser.id ? 'sent' : 'received'}`;
        
        const sender = message.sender === currentUser.id ? currentUser : contacts.find(c => c.id === message.sender);
        
        messageElement.innerHTML = `
            <div class="message-sender">${sender.name}</div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
        `;
        messagesContainer.appendChild(messageElement);
    });
    
    // التمرير إلى أحدث رسالة
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendPrivateMessage() {
    if (!currentContact) {
        alert('الرجاء اختيار شخص لإرسال الرسالة إليه');
        return;
    }
    
    const messageInput = document.getElementById('privateMessageInput');
    const content = messageInput.value.trim();
    
    if (content === '') return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = {
        id: Date.now(),
        sender: currentUser.id,
        content: content,
        time: time
    };
    
    // إضافة الرسالة إلى المحادثة
    if (!privateMessages[currentContact.id]) {
        privateMessages[currentContact.id] = [];
    }
    privateMessages[currentContact.id].push(newMessage);
    
    renderPrivateMessages();
    
    // مسح حقل الإدخال
    messageInput.value = '';
}