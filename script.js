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
            prompt: `Implement a comprehensive Gmail skill using the Google Discovery API. The AI must be able to:

Read: List messages, fetch specific email bodies, and parse attachments.

Draft: Create email drafts based on context and save them for user review.

Send: Send emails directly, including support for CC/BCC and file attachments.

Organize: Search messages using Gmail's query syntax (e.g., 'from:user'), mark emails as read/unread, and apply or remove labels.`,
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
            prompt: `Develop a Calendar skill using the Google Calendar API v3. The AI needs to:

View: List upcoming events and fetch details for a specific calendar ID.

Schedule: Create new events with titles, descriptions, locations, and attendee invites.

Check Availability: Use the freebusy query to determine if a time slot is open before booking.

Modify: Update existing event times or delete cancelled meetings.`,
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
        memory_pinecone: {
            prompt: `Vector Databases (Pinecone & ChromaDB): Semantic Memory
Create a 'Long-Term Semantic Memory' skill using Pinecone (cloud) and ChromaDB (local). The AI should:

Store: Generate embeddings for text chunks and upsert them with metadata (source, timestamp, tags).

Retrieve: Perform vector similarity searches to find relevant context for a user's question.

Manage: Update existing vectors when information changes and delete outdated 'memories' to maintain accuracy.`,
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
        memory_md: {
            prompt: `Implement a 'File-Based Memory' skill that uses a local Memory.md file as a persistent, human-readable scratchpad. The AI must be able to:

Read: Parse the entire Markdown file to recover context from previous sessions or find specific 'learned' facts.

Append: Add new entries to the bottom of the file with a timestamp (e.g., '### 2026-02-25: User prefers dark mode UI').

Update/Summarize: Periodically read long-form logs and rewrite them into a 'Current State' summary at the top of the file to save token space.

Search: Perform a keyword-based string search within the file to locate specific historical data points.

Categorize: Use Markdown headers (e.g., # Preferences, # Project Alpha, # Meeting Notes) to organize information so it can be retrieved by section.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill uses a simple markdown file in your project directory. No API keys needed!</p>

<h4>How it works</h4>
<p>When you install this skill, a <code>memory.md</code> file will be created in your EchoClaw data directory. The bot will read and write to this file to persist memories across sessions.</p>

<div class="note"><strong>Tip:</strong> You can customize the memory file location by setting MEMORY_FILE_PATH in your .env file.</div>`
        },
        memory_sqlite: {
            prompt: `Structured Data (SQLite & Memory.md): Organized Records
Build a structured memory system.

SQLite: Implement a relational database skill to create tables, insert structured records (like task lists or user preferences), and run complex SQL SELECT queries with filters.

Memory.md: Implement a file-based logging skill that can read a specific Markdown file, append new 'thought' entries or logs, and rewrite sections to summarize a conversation history.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill runs entirely locally. No API keys needed!</p>

<h4>Installation</h4>
<p>Make sure you have the sqlite3 package installed:</p>
<div class="env-example"><code>npm install sqlite3</code></div>

<h4>How it works</h4>
<p>SQLite will create a <code>memory.db</code> file in your project directory. This file stores all memories in structured tables.</p>

<div class="note"><strong>Tip:</strong> You can customize the database location by setting DATABASE_PATH in your .env file.</div>`
        },
        memory_chroma: {
            prompt: `Implement a 'Local Semantic Memory' skill using the ChromaDB library. The AI must manage a persistent local database stored on disk and perform the following operations:

Initialize/Connect: Create or load a persistent ChromaDB client pointing to a specific local directory (e.g., ./chroma_db).

Collection Management: Create, list, or delete 'collections' (the equivalent of tables) to categorize different types of memories (e.g., 'User_Preferences' vs. 'Project_Knowledge').

Add/Embed: Convert incoming text into vector embeddings (using a model like all-Minilm-L6-v2 or OpenAI's text-embedding-3-small) and store them in the collection with unique IDs and metadata.

Query: Perform a similarity search to find the 'Top K' most relevant documents based on a user's current question or task context.

Update/Upsert: Refresh existing memory entries if the information changes, ensuring no duplicate IDs are created.

Filter: Use metadata filtering (e.g., where={"type": "technical_doc"}) to narrow down the search results before performing the vector comparison.`,
            instructions: `<h4>No Setup Required</h4>
<p>This skill runs entirely locally. No API keys needed!</p>

<h4>Installation</h4>
<p>Make sure you have the chromadb package installed:</p>
<div class="env-example"><code>npm install chromadb</code></div>

<h4>How it works</h4>
<p>ChromaDB stores embeddings locally in a directory called <code>chroma_data</code> in your project. All data stays on your machine.</p>

<div class="note"><strong>Note:</strong> You may also need to install sentence-transformers for embedding generation.</div>`
        },
        github: {
            prompt: `Implement a GitHub skill using the GitHub REST API. The AI must be able to:

Code Management: Read file contents from a repo, create new branches, and commit code changes.

Collaboration: List, read, and comment on Issues; create new Pull Requests; and check the status of GitHub Action workflows.

Discovery: Search for repositories or specific code snippets within an organization.`,
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
            prompt: `Design a local File System skill with strict security boundaries. The AI should be able to:

Explore: List files and directories in a 'home' path.

File Ops: Read text/PDF/CSV files, write new files, and append data to existing logs.

Maintenance: Create new folders, rename files, and safely delete temporary assets. Ensure the AI cannot navigate outside the permitted directory (Path Traversal protection).`,
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
            prompt: `Equip the AI with a Web Search skill using the Tavily or Google Custom Search API. The AI must:

Search: Execute queries and retrieve a list of ranked URLs.

Extract: Scrape and 'clean' the text content from the top results.

Verify: Compare information across multiple sources to ensure accuracy before presenting a final answer to the user.`,
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
