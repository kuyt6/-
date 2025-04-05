// تخزين البيانات مؤقتًا (في تطبيق حقيقي ستستخدم قاعدة بيانات)
let users = [
    { id: 1, name: "محمد", email: "mohamed@example.com", avatar: "avatar1.jpg" }
];

let posts = [];
let currentUser = users[0];

// التعامل مع رفع الملفات
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const postContent = document.getElementById('postContent').value;
    
    if (!postContent && !fileInput.files[0]) {
        alert('الرجاء إدخال نص أو اختيار ملف');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        userId: currentUser.id,
        content: postContent,
        date: new Date().toLocaleString(),
        likes: 0
    };
    
    if (fileInput.files[0]) {
        const file = fileInput.files[0];
        const fileType = file.type.split('/')[0];
        
        // في تطبيق حقيقي، ستقوم برفع الملف إلى الخادم
        // هنا سنقوم فقط بحفظ معلومات الملف
        newPost.file = {
            name: file.name,
            type: fileType,
            size: file.size
        };
        
        if (fileType === 'image') {
            newPost.imageUrl = URL.createObjectURL(file);
        }
    }
    
    posts.unshift(newPost);
    renderPosts();
    
    // إعادة تعيين النموذج
    this.reset();
});

// عرض المنشورات
function renderPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>لا توجد منشورات بعد</p>';
        return;
    }
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        let postHTML = `
            <div class="post-content">${post.content}</div>
            <div class="post-info">
                نشر بواسطة ${getUserById(post.userId).name} - ${post.date}
            </div>
        `;
        
        if (post.imageUrl) {
            postHTML += `<img src="${post.imageUrl}" class="post-image" alt="صورة المنشور">`;
        } else if (post.file) {
            postHTML += `<a href="#" class="post-file">${post.file.name} (${formatFileSize(post.file.size)})</a>`;
        }
        
        postElement.innerHTML = postHTML;
        postsContainer.appendChild(postElement);
    });
}

// وظائف مساعدة
function getUserById(id) {
    return users.find(user => user.id === id);
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' بايت';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' كيلوبايت';
    else return (bytes / 1048576).toFixed(1) + ' ميجابايت';
}

// تحميل المنشورات عند بدء التشغيل
renderPosts();