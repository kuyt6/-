// هذا الملف يحتوي على تكوين تأثير الجسيمات
// يمكنك تعديل الأرقام للحصول على تأثيرات مختلفة

/* eslint-disable */
particlesJS = function(tag_id, options){

  // متغيرات داخلية
  var canvasEl = document.querySelector('#' + tag_id + ' > canvas');
  var pJS = {
    canvas: {
      el: canvasEl,
      w: canvasEl.offsetWidth,
      h: canvasEl.offsetHeight
    },
    particles: {
      number: options.particles.number,
      color: options.particles.color,
      shape: options.particles.shape,
      opacity: options.particles.opacity,
      size: options.particles.size,
      size_random: options.particles.size_random,
      nb_sides: options.particles.nb_sides,
      line_linked: options.particles.line_linked,
      move: options.particles.move
    },
    interactivity: {
      detect_on: options.interactivity.detect_on,
      events: options.interactivity.events,
      modes: options.interactivity.modes
    },
    retina_detect: options.retina_detect
  };

  /* تنفيذ تأثير الجسيمات */
  // ... (الكود الكامل لتنفيذ الجسيمات سيكون هنا)
  // يمكنك العثور على الكود الكامل في مكتبة particles.js على GitHub
};