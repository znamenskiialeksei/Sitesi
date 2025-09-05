document.addEventListener('DOMContentLoaded', () => {
    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ ---
    let githubToken = null;
    let currentConfig = null;
    let selectedElementId = null;
    const DOM = {
        loginView: document.getElementById('login-view'),
        adminView: document.getElementById('admin-view'),
        tokenInput: document.getElementById('github-token-input'),
        loginBtn: document.getElementById('login-btn'),
        saveBtn: document.getElementById('save-btn'),
        canvas: document.getElementById('admin-canvas'),
        panels: { inspector: document.getElementById('inspector-panel'), global: document.getElementById('global-settings-panel'), layout: document.getElementById('layout-settings-panel'), },
        panelBodies: { inspector: document.getElementById('inspector-body'), global: document.getElementById('global-settings-body'), layout: document.getElementById('layout-settings-body'), }
    };

    // --- ИНИЦИАЛИЗАЦИЯ И АУТЕНТИФИКАЦИЯ ---
    const savedToken = localStorage.getItem('githubToken');
    if (savedToken) {
        githubToken = savedToken;
        DOM.loginView.style.display = 'none';
        DOM.adminView.style.display = 'flex';
        loadAdminPanel();
    }
    if (DOM.loginBtn) {
        DOM.loginBtn.addEventListener('click', () => {
            const token = DOM.tokenInput.value.trim();
            if (token) {
                githubToken = token;
                localStorage.setItem('githubToken', token);
                DOM.loginView.style.display = 'none';
                DOM.adminView.style.display = 'flex';
                loadAdminPanel();
            } else {
                alert('Пожалуйста, введите токен доступа.');
            }
        });
    }
    DOM.saveBtn.addEventListener('click', saveConfiguration);

    // --- ЗАГРУЗКА И ОСНОВНОЙ РЕНДЕРИНГ ---
    async function loadAdminPanel() {
        const cacheBust = `?v=${new Date().getTime()}`;
        try {
            const response = await fetch(`config.json${cacheBust}`);
            if (!response.ok) throw new Error(`Ошибка сети (статус: ${response.status})`);
            currentConfig = await response.json();
            renderAll();
            initInteractivity();
        } catch (error) { alert(`Критическая ошибка загрузки: ${error.message}`); }
    }
    
    function renderAll() {
        renderCanvas();
        renderFloatingPanels();
    }

    function renderCanvas() {
        DOM.canvas.innerHTML = '';
        const canvasHeader = createSectionElement(currentConfig.layout.header, 'header');
        const canvasMain = document.createElement('main');
        canvasMain.id = 'element-container';
        const canvasFooter = createSectionElement(currentConfig.layout.footer, 'footer');

        const mainLayout = currentConfig.layout.main || {};
        if (mainLayout.background) { if (mainLayout.background.type === 'color') DOM.canvas.style.backgroundColor = mainLayout.background.value; } 
        else { DOM.canvas.style.backgroundColor = '#ffffff'; }

        currentConfig.layout.main.columns.forEach(column => {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'layout-column sortable-column';
            columnDiv.style.flexBasis = column.width;
            columnDiv.dataset.columnId = column.id;
            column.elements.forEach(elementId => {
                const elementData = currentConfig.elements.find(el => el.id === elementId);
                if (elementData) columnDiv.appendChild(createAdminElement(elementData));
            });
            canvasMain.appendChild(columnDiv);
        });
        
        DOM.canvas.append(canvasHeader, canvasMain, canvasFooter);
        initDragAndDrop();
    }
    
    function createSectionElement(sectionConfig, tagName) {
        const element = document.createElement(tagName);
        element.id = `canvas-${tagName}`;
        if (sectionConfig) {
            element.innerHTML = sectionConfig.content || '';
            if (sectionConfig.styles) Object.assign(element.style, sectionConfig.styles);
            if (sectionConfig.background) {
                if (sectionConfig.background.type === 'color') { element.style.backgroundColor = sectionConfig.background.value; element.style.backgroundImage = 'none'; } 
                else if (sectionConfig.background.type === 'image') { element.style.backgroundImage = `url('${sectionConfig.background.value}')`; element.style.backgroundSize = 'cover'; element.style.backgroundPosition = 'center'; }
            }
        }
        return element;
    }

    function createAdminElement(elementData) {
        const wrapper = document.createElement('div');
        wrapper.className = 'admin-element-wrapper';
        wrapper.dataset.elementId = elementData.id;
        if (elementData.styles) Object.assign(wrapper.style, elementData.styles);
        
        const overlay = document.createElement('div');
        overlay.className = 'admin-element-overlay';
        wrapper.appendChild(overlay);
        wrapper.appendChild(createElement(elementData));
        
        wrapper.addEventListener('click', e => { e.stopPropagation(); selectElement(elementData.id); });
        return wrapper;
    }

    // --- ПАНЕЛИ НАСТРОЕК ---
    function renderFloatingPanels() {
        renderGlobalSettingsPanel();
        setupLayoutSettingsPanel();
    }
    
    function renderGlobalSettingsPanel() {
        const body = DOM.panelBodies.global;
        body.innerHTML = `<div class="inspector-group"><h4>Основные</h4><div class="inspector-field"><label>Заголовок сайта (Title)</label><input type="text" data-config-path="globalSettings.pageTitle" value="${currentConfig.globalSettings.pageTitle || ''}"></div></div>`;
        body.querySelector('input').addEventListener('input', (e) => {
            currentConfig.globalSettings.pageTitle = e.target.value;
        });
    }

    function setupLayoutSettingsPanel() {
        const selector = document.getElementById('layout-section-selector');
        const editorsContainer = document.getElementById('layout-section-editors');

        const renderEditor = (key) => {
            const config = currentConfig.layout[key];
            let editorHtml = '';
            if (key === 'main') {
                editorHtml = `<div class="inspector-group">${createSectionEditorHTML(key, config)}<h5>Колонки</h5><div id="columns-editor">${currentConfig.layout.main.columns.map(col => createColumnEditorHTML(col)).join('')}</div><button id="add-column-btn" class="add-element-btn" style="width:100%; margin-top:10px;">+ Добавить колонку</button></div>`;
            } else {
                editorHtml = `<div class="inspector-group">${createSectionEditorHTML(key, config)}</div>`;
            }
            editorsContainer.innerHTML = editorHtml;
            editorsContainer.querySelectorAll('input, select, textarea').forEach(el => el.addEventListener('input', updateConfigAndRenderCanvas));
            editorsContainer.querySelectorAll('.delete-column-btn').forEach(btn => btn.addEventListener('click', deleteColumn));
            editorsContainer.querySelector('#add-column-btn')?.addEventListener('click', addColumn);
        };
        selector.addEventListener('change', (e) => renderEditor(e.target.value));
        renderEditor(selector.value);
    }
    
    function updateConfigAndRenderCanvas(event) {
        const el = event.target;
        const path = el.dataset.configPath;
        if (!path) {
            const columnEditor = el.closest('.column-editor');
            if (columnEditor) {
                const columnId = columnEditor.dataset.columnId;
                const property = el.dataset.path;
                const colIndex = currentConfig.layout.main.columns.findIndex(c => c.id === columnId);
                if (colIndex > -1) currentConfig.layout.main.columns[colIndex][property] = el.value;
            }
        } else {
            let keys = path.split('.');
            let last = keys.pop();
            let obj = keys.reduce((o, k) => o[k] = o[k] || {}, currentConfig);
            obj[last] = el.value;
        }
        renderCanvas();
    }
    
    function addColumn() {
        currentConfig.layout.main.columns.push({ id: `col-${Date.now()}`, width: '1fr', elements: [] });
        renderAll();
    }

    function deleteColumn(event) {
        const columnId = event.target.closest('.column-editor').dataset.columnId;
        currentConfig.layout.main.columns = currentConfig.layout.main.columns.filter(c => c.id !== columnId);
        renderAll();
    }

    function updateElementFromInspector(event) {
        if (!selectedElementId) return;
        const elementData = currentConfig.elements.find(el => el.id === selectedElementId);
        const input = event.target;
        const value = input.value;
        if (input.dataset.key) { elementData[input.dataset.key] = value; } 
        else if (input.dataset.contentKey) { elementData.content[input.dataset.contentKey] = value; } 
        else if (input.dataset.styleKey) {
            if (!elementData.styles) elementData.styles = {};
            elementData.styles[input.dataset.styleKey] = value;
        }
        const oldWrapper = DOM.canvas.querySelector(`.admin-element-wrapper[data-element-id="${selectedElementId}"]`);
        if (oldWrapper) {
            const newWrapper = createAdminElement(elementData);
            oldWrapper.replaceWith(newWrapper);
            newWrapper.classList.add('selected');
            makeElementsResizable();
        }
    }

    // FIX: Полностью исправленная функция удаления
    function deleteSelectedElement() {
        if (!selectedElementId || !confirm("Вы уверены, что хотите удалить этот элемент?")) return;

        // Шаг 1: Удаляем из основного списка элементов
        currentConfig.elements = currentConfig.elements.filter(el => el.id !== selectedElementId);

        // Шаг 2: Удаляем ССЫЛКУ на элемент из всех колонок
        currentConfig.layout.main.columns.forEach(column => {
            column.elements = column.elements.filter(id => id !== selectedElementId);
        });

        // Шаг 3: Скрываем инспектор и сбрасываем выбор
        DOM.panels.inspector.style.display = 'none';
        selectedElementId = null;

        // Шаг 4: Перерисовываем холст, чтобы элемент исчез
        renderCanvas();
    }
    
    // --- ИНТЕРАКТИВНОСТЬ (DRAG-N-DROP, ПАНЕЛИ, RESIZE) ---
    function initInteractivity() {
        setupToolbarActions();
        makePanelsInteractive();
        makeElementsResizable();
    }

    function makeElementsResizable() {
        interact('.admin-element-wrapper').resizable({
            edges: { left: false, right: true, bottom: true, top: false },
            listeners: {
                move(event) {
                    const target = event.target;
                    target.style.width = `${event.rect.width}px`;
                    target.style.height = `${event.rect.height}px`;
                },
                end(event) {
                    const elementId = event.target.dataset.elementId;
                    const elementData = currentConfig.elements.find(el => el.id === elementId);
                    if (elementData) {
                        if (!elementData.styles) elementData.styles = {};
                        elementData.styles.width = event.target.style.width;
                        elementData.styles.height = event.target.style.height;
                        renderInspector(elementId);
                    }
                }
            },
            modifiers: [ interact.modifiers.restrictSize({ min: { width: 50, height: 50 } }) ],
        });
    }

    function createElement(elementData) {
        const wrapper = document.createElement("div");
        wrapper.className = `element-wrapper type-${elementData.type}`;
        let element;
        switch (elementData.type) {
            case 'externalBlock': case 'videoBlock':
                element = document.createElement('iframe');
                element.dataset.src = elementData.content.url; 
                setTimeout(() => { if (element && element.dataset.src) element.src = element.dataset.src; }, 100);
                element.setAttribute('frameborder', '0');
                break;
            case 'textBlock': element = document.createElement('div'); element.innerHTML = elementData.content.html; break;
            case 'photo': element = document.createElement('img'); element.src = elementData.content.url; element.alt = elementData.adminTitle || "Изображение"; break;
            case 'button': element = document.createElement('button'); element.textContent = elementData.content.text; element.style.pointerEvents = 'none'; break;
            default: element = document.createElement('div'); element.textContent = `Неизвестный тип`;
        }
        if (element) wrapper.appendChild(element);
        return wrapper;
    }
    
    // --- ОСТАЛЬНЫЕ ФУНКЦИИ ---
    function createSectionEditorHTML(key,config){return`${key!=="main"?`<div class="inspector-field"><label>HTML-контент</label><textarea data-config-path="layout.${key}.content">${config.content||""}</textarea></div>`:""}<div class="inspector-field"><label>Тип фона</label><select data-config-path="layout.${key}.background.type"><option value="color" ${config.background?.type==="color"?"selected":""}>Цвет</option><option value="image" ${config.background?.type==="image"?"selected":""}>Изображение</option></select></div><div class="inspector-field"><label>Значение (цвет или URL)</label><input type="text" data-config-path="layout.${key}.background.value" value="${config.background?.value||""}"></div>`}
    function createColumnEditorHTML(column){return`<div class="column-editor" data-column-id="${column.id}"><input type="text" data-path="width" value="${column.width}"><button class="delete-column-btn">❌</button></div>`}
    function generateContentFields(element){switch(element.type){case"externalBlock":case"photo":case"videoBlock":return`<div class="inspector-field"><label>URL</label><input type="text" data-content-key="url" value="${element.content.url||""}"></div>`;case"textBlock":return`<div class="inspector-field"><label>HTML</label><textarea data-content-key="html">${element.content.html||""}</textarea></div>`;case"button":return`<div class="inspector-field"><label>Текст</label><input type="text" data-content-key="text" value="${element.content.text||""}"></div><div class="inspector-field"><label>Действие</label><select data-content-key="action"><option value="openLink" ${element.content.action==="openLink"?"selected":""}>Ссылка</option><option value="openModal" ${element.content.action==="openModal"?"selected":""}>Модальное окно</option></select></div><div class="inspector-field"><label>URL</label><input type="text" data-content-key="url" value="${element.content.url||""}"></div><div class="inspector-field"><label>HTML модального окна</label><textarea data-content-key="modalContent">${element.content.modalContent||""}</textarea></div>`;default:return"<p>Нет настроек.</p>"}}
    function generateStyleFields(styles){return`<div class="inspector-field"><label>Ширина</label><input type="text" data-style-key="width" value="${styles.width||""}" placeholder="(н-р, 100% или 300px)"></div><div class="inspector-field"><label>Высота</label><input type="text" data-style-key="height" value="${styles.height||""}" placeholder="(н-р, 650px или auto)"></div><div class="inspector-field"><label>Цвет фона</label><input type="color" data-style-key="backgroundColor" value="${styles.backgroundColor||"#ffffff"}"></div><div class="inspector-field"><label>Цвет текста</label><input type="color" data-style-key="color" value="${styles.color||"#000000"}"></div><div class="inspector-field"><label>Отступы</label><input type="text" data-style-key="padding" value="${styles.padding||""}"></div><div class="inspector-field"><label>Скругление</label><input type="text" data-style-key="borderRadius" value="${styles.borderRadius||""}"></div><div class="inspector-field"><label>Тень</label><input type="text" data-style-key="boxShadow" value="${styles.boxShadow||""}"></div>`}
    function setupToolbarActions(){document.querySelectorAll(".add-element-btn").forEach(btn=>{if(btn.id!=="add-column-btn")btn.onclick=()=>addNewElement(btn.dataset.type)});document.querySelectorAll(".preview-btn").forEach(btn=>{btn.onclick=()=>{if(btn.dataset.mode==="desktop")DOM.canvas.style.width="100%";if(btn.dataset.mode==="tablet")DOM.canvas.style.width="768px";if(btn.dataset.mode==="mobile")DOM.canvas.style.width="375px"}});document.querySelectorAll(".panel-toggle-btn").forEach(btn=>{btn.onclick=()=>{const panelId=btn.dataset.panel;const panel=document.getElementById(panelId);panel.style.display=panel.style.display==="none"?"block":"none"}})}
    function initDragAndDrop(){const columns=document.querySelectorAll(".sortable-column");columns.forEach(col=>{new Sortable(col,{group:"shared-elements",animation:150,ghostClass:"sortable-ghost",onEnd:updateStructureFromDOM})})}
    function makePanelsInteractive(){interact(".floating-panel").draggable({allowFrom:".panel-header",inertia:true,modifiers:[interact.modifiers.restrictRect({restriction:"parent",endOnly:true})],listeners:{move(event){const target=event.target;const