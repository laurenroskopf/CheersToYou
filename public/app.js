//Shopping cart html

//variables associated with signing up
let signupbtn = document.querySelector("#signupbtn");
let signup_modal = document.querySelector("#signup_modal");
let signup_modalbg = document.querySelector("#signup_modalbg");

//variables associated with signing in
let signinbtn = document.querySelector("#signinbtn");
let signin_modal = document.querySelector("#signin_modal");
let signin_modalbg = document.querySelector("#signin_modalbg");

//functions
function r_e(id) {
  return document.querySelector(`#${id}`);
}

function load_sc_data() {
  db.collection("OrderItems")
    .get()
    .then((data) => {
      let docs = data.docs;
      let html = ``;
      docs.forEach((doc) => {
        console.log(auth.currentUser.email);
        console.log(doc.data().email);
        console.log(doc.data().customization);
        if (auth.currentUser.email == doc.data().email) {
          html += `<div class="box pb-6 m-3 pr-0 columns">
            <div class="column is-2">
              <figure class="image is-square">
                <img src="pennants.png" alt="Product 1" />
              </figure>
            </div>
            <div class="column is-4">
              <h3 id="type"class="subtitle is-5">${doc.data().productType}</h3>
              <p>Color 1: ${doc.data().color1}</p>
              <p>Color 2: ${doc.data().color2}</p>
              <p>Customization: ${doc.data().customization}</p>
            </div>

            <!-- need to change to js -->
            <div class="column">$${parseFloat(doc.data().price).toFixed(
            2
          )}</div>
            <div onclick="del_doc('${doc.id
            }')" class="is-clickable "><i class="fa-regular fa-trash-can is-size-4 mr-5"></i></div>
          </div>`;
        }
      });
      document.querySelector("#cart").innerHTML += html;
    });
}

//update doc 
function update_doc(ele, id) {

  let inputs = ele.parentNode.querySelectorAll("input");

  inputs[0].type = "text";
  inputs[1].type = "text";

  db.collection("people").doc(id).update({
    name: inputs[0].value,
    color: inputs[1].value,
  });
}

// configure the message bar
function configure_message_bar(msg) {
  // enforce message bar being visible
  r_e("message_bar").classList.remove("is-hidden");

  // alert(msg);
  r_e("message_bar").innerHTML = msg;

  // hide the message bar after 1 seconds
  setTimeout(() => {
    r_e("message_bar").innerHTML = ""; //clear the text from the message bar
    r_e("message_bar").classList.add("is-hidden");
  }, 4000);
}

// sign up user
r_e("signup_form").addEventListener("submit", (e) => {
  e.preventDefault(); //prevent default behaviour of browser (no page refresh)

  // grab the inputs for the email and password entered in the form
  let firstname = r_e("firstname").value;
  let lastname = r_e("lastname").value;
  let email = r_e("email").value;
  let phonenumber = r_e("phonenumber").value;
  let address = r_e("address").value;
  let password = r_e("password").value;

  // Ceate the user in firebase
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      r_e("message_bar").classList.remove("is-hidden");
      // show sign up successful message on message bar
      configure_message_bar(`${user.user.email} is successfully created`);
    })
    .catch((err) => {
      signup_modal.querySelector(".error").innerHTML = err.message;
    });

  // reset the form
  r_e("signup_form").reset();

  // close the modal
  r_e("signup_modal").classList.add("is-hidden");



  //create user in collection Customers
  let p1 = {
    FirstName: firstname,
    LastName: lastname,
    UserEmail: email,
    PhoneNumber: phonenumber,
    HomeAddress: address,
  };

  db.collection("Customers").add(p1);
});

//garland price function 
function getPrice(item) {
  if (item === 'Cheers ($40)') {
    return 40;
  } else if (item === 'Congrats ($47)') {
    return 47;
  } else if (item === 'Happy Birthday ($62)') {
    return 62;
  } else {
    return 62;
  }
}

//buntings price function
function getPrice2(item) {
  if (item === '3 ft. ($28)') {
    return 28;
  } else if (item === '6 ft. ($34)') {
    return 34;
  } else {
    return 40;
  }
}

// sign in user
r_e("signin_form").addEventListener("submit", (e) => {
  e.preventDefault(); //prevent default behaviour of browser (no page refresh)

  // grab the inputs for the email and password entered in the form
  let email = r_e("email_").value;
  let password = r_e("password_").value;

  // call the Firebase function to sign-in the user
  auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      // reset the form
      r_e("signin_form").reset();

      // close the modal
      r_e("signin_modal").classList.remove("is-active");
    })
    .catch((err) => {
      //catch any arror
      signin_modal.querySelector(".error").innerHTML = err.message;
    });
});

// sign out user
r_e("signoutbtn").addEventListener("click", () => {
  auth.signOut().then(() => {});
  orderbut.classList.remove("is-active");
  orderbut.classList.add("is-hidden");
  contactbut.classList.remove("is-active");
  contactbut.classList.add("is-hidden");
  r_e("accountbutton").classList.remove("is-hidden")
});

// track user authentication status with onauthstatechanged
auth.onAuthStateChanged((user) => {
  // check if user signed in or out
  if (user) {
    // show sign in successful message on message bar
    configure_message_bar(
      `${auth.currentUser.email} is successfully signed in`
    );

    // // configure main column content
    // configure_content(user);

    // configure the navigation bar
    configure_nav_bar(user);

    r_e("must_signin").classList.add("is-hidden");
    r_e("checkout").classList.remove("is-hidden");
    r_e("account").classList.add("is-active");
  } //if user signed out
  else {
    // show sign out message to user on message bar
    configure_message_bar("You signed out successfully");

    // // configure main column content
    // configure_content();

    // configure the navigation bar
    configure_nav_bar();

    r_e("must_signin").classList.add("is-active");
    r_e("checkout").classList.add("is-hidden");
    r_e("account").classList.add("is-hidden");
  }
});

// configure the navigation bar
function configure_nav_bar(user) {
  let signedin = document.querySelectorAll(".signedin");
  let signedout = document.querySelectorAll(".signedout");

  // check if user exists
  if (user) {
    // show all signedin links
    signedin.forEach((link) => {
      link.classList.remove("is-hidden");
    });
    // hide all signedout links
    signedout.forEach((link) => {
      link.classList.add("is-hidden");
    });
  } else {
    // If user is not found show (signed out or brand new user) show sign in or sign up

    // show all signedout links
    signedout.forEach((link) => {
      link.classList.remove("is-hidden");
    });

    // hide all signedin links
    signedin.forEach((link) => {
      link.classList.add("is-hidden");
    });
  }
}

// sign-up modal link
signupbtn.addEventListener("click", () => {
  signup_modal.classList.add("is-active");
});
// sign-up modal close
signup_modalbg.addEventListener("click", () => {
  signup_modal.classList.remove("is-active");
});

// sign-in modal link
signinbtn.addEventListener("click", () => {
  signin_modal.classList.add("is-active");
});
// sign-in modal close
signin_modalbg.addEventListener("click", () => {
  signin_modal.classList.remove("is-active");
});

//variables for adding to cart
let addBtn = document.querySelector("#addBtn");

//single page app
//variables for divs
let home = document.querySelector("#Index");
let pennants = document.querySelector("#pen");
let garlands = document.querySelector("#Garlands");
let buntings = document.querySelector("#Buntings");
let ms = document.querySelector("#Milestone");
let gallery = document.querySelector("#Gallery");
let maker = document.querySelector("#Maker");
let shop = document.querySelector("#Shopping");
let contact = document.querySelector("#Contact");
//admin divs
let orders = document.querySelector("#Orders");
let contactreq = document.querySelector("#Contactreq");
//account div
let account = document.querySelector("#Account");

//variables for navbar
let homenav = document.querySelector("#homepg");
let pennantnav = document.querySelector("#pennantspg");
let garlandsnav = document.querySelector("#garlandspg");
let buntingnav = document.querySelector("#buntingpg");
let msnav = document.querySelector("#milestonepg");
let gallerynav = document.querySelector("#gallerypg");
let makernav = document.querySelector("#makerpg");
let scnav = document.querySelector("#shoppingCart");
let contactnav = document.querySelector("#contactpg");
//admin buttons
let ordernav = document.querySelector("#orderpg");
let orderbut = document.querySelector("#orderbutton");
let contactreqnav = document.querySelector("#contactreqpg");
let contactbut = document.querySelector("#contactbutton");
//account button
let accountnav = document.querySelector("#accountpg");

//variables for home page
let homepen = document.querySelector("#homepen");
let homegar = document.querySelector("#homegar");
let homeban = document.querySelector("#homeban");
let homems = document.querySelector("#homems");
let homepen1 = document.querySelector("#homepen1");
let homegar1 = document.querySelector("#homegar1");
let homeban1 = document.querySelector("#homeban1");
let homems1 = document.querySelector("#homems1");
let homeframe1 = document.querySelector("#homeframe1");
let homecust1 = document.querySelector("#homecust1");













auth.onAuthStateChanged((user) => {
  if (user) {
    if (auth.currentUser.email == "alice28512@gmail.com") {
      //add navbar for orders & contact form

      orderbut.classList.add("is-active");
      orderbut.classList.remove("is-hidden");
      contactbut.classList.add("is-active");
      contactbut.classList.remove("is-hidden");
      r_e("accountbutton").classList.add("is-hidden")
      r_e("maker_edit_div").classList.add('is-active');
      r_e("maker_edit_div").classList.remove('is-hidden');
      r_e("maker_title_div").classList.remove('is-hidden');
      r_e("maker_title_div").classList.add('is-active');
      //update = part 2
    }
  }
});






//home page

homenav.addEventListener("click", (event) => {
  event.preventDefault();

  home.classList.add("is-active");
  home.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Index") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//pennants page
pennantnav.addEventListener("click", () => {
  pennants.classList.add("is-active");
  pennants.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "pen") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//garlands page
garlandsnav.addEventListener("click", () => {
  garlands.classList.add("is-active");
  garlands.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Garlands") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//banners page
buntingnav.addEventListener("click", () => {
  buntings.classList.add("is-active");
  buntings.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Buntings") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//milestonesets page
msnav.addEventListener("click", () => {
  ms.classList.add("is-active");
  ms.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Milestone") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//gallery page
gallerynav.addEventListener("click", () => {
  gallery.classList.add("is-active");
  gallery.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Gallery") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//about us
makernav.addEventListener("click", () => {
  maker.classList.add("is-active");
  maker.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Maker") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//contact me
contactnav.addEventListener("click", () => {
  console.log("contact nav w no issues")
  contact.classList.add("is-active");
  contact.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Contact") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
  console.log("contact nav w no issues")
});

//shopping cart
scnav.addEventListener("click", () => {
  shop.classList.add("is-active");
  shop.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Shopping") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

accountnav.addEventListener("click", () => {
  account.classList.add("is-active");
  account.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Account") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//home page picture links
//pennants page
homepen.addEventListener("click", () => {
  pennants.classList.add("is-active");
  pennants.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "pen") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//garlands page
homegar.addEventListener("click", () => {
  garlands.classList.add("is-active");
  garlands.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Garlands") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//banners page
homeban.addEventListener("click", () => {
  banners.classList.add("is-active");
  banners.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Banners") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});



//milestonesets page
homems.addEventListener("click", () => {
  ms.classList.add("is-active");
  ms.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Milestone") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//home page word links
//pennants page
homepen1.addEventListener("click", () => {
  pennants.classList.add("is-active");
  pennants.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "pen") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//garlands page
homegar1.addEventListener("click", () => {
  garlands.classList.add("is-active");
  garlands.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Garlands") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//banners page
homeban1.addEventListener("click", () => {
  banners.classList.add("is-active");
  banners.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Banners") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});



//milestonesets page
homems1.addEventListener("click", () => {
  ms.classList.add("is-active");
  ms.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Milestone") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//orders admin page
ordernav.addEventListener("click", (event) => {
  event.preventDefault();

  orders.classList.add("is-active");
  orders.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Orders") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//contact form requests admin page
contactreqnav.addEventListener("click", (event) => {
  event.preventDefault();

  contactreq.classList.add("is-active");
  contactreq.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Contactreq") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
});

//adding order to shopping cart

function del_doc(id) {
  db.collection("OrderItems")
    .doc(id)
    .delete()
    .then(() => alert("Product deleted"));
  load_sc_data();
}

let addToCartPen = document.querySelector("#addPennant");
let addToCartBun = document.querySelector("#addBunting");
let addToCartGar = document.querySelector("#addGarland");
let addToCartMS = document.querySelector("#addMS");
let addToCartCust = document.querySelector("#addCustom");

addToCartPen.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    email: auth.currentUser.email,
    pennantColor: document.querySelector("#penColor").value,
    edgeColor: document.querySelector("#edgeColorPen").value,
    fontColor: document.querySelector("#fontColorPen").value,
    customization: document.querySelector("#penPersonal").value,
    productType: "Pennant",
    price: 50,
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));

  //reset the form
  document.querySelector("#penPersonal").value = "";
});

addToCartBun.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    email: auth.currentUser.email,
    color1: document.querySelector("#bcolor1").value,
    color2: document.querySelector("#bcolor2").value,
    color3: document.querySelector("#bcolor3").value,
    color4: document.querySelector("#bcolor4").value,
    letterType: document.querySelector("#bLetterType").value,
    productType: "Bunting",
    message: document.querySelector("#buntText").value,
    price: getPrice(document.querySelector("#buntText").value),
  };

  console.log(orderItem);

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));
});

addToCartGar.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {

    email: auth.currentUser.email,
    color1: document.querySelector("#gColor1").value,
    color2: document.querySelector("#gColor2").value,
    color3: document.querySelector("#gColor3").value,
    color4: document.querySelector("#gColor4").value,
    productType: "Garland",
    size: document.querySelector("#garSize").value,
    price: getPrice2(document.querySelector("#garSize").value)
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));
});

addToCartMS.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    email: auth.currentUser.email,
    productType: "Milestone Set",
    price: 48,
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));
});

function product_html(doc) {
  html = "";
  if (doc.data().productType == "Pennant") {
    html += `<p>Pennant Color: ${doc.data().pennantColor}</p>
    <p>Edge Color: ${doc.data().edgeColor}</p>
    <p>Font Color: ${doc.data().fontColor}<p>
    <p>Customization: ${doc.data().customization}</p>`;
  }

  if (doc.data().productType == "Bunting") {
    html += `<p>Flag Color 1: ${doc.data().color1}</p>
    <p>Flag Color 2: ${doc.data().color2}</p>
    <p>Flag Color 3: ${doc.data().color3}<p>
    <p>Flag Color 4: ${doc.data().color4}<p>
    <p>Letter Type: ${doc.data().letterType}</p>
    <p>Message: ${doc.data().message}</p>`;
  }

  if (doc.data().productType == "Garland") {
    html += `<p>Flag Color 1: ${doc.data().color1}</p>
    <p>Flag Color 2: ${doc.data().color2}</p>
    <p>Flag Color 3: ${doc.data().color3}<p>
    <p>Flag Color 4: ${doc.data().color4}<p>
    <p>Size: ${doc.data().size}<p>`;
  }

  return html;
}

// shopping cart data
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("OrderItems")
      .get()
      .then((data) => {
        let docs = data.docs;
        let html = ``;
        docs.forEach((doc) => {
          if (auth.currentUser.email == doc.data().email) {
            html += `<div class="box pb-6 m-3 pr-0 columns">
              <div class="column is-2">
                <figure class="image is-square">
                  <img src="pennants.png" alt="Product 1" />
                </figure>
              </div>
              <div class="column is-4">
                <h3 id="type"class="subtitle is-5">${doc.data().productType}</h3>
                <p>${product_html(doc)}</p>
              </div>
  
              <div class="column">$${parseFloat(doc.data().price).toFixed(2)}</div>
              <div onclick="del_doc('${doc.id
              }')" class="is-clickable "><i class="fa-regular fa-trash-can is-size-4 mr-5"></i></div>
            </div>`;
          }
        });
        document.querySelector("#cart").innerHTML += html;
      });
  }
})


function del_docreq(id) {
  db.collection("ContactForm")
    .doc(id)
    .delete()
    .then(() => alert("Message deleted"));
}

//load contact us form data
db.collection("ContactForm")
  .get()
  .then((data) => {
    let docs = data.docs;
    let html = ``;
    docs.forEach((doc) => {
      html += `<div class="box pb-6 m-3 pr-0 columns">
            <div class="column">
              <h2 id="type"class="subtitle is-5"> Name: ${doc.data().Name}</h2>
              <p>Email: ${doc.data().Email}</p>
              <p> Phone: ${doc.data().Phone}</p>
              <p> Message: ${doc.data().Message}</p>
            </div>

            <!-- need to change to js -->

            <div onclick="del_docreq('${doc.id
        }')" class="is-clickable "><i class="fa-regular fa-trash-can is-size-4 mr-5"></i></div>
          </div>`;
    });
    document.querySelector("#Contactreq").innerHTML += html;
  });


//contact us form
r_e("contactme_form").addEventListener("click", (e) => {
  e.preventDefault(); //prevent default behaviour of browser (no page refresh)

  //create user in collection Customers
  let m1 = {
    Name: r_e("name_cmf").value,
    Email: r_e("email_cmf").value,
    Phone: r_e("phone_cmf").value,
    Message: r_e("message_cmf").value,
  };

  db.collection("ContactForm")
    .add(m1)
    .then(() => alert("Request Submitted!"));

  //reset the form
  (r_e("name_cmf").value = ""),
  (r_e("email_cmf").value = ""),
  (r_e("phone_cmf").value = ""),
  (r_e("message_cmf").value = "");
});

//click checkout button

//subtotal area
let subtotal = 0;

//adding total to modal
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("OrderItems")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((order) => {
        let total = 0;
        order.forEach((doc) => {
          total += doc.data().price;
        });
        document.querySelector(
          "#venmo_total"
        ).innerHTML += `< h6 class ="m-5 is-size-4" > <b>Your total is $${total}<b></h6>`;
      });
  }
})


//submit edits to maker page
r_e("submit_maker_title_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection('Admin_Edits').doc('maker_body_edit').update({

    title: document.querySelector('#maker_title_edits').value,

  })


  db.collection('Admin_Edits').doc('maker_body_edit').get().then(
    (doc) => {

      document.querySelector('#maker_title_section').innerHTML = `<p class="title">${doc.data().title}</p>`

    }
  )

});

db.collection('Admin_Edits').doc('maker_body_edit').get().then(
  (doc) => {

    document.querySelector('#maker_title_section').innerHTML = `<p class="title">${doc.data().title}</p>`
  }
)


r_e("submit_maker_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection('Admin_Edits').doc('maker_body_edit').update({

    message: document.querySelector('#maker_edits').value,

  })


  db.collection('Admin_Edits').doc('maker_body_edit').get().then(
    (doc) => {

      document.querySelector('#maker_section').innerHTML = `<p>${doc.data().message}</p>`

    }
  )

});

db.collection('Admin_Edits').doc('maker_body_edit').get().then(
  (doc) => {

    document.querySelector('#maker_section').innerHTML = `<p>${doc.data().message}</p>`
  }
)



//accept payment
r_e("order_agree").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-hidden");
  configure_message_bar(`Order successfully submitted`);
});

//back or exit
r_e("back_button").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-hidden");
});

r_e("venmo_modalbg").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-hidden");
});

r_e("checkout").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-active");
});

r_e("order_agree").addEventListener("click", (e) => {
  e.preventDefault(); //prevent default behaviour of browser (no page refresh)

  const ordersData = [];

  db.collection("OrderItems")
    .where("email", "==", auth.currentUser.email)
    .get()
    .then((order) => {
      order.forEach((doc) => {
        // Push each order's data into the array
        ordersData.push(doc.data());
      });
      console.log(ordersData);

      db.collection("Orders").add({
        combinedData: ordersData, // Store the combined orders' data in a single field
        createdAt: Date.now(),
        user_venmo: r_e("user_venmo").value,
      });
      console.log("added to db");

      order.forEach((doc) => {
        db.collection("OrderItems").doc(doc.id).delete();
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });

  alert("Thanks for Ordering from Cheers to You!");
});

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("item-slide");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
}