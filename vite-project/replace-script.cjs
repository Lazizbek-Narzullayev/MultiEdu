const fs = require('fs'); 
const file = 'src/Components/Multimodal/LessonViewer.jsx'; 
const lines = fs.readFileSync(file, 'utf8').split('\n'); 
const newReturn = `    return (
        <NavbarWithDrawer>
            <Box className="lesson-viewer-container">
                <Box className="premium-container">
                    
                    {/* PAGE TITLE AREA */}
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'white', boxShadow: 'var(--shadow-soft)' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-main)', m: 0 }}>
                                {lesson.title}
                            </Typography>
                            <Chip label="Video" color="primary" sx={{ fontWeight: 'bold', borderRadius: 2 }} />
                        </Box>
                        {/* Progress Bar */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                            <Box sx={{ flexGrow: 1, height: 6, bgcolor: 'var(--primary-light)', borderRadius: 3, overflow: 'hidden' }}>
                                <Box sx={{ width: videoCompleted ? '100%' : '50%', height: '100%', bgcolor: 'var(--primary)', transition: 'width 1s ease' }} />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>
                                {videoCompleted ? '100%' : '50%'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* SECTION 1: VIDEO PLAYER */}
                    <Box className="step-wrapper">
                        <Box className="step-indicator">1</Box>
                        <Box className="step-content">
                            <Card className="premium-card" sx={{ overflow: 'visible' }}>
                                <Box sx={{ position: 'relative', bgcolor: 'black', borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9' }}>
                                    {videoId ? (
                                        <Box id="video-wrapper" sx={{ width: '100%', height: '100%' }}>
                                            <YouTube
                                                videoId={videoId}
                                                opts={{
                                                    height: '100%',
                                                    width: '100%',
                                                    playerVars: { 
                                                        rel: 0, 
                                                        modestbranding: 1,
                                                        controls: 0,
                                                        disablekb: 1,
                                                        fs: 0
                                                    },
                                                }}
                                                onReady={onPlayerReady}
                                                onStateChange={onPlayerStateChange}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                            
                                            {/* Custom Video Controls Overlay */}
                                            <Box 
                                                sx={{
                                                    position: 'absolute', bottom: 0, left: 0, width: '100%',
                                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                                    p: { xs: 1, md: 2 }, display: 'flex', alignItems: 'center', gap: 2, color: 'white',
                                                    opacity: showControls || !isPlaying ? 1 : 0, transition: 'opacity 0.3s',
                                                    zIndex: 20
                                                }} 
                                                onMouseMove={handleMouseMove}
                                            >
                                                <IconButton color="inherit" onClick={handlePlayPause}>
                                                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                                                </IconButton>
                                                <Slider
                                                    value={currentTime}
                                                    max={duration || 100}
                                                    onChange={handleSeek}
                                                    sx={{ 
                                                        color: 'var(--primary)', 
                                                        '& .MuiSlider-thumb': { width: 14, height: 14 },
                                                        '& .MuiSlider-rail': { opacity: 0.5 } 
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ minWidth: 80, textAlign: 'right', fontWeight: 'bold' }}>
                                                    {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                                                </Typography>
                                                <IconButton color="inherit" onClick={toggleFullscreen}>
                                                    <OpenInFullIcon />
                                                </IconButton>
                                            </Box>

                                            {/* Clickable Overlay for Video interactions */}
                                            <Box 
                                                onClick={handlePlayPause}
                                                onMouseMove={handleMouseMove}
                                                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'calc(100% - 60px)', zIndex: 10, cursor: 'pointer' }}
                                            />

                                        </Box>
                                    ) : isLocalVideo ? (
                                        <Box id="video-wrapper" sx={{ width: '100%', height: '100%', position: 'relative' }}>
                                            <video 
                                                ref={playerRef} 
                                                src={lesson.videoUrl} 
                                                controlsList="nodownload"
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                                onEnded={() => {
                                                    setVideoCompleted(true);
                                                    if (isTeacher) setQuizPassed(true);
                                                }}
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box className="placeholder-video">
                                            <PlayCircleFilledWhiteIcon className="placeholder-icon" />
                                            <Typography>{t('no_video', 'Video mavjud emas')}</Typography>
                                        </Box>
                                    )}
                                </Box>
                                
                                {/* Compact Transcript */}
                                {lesson.transcript && (
                                    <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', bgcolor: '#F8FAFC', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Button 
                                                onClick={() => setShowAiSubtitles(!showAiSubtitles)}
                                                endIcon={<KeyboardArrowDownIcon sx={{ transform: showAiSubtitles ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />}
                                                sx={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                                            >
                                                Transkript ko'rish / yashirish
                                            </Button>
                                            <Chip icon={<AutoAwesomeIcon fontSize="small"/>} label="AI tomonidan tarjimon qilingan" size="small" sx={{ bgcolor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 'bold' }} />
                                        </Box>
                                        {showAiSubtitles && (
                                            <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 2, maxHeight: '200px', overflowY: 'auto', border: '1px solid #E2E8F0' }}>
                                                <Typography variant="body2" sx={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{lesson.transcript}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Card>
                        </Box>
                    </Box>

                    {/* SECTION 2: AI SUMMARY */}
                    <Box className="step-wrapper">
                        <Box className="step-indicator">2</Box>
                        <Box className="step-content">
                            <Card className="premium-card ai-summary-card">
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AutoAwesomeIcon sx={{ color: 'var(--primary)' }} /> AI Xulosa
                                        </Typography>
                                        <Button variant="outlined" color="primary" onClick={handleGenerateSummary} disabled={isSummaryLoading}>
                                            {isSummaryLoading ? 'Yuklanmoqda...' : 'Xulosani ko\\'rish'}
                                        </Button>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                        {messages.filter(m => m.role === 'model' && m.text.includes('**Dars xulosasi:**')).pop()?.text || "Dars bo'yicha qisqacha xulosa olish uchun tugmani bosing."}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>

                    {/* SECTION 3: TABBED CONTENT */}
                    <Box className="step-wrapper">
                        <Box className="step-indicator">3</Box>
                        <Box className="step-content">
                            <Card className="premium-card">
                                <Tabs value={tabValue} onChange={handleTabChange} className="premium-tabs" sx={{ borderBottom: '1px solid #E2E8F0', px: 2 }}>
                                    <Tab label="Ma'ruza (Matn)" value="text" className="premium-tab" />
                                    {lesson.audioUrl && <Tab label="Audio Podkast" value="audio" className="premium-tab" />}
                                    <Tab label="Muhokama" value="discussion" className="premium-tab" />
                                </Tabs>
                                <Box sx={{ p: 3 }}>
                                    {tabValue === 'text' && (
                                        <Box>
                                            <Box className="audio-player-bar">
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Ovozli o'qish:</Typography>
                                                <IconButton onClick={handleTtsPlay} disabled={isSpeaking && !isPaused} sx={{ color: 'var(--primary)' }}><PlayArrowIcon /></IconButton>
                                                <IconButton onClick={handleTtsPause} disabled={!isSpeaking || isPaused} sx={{ color: 'var(--warning)' }}><PauseIcon /></IconButton>
                                                <IconButton onClick={handleTtsStop} disabled={!isSpeaking && !isPaused} sx={{ color: 'var(--danger)' }}><StopIcon /></IconButton>
                                                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {[0.5, 0.75, 1, 1.5, 2].map(speed => (
                                                        <Box 
                                                            key={speed} 
                                                            className={\`speed-pill \${ttsSpeed === speed ? 'active' : ''}\`}
                                                            onClick={() => { setTtsSpeed(speed); if (isSpeaking) { handleTtsStop(); setTimeout(handleTtsPlay, 100); } }}
                                                        >
                                                            {speed}x
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'var(--text-main)' }}>
                                                {lesson.textContent || lesson.description}
                                            </Typography>
                                        </Box>
                                    )}
                                    {tabValue === 'audio' && (
                                        <Box className="podcast-card">
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Audio Podkast</Typography>
                                            </Box>
                                            <Box className="waveform" />
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <audio controls src={lesson.audioUrl} style={{ width: '100%', borderRadius: 8 }} />
                                            </Box>
                                        </Box>
                                    )}
                                    {tabValue === 'discussion' && (
                                        <Box sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
                                            <Box ref={discussionContainerRef} onScroll={handleScroll} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 2 }}>
                                                {discussionMessages.map((msg, idx) => {
                                                    const isMine = user?._id === msg.sender?._id;
                                                    const parent = getParentInfo(msg.parentMessageId);
                                                    return (
                                                        <Box key={msg._id || idx} sx={{ mb: 2, display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1 }}>
                                                            <Avatar sx={{ width: 32, height: 32, bgcolor: isMine ? 'var(--primary)' : '#f59e0b', fontSize: '0.9rem' }}>
                                                                {msg.sender?.name?.[0] || 'U'}
                                                            </Avatar>
                                                            <Box sx={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                                    <Typography variant="caption" color="textSecondary">{msg.sender?.name}</Typography>
                                                                    <Chip label={getRoleLabel(msg.sender?.role)} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
                                                                    <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.6rem' }}>{formatMessageDate(msg.createdAt)}</Typography>
                                                                </Box>
                                                                <Paper sx={{ p: 1.5, px: 2, bgcolor: isMine ? 'var(--primary)' : 'white', color: isMine ? 'white' : 'black', borderRadius: 2, position: 'relative', '&:hover .msg-actions': { opacity: 1 }, boxShadow: 'var(--shadow-soft)' }}>
                                                                    {parent && (
                                                                        <Box sx={{ bgcolor: isMine ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)', p: 1, borderRadius: 1, mb: 1, borderLeft: '3px solid', borderColor: isMine ? 'white' : 'var(--primary)' }}>
                                                                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>{parent.sender?.name}</Typography>
                                                                            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>{parent.text?.substring(0, 50)}...</Typography>
                                                                        </Box>
                                                                    )}
                                                                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>{msg.text}</Typography>
                                                                    
                                                                    <Box className="msg-actions" sx={{ position: 'absolute', top: -15, right: isMine ? 'auto' : 0, left: isMine ? 0 : 'auto', opacity: 0, transition: 'opacity 0.2s', display: 'flex', bgcolor: 'white', borderRadius: 1, boxShadow: 1, color: 'black' }}>
                                                                        <IconButton size="small" onClick={() => handleReplyClick(msg)} sx={{ p: 0.5 }}><ReplyIcon sx={{ fontSize: '1rem' }} /></IconButton>
                                                                        {(isMine || isTeacher) && (
                                                                            <IconButton size="small" color="error" onClick={() => handleDeleteMessage(msg._id)} sx={{ p: 0.5 }}><DeleteIcon sx={{ fontSize: '1rem' }} /></IconButton>
                                                                        )}
                                                                    </Box>
                                                                </Paper>
                                                            </Box>
                                                        </Box>
                                                    );
                                                })}
                                                <div ref={discussionEndRef} />
                                            </Box>
                                            
                                            {replyTo && (
                                                <Box sx={{ bgcolor: 'var(--primary-light)', p: 1, borderRadius: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'var(--primary)' }}>
                                                        <b>{replyTo.sender?.name}</b> xabariga javob: {replyTo.text.substring(0, 30)}...
                                                    </Typography>
                                                    <IconButton size="small" onClick={() => setReplyTo(null)}><CloseIcon fontSize="small" /></IconButton>
                                                </Box>
                                            )}
                                            
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <TextField 
                                                    inputRef={discussionInputRef}
                                                    fullWidth 
                                                    placeholder="Xabar yozing..." 
                                                    value={discussionInput} 
                                                    onChange={(e) => setDiscussionInput(e.target.value)} 
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendDiscussion()}
                                                    size="small"
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                                                />
                                                <IconButton color="primary" onClick={handleSendDiscussion} disabled={!discussionInput.trim()} sx={{ bgcolor: 'var(--primary-light)' }}>
                                                    <SendIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Card>
                        </Box>
                    </Box>

                    {/* SECTION 4: 3D MODEL VIEWER */}
                    {has3DModel && (
                        <Box className="step-wrapper">
                            <Box className="step-indicator">4</Box>
                            <Box className="step-content">
                                <Card className="premium-card model-3d-card">
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LanguageIcon /> 3D Model
                                            </Typography>
                                            <Chip label="Interaktiv 3D vizualizatsiya" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
                                        </Box>
                                        <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', bgcolor: 'rgba(0,0,0,0.5)' }}>
                                            <ModelViewer model={{ url: lesson.model3dUrl || lesson.interactiveUrl }} />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    )}

                    {/* SECTION 5: QUIZ */}
                    {lesson.quiz?.length > 0 && (
                        <Box className="step-wrapper">
                            <Box className="step-indicator">5</Box>
                            <Box className="step-content">
                                <Card className="premium-card" sx={{ borderLeft: '6px solid var(--warning)', bgcolor: '#FFFBEB' }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#B45309', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PsychologyIcon fontSize="large" /> Bilimni tekshirish — Quiz
                                        </Typography>
                                        
                                        {!quizOpen ? (
                                            <Box>
                                                <Typography variant="body1" sx={{ color: '#92400E', mb: 3 }}>
                                                    Videoni to'liq ko'ring va quizga kirish uchun tayyor bo'ling.
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                                                    <Chip icon={videoCompleted ? <CheckCircleIcon /> : <LockIcon />} label={videoCompleted ? "Video: Ko'rildi" : "Video: Ko'rilmadi"} color={videoCompleted ? "success" : "default"} sx={{ fontWeight: 'bold' }} />
                                                    <Chip icon={quizPassed ? <CheckCircleIcon /> : <LockIcon />} label={quizPassed ? "Quiz: Topshirildi" : "Quiz: 80% to'g'ri javob kerak"} color={quizPassed ? "success" : "default"} sx={{ fontWeight: 'bold' }} />
                                                </Box>
                                                <Button 
                                                    variant="contained" 
                                                    fullWidth 
                                                    size="large"
                                                    disabled={!videoCompleted}
                                                    onClick={() => { setQuizOpen(true); setCurrentQuizIndex(0); setQuizResults({}); }}
                                                    sx={{ bgcolor: 'var(--primary)', color: 'white', py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: 'var(--primary-hover)' } }}
                                                >
                                                    Quizni boshlash →
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Box className="animate-fade-in">
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="subtitle2" color="textSecondary">Savol {currentQuizIndex + 1} / {lesson.quiz.length}</Typography>
                                                </Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1e293b' }}>
                                                    {lesson.quiz[currentQuizIndex].question}
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    {lesson.quiz[currentQuizIndex].options.map((opt, idx) => {
                                                        const isSelected = quizResults[currentQuizIndex] === idx;
                                                        return (
                                                            <Box 
                                                                key={idx} 
                                                                className={\`quiz-option \${isSelected ? 'selected' : ''}\`}
                                                                onClick={() => setQuizResults({ ...quizResults, [currentQuizIndex]: idx })}
                                                            >
                                                                <Typography>{opt}</Typography>
                                                                {isSelected && <CheckCircleIcon sx={{ color: 'var(--primary)' }} />}
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                                    <Button 
                                                        disabled={currentQuizIndex === 0} 
                                                        onClick={() => setCurrentQuizIndex(prev => prev - 1)}
                                                        sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}
                                                    >
                                                        ← Oldingi
                                                    </Button>
                                                    
                                                    {currentQuizIndex < lesson.quiz.length - 1 ? (
                                                        <Button 
                                                            variant="contained" 
                                                            disabled={quizResults[currentQuizIndex] === undefined}
                                                            onClick={() => setCurrentQuizIndex(prev => prev + 1)}
                                                            sx={{ bgcolor: 'var(--primary)', fontWeight: 'bold', borderRadius: 2 }}
                                                        >
                                                            Keyingi →
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="contained" 
                                                            disabled={Object.keys(quizResults).length < lesson.quiz.length}
                                                            onClick={() => {
                                                                let correct = 0;
                                                                lesson.quiz.forEach((q, idx) => {
                                                                    if (quizResults[idx] === q.correctAnswer) correct++;
                                                                });
                                                                const score = (correct / lesson.quiz.length) * 100;
                                                                if (score >= 80) {
                                                                    try {
                                                                        axios.post(\`\${API_BASE_URL}/quiz-results\`, {
                                                                            lessonId: id, courseId: lesson.course?._id || lesson.course,
                                                                            score: Math.round(score), totalQuestions: lesson.quiz.length, correctAnswers: correct
                                                                        }, { headers: { 'x-auth-token': user.token } });
                                                                    } catch (err) {}
                                                                    Swal.fire({ icon: 'success', title: '🎉 Tabriklaymiz!', text: \`Siz \${score}% natija qayd etdingiz. Keyingi dars ochildi!\` });
                                                                    setQuizPassed(true);
                                                                    setQuizOpen(false);
                                                                    markAsViewed();
                                                                } else {
                                                                    Swal.fire({ icon: 'error', title: 'Yana urinib ko\\'ring', text: \`Natija: \${score}%. Kamida 80% kerak.\` });
                                                                }
                                                            }}
                                                            sx={{ bgcolor: 'var(--success)', fontWeight: 'bold', borderRadius: 2, '&:hover': { bgcolor: '#059669' } }}
                                                        >
                                                            Natijani tekshirish
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    )}

                </Box>
            </Box>

            {/* STICKY BOTTOM NAVIGATION */}
            <Box className="sticky-bottom-nav">
                <Box className="nav-content-wrapper">
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => navigate(-1)}
                        sx={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                    >
                        Oldingi dars
                    </Button>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--primary)' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--primary-light)' }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--primary-light)' }} />
                    </Box>

                    {nextLesson ? (
                        <Button
                            variant="contained"
                            disabled={!videoCompleted || (lesson.quiz?.length > 0 && !quizPassed)}
                            onClick={() => navigate(\`/lessons/\${nextLesson._id}\`)}
                            endIcon={videoCompleted && (!lesson.quiz?.length || quizPassed) ? <PlayArrowIcon /> : <LockIcon />}
                            className={videoCompleted && (!lesson.quiz?.length || quizPassed) ? 'btn-unlock-anim' : ''}
                            sx={{ 
                                bgcolor: videoCompleted && (!lesson.quiz?.length || quizPassed) ? 'var(--success)' : '#E2E8F0',
                                color: videoCompleted && (!lesson.quiz?.length || quizPassed) ? 'white' : 'var(--text-muted)',
                                fontWeight: 'bold', borderRadius: 3, px: 3, py: 1.5,
                                '&:hover': { bgcolor: videoCompleted && (!lesson.quiz?.length || quizPassed) ? '#059669' : '#CBD5E1' }
                            }}
                        >
                            Keyingi dars
                        </Button>
                    ) : (
                        <Button disabled sx={{ fontWeight: 'bold', color: 'var(--text-muted)' }}>Tugadi</Button>
                    )}
                </Box>
            </Box>

            {/* AI Tutor Floating Action Button */}
            <Fab 
                color="primary" 
                aria-label="ai-tutor" 
                sx={{ position: 'fixed', bottom: 100, right: 32, zIndex: 1000, boxShadow: 'var(--shadow-hover)', bgcolor: 'var(--primary)', '&:hover': { bgcolor: 'var(--primary-hover)' } }}
                onClick={() => setIsChatMaximized(true)}
            >
                <SmartToyIcon sx={{ fontSize: 32 }} />
            </Fab>

            {/* AI Tutor Dialog (Slide-in Drawer) */}
            <Dialog 
                open={isChatMaximized} 
                onClose={() => setIsChatMaximized(false)} 
                maxWidth="xs" 
                fullWidth 
                PaperProps={{ 
                    sx: { 
                        m: 0, position: 'fixed', right: 0, height: '100vh', 
                        maxHeight: '100vh', borderRadius: '16px 0 0 16px', 
                        animation: 'slideInRight 0.3s ease' 
                    } 
                }}
            >
                <Box sx={{ p: 2, background: 'linear-gradient(to right, #6C63FF, #5A52D5)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToyIcon />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>AI Tyutor</Typography>
                    </Box>
                    <IconButton color="inherit" onClick={() => setIsChatMaximized(false)}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ height: 'calc(100vh - 140px)', overflowY: 'auto', p: 3, bgcolor: '#f8fafc' }}>
                    {messages.map((m, i) => (
                        <Box key={i} sx={{ mb: 2, display: 'flex', flexDirection: m.role === 'model' ? 'row' : 'row-reverse', alignItems: 'flex-end', gap: 1 }}>
                            <Avatar sx={{ bgcolor: m.role === 'model' ? 'var(--primary)' : '#f59e0b', width: 32, height: 32 }}>
                                {m.role === 'model' ? <SmartToyIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                            </Avatar>
                            <Paper sx={{ 
                                p: 1.5, px: 2, 
                                maxWidth: '85%', 
                                bgcolor: m.role === 'model' ? 'white' : 'var(--primary)', 
                                color: m.role === 'model' ? 'black' : 'white',
                                borderRadius: 3,
                                borderBottomLeftRadius: m.role === 'model' ? 0 : 12,
                                borderBottomRightRadius: m.role === 'model' ? 12 : 0,
                                boxShadow: 'var(--shadow-soft)'
                            }}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {m.role === 'model' && m.text.includes('**Dars xulosasi:**') ? (
                                        <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>') }} />
                                    ) : (
                                        m.text
                                    )}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                    {isChatLoading && <CircularProgress size={20} sx={{ m: 1, display: 'block', mx: 'auto', color: 'var(--primary)' }} />}
                </Box>
                <Box sx={{ p: 2, display: 'flex', gap: 1, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        placeholder="Dars bo'yicha savol bering..." 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()} 
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                    <IconButton color="primary" onClick={handleSendChatMessage} sx={{ bgcolor: 'var(--primary-light)' }}>
                        <SendIcon />
                    </IconButton>
                </Box>
            </Dialog>

        </NavbarWithDrawer>
    );
};
`

const returnIndex = lines.findIndex(line => line.trim().startsWith('return (') || line.trim() === 'return (');
if(returnIndex !== -1) {
    lines.splice(returnIndex, lines.length - returnIndex, newReturn);
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Success');
} else {
    console.log('Could not find return statement');
}
