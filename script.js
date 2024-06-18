document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registrarForm = document.getElementById('registrarForm');
    const reservarForm = document.getElementById('reservarForm');
    const reservasList = document.getElementById('reservasList');

    // Função para ler dados do banco de dados (JSON)
    function readDatabase() {
        return JSON.parse(localStorage.getItem('database')) || { users: [], reservas: {} };
    }

    // Função para salvar dados no banco de dados (JSON)
    function saveDatabase(data) {
        localStorage.setItem('database', JSON.stringify(data));
    }

    // Registrar
    if (registrarForm) {
        registrarForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;

            let database = readDatabase();
            let userExists = database.users.some(user => user.username === username);

            if (userExists) {
                alert('Usuário já existe. Escolha outro nome de usuário.');
            } else {
                database.users.push({ username, password });
                saveDatabase(database);
                alert('Registro bem-sucedido! Você pode fazer login agora.');
                window.location.href = 'login.html';
            }
        });
    }

    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            let database = readDatabase();
            let user = database.users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'ver_reservas.html';
            } else {
                alert('Usuário ou senha incorretos');
            }
        });
    }

    // Reservar
    if (reservarForm) {
        reservarForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const nome = document.getElementById('nome').value;
            const dataEntrada = document.getElementById('dataEntrada').value;
            const dataSaida = document.getElementById('dataSaida').value;
            const username = localStorage.getItem('loggedInUser');

            let database = readDatabase();
            let reservas = database.reservas[username] || [];

            // Verificar se já existe uma reserva para as datas fornecidas
            const dataConflito = reservas.some(reserva => 
                (reserva.dataEntrada === dataEntrada) || (reserva.dataSaida === dataSaida) || 
                (dataEntrada >= reserva.dataEntrada && dataEntrada <= reserva.dataSaida) ||
                (dataSaida >= reserva.dataEntrada && dataSaida <= reserva.dataSaida)
            );

            if (dataConflito) {
                alert('Já existe uma reserva para a data fornecida. Por favor, escolha outra data.');
            } else {
                reservas.push({ nome, dataEntrada, dataSaida });
                database.reservas[username] = reservas;
                saveDatabase(database);
                alert('Reserva feita com sucesso!');
            }
        });
    }

    // Ver Reservas
    if (reservasList) {
        const username = localStorage.getItem('loggedInUser');

        if (!username) {
            window.location.href = 'login.html';
        }

        let database = readDatabase();
        let reservas = database.reservas[username] || [];

        reservas.forEach(reserva => {
            let div = document.createElement('div');
            div.className = 'reserva';
            div.innerHTML = `
                <p><strong>Nome:</strong> ${reserva.nome}</p>
                <p><strong>Entrada:</strong> ${reserva.dataEntrada}</p>
                <p><strong>Saída:</strong> ${reserva.dataSaida}</p>
            `;
            reservasList.appendChild(div);
        });
    }
});
