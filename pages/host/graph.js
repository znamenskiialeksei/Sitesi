// ==============================================================================
// КОМАНДНЫЙ ГРАФ ЗАДАЧ И СОБЫТИЙ C&C (HOST GRAPH PANEL)
// Файл: pages/host/graph.js
// Назначение: Интерактивная 2FA визуализация связей Google Tasks, Calendar и CRM
// ==============================================================================

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, RefreshCw, Layers, ShieldCheck, CheckCircle2, Clock, Trash2, Plus, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TwoFaModal from '../../components/Modals/TwoFaModal';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../utils/language';
import { useToast } from '../../components/Toast';

export default function HostGraphPage() {
  const { t } = useLanguage();
  const { currentUser, setTwoFaModalOpen } = useAuth();
  const toast = useToast();

  const [loadingGraph, setLoadingGraph] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [warnings, setWarnings] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');

  const graphContainerRef = useRef(null);
  const forceGraphInstance = useRef(null);

  const fetchGraph = async () => {
    setLoadingGraph(true);
    try {
      const res = await axios.post('/api/booking', { action: 'get_tasks_graph' });
      if (res.data && res.data.success) {
        setGraphData({ nodes: res.data.nodes, edges: res.data.edges });
        if (res.data.warnings) setWarnings(res.data.warnings);
        renderGraph(res.data.nodes, res.data.edges);
      } else {
        toast.error(t('failedLoadGraph'));
      }
    } catch (err) {
      toast.error(t('errorLoadGraph'));
    } finally {
      setLoadingGraph(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isHost) {
      fetchGraph();
    }
    return () => {
      if (forceGraphInstance.current) forceGraphInstance.current._destructor();
    };
  }, [currentUser]);

  // Рендеринг графа через библиотеку force-graph
  const renderGraph = (nodes, links) => {
    import('force-graph').then((ForceGraph) => {
      if (!graphContainerRef.current) return;
      graphContainerRef.current.innerHTML = '';

      const transformedLinks = links.map((l) => ({ source: l.from, target: l.to, type: l.type }));

      const graph = ForceGraph.default()(graphContainerRef.current)
        .graphData({ nodes: [...nodes], links: transformedLinks })
        .nodeId('id')
        .nodeLabel((node) => `${node.label} (${node.group})`)
        .nodeColor((node) => node.color || '#3b82f6')
        .nodeVal((node) => (node.group === 'hub' ? 12 : node.group === 'list' ? 8 : 4))
        .linkColor(() => 'rgba(255, 255, 255, 0.15)')
        .linkWidth(1.5)
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.005)
        .backgroundColor('#090d16')
        .onNodeClick((node) => {
          setSelectedNode(node);
        });

      forceGraphInstance.current = graph;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Head>
        <title>C&C Граф Задач | Villa Turaman</title>
      </Head>

      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col">
        
        {/* Шапка графа */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/host" className="hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHostPanel')}
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Layers className="w-7 h-7 text-purple-400" />
              <span>{t('ccGraphTitle')}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchGraph}
              disabled={loadingGraph}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors flex items-center gap-2 border border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${loadingGraph ? 'animate-spin' : ''}`} />
              <span>{t('refreshGraphBtn')}</span>
            </button>
          </div>
        </div>

        {/* Контейнер интерактивного 3D/2D графа */}
        <div className="flex-1 min-h-[550px] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden relative shadow-2xl">
          <div ref={graphContainerRef} className="w-full h-full min-h-[550px]" />

          {/* Легенда узлов графа */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs space-y-1.5 pointer-events-none">
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('nodeTypesLabel')}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500" /> {t('taskListsNode')}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500" /> {t('completedTasksNode')}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500" /> {t('icalBookingsNode')}</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500" /> {t('tagsClustersNode')}</div>
          </div>

          {/* Карточка выбранного узла */}
          {selectedNode && (
            <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md p-5 rounded-2xl border border-white/10 max-w-sm w-full shadow-2xl fade-in space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  {selectedNode.group}
                </span>
                <button onClick={() => setSelectedNode(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
              {selectedNode.details && (
                <p className="text-xs text-slate-300">{selectedNode.details}</p>
              )}
            </div>
          )}
        </div>

      </main>

      <Footer />
      <TwoFaModal />
    </div>
  );
}

