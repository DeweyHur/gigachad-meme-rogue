# Background Music Setup

## Overview
The game now includes a comprehensive audio system that supports both background music and boss voice effects. The system works seamlessly across mobile (iOS/Android) and web platforms with proper audio context separation.

**Current Background Music**: `assets/audios/Песня для твоего друга.mp3`
**Current Boss Voice**: `assets/audios/Tralalero Tralala Sound Effect.mp3`

## Features
- **Auto-Start Background Music**: Background music starts playing automatically when the app loads
- **Play/Pause Control**: Toggle background music on/off with floating controls
- **Volume Control**: Adjust music volume with a slider and step buttons
- **Persistent Audio**: Music continues playing across different game screens
- **Background Playback**: Music continues even when the app is in the background (mobile)
- **Cross-Platform Support**: Works on iOS, Android, and Web browsers
- **Automatic Platform Detection**: Uses appropriate audio API for each platform
- **Local Audio Files**: Uses bundled audio for optimal performance
- **Boss Voice Effects**: Bosses have unique voice/sound effects when clicked
- **Separate Audio Contexts**: Background music and sound effects use independent audio systems

## Platform Support

### Mobile (iOS/Android)
- Uses Expo's `expo-av` library
- Full background playback support
- Native audio controls integration
- Optimized for mobile performance
- Separate audio contexts for music and effects

### Web (Browsers)
- Uses Web Audio API with separate contexts
- Requires user interaction to start audio (browser policy)
- Supports modern browsers (Chrome, Firefox, Safari, Edge)
- Automatic audio context management
- Independent background music and sound effect systems

## How to Use

### Music Controls
The music controls appear as a floating button in the top-right corner of the screen:
- **Play/Pause Button**: Click to start or stop the background music
- **Volume Button**: Click to show/hide the volume slider
- **Volume Slider**: Drag to adjust volume (0-100%)
- **Volume Buttons**: Use +/- buttons for fine volume control

### Boss Voice Effects
- **Voice Indicator**: Bosses with voice effects show a speaker icon (🔊)
- **Click to Play**: Click on any boss to hear their unique voice/sound effect
- **Current Voices**: Tralalero Tralala has a voice effect available
- **Future Voices**: Other bosses can have voice effects added
- **Independent System**: Boss voices don't interfere with background music

### Web Platform Notes
- **Auto-Start**: Music will start automatically after the first user interaction (browser requirement)
- **Audio Context**: The system automatically manages separate Web Audio contexts
- **Browser Compatibility**: Works in all modern browsers that support Web Audio API
- **No Conflicts**: Background music and sound effects use separate audio contexts

### Current Audio Files
The game is currently using:
- **Background Music**: `assets/audios/Песня для твоего друга.mp3`
- **Boss Voice**: `assets/audios/Tralalero Tralala Sound Effect.mp3`

These local audio files provide:
- ✅ **Fast Loading**: No network requests needed
- ✅ **Offline Support**: Works without internet connection
- ✅ **Reliable**: No external dependencies
- ✅ **Cross-Platform**: Works on all platforms
- ✅ **No Conflicts**: Separate audio contexts prevent interference

### Adding Your Own Music

To replace the current audio file with your own track:

1. **Replace the audio file** in `assets/audios/` folder
2. **Update the Music URL** in `components/MusicControls.tsx`:
   ```typescript
   const musicUrl = require('../assets/audios/YOUR_MUSIC_FILE.mp3');
   ```

2. **Supported Formats**:
   - MP3 (recommended)
   - WAV
   - AAC
   - OGG

3. **Recommended Sources**:
   - Local files in `assets/audios/` folder (best performance)
   - Upload to a cloud service (Google Drive, Dropbox, etc.)
   - Use a direct download link
   - Host on your own server
   - Use a CDN for better performance

### Adding Boss Voice Effects

To add voice effects for bosses:

1. **Add audio file** to `assets/audios/` folder
2. **Update boss data** in `constants/game.ts`:
   ```typescript
   {
     id: 'boss_id',
     name: 'Boss Name',
     // ... other properties
     voice: require('../assets/audios/boss_voice.mp3'),
   }
   ```

3. **Voice files should be**:
   - Short (2-5 seconds recommended)
   - High quality but compressed
   - Representative of the boss character

### Example Music URLs
```typescript
// Local asset (recommended for best performance)
const musicUrl = require('../assets/audios/background-music.mp3');

// Google Drive (make sure to set sharing to "Anyone with the link")
const musicUrl = 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID';

// Direct download link
const musicUrl = 'https://example.com/path/to/your/music.mp3';

// CDN link
const musicUrl = 'https://cdn.example.com/music/background.mp3';
```

## Technical Details

### Audio Services Architecture
- **`services/audioService.ts`**: Main unified audio service for background music
- **`services/soundEffectService.ts`**: Service for boss voice effects
- **`services/webAudioService.ts`**: Web-specific implementation for background music
- **`services/webSoundEffectService.ts`**: Web-specific implementation for sound effects
- **`components/MusicControls.tsx`**: UI component for music controls

### Platform Detection & Audio Contexts
The system automatically detects the platform and uses the appropriate audio implementation:
- **Mobile**: Uses `expo-av` for native audio with separate sound objects
- **Web**: Uses separate Web Audio contexts for background music and sound effects

### Integration Points
The music controls are automatically added to:
- Main menu (`app/index.tsx`)
- Game screen (`app/game.tsx`)

Boss voice effects are integrated in:
- Boss selector (`components/BossSelector.tsx`)

### Audio Context Separation
- **Background Music**: Uses dedicated audio context for looping music
- **Sound Effects**: Uses separate audio context for one-shot boss voices
- **No Interference**: Each audio type operates independently
- **Volume Control**: Separate volume management for each context

## Troubleshooting

### Music Not Playing (Mobile)
1. Check if the music URL is accessible
2. Verify the audio file format is supported
3. Ensure the device volume is not muted
4. Check app permissions for audio playback
5. Make sure `expo-av` is properly installed

### Music Not Playing (Web)
1. **User Interaction**: Make sure to interact with the page first (click anywhere) - browser requirement
2. Check browser console for audio context errors
3. Verify the music URL is accessible and CORS-enabled
4. Ensure the browser supports Web Audio API
5. Try refreshing the page if audio context fails

### Boss Voice Effects Not Working
1. Check if the boss has a voice file assigned
2. Verify the audio file path is correct
3. Ensure the sound effect service is initialized
4. Check browser console for errors (web)
5. Try clicking the boss again

### Play Button Issues (Fixed)
1. **Issue**: Play button was triggering boss voices instead of background music
2. **Solution**: Separated audio contexts for background music and sound effects
3. **Result**: Play button now only controls background music

### Volume Issues
1. Make sure the device volume is turned up
2. Check if the app has audio permissions
3. Try restarting the app
4. On web, check if the audio context is active

### Performance Issues
1. Use compressed audio formats (MP3, AAC)
2. Keep file sizes reasonable (< 10MB recommended)
3. Consider using streaming URLs for large files
4. On web, ensure the audio file is properly cached

### Web-Specific Issues
1. **Audio Context Suspended**: Click anywhere on the page to resume
2. **CORS Errors**: Ensure your audio file allows cross-origin requests
3. **Browser Autoplay Policy**: User interaction is required to start audio
4. **Audio Format Support**: Use MP3 for maximum browser compatibility
5. **Multiple Audio Contexts**: System now uses separate contexts to prevent conflicts

## Recent Fixes

### Audio Context Separation (Latest)
- **Problem**: Background music and boss voices were interfering with each other
- **Solution**: Created separate audio services with independent contexts
- **Files Added**: `services/webSoundEffectService.ts`
- **Files Modified**: `services/soundEffectService.ts`
- **Result**: Clean separation between background music and sound effects

### Auto-Start Background Music
- **Feature**: Background music now starts automatically when app loads
- **Implementation**: Auto-play on component initialization
- **User Experience**: Immediate audio feedback without manual intervention

### Cross-Platform Compatibility
- **Mobile**: Uses `expo-av` with proper audio mode configuration
- **Web**: Uses Web Audio API with separate contexts
- **Fallbacks**: Graceful degradation when audio is not available

## Notes
- The current implementation uses local audio files for optimal performance
- The music will loop continuously during gameplay
- Volume settings are not persisted between app sessions
- Web audio requires user interaction to start (browser security policy)
- The system automatically handles platform differences
- Local audio files provide the best performance and reliability
- Boss voice effects are one-shot sounds that play when bosses are clicked
- Voice effects are preloaded for better performance
- Background music and sound effects use completely separate audio contexts
- No more conflicts between play button and boss voice effects 