document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Navbar Scroll Effect --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 2. Smooth Scrolling for Anchor Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* --- 3. Intersection Observer for Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    /* --- 4. Mouse Move Effect for Feature Cards --- */
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* --- 5. Terminal Typewriter Effect --- */
    const terminalOutput = document.getElementById('typewriter-output');

    const lines = [
        { text: "$ npx tsx src/index.ts", type: "cmd" },
        { text: "🤖 EchoClaw v1.0 starting...", type: "system" },
        { text: "✓ Memory loaded (semantic + local)", type: "success" },
        { text: "✓ MCP tools connected", type: "success" },
        { text: "✓ Telegram bot online", type: "success" },
        { text: "✓ Connected as @echoclawbot", type: "success" },
        { text: "✓ Heartbeat scheduled: 8:00 AM EST daily", type: "success" },
        { text: "EchoClaw is ready. Listening...", type: "prompt" }
    ];

    let lineIndex = 0;

    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function typeLine() {
        if (lineIndex >= lines.length) {
            terminalOutput.appendChild(cursor); // Leave cursor at the end
            return;
        }

        const lineData = lines[lineIndex];
        const lineWrap = document.createElement('div');

        let prefix = "";
        let className = "";

        if (lineData.type === "cmd") {
            className = "token-cmd";
        } else if (lineData.type === "system") {
            className = "token-system";
        } else if (lineData.type === "success") {
            className = "token-success";
        } else if (lineData.type === "prompt") {
            className = "token-prompt";
        }

        lineWrap.className = className;
        terminalOutput.appendChild(lineWrap);
        terminalOutput.appendChild(cursor);

        let charIndex = 0;
        const text = lineData.text;

        function typeChar() {
            if (charIndex < text.length) {
                lineWrap.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, Math.random() * 30 + 20); // Random typing speed (20-50ms)
            } else {
                // Done line typing
                lineIndex++;
                terminalOutput.removeChild(cursor);

                // Add a line break wrapper delay before next line
                const delay = lineData.type === "cmd" ? 600 : 200;
                setTimeout(typeLine, delay);
            }
        }

        typeChar();
    }

    // Use Intersection Observer specifically for the terminal to start typing when visible
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeLine, 500); // Small delay after scrolling into view
                terminalObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    if (document.querySelector('.demo-section')) {
        terminalObserver.observe(document.querySelector('.demo-section'));
    }

    /* --- 6. Hero Chat Simulation --- */
    const chatContainer = document.querySelector('.chat-sim');

    if (chatContainer) {
        const chatSequence = [
            { sender: 'user', content: 'Hey Echo, can you summarize my last 3 unread emails and draft a reply to Sarah?' },
            { sender: 'bot', content: 'Checking Gmail... 📧' },
            { sender: 'bot', content: 'You have 3 unread threads.\n1. GitHub: PR #42 merged.\n2. Sarah: "Meeting moved to 3 PM."\n3. AWS: Billing alert.\n\nI drafted a reply to Sarah confirming 3 PM and saved it to your drafts.' },
            { sender: 'user', content: 'Perfect. Execute `npm run build` on the website repo and tell me if it passes.' }
        ];

        let msgIndex = 0;

        function renderNextMessage() {
            if (msgIndex >= chatSequence.length) return;

            const msgData = chatSequence[msgIndex];

            const msgEl = document.createElement('div');
            msgEl.className = `chat-msg ${msgData.sender}`;

            const isBot = msgData.sender === 'bot';
            const avatarContent = isBot ? '<img src="echoclawbot.png" alt="Bot">' : 'U';

            msgEl.innerHTML = `
                <div class="avatar ${msgData.sender}">${avatarContent}</div>
                <div class="msg-content">${msgData.content.replace(/\n/g, '<br>')}</div>
            `;

            chatContainer.appendChild(msgEl);

            // Force reflow for transition
            msgEl.offsetHeight;
            msgEl.classList.add('visible');

            msgIndex++;

            if (msgIndex < chatSequence.length) {
                // Determine wait time based on sender
                const nextMsg = chatSequence[msgIndex];
                const waitTime = nextMsg.sender === 'bot' ? 1500 : 3000;
                setTimeout(renderNextMessage, waitTime);
            }
        }

        // Start chat simulation after a delay
        setTimeout(renderNextMessage, 1500);
    }

    /* --- 7. Modal Form Logic --- */
    const modal = document.getElementById('cta-modal');
    const closeBtn = document.getElementById('modal-close');
    const form = document.getElementById('waitlist-form');
    const ctaButtons = document.querySelectorAll('a[href="#get-started"]');

    function openModal(e) {
        if (e) e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modal && closeBtn && form) {
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', openModal);
        });

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://n8n.srv945929.hstgr.cloud/webhook/6fdda321-ac0a-412c-8ced-6a6306a6e272', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    btn.textContent = 'Success!';
                    btn.classList.add('token-success');
                    btn.style.background = 'transparent';
                    btn.style.border = '1px solid #27C93F';
                    btn.style.color = '#27C93F';

                    setTimeout(() => {
                        closeModal();
                        setTimeout(() => {
                            form.reset();
                            btn.textContent = originalText;
                            btn.style = '';
                            btn.classList.remove('token-success');
                        }, 300);
                    }, 1500);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Submission failed:', error);
                btn.textContent = 'Error. Try Again.';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }, 3000);
            }
        });
    }

    /* --- 8. Contact Modal Logic --- */
    const contactModal = document.getElementById('contact-modal');
    const contactCloseBtn = document.getElementById('contact-modal-close');
    const contactForm = document.getElementById('contact-form');
    const contactLink = document.querySelector('a[href="#contact"]');

    function openContactModal(e) {
        if (e) e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeContactModal() {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (contactModal && contactCloseBtn && contactForm && contactLink) {
        contactLink.addEventListener('click', openContactModal);

        contactCloseBtn.addEventListener('click', closeContactModal);

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                closeContactModal();
            }
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://n8n.srv945929.hstgr.cloud/webhook/6fdda321-ac0a-412c-8ced-6a6306a6e272', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    btn.textContent = 'Sent!';
                    btn.classList.add('token-success');
                    btn.style.background = 'transparent';
                    btn.style.border = '1px solid #27C93F';
                    btn.style.color = '#27C93F';

                    setTimeout(() => {
                        closeContactModal();
                        setTimeout(() => {
                            contactForm.reset();
                            btn.textContent = originalText;
                            btn.style = '';
                            btn.classList.remove('token-success');
                        }, 300);
                    }, 1500);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Submission failed:', error);
                btn.textContent = 'Error. Try Again.';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.style.pointerEvents = 'auto';
                }, 3000);
            }
        });
    }

});
