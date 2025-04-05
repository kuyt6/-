// تحميل بيانات المستخدم
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    loadUserPosts();
});

function loadProfile() {
    document.getElementById('name').value = currentUser.name;
    document.getElementById('email').value = currentUser.email;
    if (currentUser.avatar) {
        document.getElementById('profileAvatar').src = currentUser.avatar;
    }
}

// تحديث الملف الشخصي
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const avatarInput = document.getElementById('avatar');
    
    currentUser.name = name;
    currentUser.email = email;
    
    if (avatarInput.files[0]) {
        const avatarFile = avatarInput.files[0];
        currentUser.avatar = URL.createObjectURL(avatarFile);
        document.getElementById('profileAvatar').src = currentUser.avatar;
    }
    
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    
    alert('تم حفظ التغييرات بنجاح');
});

// عرض منشورات المستخدم
function loadUserPosts() {
    const userPostsContainer = document.getElementById('userPostsContainer');
    const userPosts = posts.filter(post => post.userId === currentUser.id);
    
    if (userPosts.length === 0) {
        userPostsContainer.innerHTML = '<p>ليس لديك أي منشورات بعد</p>';
        return;
    }
    
    userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        
        let postHTML = `
            <div class="post-content">${post.content}</div>
            <div class="post-info">
                ${post.date}
            </div>
        `;
        
        if (post.imageUrl) {
            postHTML += `<img src="${post.imageUrl}" class="post-image" alt="صورة المنشور">`;
        } else if (post.file) {
            postHTML += `<a href="#" class="post-file">${post.file.name} (${formatFileSize(post.file.size)})</a>`;
        }
        
        postElement.innerHTML = postHTML;
        userPostsContainer.appendChild(postElement);
    });
}