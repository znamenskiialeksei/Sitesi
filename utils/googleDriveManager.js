// ==============================================================================
// ИЕРАРХИЧЕСКИЙ ФАЙЛОВЫЙ МЕНЕДЖЕР GOOGLE DRIVE
// Файл: utils/googleDriveManager.js
// Назначение: Рекурсивное создание папок, загрузка и структурирование документов
// в корневом каталоге проекта на Google Drive.
// Корневой каталог: 11xBSWA02NypliPFbziRSMfC9aAPclYF_
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

const { google } = require('googleapis');
const stream = require('stream');

const DEFAULT_PROJECT_DRIVE_ROOT = '11xBSWA02NypliPFbziRSMfC9aAPclYF_';

/**
 * Получение авторизованного клиента Google Drive v3
 */
function getDriveClient() {
  const clientEmail = (process.env.GOOGLE_CLIENT_EMAIL || '').trim();
  const rawKey = (process.env.GOOGLE_PRIVATE_KEY || '').trim();

  if (!clientEmail || !rawKey || clientEmail.includes('your-service-account-email')) {
    return null;
  }

  const cleanKey = rawKey
    .replace(/^["']|["']$/g, '')
    .replace(/\\\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  const auth = new google.auth.JWT(
    clientEmail,
    null,
    cleanKey,
    [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file'
    ]
  );

  return google.drive({ version: 'v3', auth });
}

/**
 * Рекурсивное обеспечение пути к папке [создает недостающие подпапки]
 * @param {string} parentFolderId - ID родительской папки [по умолчанию корень проекта]
 * @param {string} pathString - Путь к подпапке [например: Бухгалтерия/2026/Сентябрь/Счета_GIB]
 * @returns {Promise<{ folderId: string, webViewLink: string, path: string }>}
 */
async function ensureDirectoryPath(parentFolderId = DEFAULT_PROJECT_DRIVE_ROOT, pathString = '') {
  const drive = getDriveClient();
  if (!drive) {
    return {
      folderId: parentFolderId,
      webViewLink: `https://drive.google.com/drive/folders/${parentFolderId}`,
      path: pathString,
      isMock: true
    };
  }

  const parts = pathString.split(/[\/\\]+/).map((p) => p.trim()).filter(Boolean);
  let currentParentId = parentFolderId || DEFAULT_PROJECT_DRIVE_ROOT;
  let finalLink = `https://drive.google.com/drive/folders/${currentParentId}`;

  for (const segment of parts) {
    const q = `'${currentParentId}' in parents and name = '${segment}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const res = await drive.files.list({
      q,
      fields: 'files(id, name, webViewLink)',
      spaces: 'drive'
    });

    if (res.data.files && res.data.files.length > 0) {
      currentParentId = res.data.files[0].id;
      finalLink = res.data.files[0].webViewLink || finalLink;
    } else {
      const createRes = await drive.files.create({
        requestBody: {
          name: segment,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [currentParentId]
        },
        fields: 'id, name, webViewLink'
      });
      currentParentId = createRes.data.id;
      finalLink = createRes.data.webViewLink || `https://drive.google.com/drive/folders/${currentParentId}`;
    }
  }

  return {
    folderId: currentParentId,
    webViewLink: finalLink,
    path: pathString
  };
}

/**
 * Загрузка файла в указанную папку Google Drive
 * @param {string} folderId - ID целевой папки
 * @param {string} fileName - Имя файла
 * @param {string} mimeType - MIME-тип
 * @param {Buffer|string} content - Содержимое файла
 * @returns {Promise<{ fileId: string, webViewLink: string, name: string }>}
 */
async function uploadFileToDirectory(folderId = DEFAULT_PROJECT_DRIVE_ROOT, fileName, mimeType = 'text/plain', content) {
  const drive = getDriveClient();
  if (!drive) {
    return {
      fileId: 'mock-file-' + Date.now(),
      webViewLink: `https://drive.google.com/drive/folders/${folderId}`,
      name: fileName,
      isMock: true
    };
  }

  const bufferStream = new stream.PassThrough();
  if (Buffer.isBuffer(content)) {
    bufferStream.end(content);
  } else {
    bufferStream.end(Buffer.from(content || '', 'utf-8'));
  }

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId || DEFAULT_PROJECT_DRIVE_ROOT]
    },
    media: {
      mimeType: mimeType,
      body: bufferStream
    },
    fields: 'id, name, webViewLink, webContentLink'
  });

  return {
    fileId: res.data.id,
    webViewLink: res.data.webViewLink || `https://drive.google.com/file/d/${res.data.id}/view`,
    webContentLink: res.data.webContentLink,
    name: res.data.name
  };
}

/**
 * Создание текстового документа / заметки в папке Google Drive
 */
async function createDocumentInDirectory(folderId = DEFAULT_PROJECT_DRIVE_ROOT, fileName, textContent) {
  return uploadFileToDirectory(folderId, fileName, 'text/plain;charset=utf-8', textContent);
}

/**
 * Листинг содержимого директории
 */
async function listDirectoryContents(folderId = DEFAULT_PROJECT_DRIVE_ROOT) {
  const drive = getDriveClient();
  if (!drive) {
    return { files: [], folders: [], isMock: true };
  }

  const res = await drive.files.list({
    q: `'${folderId || DEFAULT_PROJECT_DRIVE_ROOT}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, webViewLink, size, createdTime)',
    spaces: 'drive',
    pageSize: 50
  });

  const all = res.data.files || [];
  const folders = all.filter((f) => f.mimeType === 'application/vnd.google-apps.folder');
  const files = all.filter((f) => f.mimeType !== 'application/vnd.google-apps.folder');

  return { folders, files };
}

module.exports = {
  DEFAULT_PROJECT_DRIVE_ROOT,
  getDriveClient,
  ensureDirectoryPath,
  uploadFileToDirectory,
  createDocumentInDirectory,
  listDirectoryContents
};
