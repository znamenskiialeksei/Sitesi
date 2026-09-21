// ==============================================================================
// УПРАВЛЕНИЕ ФАЙЛАМИ И ПАПКАМИ GOOGLE DRIVE ПРОЕКТА
// Файл: pages/api/ai/drive-files.js
// Назначение: Обеспечивает рекурсивное создание папок, загрузку документов
// и листинг архива проекта в корневой папке 11xBSWA02NypliPFbziRSMfC9aAPclYF_.
// 100% Zero-Brackets & Zero-Emdash Стандарт.
// ==============================================================================

import {
  DEFAULT_PROJECT_DRIVE_ROOT,
  ensureDirectoryPath,
  uploadFileToDirectory,
  createDocumentInDirectory,
  listDirectoryContents
} from '../../../utils/googleDriveManager';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const folderId = req.query.folderId || DEFAULT_PROJECT_DRIVE_ROOT;
      const contents = await listDirectoryContents(folderId);
      return res.status(200).json({
        success: true,
        folderId,
        rootFolderId: DEFAULT_PROJECT_DRIVE_ROOT,
        ...contents
      });
    }

    if (req.method === 'POST') {
      const { action = 'ensure_path', pathString = '', fileName = '', content = '', folderId } = req.body;

      if (action === 'ensure_path') {
        const result = await ensureDirectoryPath(DEFAULT_PROJECT_DRIVE_ROOT, pathString);
        return res.status(200).json({
          success: true,
          action: 'ensure_path',
          ...result
        });
      }

      if (action === 'create_doc') {
        let targetFolderId = folderId || DEFAULT_PROJECT_DRIVE_ROOT;
        if (pathString) {
          const dirRes = await ensureDirectoryPath(DEFAULT_PROJECT_DRIVE_ROOT, pathString);
          targetFolderId = dirRes.folderId;
        }

        const docName = fileName || `Заметка_${Date.now()}.txt`;
        const uploadRes = await createDocumentInDirectory(targetFolderId, docName, content || '');
        return res.status(200).json({
          success: true,
          action: 'create_doc',
          folderId: targetFolderId,
          ...uploadRes
        });
      }

      return res.status(400).json({ success: false, error: 'Неизвестное действие' });
    }

    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (err) {
    console.error('[pages/api/ai/drive-files Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
