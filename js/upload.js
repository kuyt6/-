// تهيئة تأثير الجسيمات
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#7289da" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#7289da", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    }
  }
});

// متغيرات التطبيق
let filesToUpload = [];
let tags = [];

// عناصر DOM
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const startUploadBtn = document.getElementById('startUpload');
const tagInput = document.getElementById('tagInput');
const tagsContainer = document.getElementById('tagsContainer');
const recentUploads = document.getElementById('recentUploads');

// أحداث سحب وإفلات الملفات
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#677bc4';
  uploadArea.style.backgroundColor = 'rgba(114, 137, 218, 0.2)';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = 'var(--primary-color)';
  uploadArea.style.backgroundColor = 'rgba(114, 137, 218, 0.05)';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = 'var(--primary-color)';
  uploadArea.style.backgroundColor = 'rgba(114, 137, 218, 0.05)';
  
  if (e.dataTransfer.files.length > 0) {
    handleFiles(e.dataTransfer.files);
  }
});

// اختيار الملفات عبر الزر
fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0) {
    handleFiles(fileInput.files);
  }
});

// معالجة الملفات المختارة
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // التحقق من نوع الملف وحجمه
    if (!validateFile(file)) continue;
    
    // إضافة الملف إلى قائمة الانتظار
    filesToUpload.push(file);
  }
  
  updateUploadQueue();
}

// التحقق من صحة الملف
function validateFile(file) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf', 'audio/mpeg'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!validTypes.includes(file.type)) {
    alert(`نوع الملف ${file.name} غير مدعوم`);
    return false;
  }
  
  if (file.size > maxSize) {
    alert(`حجم الملف ${file.name} كبير جدًا (الحد الأقصى 50MB)`);
    return false;
  }
  
  return true;
}

// تحديث قائمة الملفات في انتظار الرفع
function updateUploadQueue() {
  if (filesToUpload.length > 0) {
    uploadProgress.style.display = 'block';
    uploadProgress.innerHTML = `
      <h3>${filesToUpload.length} ملف جاهز للرفع</h3>
      <div class="file-list">
        ${filesToUpload.map(file => `
          <div class="file-item">
            <i class="${getFileIcon(file.type)}"></i>
            <span>${file.name}</span>
            <small>${formatFileSize(file.size)}</small>
          </div>
        `).join('')}
      </div>
    `;
  } else {
    uploadProgress.style.display = 'none';
  }
}

// بدء عملية الرفع
startUploadBtn.addEventListener('click', () => {
  if (filesToUpload.length === 0) {
    alert('الرجاء اختيار ملفات للرفع');
    return;
  }
  
  const fileTitle = document.getElementById('fileTitle').value;
  const fileDescription = document.getElementById('fileDescription').value;
  const privacy = document.querySelector('input[name="privacy"]:checked').value;
  
  // في تطبيق حقيقي، هنا ستقوم بإرسال البيانات إلى الخادم
  simulateUpload(fileTitle, fileDescription, privacy);
});

// محاكاة عملية الرفع (في تطبيق حقيقي ستستخدم AJAX أو Fetch)
function simulateUpload(title, description, privacy) {
  uploadProgress.innerHTML = `
    <h3>جاري رفع ${filesToUpload.length} ملف...</h3>
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
    </div>
    <div class="progress-info">
      <span id="progressText">0%</span>
      <span id="uploadSpeed">--</span>
    </div>
  `;
  
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const uploadSpeed = document.getElementById('uploadSpeed');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
    uploadSpeed.textContent = `${(Math.random() * 2 + 1).toFixed(1)} MB/s`;
    
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        completeUpload(title, description, privacy);
      }, 500);
    }
  }, 300);
}

// اكتمال الرفع
function completeUpload(title, description, privacy) {
  // إضافة الملفات إلى قائمة المرفوعات حديثًا
  filesToUpload.forEach(file => {
    const upload = {
      id: Date.now(),
      title: title || file.name,
      description,
      privacy,
      type: file.type,
      size: file.size,
      date: new Date().toLocaleString(),
      downloads: 0,
      likes: 0
    };
    
    addToRecentUploads(upload);
  });
  
  // إعادة تعيين النموذج
  filesToUpload = [];
  document.getElementById('fileTitle').value = '';
  document.getElementById('fileDescription').value = '';
  document.querySelector('input[name="privacy"][value="public"]').checked = true;
  tags = [];
  renderTags();
  
  // عرض رسالة نجاح
  uploadProgress.innerHTML = `
    <div class="upload-success">
      <i class="fas fa-check-circle"></i>
      <h3>تم رفع الملفات بنجاح!</h3>
      <p>يمكنك مشاركة الملفات مع الآخرين</p>
    </div>
  `;
  
  setTimeout(() => {
    uploadProgress.style.display = 'none';
  }, 3000);
}

// إضافة وسم جديد
tagInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && tagInput.value.trim() !== '') {
    const tag = tagInput.value.trim();
    if (!tags.includes(tag)) {
      tags.push(tag);
      renderTags();
    }
    tagInput.value = '';
  }
});

// عرض الوسوم
function renderTags() {
  tagsContainer.innerHTML = tags.map(tag => `
    <div class="tag">
      ${tag}
      <span class="tag-remove" data-tag="${tag}">&times;</span>
    </div>
  `).join('');
  
  // إضافة أحداث لإزالة الوسوم
  document.querySelectorAll('.tag-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tagToRemove = e.target.getAttribute('data-tag');
      tags = tags.filter(tag => tag !== tagToRemove);
      renderTags();
    });
  });
}

// إضافة إلى المرفوعات حديثًا
function addToRecentUploads(upload) {
  const emptyState = recentUploads.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }
  
  const uploadItem = document.createElement('div');
  uploadItem.className = 'upload-item animate-fade';
  uploadItem.innerHTML = `
    <i class="upload-icon ${getFileIcon(upload.type)}"></i>
    <div class="upload-details">
      <div class="upload-title">${upload.title}</div>
      <div class="upload-meta">
        <span><i class="fas fa-clock"></i> ${upload.date}</span>
        <span><i class="fas fa-database"></i> ${formatFileSize(upload.size)}</span>
        <span><i class="fas fa-${upload.privacy === 'public' ? 'globe' : upload.privacy === 'friends' ? 'user-friends' : 'lock'}"></i> ${getPrivacyText(upload.privacy)}</span>
      </div>
    </div>
    <div class="upload-actions">
      <button title="مشاركة"><i class="fas fa-share-alt"></i></button>
      <button title="تحميل"><i class="fas fa-download"></i></button>
      <button title="إعجاب"><i class="fas fa-heart"></i></button>
      <button title="تعليق"><i class="fas fa-comment"></i></button>
    </div>
  `;
  
  recentUploads.prepend(uploadItem);
}

// وظائف مساعدة
function getFileIcon(fileType) {
  if (fileType.startsWith('image/')) return 'fas fa-file-image';
  if (fileType.startsWith('video/')) return 'fas fa-file-video';
  if (fileType === 'application/pdf') return 'fas fa-file-pdf';
  if (fileType.startsWith('audio/')) return 'fas fa-file-audio';
  return 'fas fa-file';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' بايت';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' كيلوبايت';
  else return (bytes / 1048576).toFixed(1) + ' ميجابايت';
}

function getPrivacyText(privacy) {
  return {
    'public': 'عام',
    'friends': 'الأصدقاء',
    'private': 'خاص'
  }[privacy];
}

// تحميل بعض الملفات المرفوعة مسبقًا للعرض
window.addEventListener('load', () => {
  const sampleUploads = [
    {
      id: 1,
      title: 'صورة الطبيعة',
      type: 'image/jpeg',
      size: 2456789,
      date: 'اليوم 10:30 ص',
      privacy: 'public',
      downloads: 12,
      likes: 5
    },
    {
      id: 2,
      title: 'مستند المشروع',
      type: 'application/pdf',
      size: 3456789,
      date: 'أمس 3:45 م',
      privacy: 'friends',
      downloads: 8,
      likes: 3
    }
  ];
  
  sampleUploads.forEach(upload => {
    addToRecentUploads(upload);
  });
});