import React from "react";
import NavbarWithDrawer from "../../Components/NavDrawer";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Container,
  Avatar,
  Stack,
  IconButton,
  Tooltip
} from "@mui/material";
import { Person, Class, CurrencyRupee, Event, ReceiptLong as ReceiptIcon, Print as PrintIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function FeeVoucher() {
  const { t } = useTranslation();
  // Static data for fee vouchers
  const vouchers = [
    { id: 1, studentName: "Ali Khan", className: "10-sinf", dueDate: "2025-09-01", amount: "1,500,000 so'm", status: "To'lanmagan" },
    { id: 2, studentName: "Sara Ahmed", className: "9-sinf", dueDate: "2025-09-05", amount: "1,250,000 so'm", status: "To'langan" },
    { id: 3, studentName: "Bilal Hussain", className: "8-sinf", dueDate: "2025-09-07", amount: "1,000,000 so'm", status: "To'lanmagan" },
    { id: 4, studentName: "Ayesha Malik", className: "7-sinf", dueDate: "2025-09-10", amount: "900,000 so'm", status: "To'langan" },
    { id: 5, studentName: "Hamza Ali", className: "6-sinf", dueDate: "2025-09-12", amount: "850,000 so'm", status: "To'lanmagan" },
    { id: 6, studentName: "Fatima Zahra", className: "5-sinf", dueDate: "2025-09-15", amount: "720,000 so'm", status: "To'langan" },
    { id: 7, studentName: "Usman Tariq", className: "4-sinf", dueDate: "2025-09-18", amount: "650,000 so'm", status: "To'lanmagan" },
    { id: 8, studentName: "Hira Noor", className: "3-sinf", dueDate: "2025-09-20", amount: "580,000 so'm", status: "To'langan" },
  ];

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 6,
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff'
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ color: "#1e293b", fontWeight: "900" }}>
                 {t('fees_vouch_title') || t('fees_vouch', 'To\'lovlar kvitansiyasi')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                To'lov kvitansiyalarini chop etish va yuklab olish
              </Typography>
            </Box>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#eff6ff', color: '#1976d2', border: '1px solid #dbeafe' }}>
              <ReceiptIcon fontSize="large" />
            </Avatar>
          </Box>

          <Stack spacing={4} alignItems="center">
            {vouchers.map((voucher) => (
              <Box key={voucher.id} sx={{ width: '100%', maxWidth: 600 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    bgcolor: '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1976d2',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#eff6ff', color: '#1976d2', fontWeight: '900' }}>
                        #{voucher.id}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: '900' }}>
                          Vaucher #{voucher.id}0{voucher.id}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 'bold' }}>
                          ID: VCR-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Chop etish">
                        <IconButton sx={{ color: '#94a3b8', '&:hover': { color: '#1976d2', bgcolor: '#f1f5f9' } }}>
                          <PrintIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Person sx={{ fontSize: 18, color: "#64748b" }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: -0.5 }}>Talaba</Typography>
                            <Typography sx={{ color: '#334155', fontWeight: 'bold' }}>{voucher.studentName}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Class sx={{ fontSize: 18, color: "#64748b" }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: -0.5 }}>Sinf</Typography>
                            <Typography sx={{ color: '#334155', fontWeight: 'bold' }}>{voucher.className}</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Event sx={{ fontSize: 18, color: "#64748b" }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: -0.5 }}>Muddati</Typography>
                            <Typography sx={{ color: '#334155', fontWeight: 'bold' }}>{voucher.dueDate}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <CurrencyRupee sx={{ fontSize: 18, color: "#64748b" }} />
                          <Box>
                            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: -0.5 }}>Summa</Typography>
                            <Typography sx={{ color: '#10b981', fontWeight: '900' }}>{voucher.amount}</Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                    <Box sx={{ 
                      px: 2, 
                      py: 0.5, 
                      bgcolor: voucher.status === "To'langan" ? '#f0fdf4' : '#fef2f2', 
                      color: voucher.status === "To'langan" ? '#10b981' : '#ef4444', 
                      borderRadius: 1,
                      fontWeight: '900',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      border: `1px solid ${voucher.status === "To'langan" ? '#dcfce7' : '#fee2e2'}`
                    }}>
                      {voucher.status}
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
