document.addEventListener("DOMContentLoaded", cargarNumeros);

const numerosDiv = document.getElementById("numeros");
const numeroInput = document.getElementById("numeroInput");
const formulario = document.getElementById("formulario");

// ===============================
// MOSTRAR NÚMEROS DISPONIBLES
// ===============================
async function cargarNumeros() {
    const { data, error } = await supabase
        .from("numeros")
        .select("*")
        .order("numero", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    numerosDiv.innerHTML = "";

    data.forEach(num => {
        const div = document.createElement("div");
        div.innerText = num.numero;
        div.className = "num";

        if (num.estado === "ocupado") {
            div.classList.add("ocupado");
        } else {
            div.onclick = () => seleccionarNumero(num.numero);
        }

        numerosDiv.appendChild(div);
    });
}

function seleccionarNumero(numero) {
    numeroInput.value = numero;
}

// ===============================
// FORMULARIO
// ===============================
formulario.addEventListener("submit", async function (e) {
    e.preventDefault();

    const numero = parseInt(numeroInput.value);
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;

    if (!numero) {
        alert("Seleccioná un número.");
        return;
    }

    // LLAMAR A LA FUNCIÓN DE SUPABASE QUE RESERVA EL NÚMERO
    const { data, error } = await supabase.rpc("reservar_numero", {
        numero_elegido: numero,
        comprador_nombre: nombre + " / Tel: " + telefono
    });

    if (error) {
        alert("El número ya fue tomado por otra persona.");
        return;
    }

    alert("Reserva exitosa. Ahora realiza el pago a la cuenta PREX.");
    cargarNumeros();
});