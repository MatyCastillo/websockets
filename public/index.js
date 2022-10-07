const socket = io();
const messageList = document.getElementById("list-message");
let messages = [];

socket.on("updateProducts", (data) => {
  let products = data.products;
  fetch("productsTemplate.handlebars")
    .then((string) => string.text())
    .then((template) => {
      const processedTemplate = Handlebars.compile(template);
      const templateObjets = {
        products: products,
      };
      const html = processedTemplate(templateObjets);
      let div = document.getElementById("listContainer");
      div.innerHTML = html;
    });
});

document.addEventListener("submit", enviarFormulario);

function enviarFormulario(event) {
  event.preventDefault();
  let form = document.getElementById("productForm");
  let data = new FormData(form);
  console.log("data", data);
  fetch("/api/products", {
    method: "POST",
    body: data,
  })
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      Swal.fire({
        title: "Éxito",
        text: json.message,
        icon: "success",
        timer: 2000,
      }).then((result) => {
        location.href = "/";
      });
    });
}
let sendButton = document.addEventListener(
  "click",
  document.getElementById("send")
);
let input = document.getElementById("message");
let inputName = document.getElementById("inputName");
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (!e.target.value) {
      Swal.fire({
        title: "Error!",
        text: "El mensaje se encuentra vacío",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputName.value)) {
      Swal.fire({
        title: "Error!",
        text: "El email no es válido",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return;
    }
    socket.emit("message", {
      inputName: inputName.value,
      timestamp: new Date().toLocaleString(),
      message: e.target.value,
    });
    input.value = "";
  }
});
socket.on("messagelog", (data) => {
  messages = data;
  messageList.innerText = "";
  messages.forEach((messages) => {
    showMessages(messages);
  });
});

socket.on("notification", (data) => {
  messages.push(data);
  showMessages(data);
});

function showMessages(data) {
  const li = document.createElement("li");
  li.innerHTML = `<p>
                <span style="font-weight: bold; color:blue">
                  ${data.inputName}
                </span>
                <span style='color: brown'>${data.timestamp}</span>
                <span style="color:#379C5D">
                 : <i>${data.message}</i>
                </span>
              </p>`;
  messageList.appendChild(li);
}
