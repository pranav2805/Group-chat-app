const API = 'http://localhost:5000';
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMsg = document.querySelector('.error-msg');

form.addEventListener('submit', login);

function login(e){
    e.preventDefault();

    let loginDetails = {
        email: emailInput.value,
        password: passwordInput.value
    }

    axios.post(`${API}/login`, loginDetails)
    .then(response => {
        alert(response.data.message);
        //response.redirect('/expenses');
        localStorage.setItem('token', response.data.token);
        window.location.href = "chat.html"
    })
    .catch(err => {
        //alert(err.response.data.message);
        showErrorOnScreen(err.response.data.message);
    })
}

function showErrorOnScreen(msg) {
    //console.log(msg);
    errorMsg.innerHTML = `<p> ${msg} </p>`
    setTimeout(() => errorMsg.remove(), 5000);
}