
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content-item');

tabs.forEach(tab => {
  tab.addEventListener('click', function() {
    const targetTab = this.getAttribute('data-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    contents.forEach(content => {
      content.classList.remove('active');
      if (content.getAttribute('data-content') === targetTab) {
        content.classList.add('active');
      }
    });
  });
});