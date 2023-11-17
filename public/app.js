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

//functions 
function r_e(id) {
    return document.querySelector(`#${id}`)
}

// configure the message bar
function configure_message_bar(msg) {

    // enforce message bar being visible
    r_e('message_bar').classList.remove('is-hidden');

    // alert(msg);
    r_e('message_bar').innerHTML = msg;

    // hide the message bar after 1 seconds
    setTimeout(() => {
        r_e('message_bar').innerHTML = ""; //clear the text from the message bar
        r_e('message_bar').classList.add('is-hidden');
    }, 4000)
}

// sign up user
r_e('signup_form').addEventListener('submit', (e) => {
    e.preventDefault(); //prevent default behaviour of browser (no page refresh)

    // grab the inputs for the email and password entered in the form
    let firstname = r_e('firstname').value;
    let lastname = r_e('lastname').value;
    let email = r_e('email').value;
    let phonenumber = r_e('phonenumber').value;
    let address = r_e('address').value;
    let password = r_e('password').value;

    // Ceate the user in firebase
    auth.createUserWithEmailAndPassword(email, password).then((user) => {

        // show sign up successful message on message bar
        configure_message_bar(`${user.user.email} is successfully created`)

        // reset the form
        r_e('signup_form').reset();

        // close the modal
        r_e('signup_modal').classList.remove('is-active');

    }).catch(err => {
        signup_modal.querySelector('.error').innerHTML = err.message;
    })

    //create user in collection Customers
    let p1 = {
        FirstName: firstname,
        LastName: lastname,
        UserEmail: email,
        PhoneNumber: phonenumber,
        HomeAddress: address,
    }

    db.collection("Customers").add(p1)

})

// sign in user
r_e('signin_form').addEventListener('submit', (e) => {
    e.preventDefault(); //prevent default behaviour of browser (no page refresh)

    // grab the inputs for the email and password entered in the form
    let email = r_e('email_').value;
    let password = r_e('password_').value;

    // call the Firebase function to sign-in the user
    auth.signInWithEmailAndPassword(email, password).then((user) => {
        // reset the form
        r_e('signin_form').reset();

        // close the modal
        r_e('signin_modal').classList.remove('is-active');

    }).catch(err => {
        //catch any arror
        signin_modal.querySelector('.error').innerHTML = err.message;
    })

})

// sign out user
r_e('signoutbtn').addEventListener('click', () => {
    auth.signOut().then(() => { })
})



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

//variables for adding to cart
let addBtn = document.querySelector('#addBtn');


// addBtn.addEventListener('click', () => {
//     alert("hello");


//     // let person = {
//     //     name: document.querySelector("#name").value,
//     //     age: parseInt(document.querySelector("#age").value),
//     //     color: document.querySelector("#favcolor").value

//     // }

//     // //console.log(person);
//     // db.collection('people')
//     //     .add(person)
//     //     .then(() => alert("new person added"));
//     // //.then only executes after add has finished.
//     // document.querySelector("#name").value = "";
//     // document.querySelector("#age").value = "";


// })

// //single page app
// //home page
// document.getElementById('homepg').addEventListener('click', function () {
//     var div = document.getElementById('myDiv');
//     div.classList.add('newClass'); // Adding a new class
//     // div.classList.remove('oldClass'); // Optionally, you can remove a class
// });

// //