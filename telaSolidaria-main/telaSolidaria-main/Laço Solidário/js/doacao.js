function decodeToken(token) {
    try {
        const payload = token.split('.')[1]; // Extrai a parte do payload do token
        const decodedPayload = atob(payload); // Decodifica o Base64
        const parsedPayload = JSON.parse(decodedPayload); // Converte para objeto JSON
        return parsedPayload;
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        return null;
    }
}


function enviarDoacao() {
    console.log("Função enviarDoacao foi chamada."); 

    // Captura os campos do formulário
    const categoriaSelecionada = document.querySelector('input[name="categoria"]:checked');
    const descricao = document.getElementById('descricao').value;
    const instituicao = document.getElementById('opcoes').value;

    // Verifica se algum campo está vazio
    if (!descricao || !instituicao || !categoriaSelecionada) {
        alert("Por favor, preencha todos os campos antes de enviar a doação.");
        return;
    }

    const categoriaId = parseInt(categoriaSelecionada.value); // Pega o valor do radio selecionado
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Usuário não está logado. Por favor, faça login.");
        window.location.href = 'tela-login.html';
        return;
    }

    // Decodifica o token para obter o ID do usuário
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.id) {
        alert("Token inválido ou ID do usuário não encontrado.");
        return;
    }
    const usuario = decodedToken.id;

    // Criação do objeto de doação com os dados dinâmicos
    const doacao = {
        categoria: categoriaId,
        descricao: descricao,
        data: new Date().toISOString().split('T')[0],
        instituicao: parseInt(instituicao),
        usuario: usuario // Adiciona o ID do usuário ao objeto de doação
    };

    console.log("Dados da doação:", doacao);

    fetch('http://localhost:8080/doacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(doacao)
    })
    .then(response => {
        console.log("Resposta do servidor:", response);

        // Verifica se a resposta é bem-sucedida (códigos 2xx)
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Não autorizado. Faça login novamente.");
            } else if (response.status === 404) {
                throw new Error("Instituição ou Categoria não encontrada.");
            } else {
                throw new Error(`Erro ao realizar a doação. Status: ${response.status}`);
            }
        }

        // Verifica se a resposta contém JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            throw new Error("Resposta do servidor não é do tipo JSON.");
        }
    })
    .then(data => {
        console.log("Dados recebidos:", data);
        if (data && data.message) {
            alert(data.message); // Exibe a mensagem de sucesso ou erro
            if (data.doacaoUri) {
                console.log("URI da doação:", data.doacaoUri); // Log do URI da doação
            }
            window.location.href = 'minhas-doacoes.html';
        } else {
            alert("Erro ao realizar a doação.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert(error.message);
    });
}

// Vincula a função enviarDoacao ao evento de clique do botão
document.getElementById('btnEnviarDoacao').addEventListener('click', enviarDoacao);
