 tailwind.config = {
            theme: {
                extend: {
                    animation: {
                        'float': 'float 6s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate',
                        'slide-up': 'slideUp 1s ease-out forwards',
                        'fade-in': 'fadeIn 1.5s ease-out forwards',
                        'bounce-slow': 'bounce 3s infinite',
                        'ring-spin': 'ringSpin 8s linear infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' }
                        },
                        glow: {
                            '0%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)' },
                            '100%': { boxShadow: '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(34, 197, 94, 0.6)' }
                        },
                        slideUp: {
                            '0%': { transform: 'translateY(100px)', opacity: '0' },
                            '100%': { transform: 'translateY(0)', opacity: '1' }
                        },
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' }
                        },
                        ringSpin: {
                            '0%': { transform: 'rotateY(0deg) rotateX(0deg)' },
                            '25%': { transform: 'rotateY(90deg) rotateX(15deg)' },
                            '50%': { transform: 'rotateY(180deg) rotateX(0deg)' },
                            '75%': { transform: 'rotateY(270deg) rotateX(-15deg)' },
                            '100%': { transform: 'rotateY(360deg) rotateX(0deg)' }
                        }
                    }
                }
            }
        }
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Play button functionality - redirect to game
        document.getElementById('playBtn').addEventListener('click', function() {
            
        window.location.href = "alper.html";
  
        });

        document.getElementById('startGameBtn').addEventListener('click', function() {
              window.location.href = "alper.html";
        });

        function showGameModal() {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                    <div class="text-6xl mb-4">🎮</div>
                    <h3 class="text-2xl font-bold mb-4 text-gray-800">Game Siap Dimulai!</h3>
                    <p class="text-gray-600 mb-6">Klik tombol di bawah untuk memulai Menara Bilangan 3D</p>
                    <div class="flex space-x-4 justify-center">
                        <button onclick="startGame()" class="bg-gradient-to-r from-red-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                            🚀 Mulai Game
                        </button>
                        <button onclick="closeModal()" class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors">
                            ❌ Tutup
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal when clicking overlay
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        function startGame() {
            // Here you would redirect to your actual game page
            // For example: window.location.href = 'game.html';
            alert('Redirecting to Menara Bilangan 3D Game...\n\nDalam implementasi nyata, ini akan mengarahkan ke halaman game Anda.');
            closeModal();
        }

        function closeModal() {
            const modal = document.querySelector('.fixed.inset-0');
            if (modal) {
                modal.remove();
            }
        }

        // Add some interactive animations on scroll
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelectorAll('.animate-float');
            
            parallax.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Add entrance animations when elements come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                }
            });
        }, observerOptions);

        // Observe all sections for animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
   