//Shopping cart html

// document.querySelector("#sc-price").innerHTML += ``;

//variables associated with signing up  
let signupbtn = document.querySelector('#signupbtn');
let signup_modal = document.querySelector('#signup_modal');
let signup_modalbg = document.querySelector('#signup_modalbg');

//variables associated with signing in  
let signinbtn = document.querySelector('#signinbtn');
let signin_modal = document.querySelector('#signin_modal');
let signin_modalbg = document.querySelector('#signin_modalbg');


// sign-up modal link
signupbtn.addEventListener('click', () => {
    signup_modal.classList.add('is-active');
});
// sign-up modal close
signup_modalbg.addEventListener('click', () => {
    signup_modal.classList.remove('is-active');
});

// sign-in modal link
signinbtn.addEventListener('click', () => {
    signin_modal.classList.add('is-active');
})
// sign-in modal close
signin_modalbg.addEventListener('click', () => {
    signin_modal.classList.remove('is-active');
});