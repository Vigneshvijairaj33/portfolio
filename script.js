document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // 3. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal, .reveal-fade-in');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.95; // More sensitive for hero

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < triggerBottom) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);

    // 6. Smooth Custom Cursor Logic - Elite Interactive Version
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const interactiveElements = document.querySelectorAll('a, button, .social-icon, input, textarea, .project-card, .btn');

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let firstMove = true;

    let dotScale = 1;
    let ringScale = 1;
    let targetDotScale = 1;
    let targetRingScale = 1;

    let lastX = 0;
    let lastY = 0;
    let velocity = 0;

    if (cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (firstMove) {
                dotX = mouseX;
                dotY = mouseY;
                ringX = mouseX;
                ringY = mouseY;
                lastX = mouseX;
                lastY = mouseY;
                firstMove = false;
            }

            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });

        const animateCursor = () => {
            // Lerp for Dot
            dotX += (mouseX - dotX) * 0.4;
            dotY += (mouseY - dotY) * 0.4;

            // Lerp for Ring (slower follow)
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            // Lerp for Scale
            dotScale += (targetDotScale - dotScale) * 0.2;
            ringScale += (targetRingScale - ringScale) * 0.2;

            // Calculate Velocity for stretching effect
            const deltaX = mouseX - lastX;
            const deltaY = mouseY - lastY;
            velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            lastX = mouseX;
            lastY = mouseY;

            // Velocity stretching (Subtle)
            const stretch = Math.min(velocity * 0.015, 0.4);
            const stretchX = 1 + stretch;
            const stretchY = 1 - stretch * 0.5;

            // Angle of movement for stretching orientation
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            // Set Dot Transform
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) scale(${dotScale})`;

            // Set Ring Transform - includes movement-based stretching
            if (velocity > 1) {
                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) rotate(${angle}deg) scale(${ringScale * stretchX}, ${ringScale * stretchY})`;
            } else {
                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${ringScale})`;
            }

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                targetRingScale = 1.8;
                targetDotScale = 0; // Hide dot on hover
                cursorRing.classList.add('cursor-ring-hover');
            });
            el.addEventListener('mouseleave', () => {
                targetRingScale = 1;
                targetDotScale = 1;
                cursorRing.classList.remove('cursor-ring-hover');
            });
        });

        document.addEventListener('mousedown', () => {
            targetRingScale = 0.8;
            targetDotScale = 1.5;
        });
        document.addEventListener('mouseup', () => {
            targetRingScale = (cursorRing.classList.contains('cursor-ring-hover')) ? 1.8 : 1;
            targetDotScale = (cursorRing.classList.contains('cursor-ring-hover')) ? 0 : 1;
        });
    }

    // Initial check with a slight delay for better transition
    setTimeout(revealOnScroll, 100);

    // 4. Active Section Highlight on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 5. Real Contact Form Submission (Backend Connected)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            btn.innerText = 'Sending to Backend...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    btn.innerText = 'Message Received!';
                    btn.style.background = '#4CAF50';
                    contactForm.reset();

                    // Show the "Server Reply" in an alert or notification
                    if (result.autoReply) {
                        setTimeout(() => {
                            showNotification(result.autoReply);
                        }, 500);
                    }

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 4000);
                } else {
                    throw new Error(result.error);
                }
            } catch (err) {
                console.error('Submission failed:', err);
                btn.innerText = 'Backend Offline';
                btn.style.background = '#ff4b2b';

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Function to show a clean notification popup
    function showNotification(message) {
        let notification = document.createElement('div');
        notification.className = 'backend-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i data-lucide="message-square"></i>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);

        // Re-init lucide for new icons
        if (window.lucide) window.lucide.createIcons();

        // Animate in
        setTimeout(() => notification.classList.add('active'), 100);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 500);
        }, 6000);
    }

    // 6. Smooth Scroll behavior is handled via CSS, but we can add JS fallback if needed
    // (Already addressed with scroll-behavior: smooth in CSS)

    // 7. Theme Toggle Logic (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        // Save preference
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

    // Initial Fade-In for Home Section elements
    setTimeout(() => {
        const homeReveal = document.querySelector('.home-content');
        if (homeReveal) homeReveal.classList.add('active');
    }, 100);

    // --- Chatbot Logic ---
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotForm = document.getElementById('chatbot-input-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Memory Storage
    let memory = JSON.parse(localStorage.getItem('vibe_bot_memory')) || {};

    const saveMemory = () => {
        localStorage.setItem('vibe_bot_memory', JSON.stringify(memory));
    };

    const addMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${type}-message`;
        msgDiv.textContent = text;
        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const processBotReply = (input) => {
        const cleanInput = input.toLowerCase().trim();

        // 1. Detect if it's a question
        const isQuestion = cleanInput.includes('?') ||
            cleanInput.startsWith('what') ||
            cleanInput.startsWith('how') ||
            cleanInput.startsWith('who') ||
            cleanInput.startsWith('can you') ||
            cleanInput.startsWith('do you know');

        if (isQuestion) {
            // Answer based on memory
            if (cleanInput.includes('name')) {
                return memory.name ? `Your name is ${memory.name}.` : "I don't know your name yet.";
            } else if (cleanInput.includes('age')) {
                return memory.age ? `You are ${memory.age} years old.` : "I don't know your age yet.";
            } else if (cleanInput.includes('interest') || cleanInput.includes('like')) {
                return memory.interests ? `You are interested in ${memory.interests}.` : "I don't know your interests yet.";
            } else {
                return "I'm not sure I have that information yet. Try telling me your name, age, or interests!";
            }
        } else {
            // 2. Detect and store information
            let stored = false;

            // Name detection
            const nameMatch = input.match(/(?:my name is|i am|i'm)\s+([a-zA-Z\s]+)/i);
            if (nameMatch && !cleanInput.includes('like') && !cleanInput.includes('interest')) {
                const name = nameMatch[1].trim();
                // Filter out common words if it caught too much
                if (name.length > 0 && name.length < 50) {
                    memory.name = name;
                    stored = true;
                }
            }

            // Age detection
            const ageMatch = input.match(/(?:i am|i'm|age is)\s+(\d+)/i) || input.match(/(\d+)\s+years\s+old/i);
            if (ageMatch) {
                memory.age = ageMatch[1];
                stored = true;
            }

            // Interests detection
            const interestMatch = input.match(/(?:i like|interested in|interests are)\s+([a-zA-Z\s,]+)/i);
            if (interestMatch) {
                memory.interests = interestMatch[1].trim();
                stored = true;
            }

            if (stored) {
                saveMemory();
                return "Okay 👍";
            } else {
                return "That's cool! Tell me more about yourself or ask me something.";
            }
        }
    };

    if (chatbotToggle && chatbotWidget) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWidget.classList.toggle('active');
            const isOpen = chatbotWidget.classList.contains('active');

            // Toggle icons
            chatbotToggle.querySelector('.chat-icon').style.display = isOpen ? 'none' : 'block';
            chatbotToggle.querySelector('.close-icon').style.display = isOpen ? 'block' : 'none';

            if (isOpen) chatbotInput.focus();
        });

        chatbotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatbotInput.value.trim();
            if (!text) return;

            // Add user message
            addMessage(text, 'user');
            chatbotInput.value = '';

            // Bot processing delay
            setTimeout(() => {
                const reply = processBotReply(text);
                addMessage(reply, 'bot');
            }, 600);
        });
    }
});

