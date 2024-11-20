document.addEventListener('DOMContentLoaded', function () {
    // Função para verificar se os botões existem no DOM
    function verificarBotoes() {
        const btnCadastro = document.querySelector('.cadastro-inicio');
        const btnLogin = document.querySelector('.login-inicio');
        const btnSair = document.querySelector('.sair-inicio');

        // Verifica se todos os botões necessários foram encontrados
        if (!btnCadastro || !btnLogin || !btnSair) {
            console.error("Erro: Um ou mais botões não foram encontrados.");
            return null; // Retorna null se algum botão não for encontrado
        }

        return { btnCadastro, btnLogin, btnSair }; // Retorna os botões se encontrados
    }

    // Função para atualizar os botões com base no login
    function atualizarBotao() {
        const botoes = verificarBotoes(); // Verifica se os botões existem
        if (!botoes) return; // Não faz nada se os botões não foram encontrados

        const { btnCadastro, btnLogin, btnSair } = botoes;

        const token = localStorage.getItem('token'); // Verifica se o usuário tem um token
        console.log("Token recebido:", token);

        if (token) {
            // Se o usuário estiver logado, esconde "Cadastro" e "Login" e mostra "Sair"
            btnCadastro.style.display = 'none';
            btnLogin.style.display = 'none';
            btnSair.style.display = 'inline-block';
        } else {
            // Caso contrário, mostra "Cadastro" e "Login" e esconde "Sair"
            btnCadastro.style.display = 'inline-block';
            btnLogin.style.display = 'inline-block';
            btnSair.style.display = 'none';
        }
    }

    // Atualiza os botões assim que a página carregar
    atualizarBotao();

    // Lógica de login
    const formulario = document.querySelector("form");
    const Ilogin = document.querySelector(".login");
    const Isenha = document.querySelector(".senha");

    if (formulario) {
        formulario.addEventListener('submit', function (event) {
            event.preventDefault(); // Previne o envio do formulário
            login(Ilogin.value, Isenha.value); // Chama a função de login
        });
    }

    // Função de login que realiza a requisição
    function login(login, senha) {
        if (!login || !senha) {
            alert("Por favor, preencha todos os campos de login.");
            return;
        }

        fetch("http://localhost:8080/usuario/login", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                login: login,
                senha: senha
            })
        })
        .then(function (res) {
            if (!res.ok) {
                return res.json().then(function (erro) {
                    throw new Error(erro.message || "Erro desconhecido");
                });
            }
            return res.json(); // Retorna o JSON da resposta
        })
        .then(function (data) {
            const token = data.token; // Pega o token da resposta
            localStorage.setItem('token', token); // Armazena o token no localStorage

            // Atualiza os botões após o login
            atualizarBotao();
            alert("Bem-vindo ao Laço Solidário!");
            window.location.href = "index.html"; // Redireciona para a página inicial
        })
        .catch(function (error) {
            alert('senha ou e-mail inválidos!'); // Exibe erro se falhar
        });
    }

    // Função de logout
    window.logout = function () {
        localStorage.removeItem('token'); // Remove o token do localStorage
        atualizarBotao(); // Atualiza os botões após o logout
        window.location.href = "index.html"; // Redireciona para a página inicial
    };
});
