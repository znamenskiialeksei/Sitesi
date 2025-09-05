document.addEventListener('DOMContentLoaded', () => {
    const cacheBust = `?v=${new Date().getTime()}`;
    fetch(`config.json${cacheBust}`).then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    }).then(config => {
        renderPage(config);
    }).catch(error => {
        console.error("Ошибка: Не удалось загрузить конфигурацию сайта.", error);
        document.body.innerHTML = '<h1 style="text-align: center; margin-top: 50px;">Ошибка загрузки сайта</h1>';
    });
});

function renderPage(config) {
    document.title = config.globalSettings.pageTitle;
    const mainLayout = config.layout.main || {};
    setupBackground(document.body, mainLayout.background);
    setupSection('page-header', config.layout.header);
    setupSection('page-footer', config.layout.footer);
    const elementContainer = document.getElementById('element-container');
    elementContainer.innerHTML = '';
    config.layout.main.columns.forEach(column => {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'layout-column';
        columnDiv.style.flexBasis = column.width;
        column.elements.forEach(elementId => {
            const elementData = config.elements.find(el => el.id === elementId);
            if (elementData) {
                const elementNode = createElement(elementData);
                columnDiv.appendChild(elementNode);
            } else {
                console.warn(`Элемент с ID "${elementId}" не найден.`);
            }
        });
        elementContainer.appendChild(columnDiv);
    });
    setupModalInteraction();
}

function setupBackground(element, backgroundConfig) {
    if (!element || !backgroundConfig) return;
    if (backgroundConfig.type === 'color') {
        element.style.backgroundColor = backgroundConfig.value;
        element.style.backgroundImage = 'none';
    } else if (backgroundConfig.type === 'image') {
        element.style.backgroundImage = `url('${backgroundConfig.value}')`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';
        element.style.backgroundColor = 'transparent';
    }
}

function setupSection(elementId, sectionConfig) {
    const element = document.getElementById(elementId);
    if (!element || !sectionConfig) return;
    element.innerHTML = sectionConfig.content;
    setupBackground(element, sectionConfig.background);
    if (sectionConfig.styles) Object.assign(element.style, sectionConfig.styles);
}

function createElement(elementData) {
    const wrapper = document.createElement('div');
    wrapper.className = `element-wrapper type-${elementData.type}`;
    wrapper.id = elementData.id;
    let element;
    switch (elementData.type) {
        case 'externalBlock': case 'videoBlock': case 'reels':
            element = document.createElement('iframe');
            element.src = elementData.content.url;
            element.setAttribute('frameborder', '0');
            element.setAttribute('allowfullscreen', '');
            element.setAttribute('loading', 'lazy');
            break;
        case 'textBlock':
            element = document.createElement('div');
            element.innerHTML = elementData.content.html;
            break;
        case 'photo':
            element = document.createElement('img');
            element.src = elementData.content.url;
            element.alt = elementData.adminTitle || 'Изображение';
            element.setAttribute('loading', 'lazy');
            break;
        case 'button':
            if (elementData.content.hasDropdown && elementData.content.dropdownItems?.length > 0) {
                element = document.createElement('div');
                element.className = 'dropdown-container';
                const button = document.createElement('button');
                button.textContent = elementData.content.text;
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'dropdown-menu';
                elementData.content.dropdownItems.forEach(item => {
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.textContent = item.label;
                    link.target = '_blank';
                    dropdownMenu.appendChild(link);
                });
                element.appendChild(button);
                element.appendChild(dropdownMenu);

                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Сначала показываем меню, чтобы правильно рассчитать его размеры
                    dropdownMenu.classList.toggle('show');
                    if (!dropdownMenu.classList.contains('show')) return;
                    
                    const buttonRect = button.getBoundingClientRect();
                    const menuRect = dropdownMenu.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const windowWidth = window.innerWidth;

                    // Вертикальное позиционирование (вверх/вниз)
                    if (buttonRect.bottom + menuRect.height > windowHeight && buttonRect.top - menuRect.height > 0) {
                        // Если внизу нет места, а вверху есть - открываем вверх
                        dropdownMenu.style.top = `${buttonRect.top - menuRect.height}px`;
                    } else {
                        // В остальных случаях - открываем вниз
                        dropdownMenu.style.top = `${buttonRect.bottom}px`;
                    }

                    // Горизонтальное позиционирование (влево/вправо)
                    let leftPosition = buttonRect.left;
                    if (leftPosition + menuRect.width > windowWidth) {
                        leftPosition = windowWidth - menuRect.width - 5; // Смещаем влево, если не помещается
                    }
                    dropdownMenu.style.left = `${leftPosition}px`;
                });
                window.addEventListener('click', () => { dropdownMenu.classList.remove('show'); });

            } else {
                element = document.createElement('button');
                element.textContent = elementData.content.text;
                if (elementData.content.action === 'openLink' && elementData.content.url) {
                    element.onclick = () => window.open(elementData.content.url, '_blank');
                } else if (elementData.content.action === 'openModal') {
                    element.classList.add('modal-trigger-btn');
                    element.dataset.modalContent = elementData.content.modalContent;
                }
            }
            break;
        default:
            element = document.createElement('div');
            element.textContent = `Неизвестный тип элемента: ${elementData.type}`;
    }
    if (element) {
        if (elementData.styles) Object.assign(element.style, elementData.styles);
        wrapper.appendChild(element);
    }
    return wrapper;
}

function setupModalInteraction() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    if (!modalOverlay || !modalBody || !closeModalBtn) return;
    document.querySelectorAll('.modal-trigger-btn').forEach(button => {
        button.addEventListener('click', () => {
            modalBody.innerHTML = button.dataset.modalContent || '<p>Контент не задан.</p>';
            modalOverlay.classList.add('active');
        });
    });
    const closeModal = () => modalOverlay.classList.remove('active');
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', event => { if (event.target === modalOverlay) closeModal(); });
}