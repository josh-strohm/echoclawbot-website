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

    /* --- 9. Skills Modal Logic --- */
    const skillModal = document.getElementById('skill-modal');
    const skillModalClose = document.getElementById('skill-modal-close');
    const skillModalTitle = document.getElementById('skill-modal-title');
    const skillPromptCode = document.getElementById('skill-prompt-code');
    const skillInstructions = document.getElementById('skill-instructions');
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    const skillCards = document.querySelectorAll('.skill-card[data-skill]');
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillPromptContent = document.getElementById('skill-prompt-content');
    const skillInstructionsContent = document.getElementById('skill-instructions-content');

    const skillPrompts = {
        gmail: {
            prompt: `Please implement and configure the ability for you to use the Gmail skill. From now on, when I ask you to check my email, you should search for emails using the Gmail API. When I ask me to send an email, you should compose and send it using the Gmail API. Always ask for confirmation before sending any email. Your available Gmail actions include: list_emails (to show recent emails), read_email (to view a specific email), send_email (to compose and send a new email), and search_emails (to find emails by keyword). Remember to use this skill whenever I mention checking, reading, sending, or searching emails.`,
            instructions: `<h4>Step 1: Enable Gmail API in Google Cloud</h4>
<p>1. Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></p>
<p>2. Create a new project or select an existing one</p>
<p>3. Navigate to APIs & Services > Library</p>
<p>4. Search for "Gmail API" and enable it</p>

<h4>Step 2: Create OAuth Credentials</h4>
<p>1. Go to APIs & Services > Credentials</p>
<p>2. Click "Create Credentials" > "OAuth client ID"</p>
<p>3. Configure the OAuth consent screen</p>
<p>4. Select "Desktop app" as application type</p>
<p>5. Download the JSON credentials file</p>

<h4>Step 3: Add to .env file</h4>
<div class="env-example"><code>GMAIL_CLIENT_ID=your_client_id<br>GMAIL_CLIENT_SECRET=your_client_secret<br>GMAIL_REDIRECT_URI=http://localhost:3000/oauth2callback</code></div>

<div class="note"><strong>Note:</strong> For production, you'll need to verify your app with Google. For development, you can use the downloaded credentials directly.</div>`
        },
        calendar: {
            prompt: `I want you to enable the Calendar skill right now. When I ask about my schedule, you need to list today's events from my Google Calendar. Whenever I want to schedule something, you should create a new event with the title, time, and description I provide. Always confirm the details before creating any event. Your available Calendar actions include: list_events (to show upcoming events), create_event (to schedule new events), delete_event (to remove events), and check_availability (to see when I'm free). Use this skill whenever I mention my calendar, schedule, events, or appointments.`,
            instructions: `<h4>Step 1: Enable Calendar API in Google Cloud</h4>
<p>1. Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></p>
<p>2. Create a new project or select an existing one</p>
<p>3. Navigate to APIs & Services > Library</p>
<p>4. Search for "Google Calendar API" and enable it</p>

<h4>Step 2: Create OAuth Credentials</h4>
<p>1. Go to APIs & Services > Credentials</p>
<p>2. Click "Create Credentials" > "OAuth client ID"</p>
<p>3. Configure the OAuth consent screen</p>
<p>4. Select "Desktop app" as application type</p>
<p>5. Download the JSON credentials file</p>

<h4>Step 3: Add to .env file</h4>
<div class="env-example"><code>GOOGLE_CLIENT_ID=your_client_id<br>GOOGLE_CLIENT_SECRET=your_client_secret</code></div>`
        },
        memory_md: {
            prompt: `Your task is to learn and activate the Memory.md skill. You should store and retrieve important information in a local memory.md file in your project directory. When I ask you to remember something, append it to the memory.md file with a timestamp. When I ask what you remember, read and summarize the contents of memory.md. This file-based memory allows you to persist information across sessions. Use markdown formatting to organize memories by date and topic. Activate this whenever I ask you to remember or recall information.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill uses a simple markdown file in your project directory. No API keys needed!</p>

<h4>How it works</h4>
<p>When you install this skill, a <code>memory.md</code> file will be created in your EchoClaw data directory. The bot will read and write to this file to persist memories across sessions.</p>

<div class="note"><strong>Tip:</strong> You can customize the memory file location by setting MEMORY_FILE_PATH in your .env file.</div>`
        },
        memory_pinecone: {
            prompt: `Please implement and configure the ability for you to use the Pinecone Vector DB skill. From now on, you should store and retrieve memories using Pinecone, a vector database that enables semantic search. When I ask you to remember something, embed and store that information in my Pinecone index. When I ask what you remember or want to find related information, perform a semantic search against the Pinecone vectors to find the most relevant memories. This skill gives you powerful similarity-based memory recall. Remember to use this whenever I ask you to remember facts, preferences, or any information you'd like to retrieve later using natural language.`,
            instructions: `<h4>Step 1: Create a Pinecone Account</h4>
<p>1. Go to <a href="https://www.pinecone.io/" target="_blank">pinecone.io</a> and sign up</p>
<p>2. Create a new project</p>
<p>3. Create a new index (use "cosine" similarity metric)</p>

<h4>Step 2: Get API Keys</h4>
<p>1. Go to API Keys in your Pinecone dashboard</p>
<p>2. Copy your API key</p>

<h4>Step 3: Add to .env file</h4>
<div class="env-example"><code>PINECONE_API_KEY=your_api_key<br>PINECONE_ENVIRONMENT=your_environment (e.g., us-west1-gcp)</code></div>

<div class="note"><strong>Note:</strong> Make sure your Pinecone index is created before using the skill. You'll also need to install the pinecone-client package.</div>`
        },
        memory_chroma: {
            prompt: `Activate the ChromaDB skill so you can use it going forward. Store and retrieve memories using Chroma, an open-source vector database. When I tell you to remember something, embed and persist that information in the Chroma database. When I ask what you remember or need to find information, query Chroma to retrieve relevant memories using semantic search. Chroma stores embeddings locally, giving you persistent memory with privacy. Use this whenever I ask you to remember personal details, preferences, or conversation context that you'd like to recall later.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill runs entirely locally. No API keys needed!</p>

<h4>Installation</h4>
<p>Make sure you have the chromadb package installed:</p>
<div class="env-example"><code>npm install chromadb</code></div>

<h4>How it works</h4>
<p>ChromaDB stores embeddings locally in a directory called <code>chroma_data</code> in your project. All data stays on your machine.</p>

<div class="note"><strong>Note:</strong> You may also need to install sentence-transformers for embedding generation.</div>`
        },
        memory_sqlite: {
            prompt: `I need you to set up and enable the SQLite Memory skill. Store and retrieve information using SQLite, a lightweight local database. When I ask you to remember something, create a structured record in the SQLite database with the information and timestamp. When I ask what you remember, query the database to retrieve stored memories. This gives you structured, searchable persistent storage. Use SQL queries to efficiently find specific memories or retrieve all memories. Remember to use this whenever I ask you to remember details, preferences, or any structured information you'd like to store and query later.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill runs entirely locally. No API keys needed!</p>

<h4>Installation</h4>
<p>Make sure you have the sqlite3 package installed:</p>
<div class="env-example"><code>npm install sqlite3</code></div>

<h4>How it works</h4>
<p>SQLite will create a <code>memory.db</code> file in your project directory. This file stores all memories in structured tables.</p>

<div class="note"><strong>Tip:</strong> You can customize the database location by setting DATABASE_PATH in your .env file.</div>`
        },
        github: {
            prompt: `Enable the GitHub skill for your use. From this point forward, when I ask about my repositories, you should list my GitHub repos using the GitHub API. When I ask about issues or pull requests, fetch and display them from my repos. When I want to create something, use the appropriate GitHub API call. Your available GitHub actions include: list_repos (to show all my repositories), get_repo (to view a specific repo), list_issues (to show open issues), create_issue (to open a new issue), and list_pulls (to view pull requests). Remember to use this skill whenever I mention GitHub, repos, issues, or pull requests.`,
            instructions: `<h4>Step 1: Create a GitHub Personal Access Token</h4>
<p>1. Go to <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings > Developer settings > Personal access tokens</a></p>
<p>2. Click "Generate new token (classic)"</p>
<p>3. Give it a descriptive name</p>
<p>4. Select scopes: <code>repo</code> (full control of private repositories)</p>
<p>5. Generate and copy the token</p>

<h4>Step 2: Add to .env file</h4>
<div class="env-example"><code>GITHUB_TOKEN=ghp_your_token_here</code></div>

<div class="note"><strong>Security:</strong> Never share your token. If exposed, regenerate it immediately.</div>`
        },
        filesystem: {
            prompt: `Your job is to implement the File System skill. When I ask you to read a file, access and display its contents from my local file system. When I ask you to write or create a file, save the content to the specified location. When I ask to list files, show what's in a directory. Always confirm with me before creating or modifying any files. Work within my project directory that I'll specify. This skill allows you to help me with code files, documents, configurations, and any other file operations I request.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill uses your local file system. No API keys needed!</p>

<h4>Configuration</h4>
<p>By default, the bot can access its working directory. You can restrict access by setting:</p>
<div class="env-example"><code>ALLOWED_DIRECTORIES=/path/to/directory</code></div>

<h4>Safety Features</h4>
<ul>
<li>Cannot access files outside allowed directories</li>
<li>Confirms before executing write operations</li>
<li>Can enable sandboxed mode for extra security</li>
</ul>

<div class="note"><strong>Tip:</strong> The bot will only work within the directories you explicitly allow.</div>`
        },
        websearch: {
            prompt: `I want you to learn the Web Search skill. From now on, when I ask you a question that requires current or up-to-date information, search the internet to find the answer. Use a web search tool to find relevant information from reliable sources, then summarize the results for me in a clear and helpful way. This skill helps you provide accurate, timely information rather than relying only on your training data. Remember to use this whenever I ask about news, current events, or information that might have changed since your training.`,
            instructions: `<h4>Choose a Search Provider</h4>
<p>You can use one of several search APIs. Here are the options:</p>

<h4>Option 1: Tavily (Recommended)</h4>
<ol>
<li>Go to <a href="https://tavily.com/" target="_blank">tavily.com</a> and sign up</li>
<li>Get your API key from the dashboard</li>
</ol>

<h4>Option 2: Serper</h4>
<ol>
<li>Go to <a href="https://serper.dev/" target="_blank">serper.dev</a> and sign up</li>
<li>Get your API key</li>
</ol>

<h4>Option 3: Google Custom Search</h4>
<ol>
<li>Go to Google Programmable Search Engine</li>
<li>Create a search engine and get your API key</li>
</ol>

<h4>Add to .env file</h4>
<div class="env-example"><code>SEARCH_API_KEY=your_api_key<br>SEARCH_PROVIDER=tavily</code></div>`
        },
        slack: {
            prompt: `Please implement and configure the ability for you to use the Slack skill. From now on, when I ask you to send a message to Slack, you should post it to the specified channel or user using the Slack API. When I ask about channels, you should list the available Slack channels in my workspace. Your available Slack actions include: post_message (to send messages to channels or users), list_channels (to show available channels), and list_messages (to read recent messages from a channel). Remember to use this skill whenever I mention Slack, sending a message, or posting to a channel.`,
            instructions: `<h4>Step 1: Create a Slack App</h4>
<p>1. Go to <a href="https://api.slack.com/apps" target="_blank">api.slack.com/apps</a></p>
<p>2. Click "Create New App" > "From scratch"</p>
<p>3. Name your app and select your workspace</p>

<h4>Step 2: Add Permissions</h4>
<p>1. Go to "OAuth & Permissions"</p>
<p>2. Add these scopes:</p>
<ul>
<li>channels:read</li>
<li>chat:write</li>
<li>channels:history</li>
<li>groups:read</li>
<li>im:read</li>
</ul>

<h4>Step 3: Install the App</h4>
<p>1. Click "Install to Workspace"</p>
<p>2. Copy the Bot User OAuth Token</p>

<h4>Step 4: Add to .env file</h4>
<div class="env-example"><code>SLACK_BOT_TOKEN=xoxb-your-token-here<br>SLACK_SIGNING_SECRET=your_signing_secret</code></div>`
        },
        notion: {
            prompt: `Enable the Notion skill so you can interact with my Notion workspace. When I ask you to check my Notion, access my Notion workspace using the Notion API. When I ask about pages or databases, query and display the relevant information. When I want to create or update something, do so in Notion. Your available Notion actions include: get_page (to read a page), create_page (to create a new page), update_page (to modify a page), query_database (to search a database), and list_databases (to show all databases). Remember to use this skill whenever I mention Notion, pages, or databases.`,
            instructions: `<h4>Step 1: Create a Notion Integration</h4>
<p>1. Go to <a href="https://www.notion.so/my-integrations" target="_blank">notion.so/my-integrations</a></p>
<p>2. Click "+ New integration"</p>
<p>3. Give it a name (e.g., "EchoClaw Bot")</p>
<p>4. Copy the "Internal Integration Secret" (NOTION_API_KEY)</p>

<h4>Step 2: Connect to Your Notion Pages</h4>
<p>1. Open Notion and navigate to the page or database you want to share</p>
<p>2. Click the "..." menu (top right)</p>
<p>3. Select "Connect to" > Select your integration</p>
<p>4. Repeat for any other pages/databases</p>

<h4>Step 3: Add to .env file</h4>
<div class="env-example"><code>NOTION_API_KEY=secret_your_integration_key_here</code></div>

<div class="note"><strong>Important:</strong> You must share each page/database with the integration, or the bot won't be able to access it.</div>`
        },
        terminal: {
            prompt: `Your task is to activate the Terminal skill. When I ask you to run a command or execute something, run shell commands on my machine and report back the output. Only run commands I explicitly request - do not execute anything automatically. Use sandboxed execution for safety and confirm potentially dangerous commands before running them. This skill allows you to help with development tasks, running scripts, git commands, npm commands, and any other terminal operations I request.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill uses your system's terminal. No API keys needed!</p>

<h4>Safety Configuration</h4>
<p>You can configure which commands are allowed:</p>
<div class="env-example"><code>TERMINAL_ALLOWED_COMMANDS=git,npm,node,python<br>TERMINAL_SANDBOX_MODE=true</code></div>

<h4>Safety Features</h4>
<ul>
<li>Confirms before running destructive commands (rm, del, etc.)</li>
<li>Can enable sandboxed mode to restrict command access</li>
<li>Logs all commands for security review</li>
</ul>

<div class="note"><strong>Warning:</strong> This skill gives the bot shell access. Only enable if you trust the bot's interactions.</div>`
        }
    };

    function openSkillModal(skillName) {
        const title = skillName.charAt(0).toUpperCase() + skillName.slice(1).replace('_', ' ');
        skillModalTitle.textContent = title;
        
        const skillData = skillPrompts[skillName];
        if (skillData) {
            skillPromptCode.textContent = skillData.prompt;
            skillInstructions.innerHTML = skillData.instructions;
        } else {
            skillPromptCode.textContent = 'Skill prompt not available.';
            skillInstructions.innerHTML = '<p>Setup instructions not available.</p>';
        }
        
        skillModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        copyPromptBtn.textContent = 'Copy Prompt';
        copyPromptBtn.classList.remove('copied');
        
        skillTabs.forEach(tab => tab.classList.remove('active'));
        skillPromptContent.classList.add('active');
        skillInstructionsContent.classList.remove('active');
    }

    function closeSkillModal() {
        skillModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (skillModal && skillModalClose) {
        skillCards.forEach(card => {
            card.addEventListener('click', () => {
                const skill = card.getAttribute('data-skill');
                openSkillModal(skill);
            });
        });

        skillModalClose.addEventListener('click', closeSkillModal);

        skillModal.addEventListener('click', (e) => {
            if (e.target === skillModal) {
                closeSkillModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && skillModal.classList.contains('active')) {
                closeSkillModal();
            }
        });

        copyPromptBtn.addEventListener('click', () => {
            const promptText = skillPromptCode.textContent;
            navigator.clipboard.writeText(promptText).then(() => {
                copyPromptBtn.textContent = 'Copied!';
                copyPromptBtn.classList.add('copied');
                setTimeout(() => {
                    copyPromptBtn.textContent = 'Copy Prompt';
                    copyPromptBtn.classList.remove('copied');
                }, 2000);
            });
        });

        skillTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                skillTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                if (tabName === 'prompt') {
                    skillPromptContent.classList.add('active');
                    skillInstructionsContent.classList.remove('active');
                } else {
                    skillPromptContent.classList.remove('active');
                    skillInstructionsContent.classList.add('active');
                }
            });
        });
    }

});
