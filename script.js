// --- REGISTRACE SERVICE WORKERU PRO PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker úspěšně registrován!', reg.scope))
            .catch(err => console.log('Registrace Service Workera selhala:', err));
    });
}

// Rozšířený základní stav o video (Výchozí je story1, bg1.jpg a video1.mp4)
let gameData = { state: {}, contacts: {}, chapter: "story/story1.js", background: "image/bg1.jpg", video: "video/video1.mp4", darkMode: true };
const myName = "Já";
let activeContactId = null;

let typingTimeout = null;
let isTyping = false;
let currentPendingMessage = null;

const contactsContainer = document.getElementById("contacts-container");
const viewContacts = document.getElementById("view-contacts");
const viewChat = document.getElementById("view-chat");
const chatBox = document.getElementById("chat-box");
const controls = document.getElementById("controls");

function loadStoryScript(scriptName, callback) {
    const oldScript = document.getElementById('current-story-script');
    if (oldScript) oldScript.remove(); 

    const script = document.createElement('script');
    script.id = 'current-story-script';
    script.src = scriptName;
    script.onload = callback;
    document.head.appendChild(script);
}

function initGameData() {
    if (typeof window.storyData === 'undefined') return;

    Object.keys(storyData.contacts).forEach(id => {
        const c = storyData.contacts[id];
        if (!gameData.contacts[id]) {
            gameData.contacts[id] = {
                id: id, name: c.name, color: c.color,
                lastMessage: "Zatím žádné zprávy", hasUnread: false, currentScene: null, currentMessageIndex: 0, history: []
            };
        }
    });

    const sceneKeys = Object.keys(storyData.scenes);
    if (sceneKeys.length > 0) {
        // OPRAVA STARTU: Nejdřív hledáme explicitní startovací scénu z editoru
        let startSceneId = storyData.startScene;
        // Pokud z nějakého důvodu neexistuje, použijeme první jako pojistku
        if (!startSceneId || !storyData.scenes[startSceneId]) {
            startSceneId = sceneKeys[0];
        }

        const startContactId = storyData.scenes[startSceneId].contactId;
        
        if (gameData.contacts[startContactId] && !gameData.contacts[startContactId].currentScene) {
            gameData.contacts[startContactId].currentScene = startSceneId;
            gameData.contacts[startContactId].hasUnread = true;
            gameData.contacts[startContactId].lastMessage = "Nová zpráva!";
        }
    }
}
function saveGame() {
    localStorage.setItem("messengerGameSaveV3", JSON.stringify(gameData));
}

// ZDE ZAČÍNÁ NOVÝ BLOK K VLOŽENÍ
window.onload = () => {
    const saved = localStorage.getItem("messengerGameSaveV3");
    if (saved) {
        gameData = JSON.parse(saved);
        if (!gameData.chapter) gameData.chapter = "story/story1.js";
        if (!gameData.background) gameData.background = "bg1.jpg";
        if (!gameData.video) gameData.video = "video/video1.mp4"; 
    }

    // Aplikování uloženého tmavého režimu po načtení hry
    if (gameData.darkMode) {
        document.getElementById('phone-container').classList.add('dark-theme');
        const dmIcon = document.getElementById('dark-mode-icon');
        if (dmIcon) dmIcon.classList.replace('fa-moon', 'fa-sun');
    }

    // Nastavení statického pozadí
    document.querySelector('.background-scenerie').style.backgroundImage = `url('${gameData.background}')`;
    
    // Nastavení video pozadí 
    const videoEl = document.getElementById('bg-video');
    if (videoEl) {
        if (gameData.video) {
            videoEl.src = gameData.video;
            videoEl.poster = gameData.background; 
        } else {
            videoEl.removeAttribute('src');
            videoEl.load();
        }
    }

    loadStoryScript(gameData.chapter, () => {
        if (!saved) {
            initGameData(); 
        } else {
            if (typeof window.storyData !== 'undefined') {
                Object.keys(storyData.contacts).forEach(id => {
                    if (!gameData.contacts[id]) {
                        const c = storyData.contacts[id];
                        gameData.contacts[id] = {
                            id: id, name: c.name, color: c.color,
                            lastMessage: "Zatím žádné zprávy", hasUnread: false, currentScene: null, currentMessageIndex: 0, history: []
                        };
                    }
                });
            }
        }
       goHome();
    });
};



function resetGame() {
    if (confirm("Opravdu smazat celý postup hrou?")) {
        localStorage.removeItem("messengerGameSaveV3");
        location.reload();
    }
}

function renderContactsList() {
    contactsContainer.innerHTML = "";
    Object.values(gameData.contacts).forEach(c => {
        if (!c.currentScene && c.history.length === 0) return;

        const item = document.createElement("div");
        item.className = `contact-item ${c.hasUnread ? 'unread' : ''}`;
        item.onclick = () => openChatScreen(c.id);
        item.innerHTML = `
            <div class="avatar" style="background-color: ${c.color}">${c.name.charAt(0)}</div>
            <div class="contact-info">
                <div class="contact-name">${c.name}</div>
                <div class="contact-preview">${c.lastMessage}</div>
            </div>
            ${c.hasUnread ? '<div class="unread-dot"></div>' : ''}
        `;
        contactsContainer.appendChild(item);
    });
}

function openContactsScreen() {
    if (isTyping) clearTyping();
    if (activeContactId) {
        gameData.contacts[activeContactId].hasUnread = false;
        saveGame();
    }
    activeContactId = null;
    viewChat.style.display = "none";
    viewContacts.style.display = "flex";
    renderContactsList();
}

function openChatScreen(contactId) {
    activeContactId = contactId;
    const c = gameData.contacts[contactId];
    c.hasUnread = false;
    saveGame();

    document.getElementById("chat-header-name").innerText = c.name;
    const avatar = document.getElementById("chat-header-avatar");
    avatar.innerText = c.name.charAt(0);
    avatar.style.backgroundColor = c.color;

    viewContacts.style.display = "none";
    viewChat.style.display = "flex";
    chatBox.innerHTML = "";
    controls.innerHTML = "";

    // PŘIDÁNO: "true" říká funkci drawBubble, aby zatím neanimovala a nerolovala
    c.history.forEach(msg => drawBubble(msg.sender, msg.text, true)); 
    
    // Otevření chatu hodí hráče okamžitě bez animace úplně dolů
    chatBox.scrollTop = chatBox.scrollHeight; 

    processSceneEngine();
}

// --- CHYTRÉ ROLOVÁNÍ ---
function scrollToBottom(force = false) {
    // Necháme prohlížeč 100 milisekund "vydechnout", aby stihl vykreslit nová tlačítka odpovědí
    setTimeout(() => {
        // Zjistíme, jestli je hráč aktuálně blízko konce chatu (tolerance cca 150px)
        const isNearBottom = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 150;

        // Pokud je dole (nebo pokud rolování vynutíme, např. když hráč sám odešle zprávu)
        if (isNearBottom || force) {
            chatBox.scrollTo({
                top: chatBox.scrollHeight,
                behavior: 'smooth' // Nádherný plynulý posun dolů
            });
        }
    }, 100); // 100 milisekund je pro oko nepostřehnutelné, ale pro kód to vyřeší problém
}

function drawBubble(sender, text, skipScroll = false) {
    const row = document.createElement("div");
    const isMe = (sender === myName);
    row.className = `message-row ${isMe ? 'msg-me-row' : 'msg-npc-row'}`;

    if (sender === "Systém") {
        row.style.alignSelf = "center"; row.style.maxWidth = "100%";
        row.innerHTML = `<div style="font-size:12px; color:#888; margin:5px 0; font-weight:bold;">${text}</div>`;
    } else {
        let avatarHtml = "";
        if (!isMe) {
            const c = gameData.contacts[activeContactId];
            avatarHtml = `<div class="avatar chat-avatar" style="background-color: ${c.color}">${c.name.charAt(0)}</div>`;
        }
        row.innerHTML = `${avatarHtml}<div class="message-bubble ${isMe ? 'msg-me' : 'msg-npc'}">${text}</div>`;
    }
    
    chatBox.appendChild(row);
    
    // Pokud nenačítáme historii, odrolujeme dolů
    // Parametr "isMe" vynutí odrolování (pokud hráč napíše zprávu, vždy ho hodíme dolů)
    if (!skipScroll) {
        scrollToBottom(isMe);
    }
}

function saveAndAppendMessage(sender, text) {
    gameData.contacts[activeContactId].history.push({ sender, text });
    gameData.contacts[activeContactId].lastMessage = sender === myName ? `Ty: ${text}` : text;
    drawBubble(sender, text);
    saveGame();
}

function processSceneEngine() {
    controls.innerHTML = "";
    const c = gameData.contacts[activeContactId];

    if (typeof window.storyData === 'undefined') {
        drawBubble("Systém", "CHYBA: Soubor s příběhem se nenačetl!"); return;
    }

    if (!c.currentScene) return;

    const scene = window.storyData.scenes[c.currentScene];
    if (!scene) {
        drawBubble("Systém", `CHYBA: Scéna '${c.currentScene}' neexistuje!`); return;
    }

    if (c.currentMessageIndex < scene.messages.length) {
        currentPendingMessage = scene.messages[c.currentMessageIndex];
        
        let actualSender = c.name;
        if (currentPendingMessage.type === "player") actualSender = myName;
        if (currentPendingMessage.type === "system") actualSender = "Systém";

        if (currentPendingMessage.type === "player" || currentPendingMessage.type === "system") {
            saveAndAppendMessage(actualSender, currentPendingMessage.text);
            c.currentMessageIndex++;
            saveGame();
            setTimeout(processSceneEngine, 400);
            return;
        }

        isTyping = true;
        const typingDiv = document.createElement("div");
        typingDiv.id = "typing-indicator-row";
        typingDiv.className = "message-row msg-npc-row";
        typingDiv.innerHTML = `
            <div class="avatar chat-avatar" style="background-color: ${c.color}">${c.name.charAt(0)}</div>
            <div class="typing-indicator"><span></span><span></span><span></span></div>
        `;
        chatBox.appendChild(typingDiv);
        scrollToBottom();

        let delay = Math.max(1000, Math.min(3000, currentPendingMessage.text.length * 40));
        typingTimeout = setTimeout(() => { executePendingMessage(actualSender); }, delay);
} else if (scene.choices && scene.choices.length > 0) {
        
        let currentChoiceIndex = 0;

        // Hlavní obal
        const carouselWrapper = document.createElement("div");
        carouselWrapper.className = "choice-carousel-vertical";

        // Kontejner pro čistý text (bude mít 100% šířky)
        const contentDiv = document.createElement("div");
        contentDiv.className = "carousel-content-vertical";

        // Spodní navigační panel (Šipky vlevo, Odeslat vpravo)
        const navDiv = document.createElement("div");
        navDiv.className = "carousel-navigation";

        // Skupina pro přehazování šipek
        const arrowsGroup = document.createElement("div");
        arrowsGroup.className = "carousel-arrows-group";

        const btnLeft = document.createElement("button");
        btnLeft.className = "carousel-arrow left-arrow";
        btnLeft.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

        const indicatorDiv = document.createElement("div");
        indicatorDiv.className = "choice-indicator";

        const btnRight = document.createElement("button");
        btnRight.className = "carousel-arrow right-arrow";
        btnRight.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        // Samostatné Tlačítko ODESLAT
        const sendBtn = document.createElement("button");
        sendBtn.className = "choice-send-icon";
        sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        sendBtn.title = "Odeslat odpověď";

        // Sestavení prvků do sebe
        arrowsGroup.appendChild(btnLeft);
        arrowsGroup.appendChild(indicatorDiv);
        arrowsGroup.appendChild(btnRight);

        navDiv.appendChild(arrowsGroup);
        navDiv.appendChild(sendBtn);

        carouselWrapper.appendChild(contentDiv);
        carouselWrapper.appendChild(navDiv);
        controls.appendChild(carouselWrapper);

        // Skryjeme šipky úplně, pokud je na výběr jen jedna možnost,
        // a zarovnáme tlačítko odeslat doprava.
        if (scene.choices.length === 1) {
            arrowsGroup.style.display = "none";
            navDiv.style.justifyContent = "flex-end";
        }

        // Funkce pro aktualizaci textu (text teď zabírá celou šířku nahoře)
        function updateCarousel(direction) {
            contentDiv.innerHTML = ""; 
            const choice = scene.choices[currentChoiceIndex];
            
            indicatorDiv.innerText = `${currentChoiceIndex + 1}/${scene.choices.length}`;
            
            const textDiv = document.createElement("div");
            textDiv.className = `choice-text-full slide-in-${direction}`;
            textDiv.innerHTML = choice.text;
            
            contentDiv.appendChild(textDiv);

            btnLeft.disabled = currentChoiceIndex === 0;
            btnRight.disabled = currentChoiceIndex === scene.choices.length - 1;
            
            btnLeft.style.opacity = btnLeft.disabled ? "0.3" : "1";
            btnRight.style.opacity = btnRight.disabled ? "0.3" : "1";
            btnLeft.style.cursor = btnLeft.disabled ? "default" : "pointer";
            btnRight.style.cursor = btnRight.disabled ? "default" : "pointer";
        }

        // --- EXEKUCE VOLBY JE NYNÍ NAPOJENÁ NA TLAČÍTKO "ODESLAT" DOLE VLIŠTĚ ---
        sendBtn.onclick = () => {
            const choice = scene.choices[currentChoiceIndex];

            if (choice.changeChapter) {
                saveAndAppendMessage(myName, choice.text);
                
                // --- CHYTRÉ DOPLNĚNÍ SLOŽEK ---
                // Pokud z editoru přijde jen "story2.js", skript automaticky přidá "story/"
                let newChapter = choice.changeChapter.script;
                if (!newChapter.startsWith("story/")) newChapter = "story/" + newChapter;
                
                let newBg = choice.changeChapter.bg;
                if (!newBg.startsWith("image/")) newBg = "image/" + newBg;
                
                let newVid = choice.changeChapter.video || "";
                if (newVid && !newVid.startsWith("video/")) newVid = "video/" + newVid;

                gameData.chapter = newChapter;
                gameData.background = newBg;
                gameData.video = newVid; 
                // ------------------------------
                
                Object.keys(gameData.contacts).forEach(id => {
                    gameData.contacts[id].currentScene = null;
                    gameData.contacts[id].currentMessageIndex = 0;
                });
                
                saveGame();
                
                document.querySelector('.background-scenerie').style.backgroundImage = `url('${gameData.background}')`;
                
                const videoEl = document.getElementById('bg-video');
                if (videoEl) {
                    if (gameData.video) {
                        videoEl.src = gameData.video;
                        videoEl.poster = gameData.background;
                        videoEl.load();
                        videoEl.play().catch(e => console.log("Video nelze automaticky přehrát:", e));
                    } else {
                        videoEl.pause();
                        videoEl.removeAttribute('src');
                        videoEl.load();
                    }
                }
                
                viewChat.style.display = "none";
                viewContacts.style.display = "flex";
                contactsContainer.innerHTML = "<div style='padding:20px; text-align:center;'>Načítání další kapitoly...</div>";
                
                loadStoryScript(gameData.chapter, () => {
                    initGameData(); 
                    renderContactsList();
                    saveGame();
                });
                return;
            }

            if (choice.unlocks) { handleUnlock(choice.unlocks); }

            if (choice.next === "BACK_TO_CONTACTS") {
                openContactsScreen();
                return;
            }

            const nextScene = window.storyData.scenes[choice.next];
            if (nextScene && nextScene.contactId !== activeContactId) {
                saveAndAppendMessage(myName, choice.text);
                handleUnlock(choice.next);
                c.currentScene = null; 
                saveGame();
                openContactsScreen();
                return;
            }

            saveAndAppendMessage(myName, choice.text);
            c.currentScene = choice.next;
            c.currentMessageIndex = 0;
            saveGame();
            processSceneEngine();
        };

        btnLeft.onclick = () => {
            if (currentChoiceIndex > 0) {
                currentChoiceIndex--;
                updateCarousel("left");
            }
        };

        btnRight.onclick = () => {
            if (currentChoiceIndex < scene.choices.length - 1) {
                currentChoiceIndex++;
                updateCarousel("right");
            }
        };

        updateCarousel("none");
    }
}

function handleUnlock(targetSceneId) {
    const targetScene = window.storyData.scenes[targetSceneId];
    if (!targetScene) return;

    const contactId = targetScene.contactId;
    if (gameData.contacts[contactId]) {
        gameData.contacts[contactId].currentScene = targetSceneId;
        gameData.contacts[contactId].currentMessageIndex = 0;
        gameData.contacts[contactId].hasUnread = true;
        gameData.contacts[contactId].lastMessage = "Máš novou zprávu!";
    }
}

function executePendingMessage(senderName) {
    if (!isTyping) return;
    clearTypingIndicator();
    saveAndAppendMessage(senderName, currentPendingMessage.text);
    gameData.contacts[activeContactId].currentMessageIndex++;
    saveGame();
    processSceneEngine();
}

function clearTypingIndicator() {
    const ind = document.getElementById("typing-indicator-row");
    if (ind) ind.remove();
    isTyping = false;
}

function clearTyping() {
    clearTimeout(typingTimeout);
    clearTypingIndicator();
}

function skipTyping() {
    if (isTyping) {
        clearTimeout(typingTimeout);
        executePendingMessage(gameData.contacts[activeContactId].name);
    }
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && viewChat.style.display === "flex") {
        e.preventDefault(); 
        skipTyping();
    }
});


// ==========================================================================
// 5. LOKÁLNÍ AUDIO ENGINE (HUDBA + AMBIENTNÍ ZVUKY)
// ==========================================================================

// 1. Nastavení playlistu hudby (můžeš sem přidat kolik skladeb chceš)
const playlist = [
    'audio/song1.mp3',
    'audio/song2.mp3',
    'audio/song3.mp3'
];
let currentSongIndex = 0;

// 2. Vytvoření audio přehrávačů pro obě stopy
const musicPlayer = new Audio(playlist[currentSongIndex]);
const ambientPlayer = new Audio('audio/vanice.mp3');

// 3. Nastavení smyček a hlasitosti
ambientPlayer.loop = true;     // Vánice bude hrát pořád dokola
ambientPlayer.volume = 0.4;    // Hlasitost vánice (0.4 = 40%)
musicPlayer.volume = 0.7;      // Hlasitost hudby (0.7 = 70%)

// Když aktuální skladba skončí, automaticky se pustí další
musicPlayer.addEventListener('ended', nextSong);

let audioInitialized = false;

// Funkce pro prvotní spuštění obou stop najednou
function initAudio() {
    if (!audioInitialized) {
        musicPlayer.play().catch(e => console.log("Čekám na interakci uživatele"));
        ambientPlayer.play().catch(e => console.log("Čekám na interakci uživatele"));
        audioInitialized = true;
        
        const musicIcon = document.getElementById("music-icon");
        if (musicIcon) musicIcon.className = "fa-solid fa-pause";
    }
}

// Prohlížeče blokují zvuk, dokud uživatel neklikne na stránku. 
// Tímto zachytíme úplně první kliknutí kamkoliv (i na tlačítko Zahájit hru) a spustíme audio.
document.addEventListener('click', initAudio, { once: true });

// Funkce pro přepnutí na další skladbu
function nextSong() {
    currentSongIndex++;
    
    // Pokud jsme na konci playlistu, jedeme zase od první
    if (currentSongIndex >= playlist.length) {
        currentSongIndex = 0; 
    }
    
    musicPlayer.src = playlist[currentSongIndex];
    musicPlayer.play();
    
    // Ujistíme se, že ikonka ukazuje pauzu, protože hudba teď hraje
    const musicIcon = document.getElementById("music-icon");
    if (musicIcon) musicIcon.className = "fa-solid fa-pause";
}

// Funkce pro hlavní tlačítko (Pozastaví nebo spustí OBA zvuky)
function toggleMusic() {
    const musicIcon = document.getElementById("music-icon");

    if (musicPlayer.paused) {
        musicPlayer.play();
        ambientPlayer.play();
        if (musicIcon) musicIcon.className = "fa-solid fa-pause";
    } else {
        musicPlayer.pause();
        ambientPlayer.pause();
        if (musicIcon) musicIcon.className = "fa-solid fa-play";
    }
}



// ==========================================================================
// 6. POHYB RUKY A MOBILU PO KLIKNUTÍ DO PROSTORU
// ==========================================================================
document.addEventListener('click', function(e) {
    if (window.innerWidth < 1025) return;

    // Vylepšená detekce: composedPath() zjistí, jestli bylo kliknuto uvnitř mobilu,
    // i když se konkrétní prvek (např. fotka na instáči) hned po kliknutí přepsal.
    const path = e.composedPath();
    const phoneContainer = document.getElementById('phone-container');

    // Pokud kliknutí proběhlo kdekoliv uvnitř telefonu, ignoruj pohyb
    if (path.includes(phoneContainer)) return;
    
    // Pojistka pro případná samostatná tlačítka mimo telefon
    if (e.target.closest('button') || e.target.closest('a')) return;

    const x = e.clientX;
    const y = e.clientY;

    document.documentElement.style.setProperty('--pov-x', x + 'px');
    document.documentElement.style.setProperty('--pov-y', y + 'px');
});


// --- TMAVÝ REŽIM ---
function toggleDarkMode() {
    const phone = document.getElementById('phone-container');
    const icon = document.getElementById('dark-mode-icon');
    
    // Přidá nebo odebere třídu
    phone.classList.toggle('dark-theme');
    
    // Změní ikonku a uloží nastavení
    if (phone.classList.contains('dark-theme')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        gameData.darkMode = true;
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        gameData.darkMode = false;
    }
    
    // Okamžité uložení preference
    saveGame();
}


// --- FALEŠNÝ ČAS V MOBILU ---
let phoneHours = 19;
let phoneMinutes = 41;

function updateFakeTime() {
    phoneMinutes++;
    if (phoneMinutes >= 60) {
        phoneMinutes = 0;
        phoneHours = (phoneHours + 1) % 24;
    }
    document.getElementById('phone-time').textContent = 
        `${phoneHours.toString().padStart(2, '0')}:${phoneMinutes.toString().padStart(2, '0')}`;
}
setInterval(updateFakeTime, 6000); // Aktualizace každou minutu herního času


// ==========================================================================
// 9. SPRÁVA APLIKACÍ A PLOCHY (OS)
// ==========================================================================

function goHome() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    // ZMĚNA: block -> flex
    document.getElementById('view-home').style.display = 'flex';
}

function openApp(appId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.style.display = 'none');
    
    // ZMĚNA: flex zůstává, ale kontrola pro konzistenci
    document.getElementById(appId).style.display = 'flex';
    
    if (appId === 'view-contacts') {
        renderContactsList();
    } else if (appId === 'view-instagram') {
        renderInstaProfiles();
    }
}


// ==========================================================================
// 10. INSTAGRAM APLIKACE (POUZE LOGIKA - DATA JSOU V SOUBORU S PŘÍBĚHEM)
// ==========================================================================

// Pomocná funkce, která bezpečně vytáhne data z aktuálně načteného příběhu
function getInstagramData() {
    if (window.storyData && window.storyData.instagram) {
        return window.storyData.instagram;
    }
    console.error("CHYBA: Data pro Instagram nebyla v souboru s příběhem nalezena!");
    return {}; // Vrátí prázdný objekt jako pojistku proti spadnutí hry
}

function renderInstaProfiles() {
    const content = document.getElementById('insta-content');
    const backBtn = document.getElementById('insta-back-btn');
    backBtn.onclick = goHome; 
    backBtn.innerHTML = '↩<i class="fa-brands fa-instagram"></i>';
    
    const instaData = getInstagramData();
    let html = "";
    
    Object.keys(instaData).forEach(key => {
        const p = instaData[key];
        html += `
            <div class="insta-profile-card" onclick="openInstaProfile('${key}')">
                <div class="insta-avatar-wrapper">
                    <div class="insta-avatar-inner" style="background-image: url('image/${p.avatar}'); background-size: cover; background-position: center;"></div>
                </div>
                <div>
                    <div class="insta-name">${p.name}</div>
                    <div class="insta-bio">${p.bio}</div>
                </div>
            </div>
        `;
    });
    content.innerHTML = html;
}

function openInstaProfile(profileKey) {
    const instaData = getInstagramData();
    const p = instaData[profileKey];
    if (!p) return;

    const content = document.getElementById('insta-content');
    const backBtn = document.getElementById('insta-back-btn');
    
    backBtn.onclick = renderInstaProfiles;
    backBtn.innerHTML = '↩<i class="fa-brands fa-instagram"></i>';

    let html = `
        <div class="insta-profile-top">
            <div class="insta-avatar-wrapper" style="width: 75px; height: 75px;">
                <div class="insta-avatar-inner" style="background-image: url('image/${p.avatar}'); background-size: cover; background-position: center;"></div>
            </div>
            <div class="insta-stats">
                <div>
                    <div class="insta-stats-number">${p.posts.length}</div>
                    <div class="insta-stats-label">Příspěvky</div>
                </div>
                <div>
                    <div class="insta-stats-number">${p.followers}</div>
                    <div class="insta-stats-label">Sledující</div>
                </div>
                <div>
                    <div class="insta-stats-number">${p.following}</div>
                    <div class="insta-stats-label">Sleduji</div>
                </div>
            </div>
        </div>
        <div style="padding: 10px 15px; background: #fff; border-bottom: 1px solid #efefef;" class="${document.getElementById('phone-container').classList.contains('dark-theme') ? 'dark-bio' : ''}">
            <div style="font-weight: 700; margin-bottom: 2px;">${p.name}</div>
            <div style="font-size: 13px;">${p.bio}</div>
        </div>
        <div class="insta-grid">
    `;

    p.posts.forEach((post, index) => {
        html += `
            <div class="insta-grid-item" onclick="openInstaPost('${profileKey}', ${index})">
                <img src="image/${post.img}" alt="Fotka">
            </div>
        `;
    });

    html += `</div>`;
    
    if(document.getElementById('phone-container').classList.contains('dark-theme')) {
       html = html.replace('background: #fff;', 'background: #18181b; color: #f4f4f5; border-color: #27272a;');
    }
    
    content.innerHTML = html;
}

function openInstaPost(profileKey, postIndex) {
    const instaData = getInstagramData();
    const p = instaData[profileKey];
    if (!p) return;
    
    const post = p.posts[postIndex];
    const content = document.getElementById('insta-content');
    const backBtn = document.getElementById('insta-back-btn');

    backBtn.onclick = () => openInstaProfile(profileKey);
    backBtn.innerHTML = '↩<i class="fa-brands fa-instagram"></i>';

    let html = `
        <div class="insta-post">
            <div class="insta-post-header">
                <div class="insta-avatar-wrapper" style="width: 36px; height: 36px; margin-right: 10px; padding: 1px;">
                    <div class="insta-avatar-inner" style="background-image: url('${p.avatar}'); background-size: cover; background-position: center; border-width: 1px;"></div>
                </div>
                <div class="insta-name" style="margin-bottom: 0;">${p.name}</div>
            </div>
            
            <img src="image/${post.img}" class="insta-post-img" alt="Fotka">
            
            <div class="insta-action-bar">
                <i class="fa-regular fa-heart"></i>
                <i class="fa-regular fa-comment"></i>
                <i class="fa-regular fa-paper-plane"></i>
                 <div class="insta-likes">
                To se líbí ${post.likes} lidem
            </div>
            </div>
            
            <div class="insta-post-desc">
                ${post.desc}
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

    function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Chyba při pokusu o fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}