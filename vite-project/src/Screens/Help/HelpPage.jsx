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
    <Box>
      <Box mb={8}>
        <Typography variant="h3" sx={{ 
          color: '#0f172a', 
          fontWeight: '950', 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
        }}>
          <RecordVoiceOverIcon sx={{ fontSize: 40, color: '#2563eb' }} /> {t('instruction_title')}
        </Typography>
        <Typography variant="h6" sx={{ color: "#64748b", mb: 6, fontWeight: 'medium' }}>
          {t('instruction_desc')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '100%', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          {[
            { q: "Darslarga qanday qatnashaman?", a: "\"Mening Kurslarim\" bo'limiga o'tib, davom etayotgan kursingizni tanlang. U yerdagi mavzular ketma-ketligida dars materiallari (video, matn, fayl) bilan tanishib chiqishingiz mumkin." },
            { q: "Uy vazifalarini qanday yuklayman?", a: "Har bir dars oxirida uy vazifalari bo'lishi mumkin. Vazifani bajargach, \"Vazifani yuborish\" tugmasini bosing va fayl, rasm yoki havolani ilova qilib jo'nating." },
            { q: "Natijalar va o'zlashtirish balimni qayerdan ko'raman?", a: "Darslarni va testlarni to'liq tugatganingizdan so'ng, \"Natijalarim\" bo'limidan umumiy o'zlashtirishingizni va olgan balingizni ko'rishingiz mumkin." },
            { q: "Parolimni unutsam nima qilishim kerak?", a: "Tizimga kirish oynasidagi \"Parolni unutdim\" tugmasini bosing va elektron pochtangizni kiriting. Shundan so'ng pochtangizga tiklash havolasi yuboriladi." },
            { q: "O'qituvchiga qanday qilib savol bersam bo'ladi?", a: "Har bir dars sahifasida sharhlar (kommentariyalar) yoki o'qituvchiga bevosita yozish funksiyasi mavjud. O'sha yerdan o'z savolingizni berishingiz mumkin." },
            { q: "Video darslar qotib qolyapti, qanday yo'l tutay?", a: "Bu asosan internet ulanishingizga bog'liq bo'lishi mumkin. Iltimos, ulanishni tekshiring yoki video sifati parametrini pastroq qilib ko'ring." }
          ].map((faq, index) => (
            <Paper 
              key={index}
              className="glass-panel"
              sx={{ 
                p: 4, 
                borderRadius: 1, 
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', borderColor: '#2563eb' }
              }}
            >
              <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: '950', mb: 2 }}>{faq.q}</Typography>
              <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>{faq.a}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card className="glass-panel" sx={{ borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                <SupportAgentIcon sx={{ fontSize: 40, color: '#2563eb' }} />
                <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: "950" }}>
                  {t('support_title')}
                </Typography>
              </Box>
              <Typography sx={{ color: "#64748b", mb: 4 }}>
                {t('contact_desc')}
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 1, bgcolor: '#fef2f2', color: '#ef4444' }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 1, bgcolor: '#f0fdf4', color: '#10b981' }}>{success}</Alert>}

              <form onSubmit={handleCreateTicket}>
                <TextField
                  fullWidth
                  label={t('ticket_subject_label')}
                  variant="outlined"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#0f172a',
                      '& fieldset': { borderColor: '#e2e8f0', borderRadius: 1 },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748b' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
                  }}
                />
                <TextField
                  fullWidth
                  label={t('ticket_msg_label')}
                  variant="outlined"
                  multiline
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      color: '#0f172a',
                      '& fieldset': { borderColor: '#e2e8f0', borderRadius: 1 },
                      '&:hover fieldset': { borderColor: '#cbd5e1' },
                      '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                    },
                    '& .MuiInputLabel-root': { color: '#64748b' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' },
                  }}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<SendIcon />}
                  disabled={submitLoading || !message.trim()}
                  sx={{ 
                    borderRadius: 1, 
                    textTransform: 'none', 
                    py: 2,
                    fontWeight: '950',
                    background: '#2563eb',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                    '&:hover': {
                      background: '#1d4ed8',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {submitLoading ? t('saving') : t('send_ticket_btn')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h5" sx={{ color: '#0f172a', fontWeight: "950", mb: 4 }}>
            {t('my_requests')}
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': { bgcolor: '#2563eb' },
                '& .MuiTab-root': { color: '#64748b', fontWeight: '950' },
                '& .Mui-selected': { color: '#2563eb !important' }
              }}
            >
              <Tab label="Javob kutilayotganlar" />
              <Tab label="Javob berilganlar" />
            </Tabs>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" p={8}><CircularProgress color="primary" /></Box>
          ) : tickets.filter(t => tabValue === 0 ? t.status !== 'closed' : t.status === 'closed').length === 0 ? (
            <Paper className="glass-panel" sx={{ p: 10, textAlign: 'center', borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <AssignmentIcon sx={{ fontSize: 64, color: '#e2e8f0', mb: 2 }} />
              <Typography sx={{ color: '#94a3b8', fontWeight: 'bold' }}>Bu bo'limda so'rovlar topilmadi</Typography>
            </Paper>
          ) : (
            <Box sx={{ pr: 1, maxHeight: 600, overflowY: 'auto' }}>
              {tickets.filter(t => tabValue === 0 ? t.status !== 'closed' : t.status === 'closed').map(ticket => (
                <Card 
                  key={ticket._id} 
                  className="glass-panel" 
                  onClick={() => setSelectedTicket(ticket)}
                  sx={{ 
                    mb: 2, 
                    borderRadius: 1,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff',
                    cursor: 'pointer',
                    transition: '0.3s',
                    '&:hover': { bgcolor: '#f8fafc', borderColor: '#2563eb' }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography sx={{ color: '#0f172a', fontWeight: "950" }}>
                        {ticket.subject || t('no_subject')}
                      </Typography>
                      {renderStatus(ticket.status)}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold' }}>
                      {t('sent_label')}: {new Date(ticket.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog 
        open={Boolean(selectedTicket)} 
        onClose={() => setSelectedTicket(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          className: 'glass-panel',
          sx: { borderRadius: 1, border: '1px solid #e2e8f0', color: '#0f172a', bgcolor: '#ffffff' }
        }}
      >
        {selectedTicket && (
          <React.Fragment>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: '950' }}>
                {selectedTicket.subject || 'Mavzusiz murojaat'}
              </Typography>
              <IconButton onClick={() => setSelectedTicket(null)} size="small" sx={{ color: '#64748b' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 4, borderColor: '#e2e8f0' }}>
              <Box mb={4}>
                <Typography variant="subtitle1" sx={{ color: '#2563eb', fontWeight: '950', mb: 2 }}>Sizning Murojaatingiz:</Typography>
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
                  <Typography variant="body1" sx={{ color: '#0f172a', whiteSpace: 'pre-wrap' }}>{selectedTicket.message}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b', fontWeight: 'bold' }}>
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </Typography>
                </Paper>
              </Box>
              
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <Box>
                  <Divider sx={{ my: 4, borderColor: '#e2e8f0' }} />
                  <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: '950', mb: 2 }}>Admin Javoblari:</Typography>
                  {selectedTicket.replies.map((reply, i) => (
                    <Box key={i} sx={{ mt: 2, p: 3, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #dcfce7' }}>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#10b981', fontWeight: 'bold' }}>A</Avatar>
                        <Typography variant="caption" sx={{ fontWeight: '950', color: '#10b981' }}>Bosh Admin</Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#0f172a', whiteSpace: 'pre-wrap' }}>{reply.message}</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b', fontWeight: 'bold' }}>
                        {new Date(reply.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>
          </React.Fragment>
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
