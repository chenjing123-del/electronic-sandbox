document.addEventListener('DOMContentLoaded', function () {
    const sandbox = document.getElementById('sandbox');

    // 拖拽开始事件
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.type); // 传递物件的类型
            e.target.classList.add('dragging'); // 添加拖拽样式
        });

        item.addEventListener('dragend', function (e) {
            e.target.classList.remove('dragging'); // 移除拖拽样式
        });
    });

    // 拖拽进入沙盘区域事件
    sandbox.addEventListener('dragover', function (e) {
        e.preventDefault(); // 允许拖放
    });

    // 拖拽放置事件
    sandbox.addEventListener('drop', function (e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain'); // 获取物件的类型
        const offsetX = e.offsetX; // 鼠标在沙盘中的X坐标
        const offsetY = e.offsetY; // 鼠标在沙盘中的Y坐标

        // 创建新的物件元素
        const newItem = document.createElement('div');
        newItem.className = 'sandbox-item';
        newItem.textContent = getItemEmoji(type); // 设置物件的图标
        newItem.style.position = 'absolute';
        newItem.style.left = `${offsetX}px`;
        newItem.style.top = `${offsetY}px`;
        newItem.dataset.type = type;

        // 将物件添加到沙盘中
        sandbox.appendChild(newItem);
        saveSandbox(); // 保存沙盘状态
    });

    // 右键删除物件
    sandbox.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // 阻止默认右键菜单
        if (e.target.classList.contains('sandbox-item')) {
            e.target.remove(); // 删除物件
            saveSandbox(); // 更新沙盘状态
        }
    });

    // 滚轮缩放物件
    sandbox.addEventListener('wheel', function (e) {
        if (e.target.classList.contains('sandbox-item')) {
            e.preventDefault(); // 阻止页面滚动
            const scaleFactor = 1.1; // 缩放比例
            let currentScale = parseFloat(e.target.style.transform.replace('scale(', '').replace(')', '')) || 1;

            if (e.deltaY < 0) {
                // 向上滚动，放大
                currentScale *= scaleFactor;
            } else {
                // 向下滚动，缩小
                currentScale /= scaleFactor;
            }

            e.target.style.transform = `scale(${currentScale})`;
        }
    });

    // 根据类型返回对应的图标
    function getItemEmoji(type) {
        switch (type) {
            case 'tree':
                return '🌳';
            case 'house':
                return '🏠';
            case 'car':
                return '🚗';
            case 'rock':
                return '🪨';
            default:
                return '❓';
        }
    }

    // 保存沙盘状态
    function saveSandbox() {
        const items = [];
        document.querySelectorAll('.sandbox-item').forEach(item => {
            items.push({
                type: item.dataset.type,
                x: item.style.left,
                y: item.style.top,
                scale: item.style.transform || 'scale(1)'
            });
        });
        localStorage.setItem('sandbox', JSON.stringify(items));
    }

    // 加载沙盘状态
    function loadSandbox() {
        const savedItems = JSON.parse(localStorage.getItem('sandbox')) || [];
        savedItems.forEach(item => {
            const newItem = document.createElement('div');
            newItem.className = 'sandbox-item';
            newItem.textContent = getItemEmoji(item.type);
            newItem.style.position = 'absolute';
            newItem.style.left = item.x;
            newItem.style.top = item.y;
            newItem.style.transform = item.scale;
            newItem.dataset.type = item.type;
            sandbox.appendChild(newItem);
        });
    }

    // 页面加载时恢复沙盘状态
    loadSandbox();
});
