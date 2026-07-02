import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; 
import axios from 'axios';
import Link from 'next/link';
import { X, Plus, Trash2, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export default function AdminGraphPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [authError, setAuthError] = useState('');
  
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [graphError, setGraphError] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [hoverNode, setHoverNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const graphContainerRef = useRef(null);
  const forceGraphInstance = useRef(null);

  const twoFaSecret = process.env.NEXT_PUBLIC_ADMIN_2FA_SECRET;

  useEffect(() => {
    const session = sessionStorage.getItem('owner_session');
    if (session) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (twoFaSecret && !isAuthenticated) {
      import('qrcode').then((QRCode) => {
        const otpauthUrl = `otpauth://totp/VasilisaAcademy:Owner?secret=${twoFaSecret}&issuer=VasilisaAcademy`;
        QRCode.toDataURL(otpauthUrl, (err, url) => {
          if (!err) setQrCodeUrl(url);
        });
      });
    }
  }, [twoFaSecret, isAuthenticated]);

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await axios.post('/api/admin/verify-2fa', { token: inputToken });
      if (res.data.success) {
        sessionStorage.setItem('owner_session', res.data.sessionToken);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Ошибка проверки');
    }
  };

  const fetchGraph = async () => {
    setLoadingGraph(true);
    setGraphError('');
    setWarnings([]);
    try {
      const res = await axios.post('/api/booking', { action: 'get_tasks_graph' });
      if (res.data.success) {
        renderGraph(res.data.nodes, res.data.edges);
        if (res.data.warnings && res.data.warnings.length > 0) {
          setWarnings(res.data.warnings);
        }
      } else {
        setGraphError(res.data.error || 'Неизвестная ошибка при загрузке графа');
      }
    } catch (e) { setGraphError(e.response?.data?.error || e.message || 'Сетевая ошибка'); }
    setLoadingGraph(false);
  };

  useEffect(() => {
    if (isAuthenticated) fetchGraph();
  }, [isAuthenticated]);

  const renderGraph = (nodes, links) => {
    import('force-graph').then((ForceGraph) => {
      if (!graphContainerRef.current) return;
      graphContainerRef.current.innerHTML = '';
      const transformedLinks = links.map(l => ({ source: l.from, target: l.to, type: l.type }));

      const handleNodeHover = (node) => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
              highlightNodes.add(node);
              forceGraphInstance.current.graphData().links.forEach(link => {
                  if (link.source.id === node.id || link.target.id === node.id) {
                      highlightLinks.add(link);
                      highlightNodes.add(link.source);
                      highlightNodes.add(link.target);
                  }
              });
          }
          setHoverNode(node);
          setHighlightNodes(new Set(highlightNodes));
          setHighlightLinks(new Set(highlightLinks));
      };
      
      forceGraphInstance.current = ForceGraph.default()(graphContainerRef.current)
        .graphData({ nodes, links: transformedLinks })
        .nodeId('id')
        .nodeVal(node => node.group === 'hub' ? 12 : node.group === 'list' ? 8 : node.group === 'cluster' ? 5 : 3)
        .nodeColor(node => {
            if (hoverNode && !highlightNodes.has(node)) return 'rgba(100, 116, 139, 0.3)';
            return node.color;
        })
        .nodeLabel(node => {
            const details = [];
            details.push(`[${node.group.toUpperCase()}] ${node.label}`);
            if (node.status) {
                details.push(`Статус: ${node.status === 'completed' ? 'Завершено' : 'В работе'}`);
            }
            if (node.details) {
                details.push(`\n---\n${node.details}`);
            }
            if (node.note) {
                details.push(`Заметка: ${node.note}`);
            }
            return details.join('\n');
        })
        .linkLabel(link => link.type)
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.006)
        .linkWidth(link => highlightLinks.has(link) ? 2 : 1)
        .linkColor(link => highlightLinks.has(link) ? '#facc15' : 'rgba(71, 85, 105, 0.2)')
        .backgroundColor('#0f172a')
        .onNodeHover(handleNodeHover)
        .onNodeClick(node => {
           setSelectedNode(node);
           setIsPanelOpen(true);
           setNewTaskTitle('');
           setNewTaskNotes('');
        })
        .width(graphContainerRef.current.clientWidth)
        .height(window.innerHeight - 250);
    });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedNode || selectedNode.group !== 'list') return;
    setIsActionLoading(true);
    try {
      await axios.post('/api/booking', { action: 'create_task', listId: selectedNode.id, title: newTaskTitle, notes: newTaskNotes });
      setNewTaskTitle(''); setNewTaskNotes('');
      await fetchGraph();
      setIsPanelOpen(false);
    } catch (err) { alert("Ошибка создания задачи"); }
    setIsActionLoading(false);
  };

  const handleToggleTask = async (node) => {
    setIsActionLoading(true);
    try {
      const newStatus = node.status === 'completed' ? 'needsAction' : 'completed';
      await axios.post('/api/booking', { action: 'update_task_status', listId: node.listId, taskId: node.id, status: newStatus });
      await fetchGraph();
      setIsPanelOpen(false);
    } catch (err) { alert("Ошибка обновления задачи"); }
    setIsActionLoading(false);
  };

  const handleDeleteTask = async (node) => {
    if (!confirm("Точно удалить задачу безвозвратно?")) return;
    setIsActionLoading(true);
    try {
      await axios.post('/api/booking', { action: 'delete_task', listId: node.listId, taskId: node.id });
      await fetchGraph();
      setIsPanelOpen(false);
    } catch (err) { alert("Ошибка удаления задачи"); }
    setIsActionLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-sans p-6 text-white">
        <Head><title>🔒 Защищенный доступ | Владелец</title></Head>
        <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-[2rem] p-8 text-center shadow-2xl">
          <Link href="/" className="text-blue-400 text-sm mb-4 block hover:underline">← Назад на сайт</Link>
          <h1 className="text-2xl font-bold tracking-wide mb-2">АВТОРИЗАЦИЯ ВЛАДЕЛЬЦА</h1>
          <p className="text-xs text-slate-400 mb-6">Требуется двухфакторная аутентификация</p>
          {!twoFaSecret ? (
             <div className="bg-red-900/50 text-red-300 p-4 rounded-xl text-xs mb-4 border border-red-500/30">
                Ключ NEXT_PUBLIC_ADMIN_2FA_SECRET не найден в .env
             </div>
          ) : (
            qrCodeUrl && (
              <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                <p className="text-[10px] text-slate-800 font-mono mt-1 select-all">Secret: {twoFaSecret}</p>
              </div>
            )
          )}
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <input type="text" maxLength={6} value={inputToken} onChange={(e) => setInputToken(e.target.value)} placeholder="000000" className="w-full bg-slate-950 text-center text-xl tracking-widest font-mono p-3 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-white" required disabled={!twoFaSecret} />
            </div>
            {authError && <p className="text-red-500 text-xs font-semibold">{authError}</p>}
            <button type="submit" disabled={!twoFaSecret} className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-xs font-bold tracking-wider transition-all shadow-lg disabled:opacity-50">ВЕРИФИЦИРОВАТЬ И ВОЙТИ</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans p-8">
      <Head><title>📊 Управление Графом Задач и Календарём</title></Head>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap justify-between items-center bg-slate-900 border border-white/10 p-6 rounded-2xl shadow-xl gap-4">
          <div><h1 className="text-2xl font-bold text-white">Псевдо-граф управления задачами</h1></div>
          <div className="flex items-center gap-4">
            <button onClick={fetchGraph} disabled={loadingGraph} className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:animate-spin"><RefreshCw size={16}/></button>
            <Link href="/" className="bg-slate-800 hover:bg-slate-700 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">← НАЗАД К CRM</Link>
            <button onClick={() => { sessionStorage.clear(); setIsAuthenticated(false); }} className="bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all">ВЫЙТИ</button>
          </div>
        </div> 
        <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden relative shadow-xl">
          <div className="p-4 border-b border-white/5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-500 rounded-full"></span>Списки задач</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500 rounded-full"></span>Активные задачи</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span>Завершенные задачи</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-500 rounded-full"></span>Теги</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded-full"></span>Правила (CRM)</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded-full"></span>Google Calendar</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span>iCal Брони</span>
          </div>

          {loadingGraph && (<div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50"><span className="text-blue-400 animate-pulse">СИНХРОНИЗАЦИЯ С GOOGLE API...</span></div>)}

          <div ref={graphContainerRef} className="w-full bg-slate-950 min-h-[calc(100vh-250px)]"></div>

          {/* Интерактивная Панель Управления Графом (C&C) */}
          {isPanelOpen && selectedNode && (
             <div className="absolute top-20 right-6 w-80 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-6 z-[100] text-sm text-slate-300">
                <button onClick={() => setIsPanelOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={16}/></button>
                <h3 className="font-bold text-white mb-2 text-base pr-4">{selectedNode.label}</h3>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-4 border-b border-slate-800 pb-2">ТИП УЗЛА: {selectedNode.group}</span>

                {selectedNode.group === 'task' && (
                   <div className="flex flex-col gap-3 mt-4">
                      <button disabled={isActionLoading} onClick={() => handleToggleTask(selectedNode)} className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50">
                         {selectedNode.status === 'completed' ? <Clock size={16}/> : <CheckCircle size={16}/>}
                         {selectedNode.status === 'completed' ? 'Вернуть в работу' : 'Завершить задачу'}
                      </button>
                      <button disabled={isActionLoading} onClick={() => handleDeleteTask(selectedNode)} className="bg-red-900/40 hover:bg-red-800 text-red-400 border border-red-500/20 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                         <Trash2 size={16}/> Удалить безвозвратно
                      </button>
                   </div>
                )}

                {selectedNode.group === 'list' && (
                   <form onSubmit={handleCreateTask} className="mt-4 flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Добавить новую задачу</h4>
                      <input value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} placeholder="Короткое название" required className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-all"/>
                      <textarea value={newTaskNotes} onChange={e=>setNewTaskNotes(e.target.value)} placeholder="Детали, #хэштеги или СВЯЗЬ: [название]" className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-blue-500 resize-none h-24 transition-all"/>
                      <button type="submit" disabled={isActionLoading} className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"><Plus size={16}/> Создать узел</button>
                   </form>
                )}

                {(selectedNode.group === 'calendar' || selectedNode.group === 'gcal_event' || selectedNode.group === 'ical_event') && (
                   <div className="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 max-h-60 overflow-y-auto">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Детали:</span>
                      <p className="text-white font-bold break-words">{selectedNode.details}</p>
                      {selectedNode.note && (
                        <>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest block mt-2">Заметка:</span>
                          <p className="text-slate-300 italic text-xs break-words">{selectedNode.note}</p>
                        </>
                      )}
                   </div>
                )}
             </div>
          )}
        </div>

        {(warnings.length > 0 || graphError) && (
          <div className="mt-6 p-4 rounded-2xl border bg-slate-900/50 border-white/10">
            {graphError && (
              <div className="p-4 bg-red-900/50 border border-red-500/30 rounded-xl text-red-300 text-sm">
                <h4 className="font-bold mb-2">Критическая ошибка:</h4>
                <p>{graphError}</p>
              </div>
            )}
            {warnings.length > 0 && (
              <div className={`p-4 bg-yellow-900/50 border border-yellow-500/30 rounded-xl text-yellow-300 text-sm ${graphError ? 'mt-4' : ''}`}>
                <h4 className="font-bold mb-2">Предупреждения конфигурации:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
