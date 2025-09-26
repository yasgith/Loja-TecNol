// Função para exibir mensagens como Caixa de Diálogo
function showMessage(msg) {
    $("#textoDialog").html(msg);
    $.mobile.changePage("#msgDialog", { transition: "pop" });
}

// Validação simples do formulário de Contato
$(document).on("submit", "#contato", function (e) {
    e.preventDefault();

    // Corrigido: seleção correta dos campos pelo ID
    var name = $("#cname").val().trim();
    var email = $("#cemail").val().trim();
    var msg = $("#cmsg").val().trim();

    if (!name || !email || !msg) {
        showMessage("Preencha todos os campos.");
        return;
    }

    var arroba = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!arroba.test(email)) {
        showMessage("Email inválido.");
        return;
    }

    // Simula envio
    showMessage("Mensagem enviada com sucesso! Em breve entraremos em contato.");
    $(this)[0].reset();
});