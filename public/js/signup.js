const API = 'http://localhost:5000';
const form = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const numberInput = document.getElementById('number');
const passwordInput = document.getElementById('password');
const errorMsg = document.querySelector('.error-msg');

form.addEventListener('submit', addUser);

function addUser(e) {
    e.preventDefault();
    if(nameInput.value==='' || emailInput.value==='' || passwordInput.value===''){
        //msg.classList.add('error');
        showErrorOnScreen('Please enter all fields!')
        console.log('Please enter all fields');
    } 
    else {
        let userDetails = {
            name: nameInput.value,
            email: emailInput.value,
            number: numberInput.value,
            password: password.value
        }

        axios.post(`${API}/signup`, userDetails)
            .then(response => {
                alert(response.data.message);
                window.location.href = "login.html";
            })
            .catch(err => {
                //alert(err.response.data.message);
                showErrorOnScreen(err.response.data.message);
            })

        nameInput.value = '';
        emailInput.value = '';
        numberInput.value = '';
        passwordInput.value = '';
    }
}

function showErrorOnScreen(msg) {
    //console.log(msg);
    errorMsg.innerHTML = `<p> ${msg} </p>`
    setTimeout(() => errorMsg.remove(), 5000);
}