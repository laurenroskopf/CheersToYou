//Shopping cart html

// document.querySelector("#sc-price").innerHTML += ``;

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

// Get the documents from the Reviews Collection in Firebase
function load_data(coll, loc, field, val) {
  // check if we pass all 4 arguments
  let query = "";

  if (field && val) {
    query = db.collection(coll).where(field, "==", val);
  } else {
    query = db.collection(coll);
  }

  query.get().then((res) => {
    let documents = res.docs;
    // html reference
    html = "";
    // loop through the documents array
    documents.forEach((doc) => {
      //create review box on html
      html += `<div class="box">`;
      // check if current user email matches email stored on the document

      if (auth.currentUser.email == doc.data().user_email) {
        // show button to delete if post was created by current user
        html += `<h1 class="title">${
          doc.data().title
        } <button class="button is-size-5 is-pulled-right is-white has-text-danger-dark" onclick="del_doc('reviews', '${
          doc.id
        }')"> <i class="fa-solid fa-trash-can is-size-4"></i></button> </h1>`; // add the review title inside an h1 and trash can image on right side of div
      } else {
        // hide button to delete if post was not created by current user
        html += `<h1 class="title is-size-4">${doc.data().title} </h1>`; // add the review title inside an h1
      }
      //add review posted by user to review box
      html += `<p class="  p-2">Posted by User: ${doc.data().user_email}</p>`;
      //add line between the user and the review content
      html += `<hr>`;
      //add review content to review box
      html += `<p>${doc.data().desc}</p>`;
      //end review box
      html += `</div>`;
    });

    // ensure the loc div is not hidden
    r_e(loc).classList.remove("is-hidden");

    // show on the content div
    r_e(loc).innerHTML = html;
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
});

// track user authentication status with onauthstatechanged
auth.onAuthStateChanged((user) => {
  // check if user signed in or out
  if (user) {
    // show sign in successful message on message bar
    configure_message_bar(
      `${auth.currentUser.email} is successfully signed in`
    );

    // show user email in navigation bar
    r_e("user_email").innerHTML = auth.currentUser.email;

    // // configure main column content
    // configure_content(user);

    // configure the navigation bar
    configure_nav_bar(user);

    r_e("must_signin").classList.add("is-hidden");
    r_e("checkout").classList.remove("is-hidden");
  } //if user signed out
  else {
    // show sign out message to user on message bar
    configure_message_bar("You signed out successfully");

    // remove user email from navigation bar
    r_e("user_email").innerHTML = "";

    // // configure main column content
    // configure_content();

    // configure the navigation bar
    configure_nav_bar();

    r_e("must_signin").classList.add("is-active");
    r_e("checkout").classList.add("is-hidden");
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
//variables for divs
let home = document.querySelector("#Index");
let pennants = document.querySelector("#pen");
let garlands = document.querySelector("#Garlands");
let banners = document.querySelector("#Banners");
let ms = document.querySelector("#Milestone");
let framed = document.querySelector("#Framed");
let custom = document.querySelector("#Custom");
let gallery = document.querySelector("#Gallery");
let maker = document.querySelector("#Maker");
let shop = document.querySelector("#Shopping");
let contact = document.querySelector("#Contact");

//variables for navbar
let homenav = document.querySelector("#homepg");
let pennantnav = document.querySelector("#pennantspg");
let garlandsnav = document.querySelector("#garlandspg");
let bannersnav = document.querySelector("#bannerspg");
let msnav = document.querySelector("#milestonepg");
let framednav = document.querySelector("#framedpg");
let customnav = document.querySelector("#custompg");
let gallerynav = document.querySelector("#gallerypg");
let makernav = document.querySelector("#makerpg");
let scnav = document.querySelector("#shoppingCart");
let contactnav = document.querySelector("#contactpg");

//variables for home page
let homepen = document.querySelector("#homepen");
let homegar = document.querySelector("#homegar");
let homeban = document.querySelector("#homeban");
let homems = document.querySelector("#homems");
let homeframe = document.querySelector("#homeframe");
let homecust = document.querySelector("#homecust");
let homepen1 = document.querySelector("#homepen1");
let homegar1 = document.querySelector("#homegar1");
let homeban1 = document.querySelector("#homeban1");
let homems1 = document.querySelector("#homems1");
let homeframe1 = document.querySelector("#homeframe1");
let homecust1 = document.querySelector("#homecust1");

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
bannersnav.addEventListener("click", () => {
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

//framed art page
framednav.addEventListener("click", () => {
  framed.classList.add("is-active");
  framed.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Framed") {
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

//custom art page
customnav.addEventListener("click", () => {
  custom.classList.add("is-active");
  custom.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Custom") {
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
  contact.classList.add("is-active");
  contact.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Contact") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
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

//framed art page
homeframe.addEventListener("click", () => {
  framed.classList.add("is-active");
  framed.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Framed") {
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

//custom art page
homecust.addEventListener("click", () => {
  custom.classList.add("is-active");
  custom.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Custom") {
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

//framed art page
homeframe1.addEventListener("click", () => {
  framed.classList.add("is-active");
  framed.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Framed") {
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

//custom art page
homecust1.addEventListener("click", () => {
  custom.classList.add("is-active");
  custom.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Custom") {
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
}

let addToCartPen = document.querySelector("#addPennant");
let addToCartBan = document.querySelector("#addBanner");
let addToCartGar = document.querySelector("#addGarland");
let addToCartMS = document.querySelector("#addMS");
let addToCartCust = document.querySelector("#addCustom");

addToCartPen.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    color1: document.querySelector("#penColor").value,
    color2: document.querySelector("#fontColorPen").value,
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

addToCartBan.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    color1: document.querySelector("#banColor").value,
    color2: document.querySelector("#fontColorBan").value,
    customization: document.querySelector("#banPersonal").value,
    productType: "Banner",
    price: 30,
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));

  //reset the form
  document.querySelector("#banPersonal").value = "";
});

addToCartGar.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    color1: document.querySelector("#garColor").value,
    customization: document.querySelector("#garPersonal").value,
    productType: "Garland",
    price: 45,
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));

  //reset the form
  document.querySelector("#garPersonal").value = "";
});

addToCartMS.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    color1: document.querySelector("#msColor").value,
    color2: document.querySelector("#fontColorMS").value,
    customization: document.querySelector("#msPersonal").value,
    productType: "Milestone Set",
    price: 55,
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));

  //reset the form
  document.querySelector("#msPersonal").value = "";
});

addToCartCust.addEventListener("click", (event) => {
  event.preventDefault();

  let orderItem = {
    color1: document.querySelector("#custColor").value,
    color2: document.querySelector("#fontColorCust").value,
    customization: document.querySelector("#CustPersonal").value,
    productType: "Custom Request",
    price: 70,
  };

  db.collection("OrderItems")
    .add(orderItem)
    .then(() => alert("Added to Cart!"));

  //reset the form
  document.querySelector("#custPersonal").value = "";
});

db.collection("OrderItems")
  .get()
  .then((data) => {
    let docs = data.docs;
    let html = ``;
    docs.forEach((doc) => {
      html += `<div class="box pb-6 pr-0 columns">
            <div class="column is-2">
              <figure class="image is-96x96">
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
            <div onclick="del_doc('${
              doc.id
            }')" class="is-clickable "><i class="fa-regular fa-trash-can is-size-4 mr-5"></i></div>
          </div>`;
    });

    document.querySelector("#cart").innerHTML += html;
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

  console.log(m1);

  db.collection("ContactForm").add(m1);

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
db.collection("OrderItems")
  .get()
  .then((data) => {
    let docs = data.docs;
    let total = 0;
    docs.forEach((doc) => {
      total += doc.data().price;
    });
    console.log(total);
    document.querySelector(
      "#venmo_total"
    ).innerHTML += `<h6 class ="m-5 is-size-4"><b>
Your total is $${total}
<b></h6>`;
  });

//accept payment
r_e("order-agree").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo-modal").classList.add("is-hidden");
  configure_message_bar(`Order successfully submitted`);
});

//back or exit
r_e("back-button").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo-modal").classList.add("is-hidden");
});

r_e("venmo-modalbg").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo-modal").classList.add("is-hidden");
});

r_e("checkout").addEventListener("click", (event) => {
  r_e("venmo-modal").classList.add("is-active");
});
