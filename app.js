// 初始化清酒数据
let sakes = [];

// DOM 元素
const sakeContainer = document.getElementById('sake-container');

// 渲染清酒卡片
function renderSakes() {
    sakeContainer.innerHTML = sakes.map(sake => `
        <div class="sake-card" data-id="${sake.id}">
            <div class="sake-image" style="background-image: url('${sake.image}')"></div>
            <div class="sake-info">
                <h3>${sake.name}</h3>
                <div class="sake-rating">
                    ${renderRating(sake.rating)}
                </div>
                <p class="sake-notes">${sake.notes}</p>
            </div>
        </div>
    `).join('');
}

// 渲染评分星星
function renderRating(rating) {
    const fullStars = '★'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars;
}

// 初始化
function init() {
    // 示例数据
    sakes = [
        {
            id: 1,
            name: '大吟酿',
            image: 'https://via.placeholder.com/300',
            rating: 4,
            notes: '口感清爽，带有淡淡的花香'
        },
        {
            id: 2,
            name: '纯米酒',
            image: 'https://via.placeholder.com/300',
            rating: 3,
            notes: '米香浓郁，适合搭配寿司'
        }
    ];

    renderSakes();
}

// 模态窗口相关元素
const modal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close');
const addSakeBtn = document.getElementById('add-sake-btn');
const sakeForm = document.getElementById('sake-form');
const deleteBtn = document.getElementById('delete-btn');
const imagePreview = document.getElementById('image-preview');
const ratingStars = document.querySelectorAll('.rating-stars span');
let currentRating = 0;
let currentSakeId = null;

// 打开模态窗口
function openModal(sake = null) {
    if (sake) {
        // 编辑模式
        document.getElementById('sake-name').value = sake.name;
        document.getElementById('sake-category').value = sake.category || '大吟酿';
        setRating(sake.rating);
        document.getElementById('sake-notes').value = sake.notes;
        imagePreview.style.backgroundImage = `url('${sake.image}')`;
        deleteBtn.style.display = 'block';
        currentSakeId = sake.id;
    } else {
        // 添加模式
        sakeForm.reset();
        imagePreview.style.backgroundImage = '';
        deleteBtn.style.display = 'none';
        currentSakeId = null;
    }
    modal.style.display = 'block';
}

// 关闭模态窗口
function closeModal() {
    modal.style.display = 'none';
}

// 设置评分
function setRating(rating) {
    currentRating = rating;
    ratingStars.forEach((star, index) => {
        star.textContent = index < rating ? '★' : '☆';
        star.classList.toggle('active', index < rating);
    });
}

// 图片上传处理
document.getElementById('sake-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.style.backgroundImage = `url('${e.target.result}')`;
        }
        reader.readAsDataURL(file);
    }
});

// 评分交互
ratingStars.forEach(star => {
    star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        setRating(value);
    });
});

// 表单提交
sakeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const sake = {
        id: currentSakeId || Date.now(),
        name: document.getElementById('sake-name').value,
        category: document.getElementById('sake-category').value,
        rating: currentRating,
        notes: document.getElementById('sake-notes').value,
        image: imagePreview.style.backgroundImage.slice(4, -1).replace(/"/g, "")
    };

    if (currentSakeId) {
        // 更新现有清酒
        const index = sakes.findIndex(s => s.id === currentSakeId);
        sakes[index] = sake;
    } else {
        // 添加新清酒
        sakes.push(sake);
    }

    renderSakes();
    closeModal();
});

// 删除清酒
deleteBtn.addEventListener('click', function() {
    sakes = sakes.filter(s => s.id !== currentSakeId);
    renderSakes();
    closeModal();
});

// 事件监听
addSakeBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// 卡片点击事件
sakeContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.sake-card');
    if (card) {
        const sakeId = parseInt(card.dataset.id);
        const sake = sakes.find(s => s.id === sakeId);
        openModal(sake);
    }
});

// 启动应用
init();
