import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Divider, Accordion, AccordionSummary, AccordionDetails,
  Chip, Avatar, CircularProgress, Alert, Paper, Grid,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, IconButton,
  Container
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NavbarWithDrawer from '../../Components/NavDrawer';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import ReviewForm from '../../Components/ReviewForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/Components/ui/badge';

const HelpPage = () => {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;
  const { t } = useTranslation();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin reply states
  const [replyMessage, setReplyMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState(null);

  // Tabs state
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Selected ticket for modal
  const [selectedTicket, setSelectedTicket] = useState(null);

  const isSuperAdmin = user?.role === 'super-admin';

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const endpoint = isSuperAdmin ? '/support/all' : '/support/my-tickets';
      const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { 'x-auth-token': token }
      });
      setTickets(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSubmitLoading(true);
      setError('');
      setSuccess('');
      
      const res = await axios.post(
        `${API_BASE_URL}/support`,
        { subject, message },
        { headers: { 'x-auth-token': token } }
      );
      
      setTickets([res.data, ...tickets]);
      setSubject('');
      setMessage('');
      setSuccess('Xabaringiz adminga yetkazildi. Tez orada javob olasiz.');
      setSubmitLoading(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setSubmitLoading(false);
      setError('Xabarni yuborishda xatolik yuz berdi.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleReplyTicket = async (ticketId) => {
    if (!replyMessage.trim()) return;

    try {
      setSubmitLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/support/${ticketId}/reply`,
        { message: replyMessage, status: 'closed' },
        { headers: { 'x-auth-token': token } }
      );

      // Update the ticket in the local list
      setTickets(tickets.map(t => t._id === ticketId ? res.data : t));
      setReplyMessage('');
      setActiveTicket(null);
      setSubmitLoading(false);
    } catch (err) {
      setSubmitLoading(false);
      console.error(err);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'open': return <Chip label={t('status_open')} sx={{ borderRadius: 1, bgcolor: '#fef3c7', color: '#d97706', fontWeight: 'bold' }} size="small" />;
      case 'in-progress': return <Chip label={t('status_inprogress')} sx={{ borderRadius: 1, bgcolor: '#e0f2fe', color: '#0284c7', fontWeight: 'bold' }} size="small" />;
      case 'closed': return <Chip label={t('status_closed')} sx={{ borderRadius: 1, bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 'bold' }} size="small" />;
      default: return <Chip label={status} size="small" sx={{ borderRadius: 1 }} />;
    }
  };

  const renderStudentTeacherView = () => (
    <Box className="space-y-16">
      {/* Header Section */}
      <Box className="relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 p-10 lg:p-14 shadow-sm">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-3xl">
          <Badge className="bg-primary/10 text-primary border-none px-5 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">
            Platforma koʻmagi
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Platformadan foydalanish <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
              yoʻriqnomasi
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Tizimdan qanday foydalanish, darslarni o'tish va vazifalarni ishlash bo'yicha <br className="hidden lg:block" />
            qisqacha ma'lumotlar bilan tanishib chiqing.
          </p>
        </div>
      </Box>

      {/* FAQ Grid */}
      <Box className="space-y-8">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <RecordVoiceOverIcon className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ko'p so'raladigan savollar</h2>
        </div>

        <Grid container spacing={4}>
          {[
            { q: "Darslarga qanday qatnashaman?", a: "\"Mening Kurslarim\" bo'limiga o'tib, davom etayotgan kursingizni tanlang. U yerdagi mavzular ketma-ketligida dars materiallari (video, matn, fayl) bilan tanishib chiqishingiz mumkin." },
            { q: "Uy vazifalarini qanday yuklayman?", a: "Har bir dars oxirida uy vazifalari bo'lishi mumkin. Vazifani bajargach, \"Vazifani yuborish\" tugmasini bosing va fayl, rasm yoki havolani ilova qilib jo'nating." },
            { q: "Natijalar va o'zlashtirish balimni qayerdan ko'raman?", a: "Darslarni va testlarni to'liq tugatganingizdan so'ng, \"Natijalarim\" bo'limidan umumiy o'zlashtirishingizni va olgan balingizni ko'rishingiz mumkin." },
            { q: "Parolimni unutsam nima qilishim kerak?", a: "Tizimga kirish oynasidagi \"Parolni unutdim\" tugmasini bosing va elektron pochtangizni kiriting. Shundan so'ng pochtangizga tiklash havolasi yuboriladi." },
            { q: "O'qituvchiga qanday qilib savol bersam bo'ladi?", a: "Har bir dars sahifasida sharhlar (kommentariyalar) yoki o'qituvchiga bevosita yozish funksiyasi mavjud. O'sha yerdan o'z savolingizni berishingiz mumkin." },
            { q: "Video darslar qotib qolyapti, qanday yo'l tutay?", a: "Bu asosan internet ulanishingizga bog'liq bo'lishi mumkin. Iltimos, ulanishni tekshiring yoki video sifati parametrini pastroq qilib ko'ring." }
          ].map((faq, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 h-full shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-6">
                  <span className="font-black text-lg">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 leading-snug group-hover:text-primary transition-colors">
                  {faq.q}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                  {faq.a}
                </p>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Support Section */}
      <Box className="grid lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <Box className="lg:col-span-5">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <SupportAgentIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Yordam xizmati</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Adminga murojaat yuborish</p>
              </div>
            </div>

            <p className="text-slate-500 font-medium">
              Agarda sizda savollar bo'lsa yoki texnik muammoga duch kelsangiz, quyidagi formani to'ldirib bizga yuboring.
            </p>

            {error && <Alert severity="error" className="rounded-2xl border-none font-bold text-sm bg-rose-50 text-rose-600">{error}</Alert>}
            {success && <Alert severity="success" className="rounded-2xl border-none font-bold text-sm bg-emerald-50 text-emerald-600">{success}</Alert>}

            <form onSubmit={handleCreateTicket} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Murojaat mavzusi</label>
                <TextField
                  fullWidth
                  placeholder="Masalan: Kursga kirishda muammo"
                  variant="outlined"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#f8fafc',
                      '& fieldset': { borderColor: '#f1f5f9', borderRadius: '1.25rem' },
                      '&:hover fieldset': { borderColor: '#e2e8f0' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Batafsil ma'lumot</label>
                <TextField
                  fullWidth
                  placeholder="Xabaringizni yozing..."
                  variant="outlined"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#f8fafc',
                      '& fieldset': { borderColor: '#f1f5f9', borderRadius: '1.25rem' },
                      '&:hover fieldset': { borderColor: '#e2e8f0' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    }
                  }}
                  required
                />
              </div>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitLoading || !message.trim()}
                className="h-16 rounded-[1.25rem] bg-primary hover:bg-primary/90 text-white font-black text-base gap-3 shadow-xl shadow-primary/20 transition-all duration-300"
              >
                {submitLoading ? t('saving') : "Xabarni yuborish"}
                <SendIcon className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </Box>

        {/* Requests List */}
        <Box className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4 text-slate-900 font-black text-2xl">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <AssignmentIcon className="w-5 h-5" />
              </div>
              <span>Mening murojaatlarim</span>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setTabValue(0)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabValue === 0 ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Javob kutilayotganlar
              </button>
              <button 
                onClick={() => setTabValue(1)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tabValue === 1 ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Javob berilganlar
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><CircularProgress /></div>
          ) : tickets.filter(t => tabValue === 0 ? t.status !== 'closed' : t.status === 'closed').length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] py-24 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                <AssignmentIcon className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Hozircha murojaatlar yo'q</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {tickets.filter(t => tabValue === 0 ? t.status !== 'closed' : t.status === 'closed').map(ticket => (
                <motion.div 
                  key={ticket._id} 
                  layout
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-white border border-slate-100 rounded-[2rem] p-6 cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-slate-900 text-lg group-hover:text-primary transition-colors">{ticket.subject || "Mavzusiz murojaat"}</h4>
                    {renderStatus(ticket.status)}
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Yuborilgan: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className={ticket.replies?.length > 0 ? 'text-emerald-500' : 'text-slate-400'}>
                      {ticket.replies?.length > 0 ? "Javob berilgan" : "Kutilmoqda"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Box>
      </Box>

      {/* Modal Dialog */}
      <Dialog 
        open={Boolean(selectedTicket)} 
        onClose={() => setSelectedTicket(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '2.5rem', overflow: 'hidden', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }
        }}
      >
        {selectedTicket && (
          <div className="flex flex-col h-full bg-white">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                  <AssignmentIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{selectedTicket.subject || 'Murojaat tafsiloti'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <IconButton onClick={() => setSelectedTicket(null)} className="bg-white hover:bg-slate-100">
                <CloseIcon />
              </IconButton>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[500px] custom-scrollbar">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 bg-primary rounded-full" />
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sizning murojaatingiz</h5>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-900 font-medium leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                </div>
              </div>
              
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin javobi</h5>
                  </div>
                  {selectedTicket.replies.map((reply, i) => (
                    <div key={i} className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <CheckCircleOutlineIcon className="w-16 h-16 text-emerald-600" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>A</Avatar>
                        <div>
                          <p className="text-xs font-black text-emerald-700 leading-none mb-1">MultiEdu Qo'llab-quvvatlash</p>
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{new Date(reply.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <p className="text-slate-900 font-medium leading-relaxed relative z-10">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100">
               <Button 
                fullWidth 
                onClick={() => setSelectedTicket(null)}
                className="h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-sm hover:bg-slate-100 transition-colors"
               >
                 Yopish
               </Button>
            </div>
          </div>
        )}
      </Dialog>
    </Box>
  );

  const renderSuperAdminView = () => {
    const displayedTickets = tickets.filter(t => tabValue === 0 ? t.status !== 'closed' : t.status === 'closed');
    const selectedAdminTicket = tickets.find(t => t._id === activeTicket);

    return (
    <Box>
      <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3" sx={{ 
          color: '#0f172a', 
          fontWeight: '950', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
        }}>
          <SupportAgentIcon sx={{ fontSize: 40, color: '#2563eb' }} /> {t('help_title')}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 6 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, val) => { handleTabChange(e, val); setActiveTicket(null); }}
          sx={{
            '& .MuiTabs-indicator': { bgcolor: '#2563eb' },
            '& .MuiTab-root': { color: '#64748b', fontWeight: '950' },
            '& .Mui-selected': { color: '#2563eb !important' }
          }}
        >
          <Tab label={t('admin_tickets_waiting')} />
          <Tab label={t('admin_tickets_closed')} />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={10}><CircularProgress color="primary" /></Box>
      ) : displayedTickets.length === 0 ? (
        <Paper className="glass-panel" sx={{ p: 12, textAlign: 'center', borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
           <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#10b981', mb: 2, opacity: 0.5 }} />
           <Typography sx={{ color: '#64748b', fontWeight: 'bold' }}>{t('admin_no_tickets')}</Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              maxHeight: 'calc(100vh - 350px)', 
              overflowY: 'auto', 
              pr: 2,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: 3 }
            }}>
                {displayedTickets.map(ticket => (
                  <Card 
                    key={ticket._id} 
                    className="glass-panel" 
                    onClick={() => setActiveTicket(ticket._id)}
                    sx={{ 
                      mb: 2, 
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: activeTicket === ticket._id ? '#2563eb' : '#e2e8f0',
                      bgcolor: activeTicket === ticket._id ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                      transition: 'all 0.3s',
                      '&:hover': { borderColor: '#2563eb' }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography sx={{ color: '#0f172a', fontWeight: "950" }}>
                          {ticket.sender?.name || 'Foydalanuvchi'}
                        </Typography>
                        {renderStatus(ticket.status)}
                      </Box>
                      <Typography variant="body2" sx={{ color: '#475569', fontWeight: 'bold', mb: 2 }}>
                        {ticket.subject || 'Mavzusiz murojaat'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            {selectedAdminTicket ? (
              <Paper className="glass-panel" sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', p: 4, height: 'calc(100vh - 350px)', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 2 }}>
                  <Box display="flex" alignItems="center" gap={3} mb={6}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: '#2563eb', fontWeight: '950', fontSize: '1.5rem', borderRadius: 1 }}>
                      {selectedAdminTicket.sender?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: '950' }}>
                        {selectedAdminTicket.sender?.name}
                        <Chip label={selectedAdminTicket.sender?.role} size="small" sx={{ ml: 2, bgcolor: '#e0f2fe', color: '#0284c7', fontWeight: 'bold', borderRadius: 1 }} />
                      </Typography>
                      <Typography sx={{ color: '#64748b', fontWeight: 'bold' }}>
                        {selectedAdminTicket.sender?.email} • {new Date(selectedAdminTicket.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: '950', mb: 2 }}>
                    Mavzu: {selectedAdminTicket.subject || 'Mavzusiz'}
                  </Typography>
                  <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0', mb: 6 }}>
                    <Typography variant="body1" sx={{ color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                      {selectedAdminTicket.message}
                    </Typography>
                  </Paper>

                  {selectedAdminTicket.replies && selectedAdminTicket.replies.length > 0 && (
                    <Box mt={6}>
                      <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: '950', mb: 3 }}>{t('admin_reply_history')}</Typography>
                      {selectedAdminTicket.replies.map((reply, i) => (
                        <Box key={i} sx={{ mb: 3, p: 3, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #dcfce7' }}>
                          <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <SupportAgentIcon sx={{ color: '#10b981', fontSize: 20 }} />
                            <Typography variant="caption" sx={{ fontWeight: '950', color: '#10b981' }}>{t('admin_your_reply')}</Typography>
                            <Typography variant="caption" sx={{ ml: 'auto', color: '#64748b', fontWeight: 'bold' }}>
                              {new Date(reply.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#0f172a', whiteSpace: 'pre-wrap' }}>{reply.message}</Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {selectedAdminTicket.status === 'open' && (
                  <Box sx={{ pt: 4, borderTop: '1px solid #e2e8f0' }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      placeholder="Xabaringizni yozing..."
                      variant="outlined"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          color: '#0f172a',
                          '& fieldset': { borderColor: '#e2e8f0', borderRadius: 1 },
                          '&:hover fieldset': { borderColor: '#cbd5e1' },
                          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                        }
                      }}
                    />
                    <Box display="flex" justifyContent="flex-end">
                      <Button 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        disabled={submitLoading || !replyMessage.trim()}
                        onClick={() => handleReplyTicket(selectedAdminTicket._id)}
                        sx={{ 
                          borderRadius: 1, 
                          px: 6, 
                          py: 1.5,
                          fontWeight: '950',
                          background: '#2563eb',
                          '&:hover': {
                            background: '#1d4ed8',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        {t('admin_send_and_close')}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            ) : (
              <Box sx={{ height: 'calc(100vh - 350px)', bgcolor: '#ffffff', borderRadius: 1, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <SupportAgentIcon sx={{ fontSize: 80, color: '#e2e8f0', mb: 3 }} />
                <Typography variant="h5" sx={{ color: '#94a3b8', fontWeight: 'bold' }}>{t('admin_select_ticket')}</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
    );
  };

  return (
    <NavbarWithDrawer>
      <Box className="mesh-bg-light" sx={{ minHeight: '100%', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="xl">
          {isSuperAdmin ? renderSuperAdminView() : renderStudentTeacherView()}
          
          <Box sx={{ mt: 8, mb: 4 }}>
            <ReviewForm />
          </Box>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
};

export default HelpPage;
