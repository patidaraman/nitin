<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Astra
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?>
<?php astra_content_bottom(); ?>
	</div> <!-- ast-container -->
	</div><!-- #content -->
<?php
	astra_content_after();

	astra_footer_before();

	astra_footer();

	astra_footer_after();
?>
	</div><!-- #page -->
<?php
	astra_body_bottom();
	wp_footer();
?>

<!-- VAPI Assistant Voice Chat - Uses Your Exact Prompt -->
<div id="vapi-button-container" style="position: fixed; top: 50%; right: 30px; transform: translateY(-50%); z-index: 9999;">
    <button id="vapi-talk-btn" style="background: #667eea; color: white; border: none; padding: 15px 20px; border-radius: 25px; cursor: pointer; font-weight: bold;">
        🎙️ Talk to AI
    </button>
    <div id="vapi-status" style="margin-top: 10px; font-size: 12px; color: #666; display: none; background: white; padding: 8px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); max-width: 300px;">
        Loading...
    </div>
</div>

<script>
// VAPI Assistant Voice Chat - Uses Your Exact VAPI Prompt
(function() {
    console.log('🚀 VAPI Assistant Voice Chat - Using Your Exact Prompt');
    
    let recognition = null;
    let synthesis = window.speechSynthesis;
    let isCallActive = false;
    let isRecognitionActive = false;
    let isSpeaking = false;
    let lastTranscriptTime = 0;
    
    const btn = document.getElementById('vapi-talk-btn');
    const status = document.getElementById('vapi-status');
    
    // Initialize Speech Recognition with better timing
    function initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        } else {
            console.error('Speech recognition not supported');
            btn.textContent = '❌ Not Supported';
            btn.disabled = true;
            return false;
        }
        
        recognition.continuous = true; // Keep listening
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            isRecognitionActive = true;
            if (!isSpeaking) {
                status.textContent = '🎤 Listening...';
            }
        };
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            
            // Only process if we have a final transcript and enough time has passed
            if (finalTranscript.trim() && !isSpeaking) {
                const now = Date.now();
                if (now - lastTranscriptTime > 2000) { // Wait 2 seconds between processing
                    console.log('📝 User said:', finalTranscript);
                    lastTranscriptTime = now;
                    sendToVAPIAssistant(finalTranscript.trim());
                }
            }
            
            // Show interim results
            if (interimTranscript.trim() && !isSpeaking) {
                status.textContent = `🎤 Hearing: "${interimTranscript.trim()}"`;
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            if (event.error === 'no-speech') {
                if (!isSpeaking) {
                    status.textContent = '🎤 Listening... (speak now)';
                }
                // Don't restart immediately, let it continue
            } else if (event.error === 'network') {
                status.textContent = '🌐 Network error. Please check connection.';
            } else if (event.error === 'not-allowed') {
                status.textContent = '🎤 Microphone access denied.';
                alert('Please allow microphone access to use voice chat.');
            }
        };
        
        recognition.onend = () => {
            console.log('🎤 Speech recognition ended');
            isRecognitionActive = false;
            
            // Only restart if call is active and not speaking
            if (isCallActive && !isSpeaking) {
                setTimeout(() => {
                    if (isCallActive && !isRecognitionActive && !isSpeaking) {
                        startListening();
                    }
                }, 1000); // Wait 1 second before restarting
            }
        };
        
        return true;
    }
    
    // Safe function to start listening
    function startListening() {
        if (isCallActive && !isRecognitionActive && !isSpeaking) {
            try {
                recognition.start();
            } catch (error) {
                console.log('Recognition start failed:', error);
                isRecognitionActive = false;
                if (isCallActive && !isSpeaking) {
                    setTimeout(startListening, 2000);
                }
            }
        }
    }
    
    // Send to your VAPI Assistant backend - NEW ENDPOINT
    async function sendToVAPIAssistant(text) {
        try {
            // Stop listening while processing
            if (recognition && isRecognitionActive) {
                recognition.stop();
            }
            
            status.textContent = '🤔 AI is thinking...';
            
            console.log('📤 Sending to VAPI Assistant:', text);
            
            // Use the NEW VAPI Assistant endpoint with your exact prompt
            const response = await fetch('https://hostig.netlify.app/api/v1/vapi/assistant-chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    userId: 'web-voice-user',
                    source: 'voice-chat',
                    assistantId: 'afb4afd9-f88a-4976-a8ba-091174288ebe'
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('📥 VAPI Assistant response:', result);
            
            // Use the response from your VAPI assistant
            if (result.response) {
                speakText(result.response);
            } else if (result.message) {
                speakText(result.message);
            } else {
                speakText('Main samajh nahi paayi, kya aap phir se bata sakte hain?');
                // Restart listening immediately if no response
                setTimeout(startListening, 1000);
            }
            
        } catch (error) {
            console.error('❌ VAPI Assistant request failed:', error);
            speakText('Main samajh nahi paayi, kya aap phir se bata sakte hain? I had trouble processing that.');
        }
    }
    
    // Text-to-speech with better timing
    function speakText(text) {
        isSpeaking = true;
        status.textContent = '🗣️ AI is speaking...';
        
        // Stop recognition while speaking
        if (recognition && isRecognitionActive) {
            recognition.stop();
        }
        
        synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85; // Match your VAPI assistant speed
        utterance.pitch = 1.1; // Female voice pitch
        utterance.volume = 1.0;
        
        // Use best available female voice (matching your VAPI assistant)
        const voices = synthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            (voice.name.includes('Karen') || 
             voice.name.includes('Samantha') || 
             voice.name.includes('Female')) &&
            voice.lang.startsWith('en')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
            console.log('🔊 Using voice:', femaleVoice.name);
        }
        
        utterance.onstart = () => {
            console.log('🗣️ AI started speaking');
            isSpeaking = true;
        };
        
        utterance.onend = () => {
            console.log('🗣️ AI finished speaking');
            isSpeaking = false;
            
            if (isCallActive) {
                status.textContent = '🎤 Your turn to speak...';
                // Wait 2 seconds after AI finishes before starting to listen
                setTimeout(() => {
                    if (isCallActive && !isSpeaking) {
                        startListening();
                    }
                }, 2000);
            }
        };
        
        synthesis.speak(utterance);
    }
    
    // Initialize and setup button
    if (initializeSpeechRecognition()) {
        btn.textContent = '🎙️ Talk to AI';
        btn.disabled = false;
        
        btn.addEventListener('click', async function() {
            if (!isCallActive) {
                // Start voice chat
                try {
                    btn.textContent = 'Connecting...';
                    btn.disabled = true;
                    status.style.display = 'block';
                    status.textContent = '🔄 Starting voice chat...';
                    
                    // Request microphone permission
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                    console.log('✅ Microphone access granted');
                    
                    isCallActive = true;
                    isSpeaking = false;
                    lastTranscriptTime = 0;
                    
                    btn.textContent = '🔴 End Chat';
                    btn.disabled = false;
                    
                    // Start with AI greeting using your VAPI assistant's first message
                    setTimeout(() => {
                        speakText("Hello! Namaste! I'm from Adlync Solutions. How can I help you today?");
                    }, 500);
                    
                } catch (error) {
                    console.error('❌ Failed to start voice chat:', error);
                    
                    let errorMsg = 'Failed to start voice chat.\n\n';
                    
                    if (error.name === 'NotAllowedError') {
                        errorMsg += '🎤 Please allow microphone access and try again.';
                    } else if (error.name === 'NotFoundError') {
                        errorMsg += '🎤 No microphone detected. Please check your device.';
                    } else {
                        errorMsg += '❌ Error: ' + error.message;
                    }
                    
                    alert(errorMsg);
                    btn.textContent = '🎙️ Talk to AI';
                    btn.disabled = false;
                    status.style.display = 'none';
                }
            } else {
                // End voice chat
                isCallActive = false;
                isRecognitionActive = false;
                isSpeaking = false;
                
                if (recognition) {
                    recognition.stop();
                }
                synthesis.cancel();
                
                btn.textContent = '🎙️ Talk to AI';
                btn.disabled = false;
                status.style.display = 'none';
                
                console.log('📞 Voice chat ended');
                
                // End with your VAPI assistant's end message
                setTimeout(() => {
                    speakText("Thank you! Aapka din bahut hi accha rahe!");
                }, 300);
            }
        });
        
        // Load voices when available
        synthesis.onvoiceschanged = () => {
            console.log('🔊 Voices loaded:', synthesis.getVoices().length);
        };
        
        console.log('✅ VAPI Assistant voice chat ready with your exact prompt!');
    }
})();
</script>

</body>
</html>