// تخزين الرسائل (في تطبيق حقيقي ستستخدم قاعدة بيانات أو WebSocket)
let messages = [
    { id: 1, sender: "أحمد", content: "مرحباً بالجميع!", time: "10:00 ص" },
    { id: 2, sender: "محمد", content: "أهلاً وسهلاً!", time: "10:05 ص" }
];

// تحميل الرسائل عند بدء التشغيل
document.addEventListener('DOMContentLoaded', function() {
    renderMessages();
    
    // إرسال رسالة جديدة
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function renderMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-sender">${message.sender}</div>
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.time}</div>
        `;
        messagesContainer.appendChild(messageElement);
    });
    
    // التمرير إلى أحدث رسالة
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();
    
    if (content === '') return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = {
        id: Date.now(),
        sender: currentUser.name,
        content: content,
        time: time
    };
    
    messages.push(newMessage);
    renderMessages();
    
    // مسح حقل الإدخال
    messageInput.value = '';
}