const fs = require('fs');
const file = 'src/Components/Multimodal/LessonViewer.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the Compact Transcript block
const transcriptBlockRegex = /\s*{\/\* Compact Transcript \*\/\}[\s\S]*?(?=<\/Card>)/;
content = content.replace(transcriptBlockRegex, '\n');

// 2. Add the Subtitle Icon Button to Video Controls
const controlsTarget = `<IconButton color="inherit" onClick={toggleFullscreen}>`;
const controlsReplacement = `<IconButton color="inherit" onClick={() => setShowAiSubtitles(!showAiSubtitles)}>
                                                    <DescriptionIcon sx={{ color: showAiSubtitles ? 'var(--primary)' : 'inherit' }} />
                                                </IconButton>
                                                <IconButton color="inherit" onClick={toggleFullscreen}>`;
content = content.replace(controlsTarget, controlsReplacement);

// 3. Add Transcript Overlay inside the video relative box
const overlayTarget = `                                    )}
                                </Box>`;
const overlayReplacement = `                                    )}
                                    {/* NEW TRANSCRIPT OVERLAY */}
                                    {showAiSubtitles && lesson.transcript && (
                                        <Box sx={{ position: 'absolute', bottom: 70, left: '5%', right: '5%', bgcolor: 'rgba(0,0,0,0.7)', p: 2, borderRadius: 2, zIndex: 15, maxHeight: '30%', overflowY: 'auto', backdropFilter: 'blur(5px)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="caption" sx={{ color: 'var(--primary-light)', fontWeight: 'bold' }}><AutoAwesomeIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} /> AI tomonidan tarjimon qilingan</Typography>
                                                <IconButton size="small" onClick={() => setShowAiSubtitles(false)} sx={{ color: 'white', p: 0 }}><CloseIcon fontSize="small" /></IconButton>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: 'white', lineHeight: 1.6 }}>{lesson.transcript}</Typography>
                                        </Box>
                                    )}
                                </Box>`;
content = content.replace(overlayTarget, overlayReplacement);

// 4. Extract Tabbed Content
const tabsRegex = /\s*{\/\* SECTION 3: TABBED CONTENT \*\/\}[\s\S]*?(?={\/\* SECTION 4: 3D MODEL VIEWER \*\/})/g;
const tabsMatch = content.match(tabsRegex);

if (tabsMatch) {
    let tabsContent = tabsMatch[0];
    
    // Remove it from its original place
    content = content.replace(tabsMatch[0], '\n\n                    ');
    
    // Strip the Step wrapper from the tabs content
    // Find everything inside <Card className="premium-card"> ... </Card>
    const innerTabsRegex = /<Tabs value={tabValue}[\s\S]*?<\/Box>\s*<\/Card>/;
    const innerTabsMatch = tabsContent.match(innerTabsRegex);
    
    if (innerTabsMatch) {
        let cleanTabs = innerTabsMatch[0].replace('</Card>', ''); // remove closing card since we merge it
        
        // Add a divider and background for the tabs area
        cleanTabs = cleanTabs.replace('<Tabs value={tabValue} onChange={handleTabChange} className="premium-tabs"', 
            '<Box sx={{ borderTop: "1px solid #E2E8F0" }}><Tabs value={tabValue} onChange={handleTabChange} className="premium-tabs" sx={{ bgcolor: "#F8FAFC", px: 2 }}');
            
        // We need to close the <Box> we just opened
        cleanTabs += '\n                                </Box>\n';
        
        // Insert it right before the closing </Card> of the video player
        // Since we removed the compact transcript, the video card ends right after </Box>
        const videoCardEndTarget = `                                </Box>
                            </Card>`;
        const videoCardEndReplacement = `                                </Box>
                                
                                {/* TABBED CONTENT MERGED UNDER VIDEO */}
                                ${cleanTabs}
                            </Card>`;
                            
        content = content.replace(videoCardEndTarget, videoCardEndReplacement);
    }
}

// Rename the sections
content = content.replace(/SECTION 4: 3D MODEL VIEWER/g, 'SECTION 3: 3D MODEL VIEWER');
content = content.replace(/<Box className="step-indicator">4<\/Box>/g, '<Box className="step-indicator">3</Box>');

content = content.replace(/SECTION 5: QUIZ/g, 'SECTION 4: QUIZ');
content = content.replace(/<Box className="step-indicator">5<\/Box>/g, '<Box className="step-indicator">4</Box>');

fs.writeFileSync(file, content, 'utf8');
console.log('Done refactoring layout!');
