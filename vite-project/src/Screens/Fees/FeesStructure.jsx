import React from "react";
import NavbarWithDrawer from "../../Components/NavDrawer";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Container,
  Avatar,
  Stack
} from "@mui/material";
import { Class, CurrencyRupee, School, LocalShipping, ReceiptLong as ReceiptIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function FeeStructure() {
  const { t } = useTranslation();
  // Static fee structure data
  const structures = [
    {
      id: 1,
      className: "10-sinf",
      tuition: "1,500,000 so'm",
      lab: "200,000 so'm",
      transport: "300,000 so'm",
      total: "2,000,000 so'm",
    },
    {
      id: 2,
      className: "9-sinf",
      tuition: "1,400,000 so'm",
      lab: "180,000 so'm",
      transport: "250,000 so'm",
      total: "1,830,000 so'm",
    },
    {
      id: 3,
      className: "8-sinf",
      tuition: "1,300,000 so'm",
      lab: "150,000 so'm",
      transport: "200,000 so'm",
      total: "1,650,000 so'm",
    },
    {
      id: 4,
      className: "7-sinf",
      tuition: "1,200,000 so'm",
      lab: "120,000 so'm",
      transport: "150,000 so'm",
      total: "1,470,000 so'm",
    },
    {
      id: 5,
      className: "6-sinf",
      tuition: "1,100,000 so'm",
      lab: "100,000 so'm",
      transport: "150,000 so'm",
      total: "1,350,000 so'm",
    },
    {
      id: 6,
      className: "5-sinf",
      tuition: "1,000,000 so'm",
      lab: "80,000 so'm",
      transport: "120,000 so'm",
      total: "1,200,000 so'm",
    },
    {
      id: 7,
      className: "4-sinf",
      tuition: "900,000 so'm",
      lab: "50,000 so'm",
      transport: "150,000 so'm",
      total: "1,100,000 so'm",
    },
    {
      id: 8,
      className: "3-sinf",
      tuition: "800,000 so'm",
      lab: "30,000 so'm",
      transport: "150,000 so'm",
      total: "980,000 so'm",
    },
  ];

  return (
    <NavbarWithDrawer>
      <Box sx={{ minHeight: '100%', py: { xs: 4, md: 8 }, bgcolor: '#f8fafc' }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 8,
              p: 4,
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#fff'
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ color: "#1e293b", fontWeight: "900" }}>
                {t('fees_structure_title') || t('fees_structure', 'To\'lovlar tarkibi')}
              </Typography>
              <Typography sx={{ color: "#64748b", fontWeight: 'bold', mt: 1 }}>
                Sinflar va guruhlar uchun o'quv to'lovlari miqdorini belgilash
              </Typography>
            </Box>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe' }}>
              <ReceiptIcon fontSize="large" />
            </Avatar>
          </Box>

          <Grid container spacing={4}>
            {structures.map((fee) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={fee.id}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e2e8f0',
                    bgcolor: '#fff',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: '#1976d2',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "900", mb: 3, color: "#1e293b", borderLeft: '4px solid #1976d2', pl: 2 }}
                  >
                    {fee.className}
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <School sx={{ fontSize: 20, color: "#1976d2" }} />
                      <Typography sx={{ color: '#475569', fontWeight: 'bold' }}>
                        <span style={{ color: '#94a3b8' }}>O'qish:</span> {fee.tuition}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Class sx={{ fontSize: 20, color: "#10b981" }} />
                      <Typography sx={{ color: '#475569', fontWeight: 'bold' }}>
                        <span style={{ color: '#94a3b8' }}>Laboratoriya:</span> {fee.lab}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <LocalShipping sx={{ fontSize: 20, color: "#f59e0b" }} />
                      <Typography sx={{ color: '#475569', fontWeight: 'bold' }}>
                        <span style={{ color: '#94a3b8' }}>Transport:</span> {fee.transport}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CurrencyRupee sx={{ fontSize: 20, color: "#10b981" }} />
                      <Typography variant="h6" sx={{ color: '#10b981', fontWeight: '900' }}>
                        {fee.total}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </NavbarWithDrawer>
  );
}
