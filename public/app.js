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


    }).catch(err => {
        signup_modal.querySelector('.error').innerHTML = err.message;
    })

    // reset the form
    r_e('signup_form').reset();

    // close the modal
    r_e('signup_modal').classList.add('is-hidden');

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
    auth.signOut().then(() => {})
})


// track user authentication status with onauthstatechanged
auth.onAuthStateChanged((user) => {
    // check if user signed in or out
    if (user) {
        // show sign in successful message on message bar
        configure_message_bar(`${auth.currentUser.email} is successfully signed in`)

        // show user email in navigation bar
        r_e('user_email').innerHTML = auth.currentUser.email;

        // configure main column content
        configure_content(user);

        // configure the navigation bar
        configure_nav_bar(user);

    } //if user signed out
    else {
        // show sign out message to user on message bar
        configure_message_bar("You signed out successfully")

        // remove user email from navigation bar
        r_e('user_email').innerHTML = "";

        // configure main column content
        configure_content();

        // configure the navigation bar
        configure_nav_bar();
        r_e('must_signin').innerHTML = `<p class="has-text-white is-size-3 has-text-centered">Please sign-in to place orders</p>`;
    }
})

// configure the navigation bar
function configure_nav_bar(user) {
    let signedin = document.querySelectorAll('.signedin');
    let signedout = document.querySelectorAll('.signedout');

    // check if user exists
    if (user) {
        // show all signedin links
        signedin.forEach(link => {
            link.classList.remove('is-hidden');
        })
        // hide all signedout links
        signedout.forEach(link => {
            link.classList.add('is-hidden');
        })

    } else {
        // If user is not found show (signed out or brand new user) show sign in or sign up 

        // show all signedout links
        signedout.forEach(link => {
            link.classList.remove('is-hidden');
        })

        // hide all signedin links
        signedin.forEach(link => {
            link.classList.add('is-hidden');
        })

    }

}


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

//single page app

// Function to handle showing a specific section and hiding others
function showSection(sectionId) {
    var div = document.getElementById(sectionId);
    div.classList.remove('is-hidden'); // Show the selected section

    // Hide other sections
    var allSections = document.querySelectorAll('.content'); // Select all sections by class
    allSections.forEach((section) => {
        if (section.id !== sectionId) {
            section.classList.add('is-hidden'); // Hide other sections
        }
    });
}

//home page
document.getElementById('homepg').addEventListener('click', () => {
    showSection('index.html');
});

//pennants page
document.getElementById('pennantspg').addEventListener('click', () => {
    showSection('pennants.html');
});

//garlands page
document.getElementById('garlandspg').addEventListener('click', () => {
    showSection('garlands.html');
});

//banners page
document.getElementById('bannerspg').addEventListener('click', () => {
    showSection('banners.html');
});

//framed art page
document.getElementById('framedpg').addEventListener('click', () => {
    showSection('framedart.html');
});

//milestonesets page
document.getElementById('milestonepg').addEventListener('click', () => {
    showSection('milestonesets.html');
});

//custom art page
document.getElementById('custompg').addEventListener('click', () => {
    showSection('custom.html');
});

//gallery page
document.getElementById('gallerypg').addEventListener('click', () => {
    showSection('gallery.html');
});

//about us
document.getElementById('makerpg').addEventListener('click', () => {
    showSection('aboutus.html');
});

//shopping cart
document.getElementById('shoppingCart').addEventListener('click', () => {
    showSection('shoppingcart.html');
});