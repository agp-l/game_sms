

        function escapeHtml(unsafe) {
            if (!unsafe) return "";
            return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        }

        let storyData = {
            startScene: "scena_1", // Nové pole pro uchování počáteční scény
            contacts: { "petr": { name: "Petr", color: "#ff4757" } },
            scenes: { "scena_1": { contactId: "petr", editor: { x: 200, y: 150 }, messages: [], choices: [] } }
        };

        const canvas = document.getElementById("canvas");
        const svgCanvas = document.getElementById("lines-svg");
        const nodesContainer = document.getElementById("nodes-container");
        const container = document.getElementById("canvas-container");

        let zoomLevel = 1;
        let selectedNodes = new Set();
        let isBoxSelecting = false;
        let boxStartX = 0, boxStartY = 0;

        let isDraggingNode = false;
        let dragOffsets = {};
        let isDraggingWire = false;
        let wireSource = null;
        let tempWirePath = null;
        let wireTargetNodeId = null;

        function setZoom(newZoom) {
            zoomLevel = Math.max(0.2, Math.min(newZoom, 2));
            document.getElementById('zoom-display').innerText = Math.round(zoomLevel * 100) + '%';
            canvas.style.transform = `scale(${zoomLevel})`;
            drawAllWires();
        }

        function updateSelectionVisuals() {
            document.querySelectorAll('.node').forEach(node => node.classList.remove('selected'));
            selectedNodes.forEach(nodeId => {
                const node = document.getElementById(`node-${nodeId}`);
                if (node) node.classList.add('selected');
            });
        }

        function renderEditor() {
            nodesContainer.innerHTML = "";
            let contactsOptions = Object.keys(storyData.contacts).map(id => `<option value="${id}">${escapeHtml(storyData.contacts[id].name)}</option>`).join("");
            
            // Nastavení defaultní start scény pokud chybí
            if(!storyData.startScene && Object.keys(storyData.scenes).length > 0) {
                storyData.startScene = Object.keys(storyData.scenes)[0];
            }

            Object.keys(storyData.scenes).forEach(id => {
                const scene = storyData.scenes[id];
                const nodeDiv = document.createElement("div");
                const isStart = (storyData.startScene === id);
                
                nodeDiv.className = `node ${isStart ? 'is-start' : ''}`;
                nodeDiv.id = `node-${id}`;
                nodeDiv.style.left = scene.editor.x + "px";
                nodeDiv.style.top = scene.editor.y + "px";

                nodeDiv.onmousedown = (e) => startNodeDrag(e, id);
                nodeDiv.onmouseenter = () => { if (isDraggingWire) { wireTargetNodeId = id; nodeDiv.classList.add("wire-target"); } };
                nodeDiv.onmouseleave = () => { wireTargetNodeId = null; nodeDiv.classList.remove("wire-target"); };

                // Tlačítko START
                const startBtnHtml = `
                    <button class="btn-blue" onclick="setStartScene('${id}')" title="Nastavit jako počáteční zprávu po načtení hry" 
                        style="padding: 2px 6px; font-size: 10px; ${isStart ? 'background: #f1c40f; color: #000;' : ''}">
                        <i class="fa-solid fa-flag"></i> ${isStart ? 'START' : 'Start'}
                    </button>
                `;

                let html = `
                    <div class="node-drag-handle">
                        ${startBtnHtml}
                        <input type="text" value="${escapeHtml(id)}" placeholder="ID Scény" style="font-weight:bold; margin: 0 5px;" onchange="renameScene('${id}', this.value)">
                        <button class="btn-del" onclick="deleteScene('${id}')" title="Smazat scénu"><i class="fa-solid fa-trash"></i></button>
                    </div>
                    <div class="node-body">
                        <select onchange="updateScene('${id}', 'contactId', this.value)" title="S kým si hráč píše">
                            ${contactsOptions.replace(`value="${scene.contactId}"`, `value="${scene.contactId}" selected`)}
                        </select>
                        <div class="section-title">Dialog (Zprávy)</div>
                        <div id="msgs-${id}">
                `;

                (scene.messages || []).forEach((msg, idx) => {
                    let typeHtml = `
                        <select onchange="updateMsg('${id}', ${idx}, 'type', this.value)">
                            <option value="npc" ${msg.type === 'npc' ? 'selected' : ''}>NPC</option>
                            <option value="player" ${msg.type === 'player' ? 'selected' : ''}>Hráč</option>
                            <option value="system" ${msg.type === 'system' ? 'selected' : ''}>Systém</option>
                        </select>
                    `;
                    html += `
                        <div class="msg-row">
                            ${typeHtml}
                            <textarea placeholder="Text zprávy..." oninput="updateMsg('${id}', ${idx}, 'text', this.value)">${escapeHtml(msg.text)}</textarea>
                            <button class="btn-del" onclick="deleteMsg('${id}', ${idx})" title="Smazat zprávu"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    `;
                });
                html += `</div><button onclick="addMsg('${id}')"><i class="fa-solid fa-plus"></i> Nová zpráva</button>`;

                html += `<div class="section-title" style="margin-top:10px;">Možnosti odpovědi (Větvení)</div><div id="choices-${id}">`;
                (scene.choices || []).forEach((choice, idx) => {
                    let targetText = choice.next ? `Vede do: ${choice.next}` : "Zatáhni za tečku 👉";
                    if (choice.next === "BACK_TO_CONTACTS") targetText = "Vrátí do kontaktů";

                    let unlockHtml = "";
                    if (choice.unlocks !== undefined) {
                        let sceneOptions = `<option value="">-- Vyber scénu --</option>` +
                            Object.keys(storyData.scenes).map(s => `<option value="${s}" ${choice.unlocks === s ? 'selected' : ''}>${s}</option>`).join("");

                        unlockHtml = `
                            <div style="display:flex; gap:5px; align-items:center; background:#2c1a1a; padding:4px 6px; border-radius:4px; border: 1px solid #5c2c2c; margin-top: 5px;">
                                <span style="font-size:12px;" title="Odemyká chat na pozadí"><i class="fa-solid fa-lock-open"></i></span>
                                <select onchange="updateUnlock('${id}', ${idx}, this.value)" style="padding:2px; font-size:10px; flex-grow:1;">${sceneOptions}</select>
                                <button class="btn-del" style="font-size:14px; padding:0 4px;" onclick="removeUnlock('${id}', ${idx})" title="Zrušit odemykání"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                        `;
                    } else {
                        unlockHtml = `<button style="font-size:10px; padding:2px 6px; background:transparent; border:1px solid #444; color:#aaa; border-radius:4px;" onclick="addUnlock('${id}', ${idx})" title="Tajně odemkne jiný chat"><i class="fa-solid fa-unlock-keyhole"></i> Akce</button>`;
                    }

                    let chapterHtml = "";
                    if (choice.changeChapter !== undefined) {
                        chapterHtml = `
                            <div style="display:flex; gap:5px; align-items:center; background:#1a2a40; padding:4px 6px; border-radius:4px; border: 1px solid #2a4a70; margin-top: 5px;">
                                <span style="font-size:12px;" title="Přepne hru do nového souboru"><i class="fa-solid fa-forward-step"></i></span>
                                <input type="text" placeholder="story2.js" value="${escapeHtml(choice.changeChapter.script)}" oninput="updateChapter('${id}', ${idx}, 'script', this.value)" style="width: 32%;">
                                <input type="text" placeholder="bg2.jpg" value="${escapeHtml(choice.changeChapter.bg)}" oninput="updateChapter('${id}', ${idx}, 'bg', this.value)" style="width: 28%;">
                                <input type="text" placeholder="vid2.mp4" value="${escapeHtml(choice.changeChapter.video || '')}" oninput="updateChapter('${id}', ${idx}, 'video', this.value)" style="width: 28%;" title="Pozadí video (volitelné)">
                                <button class="btn-del" style="font-size:14px; padding:0 4px;" onclick="removeChapter('${id}', ${idx})" title="Zrušit přechod"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                        `;
                        targetText = "PŘECHOD DO NOVÉ KAPITOLY";
                    } else {
                        chapterHtml = `<button style="font-size:10px; padding:2px 6px; background:transparent; border:1px solid #444; color:#aaa; border-radius:4px; margin-left:5px;" onclick="addChapter('${id}', ${idx})" title="Načte novou kapitolu a pozadí"><i class="fa-solid fa-forward-step"></i> Kapitola</button>`;
                    }

                    html += `
                        <div class="choice-block" id="port-out-${id}-${idx}">
                            <textarea placeholder="Text tlačítka pro hráče..." oninput="updateChoice('${id}', ${idx}, 'text', this.value)">${escapeHtml(choice.text)}</textarea>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px; gap: 5px;">
                                <span style="font-size:10px; color:#aaa; flex-grow:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${targetText}</span>
                                <div style="display:flex;">
                                    ${choice.unlocks === undefined ? unlockHtml : ""}
                                    ${choice.changeChapter === undefined ? chapterHtml : ""}
                                </div>
                                <button class="btn-del" onclick="deleteChoice('${id}', ${idx})" title="Smazat volbu"><i class="fa-solid fa-trash"></i></button>
                            </div>
                            ${choice.unlocks !== undefined ? unlockHtml : ""}
                            ${choice.changeChapter !== undefined ? chapterHtml : ""}
                            ${choice.changeChapter === undefined ? `<div class="port-out" onmousedown="startWireDrag(event, '${id}', ${idx})" title="Chytni mě a táhni k jiné bublině"></div>` : ""}
                        </div>
                    `;
                });

                html += `</div><button class="btn-blue" onclick="addChoice('${id}')"><i class="fa-solid fa-plus"></i> Přidat volbu</button>`;
                html += `</div>`;

                nodeDiv.innerHTML = html;
                nodesContainer.appendChild(nodeDiv);
            });
            drawAllWires();
            updateSelectionVisuals();
        }

        function drawAllWires() {
            svgCanvas.innerHTML = "";
            Object.keys(storyData.scenes).forEach(id => {
                const scene = storyData.scenes[id];
                (scene.choices || []).forEach((choice, idx) => {
                    const portEl = document.getElementById(`port-out-${id}-${idx}`);
                    if (!portEl) return;

                    if (choice.next && choice.next !== "BACK_TO_CONTACTS" && storyData.scenes[choice.next]) {
                        createSvgWire(portEl, document.getElementById(`node-${choice.next}`), "#0084ff", false);
                    }
                    if (choice.unlocks && storyData.scenes[choice.unlocks]) {
                        createSvgWire(portEl, document.getElementById(`node-${choice.unlocks}`), "#ff4757", true);
                    }
                });
            });
        }

        function createSvgWire(elFrom, elTo, color, isDashed, toMouseX = null, toMouseY = null) {
            if (!elFrom) return;
            const fromRect = elFrom.getBoundingClientRect();
            const canvasRect = svgCanvas.getBoundingClientRect();

            const x1 = (fromRect.right - canvasRect.left) / zoomLevel;
            const y1 = (fromRect.top + fromRect.height / 2 - canvasRect.top) / zoomLevel;

            let x2, y2;
            if (elTo) {
                const toRect = elTo.getBoundingClientRect();
                x2 = (toRect.left - canvasRect.left) / zoomLevel;
                y2 = (toRect.top - canvasRect.top) / zoomLevel + 20; 
            } else {
                x2 = (toMouseX - canvasRect.left) / zoomLevel;
                y2 = (toMouseY - canvasRect.top) / zoomLevel;
            }

            const offset = Math.max(80, Math.abs(x2 - x1) * 0.5);
            const d = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", color);
            path.setAttribute("stroke-width", "3");
            if (isDashed) path.setAttribute("stroke-dasharray", "6, 6");

            svgCanvas.appendChild(path);
            return path;
        }

        function startNodeDrag(e, id) {
            const tgt = e.target.tagName.toLowerCase();
            if (tgt === 'input' || tgt === 'textarea' || tgt === 'select' || tgt === 'button' || e.target.closest('button') || e.target.classList.contains('port-out')) {
                return;
            }

            if (!selectedNodes.has(id)) {
                if (!e.shiftKey) selectedNodes.clear();
                selectedNodes.add(id);
                updateSelectionVisuals();
            }

            isDraggingNode = true;
            dragOffsets = {};

            selectedNodes.forEach(nodeId => {
                dragOffsets[nodeId] = {
                    x: (e.clientX / zoomLevel) - storyData.scenes[nodeId].editor.x,
                    y: (e.clientY / zoomLevel) - storyData.scenes[nodeId].editor.y
                };
            });
        }

        function startWireDrag(e, sceneId, choiceIdx) {
            e.stopPropagation();
            isDraggingWire = true; wireSource = { sceneId, choiceIdx };
            tempWirePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            tempWirePath.setAttribute("fill", "none"); tempWirePath.setAttribute("stroke", "#0084ff"); tempWirePath.setAttribute("stroke-width", "3");
            tempWirePath.style.pointerEvents = "none";
            svgCanvas.appendChild(tempWirePath);
        }

        document.getElementById("canvas-container").addEventListener("mousedown", (e) => {
            if (e.target.id === "canvas-container" || e.target.id === "canvas" || e.target.id === "lines-svg") {
                isBoxSelecting = true;
                boxStartX = e.clientX;
                boxStartY = e.clientY;
                
                const selBox = document.getElementById("selection-box");
                selBox.style.display = "block";
                selBox.style.left = boxStartX + "px";
                selBox.style.top = boxStartY + "px";
                selBox.style.width = "0px";
                selBox.style.height = "0px";
                
                if (!e.shiftKey) {
                    selectedNodes.clear();
                    updateSelectionVisuals();
                }
            }
        });

        document.addEventListener("mousemove", (e) => {
            if (isDraggingNode) {
                selectedNodes.forEach(nodeId => {
                    storyData.scenes[nodeId].editor.x = (e.clientX / zoomLevel) - dragOffsets[nodeId].x;
                    storyData.scenes[nodeId].editor.y = (e.clientY / zoomLevel) - dragOffsets[nodeId].y;
                    const node = document.getElementById(`node-${nodeId}`);
                    if (node) {
                        node.style.left = storyData.scenes[nodeId].editor.x + "px";
                        node.style.top = storyData.scenes[nodeId].editor.y + "px";
                    }
                });
                drawAllWires();
            }
            
            if (isDraggingWire && tempWirePath) {
                svgCanvas.removeChild(tempWirePath);
                tempWirePath = createSvgWire(document.getElementById(`port-out-${wireSource.sceneId}-${wireSource.choiceIdx}`), null, "#0084ff", false, e.clientX, e.clientY);
            }

            if (isBoxSelecting) {
                const selBox = document.getElementById("selection-box");
                const currentX = e.clientX;
                const currentY = e.clientY;
                
                selBox.style.left = Math.min(boxStartX, currentX) + "px";
                selBox.style.top = Math.min(boxStartY, currentY) + "px";
                selBox.style.width = Math.abs(currentX - boxStartX) + "px";
                selBox.style.height = Math.abs(currentY - boxStartY) + "px";
            }
        });

        document.addEventListener("mouseup", (e) => {
            if (isDraggingNode) isDraggingNode = false;
            
            if (isDraggingWire) {
                isDraggingWire = false;
                if (tempWirePath && tempWirePath.parentNode) svgCanvas.removeChild(tempWirePath);
                if (wireTargetNodeId) {
                    storyData.scenes[wireSource.sceneId].choices[wireSource.choiceIdx].next = wireTargetNodeId;
                } else {
                    storyData.scenes[wireSource.sceneId].choices[wireSource.choiceIdx].next = "BACK_TO_CONTACTS";
                }
                wireSource = null; wireTargetNodeId = null;
                renderEditor();
            }

            if (isBoxSelecting) {
                isBoxSelecting = false;
                const selBox = document.getElementById("selection-box");
                
                const boxRect = selBox.getBoundingClientRect(); 
                selBox.style.display = "none";
                
                Object.keys(storyData.scenes).forEach(nodeId => {
                    const node = document.getElementById(`node-${nodeId}`);
                    if (!node) return;
                    const nodeRect = node.getBoundingClientRect();
                    
                    if (!(boxRect.right < nodeRect.left || 
                          boxRect.left > nodeRect.right || 
                          boxRect.bottom < nodeRect.top || 
                          boxRect.top > nodeRect.bottom)) {
                        selectedNodes.add(nodeId);
                    }
                });
                
                updateSelectionVisuals();
            }
        });

        function createSceneLogic(spawnX, spawnY) {
            let id = "scena_" + Math.floor(Math.random() * 1000);
            let firstContact = Object.keys(storyData.contacts)[0] || "";
            storyData.scenes[id] = { contactId: firstContact, editor: { x: spawnX, y: spawnY }, messages: [], choices: [] };
            
            // Nastaví novou bublinu jako startovací pokud je to úplně první bublina na plátně
            if(Object.keys(storyData.scenes).length === 1) {
                storyData.startScene = id;
            }
            renderEditor();
        }

        function setStartScene(id) {
            storyData.startScene = id;
            renderEditor();
        }

        function addSceneCenter() {
            let spawnX = (container.scrollLeft + (container.clientWidth / 2) - 170) / zoomLevel;
            let spawnY = (container.scrollTop + (container.clientHeight / 2) - 100) / zoomLevel;
            createSceneLogic(spawnX, spawnY);
        }

        document.getElementById("canvas").addEventListener("dblclick", function (e) {
            if (e.target.id !== "canvas" && e.target.id !== "lines-svg") return;
            const canvasRect = this.getBoundingClientRect();
            createSceneLogic((e.clientX - canvasRect.left) / zoomLevel, (e.clientY - canvasRect.top) / zoomLevel);
        });

        function deleteScene(id) { 
            if (confirm("Opravdu smazat tuto bublinu?")) { 
                selectedNodes.delete(id); 
                delete storyData.scenes[id]; 
                
                // Pokud smažeme startovací scénu, přepneme to na jinou dostupnou (nebo null)
                if(storyData.startScene === id) {
                    storyData.startScene = Object.keys(storyData.scenes)[0] || null;
                }
                
                renderEditor(); 
            } 
        }
        function renameScene(oldId, newId) {
            newId = newId.trim().replace(/\s+/g, '_');
            if (!newId || oldId === newId || storyData.scenes[newId]) { renderEditor(); return; }
            storyData.scenes[newId] = storyData.scenes[oldId];
            delete storyData.scenes[oldId];
            
            if(storyData.startScene === oldId) {
                storyData.startScene = newId;
            }

            Object.values(storyData.scenes).forEach(s => {
                (s.choices || []).forEach(c => {
                    if (c.next === oldId) c.next = newId;
                    if (c.unlocks === oldId) c.unlocks = newId;
                });
            });
            renderEditor();
        }
        function updateScene(id, field, val) { storyData.scenes[id][field] = val; }
        function addMsg(id) { storyData.scenes[id].messages.push({ type: "npc", text: "" }); renderEditor(); }
        function updateMsg(id, idx, field, val) { storyData.scenes[id].messages[idx][field] = val; }
        function deleteMsg(id, idx) { storyData.scenes[id].messages.splice(idx, 1); renderEditor(); }
        function addChoice(id) { storyData.scenes[id].choices.push({ text: "", next: "BACK_TO_CONTACTS" }); renderEditor(); }
        function updateChoice(id, idx, field, val) { storyData.scenes[id].choices[idx][field] = val; }
        function deleteChoice(id, idx) { storyData.scenes[id].choices.splice(idx, 1); renderEditor(); }
        function addUnlock(id, idx) { storyData.scenes[id].choices[idx].unlocks = ""; renderEditor(); }
        function updateUnlock(id, idx, val) { storyData.scenes[id].choices[idx].unlocks = val; drawAllWires(); }
        function removeUnlock(id, idx) { delete storyData.scenes[id].choices[idx].unlocks; renderEditor(); }
        
        function addChapter(id, idx) { 
            storyData.scenes[id].choices[idx].changeChapter = { script: "story2.js", bg: "bg2.jpg", video: "video2.mp4" }; 
            storyData.scenes[id].choices[idx].next = ""; 
            renderEditor(); 
        }
        
        function updateChapter(id, idx, field, val) { storyData.scenes[id].choices[idx].changeChapter[field] = val; }
        function removeChapter(id, idx) { delete storyData.scenes[id].choices[idx].changeChapter; storyData.scenes[id].choices[idx].next = "BACK_TO_CONTACTS"; renderEditor(); }

        function openContactsModal() { document.getElementById("contacts-modal").style.display = "flex"; renderContacts(); }
        function closeContactsModal() { document.getElementById("contacts-modal").style.display = "none"; renderEditor(); }

        function renderContacts() {
            const list = document.getElementById("contacts-list");
            list.innerHTML = "";
            Object.keys(storyData.contacts).forEach(id => {
                const c = storyData.contacts[id];
                list.innerHTML += `
                    <div class="contact-row">
                        <input type="text" value="${escapeHtml(id)}" placeholder="ID" onchange="renameContact('${id}', this.value)" style="width: 80px;">
                        <input type="text" value="${escapeHtml(c.name)}" placeholder="Jméno" oninput="updateContact('${id}', 'name', this.value)">
                        <input type="color" value="${c.color}" onchange="updateContact('${id}', 'color', this.value)">
                        <button class="btn-del" onclick="deleteContact('${id}')" title="Smazat kontakt"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
        }

        function addContact() {
            let id = "kontakt_" + Math.floor(Math.random() * 100);
            storyData.contacts[id] = { name: "Nové jméno", color: "#888888" };
            renderContacts();
        }
        function updateContact(id, field, val) { storyData.contacts[id][field] = val; }
        function renameContact(oldId, newId) {
            newId = newId.trim().replace(/\s+/g, '_');
            if (!newId || oldId === newId || storyData.contacts[newId]) return renderContacts();
            storyData.contacts[newId] = storyData.contacts[oldId];
            delete storyData.contacts[oldId];
            Object.values(storyData.scenes).forEach(s => { if (s.contactId === oldId) s.contactId = newId; });
            renderContacts();
        }
        function deleteContact(id) { delete storyData.contacts[id]; renderContacts(); }

        function exportFile() {
            // 1. Oddělíme Instagram data od hlavního příběhu
            const instaData = storyData.instagram || {};
            const baseData = { ...storyData };
            delete baseData.instagram; // Smažeme z hlavního objektu
            
            // 2. Vygenerujeme základní data
            let fileContent = `window.storyData = ${JSON.stringify(baseData, null, 4)};\n\n`;
            
            // 3. Přilepíme Instagram čistě na konec (tak jak jsi to měl ručně!)
            if (Object.keys(instaData).length > 0) {
                fileContent += `// A SEM, NA ÚPLNÝ KONEC SOUBORU, PŘIDEJ INSTAGRAM:\n`;
                fileContent += `window.storyData.instagram = ${JSON.stringify(instaData, null, 4)};\n`;
            }
            
            // Vrátíme Instagram zpět do paměti editoru, aby nezmizel z obrazovky
            storyData.instagram = instaData;
            
            const blob = new Blob([fileContent], { type: "text/javascript" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "story.js"; a.click();
        }

        function importFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    // Místo padajícího JSON.parse vytvoříme falešné okno (sandbox) 
                    // a necháme soubor, aby se sám načetl přesně jako ve hře.
                    const fakeWindow = {};
                    const runScript = new Function("window", e.target.result);
                    runScript(fakeWindow); // Spustí kód ze souboru

                    if (fakeWindow.storyData) {
                        storyData = fakeWindow.storyData;
                        if (!storyData.instagram) storyData.instagram = {};
                        renderEditor();
                    } else {
                        alert("Soubor neobsahuje správná data (window.storyData chybí)!");
                    }
                } catch (err) { alert("Chyba načítání (Zkontroluj, zda v kódu nechybí čárka): " + err); }
            };
            reader.readAsText(file);
        }

        renderEditor();

        // ==========================================
        // SPRÁVCE INSTAGRAMU (LOGIKA)
        // ==========================================
        function openInstaModal() { 
            document.getElementById("insta-modal").style.display = "flex"; 
            if (!storyData.instagram) storyData.instagram = {};
            renderInsta(); 
        }
        function closeInstaModal() { document.getElementById("insta-modal").style.display = "none"; }

        function renderInsta() {
            const list = document.getElementById("insta-list");
            list.innerHTML = "";
            Object.keys(storyData.instagram).forEach(id => {
                const p = storyData.instagram[id];
                let postsHtml = "";
                (p.posts || []).forEach((post, idx) => {
                    postsHtml += `
                        <div class="insta-post-row">
                            <input type="text" value="${escapeHtml(post.img)}" placeholder="Název fotky (foto.jpg)" oninput="updateInstaPost('${id}', ${idx}, 'img', this.value)" style="width: 130px;">
                            <textarea placeholder="Popisek fotky..." oninput="updateInstaPost('${id}', ${idx}, 'desc', this.value)" style="flex-grow:1; height: 32px; min-height: 32px;">${escapeHtml(post.desc)}</textarea>
                            <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
                                <input type="number" value="${post.likes}" placeholder="Likes" oninput="updateInstaPost('${id}', ${idx}, 'likes', parseInt(this.value)||0)" style="width: 60px;" title="Počet srdíček">
                                <button class="btn-del" onclick="deleteInstaPost('${id}', ${idx})" title="Smazat příspěvek"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    `;
                });

                list.innerHTML += `
                    <div class="insta-profile-box">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 10px; align-items: center;">
                            <strong style="color: #e1306c;"><i class="fa-solid fa-user"></i> Profil</strong>
                            <button class="btn-del" style="width: auto; padding: 2px 8px; border: 1px solid #ff4757;" onclick="deleteInstaProfile('${id}')">Smazat profil</button>
                        </div>
                        <div style="display:flex; gap:8px; margin-bottom: 8px;">
                            <input type="text" value="${escapeHtml(id)}" placeholder="Unikátní ID" onchange="renameInstaProfile('${id}', this.value)" style="width: 140px;" title="ID (např. elias_syn)">
                            <input type="text" value="${escapeHtml(p.name)}" placeholder="Zobrazované Jméno" oninput="updateInstaProfile('${id}', 'name', this.value)" style="flex-grow: 1;">
                            <input type="text" value="${escapeHtml(p.avatar)}" placeholder="Avatar (např. ikona.png)" oninput="updateInstaProfile('${id}', 'avatar', this.value)" style="width: 180px;">
                        </div>
                        <div style="display:flex; gap:8px; margin-bottom: 8px;">
                            <input type="text" value="${escapeHtml(p.bio)}" placeholder="Bio (Popis profilu pod jménem)" oninput="updateInstaProfile('${id}', 'bio', this.value)" style="flex-grow: 1;">
                            <input type="text" value="${escapeHtml(p.followers)}" placeholder="Sledující" oninput="updateInstaProfile('${id}', 'followers', this.value)" style="width: 80px;" title="Sledující">
                            <input type="text" value="${escapeHtml(p.following)}" placeholder="Sleduje" oninput="updateInstaProfile('${id}', 'following', this.value)" style="width: 80px;" title="Sleduje">
                        </div>
                        <div style="margin-top: 15px; font-size: 11px; color: #888; font-weight: bold; border-bottom: 1px solid #3c3c3e; padding-bottom: 5px;">FOTKY A PŘÍSPĚVKY:</div>
                        <div id="posts-${id}">${postsHtml}</div>
                        <button onclick="addInstaPost('${id}')" style="margin-top: 10px; font-size:11px; background: transparent;"><i class="fa-solid fa-plus"></i> Přidat další fotku do profilu</button>
                    </div>
                `;
            });
        }
        
        function addInstaProfile() {
            let id = "profil_" + Math.floor(Math.random() * 1000);
            storyData.instagram[id] = { name: "Nový Profil", avatar: "default.png", bio: "Popis...", followers: "0", following: "0", posts: [] };
            renderInsta();
        }
        function deleteInstaProfile(id) { if(confirm("Opravdu smazat celý tento profil a jeho fotky?")) { delete storyData.instagram[id]; renderInsta(); } }
        function renameInstaProfile(oldId, newId) {
            newId = newId.trim().replace(/\s+/g, '_');
            if (!newId || oldId === newId || storyData.instagram[newId]) return renderInsta();
            storyData.instagram[newId] = storyData.instagram[oldId];
            delete storyData.instagram[oldId];
            renderInsta();
        }
        function updateInstaProfile(id, field, val) { storyData.instagram[id][field] = val; }
        
        function addInstaPost(id) {
            storyData.instagram[id].posts.push({ img: "fotka.jpg", desc: "Nový příspěvek...", likes: 0 });
            renderInsta();
        }
        function updateInstaPost(id, idx, field, val) { storyData.instagram[id].posts[idx][field] = val; }
        function deleteInstaPost(id, idx) { storyData.instagram[id].posts.splice(idx, 1); renderInsta(); }
