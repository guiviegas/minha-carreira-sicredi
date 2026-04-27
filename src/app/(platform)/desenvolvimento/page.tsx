'use client';

import { useState } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { getEmployeeById } from '@/data/employees';
import { getAvailableTracks, getTracksForRole } from '@/data/development-tracks';
import { getRoleById } from '@/data/roles';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Clock, Star, Filter, ArrowRight, CheckCircle2, Sparkles, Target, Handshake, BarChart3, Lightbulb, Building2, MapIcon, Coins, Brain, TrendingUp, Video, MonitorPlay, FileText, Users, Crosshair } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

type TrackMode = 'netflix' | 'hybrid';

// Gradient mapping per category
const categoryGradients: Record<string, string> = {
  lideranca: 'linear-gradient(135deg, #146E37 0%, #2E7D32 40%, #66BB6A 100%)',
  financeira: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 40%, #42A5F5 100%)',
  estrategica: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 40%, #AB47BC 100%)',
  comercial: 'linear-gradient(135deg, #E65100 0%, #EF6C00 40%, #FF9800 100%)',
  cooperativismo: 'linear-gradient(135deg, #004D40 0%, #00695C 40%, #26A69A 100%)',
  soft: 'linear-gradient(135deg, #880E4F 0%, #AD1457 40%, #EC407A 100%)',
};

// Course images mapping
const courseImages: Record<string, string> = {
  c1: '/courses/cooperativismo.png',
  c2: '/courses/escuta-ativa.png',
  c3: '/courses/financeira.png',
  c4: '/courses/lideranca.png',
  c5: '/courses/governanca.png',
  c6: '/courses/okrs.png',
  c7: '/courses/carteira.png',
  c8: '/courses/adaptabilidade.png',
  c9: '/courses/inovacao.png',
};

const courses = [
  { id: 'c1', title: 'Essência Cooperativista na Prática', desc: 'Como viver os valores cooperativos no dia a dia e fortalecer vínculos com associados', type: 'video' as const, duration: '4h', provider: 'Sicredi Aprende', skills: ['Essência Cooperativista'], progress: 30, rating: 4.8, category: 'cooperativismo', icon: Building2 },
  { id: 'c2', title: 'Entender para Atender: Escuta Ativa', desc: 'Técnicas de escuta empática e mediação de conflitos com associados', type: 'interactive' as const, duration: '2h', provider: 'Sicredi Aprende', skills: ['Entender para Atender', 'Comunicação'], progress: 0, rating: 4.6, category: 'soft', icon: Handshake },
  { id: 'c3', title: 'Análise Financeira para GNs', desc: 'Leitura de balanços, DRE e indicadores, base para decisões de crédito', type: 'video' as const, duration: '6h', provider: 'Sicredi Aprende', skills: ['Análise Financeira'], progress: 0, rating: 4.5, category: 'financeira', icon: BarChart3 },
  { id: 'c4', title: 'Liderança e Feedback SCII', desc: 'Metodologia SCII (Situação, Comportamento, Intenção, Impacto) e conversas de PDI', type: 'mentoring' as const, duration: '8h', provider: 'Programa S2S', skills: ['Liderança', 'Feedback Contínuo'], progress: 0, rating: 4.9, category: 'lideranca', icon: Target },
  { id: 'c5', title: 'Governança Cooperativa', desc: 'Assembleia, conselho, comitês e o papel do associado na governança', type: 'article' as const, duration: '1.5h', provider: 'Sicredi Aprende', skills: ['Essência Cooperativista'], progress: 100, rating: 4.3, category: 'cooperativismo', icon: Building2 },
  { id: 'c6', title: 'OKRs e Planejamento Estratégico', desc: 'Como definir e cascatear objetivos alinhados à estratégia da cooperativa', type: 'interactive' as const, duration: '3h', provider: 'Sicredi Aprende', skills: ['Vai lá e faz', 'Estratégia'], progress: 0, rating: 4.7, category: 'estrategica', icon: Lightbulb },
  { id: 'c7', title: 'Gestão de Carteira Premium', desc: 'Estratégias de cross-selling e retenção para associados alta renda', type: 'video' as const, duration: '3h', provider: 'Sicredi Aprende', skills: ['Comercial', 'Relacionamento'], progress: 100, rating: 4.4, category: 'comercial', icon: Coins },
  { id: 'c8', title: 'Aprender e Mudar Rápido', desc: 'Mindset de crescimento, adaptabilidade e gestão de mudança organizacional', type: 'practice' as const, duration: '2h', provider: 'Programa Bem-Estar', skills: ['Aprender e Mudar Rápido'], progress: 65, rating: 4.8, category: 'soft', icon: Brain },
  { id: 'c9', title: 'Inovar para Transformar: Design Thinking', desc: 'Ferramentas de inovação aplicadas ao contexto cooperativo', type: 'video' as const, duration: '2h', provider: 'Sicredi Aprende', skills: ['Inovar para Transformar'], progress: 0, rating: 4.5, category: 'estrategica', icon: TrendingUp },
];

export default function DesenvolvimentoPage() {
  const { currentPersona } = usePersona();
  const [mode, setMode] = useState<TrackMode>('netflix');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  if (!currentPersona) return null;

  const categories = ['todos', 'lideranca', 'financeira', 'estrategica', 'comercial', 'cooperativismo', 'soft'];
  const categoryLabels: Record<string, string> = {
    todos: 'Todos',
    lideranca: 'Liderança',
    financeira: 'Financeira',
    estrategica: 'Estratégica',
    comercial: 'Comercial',
    cooperativismo: 'Cooperativismo',
    soft: 'Soft Skills',
  };

  const filteredCourses = categoryFilter === 'todos' ? courses : courses.filter(c => c.category === categoryFilter);
  const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100);
  const completed = courses.filter(c => c.progress === 100);
  const recommended = courses.filter(c => c.progress === 0).slice(0, 4);

  // Get structured tracks for persona
  const employee = getEmployeeById(currentPersona.employeeId);
  const availableTracks = employee ? getAvailableTracks(employee.roleId) : [];
  const allRelevantTracks = employee ? getTracksForRole(employee.roleId) : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-5xl space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trilhas de Desenvolvimento</h1>
          <p className="text-sm text-gray-500 mt-1">Seu plano personalizado de crescimento, no seu ritmo</p>
        </div>
        <div className="flex gap-2">
          {(['netflix', 'hybrid'] as TrackMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === m ? 'bg-verde-digital text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {m === 'netflix' ? 'Explorar' : 'Estruturada'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress Summary */}
      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-verde-digital metric-value">{inProgress.length}</p>
          <p className="text-xs text-gray-500 mt-1">Em andamento</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 metric-value">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-1">Concluídos</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-purple-600 metric-value">
            {courses.reduce((acc, c) => acc + (c.progress === 100 ? parseFloat(c.duration) : 0), 0)}h
          </p>
          <p className="text-xs text-gray-500 mt-1">Horas investidas</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'netflix' ? (
          <motion.div key="netflix" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            {/* Continue Watching */}
            {inProgress.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-verde-digital" /> Continue de onde parou
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inProgress.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended */}
            <div>
              <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> Recomendado para você
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommended.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Category Filter + All */}
            <div>
              <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? 'bg-verde-digital text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="hybrid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {allRelevantTracks.length === 0 ? (
              <div className="card p-8 text-center">
                <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhuma trilha estruturada disponível para seu cargo atual.</p>
              </div>
            ) : (
              allRelevantTracks.map((track) => {
                const fromRole = getRoleById(track.fromRoleId);
                const toRole = getRoleById(track.toRoleId);
                const isActive = employee && track.fromRoleId === employee.roleId;
                return (
                  <div key={track.id} className={`card p-5 ${isActive ? 'border-l-4 border-verde-digital' : ''}`}>
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h2 className="text-sm font-bold text-gray-800">{track.title}</h2>
                          {track.certification && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                              track.certificationRequired ? 'bg-purple-100 text-purple-700' : 'bg-blue-50 text-blue-600'
                            }`}>
                              {track.certification} {track.certificationRequired ? '(obrigatória)' : '(diferencial)'}
                            </span>
                          )}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            track.type === 'vertical' ? 'bg-verde-50 text-verde-digital' : track.type === 'lateral' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {track.type === 'vertical' ? 'Progressão' : track.type === 'lateral' ? 'Lateral' : 'Liderança'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{track.subtitle}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {fromRole?.shortTitle} → {toRole?.shortTitle} · {track.totalDuration}
                        </p>
                      </div>
                      <span className={`text-lg font-extrabold metric-value ${track.progress > 0 ? 'text-verde-digital' : 'text-gray-300'}`}>
                        {track.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3 mt-2">
                      <div className="h-full rounded-full bg-verde-digital transition-all" style={{ width: `${track.progress}%` }} />
                    </div>
                    <div className="space-y-2">
                      {track.phases.map((phase, i) => (
                        <div key={phase.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs font-semibold text-gray-700">Fase {i + 1}: {phase.name}</p>
                            <span className={`text-[10px] font-semibold metric-value ${phase.progress > 0 ? 'text-verde-digital' : 'text-gray-400'}`}>
                              {phase.progress}%
                            </span>
                          </div>
                          <div className="h-1 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div className="h-full rounded-full bg-verde-digital" style={{ width: `${phase.progress}%` }} />
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.courses.map((c) => (
                              <span
                                key={c.id}
                                className={`text-[10px] px-2 py-0.5 rounded border ${
                                  c.completed
                                    ? 'bg-green-50 border-green-200 text-green-600 line-through'
                                    : 'bg-white border-gray-200 text-gray-600'
                                }`}
                              >
                                {c.completed && '✓ '}{c.title} · {c.duration}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CourseCard({ course }: { course: typeof courses[0] }) {
  const gradient = categoryGradients[course.category] || categoryGradients.lideranca;
  const Icon = course.icon;
  
  return (
    <div className="card card-interactive overflow-hidden group">
      <div 
        className="aspect-[16/9] flex items-center justify-center relative overflow-hidden"
        style={{ background: gradient }}
      >
        {/* Course photo */}
        {courseImages[course.id] && (
          <img 
            src={courseImages[course.id]} 
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {/* Gradient overlay — translucent to reveal photo */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${gradient.includes('#146E37') ? 'rgba(20,110,55,0.35)' : gradient.includes('#0D47A1') ? 'rgba(13,71,161,0.35)' : gradient.includes('#4A148C') ? 'rgba(74,20,140,0.35)' : gradient.includes('#E65100') ? 'rgba(230,81,0,0.35)' : gradient.includes('#004D40') ? 'rgba(0,77,64,0.35)' : 'rgba(136,14,79,0.35)'} 0%, transparent 70%), linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)` }} />
        {course.progress > 0 && course.progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-10">
            <div className="h-full bg-white" style={{ width: `${course.progress}%` }} />
          </div>
        )}
        {course.progress === 100 && (
          <div className="absolute top-2 right-2 bg-white text-green-600 rounded-full p-1 z-10">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-800 group-hover:text-verde-digital transition-colors line-clamp-1">{course.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{course.desc}</p>
        <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {course.duration}</span>
          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400" /> {course.rating}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {course.skills.map(s => (
            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-verde-50 text-verde-digital rounded">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
