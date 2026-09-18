document.addEventListener('DOMContentLoaded', () => {
    const pageForm = document.getElementById('page-form');
    const pageResult = document.getElementById('page-result');
    const generateBtn = document.getElementById('generate-btn');
    const navBackArrow = document.getElementById('nav-back-arrow');
    const navBackX = document.getElementById('nav-back-x');

    // 注册 PWA Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => console.log('ServiceWorker 注册成功:', registration.scope))
                .catch(err => console.log('ServiceWorker 注册失败:', err));
        });
    }

    // 简化的字段列表（移除了不需要填写的字段）
    const fields = [
        'name', 'leaveType', 'startTime', 'endTime',
        'reason', 'applyTime', 'counselorName', 'approveTime'
    ];

    // 加载已保存的数据
    loadSavedData();

    // 监听输入并自动保存
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                saveData();
            });
        }
    });

    // 生成按钮点击事件
    generateBtn.addEventListener('click', () => {
        if (validateForm()) {
            updateDisplay();
            showPage('result');
        } else {
            alert('请填写完整必填项！');
        }
    });

    // 头部返回按钮点击事件 (箭头和X)
    [navBackArrow, navBackX].forEach(btn => {
        btn.addEventListener('click', () => {
            showPage('form');
        });
    });

    // 自动保存数据到 localStorage
    function saveData() {
        const data = {};
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                data[id] = input.value;
            }
        });
        localStorage.setItem('leaveFormData_v2', JSON.stringify(data));
    }

    // 从 localStorage 加载数据
    function loadSavedData() {
        const savedData = localStorage.getItem('leaveFormData_v2');
        if (savedData) {
            const data = JSON.parse(savedData);
            fields.forEach(id => {
                const input = document.getElementById(id);
                if (input && data[id]) {
                    input.value = data[id];
                }
            });
        }
    }

    // 表单验证
    function validateForm() {
        return fields.every(id => {
            const input = document.getElementById(id);
            return input && input.value.trim() !== '';
        });
    }

    // 页面切换
    function showPage(page) {
        if (page === 'result') {
            pageForm.classList.add('hidden');
            pageResult.classList.remove('hidden');
            // 确保内容从顶部开始显示
            document.getElementById('scroll-content').scrollTop = 0;
        } else {
            pageForm.classList.remove('hidden');
            pageResult.classList.add('hidden');
        }
    }

    // 更新展示页面内容
    function updateDisplay() {
        const data = {};
        fields.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                data[id] = input.value;
            }
        });

        // 请假类型和理由
        document.getElementById('display-leaveType').textContent = data.leaveType;
        document.getElementById('display-reason').textContent = data.reason;

        // 格式化时间显示 (YYYY-MM-DD HH:mm:ss)
        document.getElementById('display-startTime').textContent = formatDateTime(data.startTime, true);
        document.getElementById('display-endTime').textContent = formatDateTime(data.endTime, true);

        // 办理进度时间 (YYYY-MM-DD HH:mm)
        document.getElementById('display-applyTime').textContent = formatDateTime(data.applyTime, false);
        document.getElementById('display-approveTime').textContent = formatDateTime(data.approveTime, false);
        
        // 办理进度人名
        document.getElementById('display-applyName').textContent = data.name;
        document.getElementById('display-counselorName').textContent = data.counselorName;
    }

    // 时间格式化
    function formatDateTime(dateTimeStr, includeSeconds) {
        if (!dateTimeStr) return '';
        const date = new Date(dateTimeStr);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = '00';

        let formatted = `${y}-${m}-${d} ${h}:${min}`;
        if (includeSeconds) {
            formatted += `:${s}`;
        }
        return formatted;
    }
});
