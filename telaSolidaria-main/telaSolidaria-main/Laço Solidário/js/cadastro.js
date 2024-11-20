const formulario = document.querySelector("form");
const Inome = document.querySelector(".nome");
const Icpf = document.querySelector(".cpf");
const Itelefone = document.querySelector(".telefone");
const Ilogin = document.querySelector(".login");
const Isenha = document.querySelector(".senha");

function limpar() {
    Inome.value = "";
    Icpf.value = "";
    Itelefone.value = "";
    Ilogin.value = "";
    Isenha.value = "";
};

function redirecionarPagina() {
    window.location.href = "tela-login.html";
}

formulario.addEventListener('submit', function (event) {
    event.preventDefault();

    // Verifica se todos os campos estão preenchidos
    if (Inome.value && Icpf.value && Itelefone.value && Ilogin.value && Isenha.value) {
        cadastrar();
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

async function verificarDuplicatas(usuario) {
    try {
        const response = await fetch("http://localhost:8080/usuario/cadastro", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            const data = await response.text();
            return data.includes("login") || data.includes("cpf");
        } else {
            alert("Cadastro concluído com sucesso!");
            limpar();
            redirecionarPagina();
        }

        return false; // Não há duplicatas
    } catch (error) {
        console.error("Erro na verificação de duplicatas:", error);
        return false; // Assume que não há duplicatas em caso de erro
    }
}

async function cadastrar() {
    const usuario = {
        nome: Inome.value,
        cpf: Icpf.value,
        telefone: Itelefone.value,
        login: Ilogin.value,
        senha: Isenha.value,
        tipo_de_usuario: "doador" // Define o tipo de usuário como "doador"
    };

    const duplicatas = await verificarDuplicatas(usuario);

    if (duplicatas) {
        alert("E-mail ou CPF já cadastrados.");
        return;
    }
}
