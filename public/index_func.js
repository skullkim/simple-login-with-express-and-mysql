const main = document.getElementById('main');
const login = document.getElementById('login');
login.addEventListener('click', (login_event) =>{
    main.setAttribute('action', "/login");
    main.setAttribute('method', "POST");
}); 

const sign_up = document.getElementById('sign-up');
const login_input = document.getElementsByClassName("login-input");
sign_up.addEventListener('click', () => {
    main.setAttribute('action', '/signup');
    main.setAttribute('method', 'GET');
})