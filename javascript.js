const famosos = {
            "Patriotas_Argentinos": [
                {nombre: "José de San Martín", descripcion: "Libertador de Argentina, Chile y Perú", imagen: "./img/proceres/sanmartin.webp"},
                {nombre: "Manuel Belgrano", descripcion: "Creador de la bandera argentina", imagen: "./img/proceres/manuel belgrano.webp"},
                {nombre: "Juan Martín de Pueyrredón", descripcion: "Director Supremo que apoyó las campañas libertadoras", imagen: "./img/proceres/pueyrredon.webp"},
                {nombre: "Martín Miguel de Güemes", descripcion: "Defensor del norte argentino con sus gauchos", imagen: "./img/proceres/martin guemes.webp"},
                {nombre: "Juana Azurduy", descripcion: "Heroína de la independencia, luchó junto a las tropas patriotas", imagen: "./img/proceres/jauana azurduy.webp"}
            ],
            "Presidentes_Argentinos": [
                {nombre: "Domingo Faustino Sarmiento", descripcion: "Impulsor de la educación pública", imagen: "./img/presidentes/faustino sarmiento.webp"},
                {nombre: "Bartolomé Mitre", descripcion: "Primer presidente de la Nación unificada", imagen: "./img/presidentes/bartolome mitre.webp"},
                {nombre: "Hipólito Yrigoyen", descripcion: "Primer presidente elegido por voto secreto y obligatorio", imagen: "./img/presidentes/hipolito yrigoyen.webp"},
                {nombre: "Juan Domingo Perón", descripcion: "Figura central del peronismo, tres veces presidente", imagen: "./img/presidentes/peron.webp"},
                {nombre: "Raúl Alfonsín", descripcion: "Presidente del retorno democrático en 1983", imagen: "./img/presidentes/raul alfonsin.webp"}
            ],
            "Actores_Argentinos": [
                {nombre: "Ricardo Darín", descripcion: "Actor de cine reconocido internacionalmente", imagen: "./img/actores/ricardo darin.webp"},
                {nombre: "Norma Aleandro", descripcion: "Actriz premiada en Hollywood y referente del teatro", imagen: "./img/actores/norma leandro.webp"},
                {nombre: "Luis Brandoni", descripcion: "Actor de cine, teatro y televisión", imagen: "./img/actores/luis brandoni.webp"},
                {nombre: "Mercedes Morán", descripcion: "Actriz destacada en cine y TV", imagen: "./img/actores/mercedes moran.webp"},
                {nombre: "Guillermo Francella", descripcion: "Actor de comedia y drama, muy popular en Argentina", imagen: "./img/actores/guillermo francella.webp"}
            ]
        };

        const categoryNames = {
            "Patriotas_Argentinos": "Patriota",
            "Presidentes_Argentinos": "Presidente",
            "Actores_Argentinos": "Actor"
        };

        let currentQuestionIndex = 0;
        let score = 0;
        let questions = [];
        let timer;
        let timeLeft = 10;
        let usedPersons = [];

        function generateQuestions() {
            questions = [];
            usedPersons = [];
            const allPersons = [];
            
            for (let category in famosos) {
                famosos[category].forEach(person => {
                    allPersons.push({...person, category});
                });
            }

            // Mezclar todas las personas
            const shuffledPersons = allPersons.sort(() => 0.5 - Math.random());

            for (let i = 0; i < 10 && i < shuffledPersons.length; i++) {
                const correctPerson = shuffledPersons[i];
                usedPersons.push(correctPerson.nombre);
                
                // Obtener opciones incorrectas (que no sean la correcta y no hayan sido usadas)
                const wrongOptions = allPersons.filter(p => 
                    p.nombre !== correctPerson.nombre && 
                    !usedPersons.includes(p.nombre)
                );
                
                // Seleccionar 3 opciones incorrectas aleatorias
                const shuffled = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
                
                // Mezclar la respuesta correcta con las incorrectas
                const options = [...shuffled, correctPerson].sort(() => 0.5 - Math.random());
                
                questions.push({
                    question: correctPerson.descripcion,
                    correct: correctPerson.nombre,
                    options: options.map(p => p.nombre),
                    category: correctPerson.category,
                    imagen: correctPerson.imagen
                });
            }
        }

        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            generateQuestions();
            
            document.getElementById('startScreen').classList.add('hidden');
            document.getElementById('resultScreen').classList.add('hidden');
            document.getElementById('gameScreen').classList.remove('hidden');
            
            showQuestion();
        }

        function showQuestion() {
            if (currentQuestionIndex >= 10) {
                showResults();
                return;
            }

            const question = questions[currentQuestionIndex];
            timeLeft = 10;
            
            document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
            document.getElementById('scoreValue').textContent = score;
            document.getElementById('questionText').textContent = question.question;
            document.getElementById('categoryBadge').textContent = categoryNames[question.category];
            document.getElementById('questionImage').src = question.imagen;
            document.getElementById('progressBar').style.width = ((currentQuestionIndex + 1) / 10 * 100) + '%';
            
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            
            const letters = ['A', 'B', 'C', 'D'];
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                optionDiv.innerHTML = `
                    <div class="option-letter">${letters[index]}</div>
                    <div>${option}</div>
                `;
                optionDiv.onclick = () => selectAnswer(option, optionDiv);
                optionsContainer.appendChild(optionDiv);
            });

            startTimer();
        }

        function startTimer() {
            clearInterval(timer);
            document.getElementById('timer').textContent = `⏱️ ${timeLeft}s`;
            
            timer = setInterval(() => {
                timeLeft--;
                document.getElementById('timer').textContent = `⏱️ ${timeLeft}s`;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    handleTimeout();
                }
            }, 1000);
        }

        function selectAnswer(selected, optionDiv) {
            clearInterval(timer);
            const question = questions[currentQuestionIndex];
            const allOptions = document.querySelectorAll('.option');
            
            allOptions.forEach(opt => {
                opt.classList.add('disabled');
                if (opt.textContent.includes(question.correct)) {
                    opt.classList.add('correct');
                }
            });

            if (selected === question.correct) {
                score += 10;
                optionDiv.classList.add('correct');
            } else {
                optionDiv.classList.add('incorrect');
            }

            document.getElementById('scoreValue').textContent = score;
            
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 2000);
        }

        function handleTimeout() {
            const question = questions[currentQuestionIndex];
            const allOptions = document.querySelectorAll('.option');
            
            allOptions.forEach(opt => {
                opt.classList.add('disabled');
                if (opt.textContent.includes(question.correct)) {
                    opt.classList.add('correct');
                }
            });

            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion();
            }, 2000);
        }

        function showResults() {
            clearInterval(timer);
            document.getElementById('gameScreen').classList.add('hidden');
            document.getElementById('resultScreen').classList.remove('hidden');
            
            const percentage = (score / 100) * 100;
            let message, description;
            
            if (percentage === 100) {
                message = "¡Perfecto!";
                description = "Eres un maestro de la historia latinoamericana";
            } else if (percentage >= 70) {
                message = "¡Excelente!";
                description = "Muy buen conocimiento";
            } else if (percentage >= 40) {
                message = "¡Bien hecho!";
                description = "Conoces lo básico, pero puedes mejorar";
            } else {
                message = "Sigue practicando";
                description = "Necesitas repasar más historia";
            }
            
            document.getElementById('resultMessage').textContent = message;
            document.getElementById('finalScore').textContent = score;
            document.getElementById('resultDescription').textContent = description;
        }

        function goToStart() {
            document.getElementById('resultScreen').classList.add('hidden');
            document.getElementById('startScreen').classList.remove('hidden');
        }
