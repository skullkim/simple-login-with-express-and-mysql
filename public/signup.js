const signup = document.getElementById('signup');

const sign_button = document.getElementById('sign-button');
sign_button.addEventListener('click', () => {
    signup.setAttribute('action', '/signup/check-signup');
    signup.setAttribute('method', 'POST');
});

const main_page = document.getElementById('main-page');
main_page.addEventListener('click', () => {
    signup.setAttribute('action', '/');
    signup.setAttribute('method', 'GET');
})