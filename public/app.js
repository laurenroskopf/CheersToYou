//Shopping cart html
let slideIndex = 1;

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
  };

  db.collection("Customers").add(p1);
});

function getSelectedButton(button_label) {
  // var ele = document.getElementsByName(button_label);
  // if (ele[0].checked) {
  //   return "Option 1";
  // }
  // if (ele[1].checked) {
  //   return "Option 2";
  // }
  // if (ele[2].checked) {
  //   return "Option 3";
  // }
  // if (ele[3].checked) {
  //   return "Option 4";
  // } else {
  // }
  //  document.getElementById("result").innerHTML = "Choosen: "+ele[i].value;
}

//garland price function
function getPrice(item) {
  if (item === "Cheers ($40)") {
    return 40;
  } else if (item === "Congrats ($47)") {
    return 47;
  } else if (item === "Happy Birthday ($62)") {
    return 62;
  } else {
    return 62;
  }
}

//buntings price function
function getPrice2(item) {
  if (item === "3 ft. ($28)") {
    return 28;
  } else if (item === "6 ft. ($34)") {
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
      alert("Error with Sign in. Please try again");
    });
});

// sign out user
r_e("signoutbtn").addEventListener("click", () => {
  auth.signOut().then(() => {});
  orderbut.classList.remove("is-active");
  orderbut.classList.add("is-hidden");
  contactbut.classList.remove("is-active");
  contactbut.classList.add("is-hidden");
  r_e("accountbutton").classList.remove("is-hidden");
  location.reload();
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

function product_html(doc) {
  html = "";
  if (doc.data().productType == "Pennant") {
    html += `<p>Pennant Color: ${doc.data().pennantColor}</p>
    <p>Edge Color: ${doc.data().edgeColor}</p>
    <p>Font Color: ${doc.data().fontColor}<p>
    <p>Tab Color: ${doc.data().tabColor}<p>
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

function completed_product_html(doc) {
  html = "";
  if (doc.productType == "Pennant") {
    html += `<h6>${doc.productType} - $${doc.price}</h6>
    <p>Pennant Color: ${doc.pennantColor}</p>
    <p>Edge Color: ${doc.edgeColor}</p>
    <p>Font Color: ${doc.fontColor}<p>
    <p>Tab Color: ${doc.tabColor}<p>
    <p>Customization: ${doc.customization}</p>`;
  }

  if (doc.productType == "Bunting") {
    html += `<h6>${doc.productType} - $${doc.price}</h6>
    <p>Flag Color 1: ${doc.color1}</p>
    <p>Flag Color 2: ${doc.color2}</p>
    <p>Flag Color 3: ${doc.color3}<p>
    <p>Flag Color 4: ${doc.color4}<p>
    <p>Letter Type: ${doc.letterType}</p>
    <p>Message: ${doc.message}</p>`;
  }

  if (doc.productType == "Garland") {
    html += `<h6>${doc.productType} - $${doc.price}</h6>
    <p>Flag Color 1: ${doc.color1}</p>
    <p>Flag Color 2: ${doc.color2}</p>
    <p>Flag Color 3: ${doc.color3}<p>
    <p>Flag Color 4: ${doc.color4}<p>
    <p>Size: ${doc.size}<p>`;
  }

  if (doc.productType == "Milestone Set") {
    html += `<h6>${doc.productType} - $${doc.price}</h6>`;
  }

  return html;
}

// shopping cart data
function load_sc() {
  let html = ``;
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection("OrderItems")
        .get()
        .then((data) => {
          let docs = data.docs;
          docs.forEach((doc) => {
            if (auth.currentUser.email == doc.data().email) {
              html += `<div class="box pb-6 m-3 pr-0 columns">
                <div class="column is-2">
                  <figure class="image is-square">
                    <img src="pennants.png" alt="Product 1" />
                  </figure>
                </div>
                <div class="column is-4">
                  <h3 id="type"class="subtitle is-5">${
                    doc.data().productType
                  }</h3>
                  <p>${product_html(doc)}</p>
                </div>
    
                <div class="column">$${parseFloat(doc.data().price).toFixed(
                  2
                )}</div>
                <div onclick="del_doc('${
                  doc.id
                }')" class="is-clickable "><i class="fa-regular fa-trash-can is-size-4 mr-5"></i></div>
              </div>`;
            }
          });
          document.querySelector("#cart").innerHTML = html;
        });
    }
  });
  return html;
}

// order details for admin account
function load_order() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      //display customer orders
      db.collection("Orders")
        .get()
        .then((data) => {
          let docs = data.docs;
          let orderhtml = ``;
          docs.forEach((doc) => {
            //still need to get customer name from customer db
            orderhtml += `<div class="box">
              <div>
              <h3 id="type"class="subtitle is-5">Order</h3>    
              </div>
              <div>Customer Name:</div>
              <div>Ordered on ${doc.data().createdAt.toDate().getMonth()}/${doc
              .data()
              .createdAt.toDate()
              .getDate()}/${doc.data().createdAt.toDate().getFullYear()}</div>
              <div>Email: ${doc.data().combinedData[0].email}</div>
              <div>Total: $${doc.data().total}</div>
              <div>Venmo: @${doc.data().user_venmo}</div>
              <div>Shipping Address: ${doc.data().address} ${
              doc.data().city
            }, ${doc.data().state} ${doc.data().zip}</div>
              <br>`;
            let items = doc.data().combinedData;
            items.forEach((item) => {
              orderhtml += `<p>${completed_product_html(item)}</p>`;
            });
            orderhtml += `<div onclick="del_order('${doc.id}')" class="is-clickable button">Order Completed!</div>
              </div>
              </div>`;
          });
          document.querySelector("#adminOrders").innerHTML = orderhtml;
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    }
  });
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
      r_e("accountbutton").classList.add("is-hidden");
      r_e("maker_edit_div").classList.add("is-active");
      r_e("maker_edit_div").classList.remove("is-hidden");
      r_e("maker_title_div").classList.remove("is-hidden");
      r_e("maker_title_div").classList.add("is-active");
      r_e("pennant_home_edit_div").classList.add("is-active");
      r_e("pennant_home_edit_div").classList.remove("is-hidden");
      r_e("pennant_product_edit_div").classList.remove("is-hidden");
      r_e("pennant_product_edit_div").classList.add("is-active");
      r_e("pennant_price_edit_div").classList.remove("is-hidden");
      r_e("pennant_price_edit_div").classList.add("is-active");
      r_e("bunting_product_edit_div").classList.add("is-active");
      r_e("bunting_product_edit_div").classList.remove("is-hidden");
      r_e("bunting_home_edit_div").classList.remove("is-hidden");
      r_e("bunting_home_edit_div").classList.add("is-active");
      r_e("garland_product_edit_div").classList.add("is-active");
      r_e("garland_product_edit_div").classList.remove("is-hidden");
      r_e("garland_home_edit_div").classList.remove("is-hidden");
      r_e("garland_home_edit_div").classList.add("is-active");
      r_e("milestone_home_edit_div").classList.remove("is-hidden");
      r_e("milestone_home_edit_div").classList.add("is-active");
      r_e("milestone_product_edit_div").classList.remove("is-hidden");
      r_e("milestone_product_edit_div").classList.add("is-active");
      //update = part 2
      r_e("accountbutton").classList.add("is-hidden");
      r_e("maker_edit_div").classList.add("is-active");
      r_e("maker_edit_div").classList.remove("is-hidden");
      r_e("maker_title_div").classList.remove("is-hidden");
      r_e("maker_title_div").classList.add("is-active");
      r_e("pennant_home_edit_div").classList.add("is-active");
      r_e("pennant_home_edit_div").classList.remove("is-hidden");
      r_e("pennant_product_edit_div").classList.remove("is-hidden");
      r_e("pennant_product_edit_div").classList.add("is-active");
      r_e("bunting_product_edit_div").classList.add("is-active");
      r_e("bunting_product_edit_div").classList.remove("is-hidden");
      r_e("bunting_home_edit_div").classList.remove("is-hidden");
      r_e("bunting_home_edit_div").classList.add("is-active");
      r_e("garland_product_edit_div").classList.add("is-active");
      r_e("garland_product_edit_div").classList.remove("is-hidden");
      r_e("garland_home_edit_div").classList.remove("is-hidden");
      r_e("garland_home_edit_div").classList.add("is-active");
      r_e("milestone_home_edit_div").classList.remove("is-hidden");
      r_e("milestone_home_edit_div").classList.add("is-active");
      r_e("milestone_product_edit_div").classList.remove("is-hidden");
      r_e("milestone_product_edit_div").classList.add("is-active");
      r_e("bunting_price1_edit_div").classList.remove("is-hidden");
      r_e("bunting_price1_edit_div").classList.add("is-active");
      r_e("bunting_words1_edit_div").classList.remove("is-hidden");
      r_e("bunting_words1_edit_div").classList.add("is-active");
      r_e("bunting_price2_edit_div").classList.remove("is-hidden");
      r_e("bunting_price2_edit_div").classList.add("is-active");
      r_e("bunting_words2_edit_div").classList.remove("is-hidden");
      r_e("bunting_words2_edit_div").classList.add("is-active");
      r_e("bunting_price3_edit_div").classList.remove("is-hidden");
      r_e("bunting_price3_edit_div").classList.add("is-active");
      r_e("bunting_words3_edit_div").classList.remove("is-hidden");
      r_e("bunting_words3_edit_div").classList.add("is-active");
      r_e("bunting_price4_edit_div").classList.remove("is-hidden");
      r_e("bunting_price4_edit_div").classList.add("is-active");
      r_e("bunting_words4_edit_div").classList.remove("is-hidden");
      r_e("bunting_words4_edit_div").classList.add("is-active");
      r_e("ms_price_edit_div").classList.remove("is-hidden");
      r_e("ms_price_edit_div").classList.add("is-active");
      r_e("gar_price1_edit_div").classList.remove("is-hidden");
      r_e("gar_price1_edit_div").classList.add("is-active");
      r_e("gar_words1_edit_div").classList.remove("is-hidden");
      r_e("gar_words1_edit_div").classList.add("is-active");
      r_e("gar_price2_edit_div").classList.remove("is-hidden");
      r_e("gar_price2_edit_div").classList.add("is-active");
      r_e("gar_words2_edit_div").classList.remove("is-hidden");
      r_e("gar_words2_edit_div").classList.add("is-active");
      r_e("gar_price3_edit_div").classList.remove("is-hidden");
      r_e("gar_price3_edit_div").classList.add("is-active");
      r_e("gar_words3_edit_div").classList.remove("is-hidden");
      r_e("gar_words3_edit_div").classList.add("is-active");
      r_e("maker_image_div").classList.remove("is-hidden");
      r_e("maker_image_div").classList.add("is-active");
      r_e("home_bunting_div_image").classList.remove("is-hidden");
      r_e("home_bunting_div_image").classList.add("is-active");
      r_e("home_pennant_div_image").classList.remove("is-hidden");
      r_e("home_pennant_div_image").classList.add("is-active");
      r_e("home_garland_div_image").classList.remove("is-hidden");
      r_e("home_garland_div_image").classList.add("is-active");
      r_e("home_milestone_div_image").classList.remove("is-hidden");
      r_e("home_milestone_div_image").classList.add("is-active");
      r_e("gallery1_div_image").classList.remove("is-hidden");
      r_e("gallery1_div_image").classList.add("is-active");
      r_e("gallery2_div_image").classList.remove("is-hidden");
      r_e("gallery2_div_image").classList.add("is-active");
      r_e("gallery3_div_image").classList.remove("is-hidden");
      r_e("gallery3_div_image").classList.add("is-active");
      r_e("gallery4_div_image").classList.remove("is-hidden");
      r_e("gallery4_div_image").classList.add("is-active");
      r_e("gallery5_div_image").classList.remove("is-hidden");
      r_e("gallery5_div_image").classList.add("is-active");
      r_e("gallery6_div_image").classList.remove("is-hidden");
      r_e("gallery6_div_image").classList.add("is-active");
      r_e("gallery7_div_image").classList.remove("is-hidden");
      r_e("gallery7_div_image").classList.add("is-active");
      r_e("gallery8_div_image").classList.remove("is-hidden");
      r_e("gallery8_div_image").classList.add("is-active");
      r_e("gallery9_div_image").classList.remove("is-hidden");
      r_e("gallery9_div_image").classList.add("is-active");
      r_e("gallery10_div_image").classList.remove("is-hidden");
      r_e("gallery10_div_image").classList.add("is-active");
      r_e("gallery11_div_image").classList.remove("is-hidden");
      r_e("gallery11_div_image").classList.add("is-active");
      r_e("gallery12_div_image").classList.remove("is-hidden");
      r_e("gallery12_div_image").classList.add("is-active");
      r_e("gallery13_div_image").classList.remove("is-hidden");
      r_e("gallery13_div_image").classList.add("is-active");
      r_e("pencar1_div_image").classList.remove("is-hidden");
      r_e("pencar1_div_image").classList.add("is-active");
      r_e("pencar2_div_image").classList.remove("is-hidden");
      r_e("pencar2_div_image").classList.add("is-active");
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
  showSlides(slideIndex, "mySlidesPen");
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
  showSlides(slideIndex, "mySlidesGar");
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
  showSlides(slideIndex, "mySlidesBun");
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
  showSlides(slideIndex, "mySlidesMS");
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
  console.log("contact nav w no issues");
  contact.classList.add("is-active");
  contact.classList.remove("is-hidden");

  var allSections = document.querySelectorAll(".content"); // Select all sections by class
  allSections.forEach((section) => {
    if (section.id != "Contact") {
      section.classList.add("is-hidden"); // Hide other sections
      section.classList.remove("is-active");
    }
  });
  console.log("contact nav w no issues");
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
  load_sc();
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
  load_account();
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

//buntings page
homeban1.addEventListener("click", () => {
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
  load_order();
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
  load_contact();
});

//adding order to shopping cart

function del_doc(id) {
  db.collection("OrderItems")
    .doc(id)
    .delete()
    .then(() => alert("Product deleted"));
  load_sc();
}

//delete when order fulfilled
function del_order(id) {
  db.collection("Orders")
    .doc(id)
    .delete()
    .then(() => alert("Order Completed!"));
  load_order();
}

function get_price(doc_name) {
  db.collection("Admin_Edits")
    .doc("pennants")
    .get()
    .then((doc) => {
      prc = doc.data().price;
    });
}

function get_price(doc_name) {
  db.collection("Admin_Edits")
    .doc("pennants")
    .get()
    .then((doc) => {
      prc = doc.data().price;
    });
}

let addToCartPen = document.querySelector("#addPennant");
let addToCartBun = document.querySelector("#addBunting");
let addToCartGar = document.querySelector("#addGarland");
let addToCartMS = document.querySelector("#addMS");
let addToCartCust = document.querySelector("#addCustom");

addToCartPen.addEventListener("click", (event) => {
  event.preventDefault();

  db.collection("Admin_Edits")
    .doc("pennants")
    .get()
    .then((doc) => {
      let prc = doc.data().price;

      let orderItem = {
        email: auth.currentUser.email,
        pennantColor: document.querySelector("#penColor").value,
        edgeColor: document.querySelector("#edgeColorPen").value,
        fontColor: document.querySelector("#fontColorPen").value,
        tabColor: document.querySelector("#tabColorPen").value,
        customization: document.querySelector("#penPersonal").value,
        productType: "Pennant",
        price: prc,
      };
      db.collection("OrderItems")
        .add(orderItem)
        .then(() => alert("Added to Cart!"));
    });
});
// // //reset the form
// document.querySelector("#penPersonal").value = "";

//connects bunting
function bunting_info() {
  let radio_buttons = document.getElementsByName("bunt-choice");
  let letter_type = document.getElementsByName("letters");
  let letters = "";
  if (letter_type[0].checked) {
    letters = "UPPERCASE";
  }
  if (letter_type[1].checked) {
    letters = "lowercase";
  }
  if (radio_buttons[0].checked) {
    db.collection("Admin_Edits")
      .doc("buntings")
      .get()
      .then((doc) => {
        let prc = doc.data().bprice1;
        let message = doc.data().boption1;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#bColor1").value,
          color2: document.querySelector("#bColor2").value,
          color3: document.querySelector("#bColor3").value,
          color4: document.querySelector("#bColor4").value,
          letterType: letters,
          productType: "Bunting",
          message: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else if (radio_buttons[1].checked) {
    db.collection("Admin_Edits")
      .doc("buntings")
      .get()
      .then((doc) => {
        let prc = doc.data().bprice2;
        let message = doc.data().boption2;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#bColor1").value,
          color2: document.querySelector("#bColor2").value,
          color3: document.querySelector("#bColor3").value,
          color4: document.querySelector("#bColor4").value,
          letterType: letters,
          productType: "Bunting",
          message: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else if (radio_buttons[2].checked) {
    db.collection("Admin_Edits")
      .doc("buntings")
      .get()
      .then((doc) => {
        let prc = doc.data().bprice3;
        let message = doc.data().bprice3;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#bColor1").value,
          color2: document.querySelector("#bColor2").value,
          color3: document.querySelector("#bColor3").value,
          color4: document.querySelector("#bColor4").value,
          letterType: letters,
          productType: "Bunting",
          message: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else if (radio_buttons[3].checked) {
    db.collection("Admin_Edits")
      .doc("buntings")
      .get()
      .then((doc) => {
        let prc = doc.data().boption4;
        let message = doc.data().bprice4;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#bColor1").value,
          color2: document.querySelector("#bColor2").value,
          color3: document.querySelector("#bColor3").value,
          color4: document.querySelector("#bColor4").value,
          letterType: letters,
          productType: "Bunting",
          message: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else {
    alert("Please select message!");
  }
}

addToCartBun.addEventListener("click", (event) => {
  event.preventDefault();
  bunting_info();
  // reset
  let ele = document.getElementsByName("bunt-choice");
  for (var i = 0; i < ele.length; i++) ele[i].checked = false;

  let letters = document.getElementsByName("letters");
  for (var i = 0; i < letters.length; i++) letters[i].checked = false;
  setTimeout(() => {
    r_e("bColor1").selectedIndex = 0;
    r_e("bColor2").selectedIndex = 0;
    r_e("bColor3").selectedIndex = 0;
    r_e("bColor4").selectedIndex = 0;
  }, 2000);
});

function garland_info() {
  let radio_buttons = document.getElementsByName("gar-choice");

  if (radio_buttons[0].checked) {
    db.collection("Admin_Edits")
      .doc("garlands")
      .get()
      .then((doc) => {
        let prc = doc.data().gprice1;
        let message = doc.data().goption1;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#gColor1").value,
          color2: document.querySelector("#gColor2").value,
          color3: document.querySelector("#gColor3").value,
          productType: "Garland",
          size: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else if (radio_buttons[1].checked) {
    db.collection("Admin_Edits")
      .doc("garlands")
      .get()
      .then((doc) => {
        let prc = doc.data().gprice2;
        let message = doc.data().goption2;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#gColor1").value,
          color2: document.querySelector("#gColor2").value,
          color3: document.querySelector("#gColor3").value,
          productType: "Garland",
          size: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else if (radio_buttons[2].checked) {
    db.collection("Admin_Edits")
      .doc("garlands")
      .get()
      .then((doc) => {
        let prc = doc.data().gprice3;
        let message = doc.data().goption3;
        let orderItem = {
          email: auth.currentUser.email,
          color1: document.querySelector("#gColor1").value,
          color2: document.querySelector("#gColor2").value,
          color3: document.querySelector("#gColor3").value,
          productType: "Garland",
          size: message,
          price: prc,
        };

        console.log(orderItem);

        db.collection("OrderItems")
          .add(orderItem)
          .then(() => alert("Added to Cart!"));
      });
  } else {
    alert("Please select message!");
  }
}
addToCartGar.addEventListener("click", (event) => {
  event.preventDefault();
  garland_info();

  //reset
  let ele = document.getElementsByName("gar-choice");
  for (var i = 0; i < ele.length; i++) ele[i].checked = false;

  r_e("gColor1").selectedIndex = 0;
  r_e("gColor2").selectedIndex = 0;
  r_e("gColor3").selectedIndex = 0;
});

addToCartMS.addEventListener("click", (event) => {
  event.preventDefault();

  db.collection("Admin_Edits")
    .doc("milestones")
    .get()
    .then((doc) => {
      let prc = doc.data().price;

      let orderItem = {
        email: auth.currentUser.email,
        productType: "Milestone Set",
        price: prc,
      };
      db.collection("OrderItems")
        .add(orderItem)
        .then(() => alert("Added to Cart!"));
    });
});

//load contact us form data
function load_contact() {
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

            <div onclick="del_docreq('${
              doc.id
            }')" class="is-clickable "><i class="fa-regular fa-trash-can is-size-4 mr-5"></i></div>
          </div>`;
      });
      document.querySelector("#Contactreq").innerHTML += html;
    });
}

function del_docreq(id) {
  db.collection("ContactForm")
    .doc(id)
    .delete()
    .then(() => alert("Message deleted"));
  load_contact();
}

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

//adding total to modal
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("OrderItems")
      .where("email", "==", auth.currentUser.email)
      .get()
      .then((order) => {
        let total = 8;
        order.forEach((doc) => {
          total += parseInt(doc.data().price);
        });
        document.querySelector(
          "#venmo_total"
        ).innerHTML += `<h6 class ="m-5 is-size-4"> <b>Your total is $${total}<b></h6>`;
      });
  }
});

//function to insert an image
function images(coll, d, content1, input1) {
  // 7. Getting the image ready
  let file = document.querySelector(input1).files[0];
  let image = new Date() + "_" + file.name;

  const task = ref.child(image).put(file);

  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      // Url is ready now
      // 4. Object

      db.collection(coll).doc(d).update({
        url: url,
      });

      // set a delay

      setTimeout(() => {
        db.collection(coll)
          .doc(d)
          .get()
          .then((doc) => {
            document.querySelector(content1).innerHTML = `<img src="${
              doc.data().url
            }" />`;
          });
      }, 1000);
    });
}

//submit maker image
r_e("submit_maker_image").addEventListener("click", (e) => {
  e.preventDefault();
  images(
    "Admin_Edits",
    "maker_body_edit",
    "#maker_image",
    "#maker_image_input"
  );
  // r_e("maker_image").innerHTML = `<img src="${doc.data().url}" />`
});

//submit buntings home picture
r_e("submit_bunting_home_image").addEventListener("click", (e) => {
  e.preventDefault();
  images(
    "Admin_Edits",
    "bunting_home",
    "#bunting_image_home",
    "#bunting_home_image_input"
  );
});
db.collection("Admin_Edits")
  .doc("bunting_home")
  .get()
  .then((doc) => {
    r_e("bunting_image_home").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit pennants home picture
r_e("submit_pennant_home_image").addEventListener("click", (e) => {
  e.preventDefault();
  images(
    "Admin_Edits",
    "pennant_home",
    "#pennant_image_home",
    "#pennant_home_image_input"
  );
});
db.collection("Admin_Edits")
  .doc("pennant_home")
  .get()
  .then((doc) => {
    r_e("pennant_image_home").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit garland home picture
r_e("submit_garland_home_image").addEventListener("click", (e) => {
  e.preventDefault();
  images(
    "Admin_Edits",
    "garland_home",
    "#garland_image_home",
    "#garland_home_image_input"
  );
});
db.collection("Admin_Edits")
  .doc("garland_home")
  .get()
  .then((doc) => {
    r_e("garland_image_home").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit milestone home picture
r_e("submit_milestone_home_image").addEventListener("click", (e) => {
  e.preventDefault();
  images(
    "Admin_Edits",
    "milestone_home",
    "#milestone_image_home",
    "#milestone_home_image_input"
  );
});
db.collection("Admin_Edits")
  .doc("milestone_home")
  .get()
  .then((doc) => {
    r_e("milestone_image_home").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo1

r_e("gallery1_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery1", "#gallery1_image", "#gallery1_input");
});
db.collection("Admin_Edits")
  .doc("gallery1")
  .get()
  .then((doc) => {
    r_e("gallery1_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo2

r_e("gallery2_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery2", "#gallery2_image", "#gallery2_input");
});
db.collection("Admin_Edits")
  .doc("gallery2")
  .get()
  .then((doc) => {
    r_e("gallery2_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo3

r_e("gallery3_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery3", "#gallery3_image", "#gallery3_input");
});
db.collection("Admin_Edits")
  .doc("gallery3")
  .get()
  .then((doc) => {
    r_e("gallery3_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo4

r_e("gallery4_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery4", "#gallery4_image", "#gallery4_input");
});
db.collection("Admin_Edits")
  .doc("gallery4")
  .get()
  .then((doc) => {
    r_e("gallery4_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo5

r_e("gallery5_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery5", "#gallery5_image", "#gallery5_input");
});
db.collection("Admin_Edits")
  .doc("gallery5")
  .get()
  .then((doc) => {
    r_e("gallery5_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo6

r_e("gallery6_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery6", "#gallery6_image", "#gallery6_input");
});
db.collection("Admin_Edits")
  .doc("gallery6")
  .get()
  .then((doc) => {
    r_e("gallery6_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo7
r_e("gallery7_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery7", "#gallery7_image", "#gallery7_input");
});
db.collection("Admin_Edits")
  .doc("gallery7")
  .get()
  .then((doc) => {
    r_e("gallery7_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo8
r_e("gallery8_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery8", "#gallery8_image", "#gallery8_input");
});
db.collection("Admin_Edits")
  .doc("gallery8")
  .get()
  .then((doc) => {
    r_e("gallery8_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo9
r_e("gallery9_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery9", "#gallery9_image", "#gallery9_input");
});
db.collection("Admin_Edits")
  .doc("gallery9")
  .get()
  .then((doc) => {
    r_e("gallery9_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo10
r_e("gallery10_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery10", "#gallery10_image", "#gallery10_input");
});
db.collection("Admin_Edits")
  .doc("gallery10")
  .get()
  .then((doc) => {
    r_e("gallery10_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo11
r_e("gallery11_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery11", "#gallery11_image", "#gallery11_input");
});
db.collection("Admin_Edits")
  .doc("gallery11")
  .get()
  .then((doc) => {
    r_e("gallery11_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo12
r_e("gallery12_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery12", "#gallery12_image", "#gallery12_input");
});
db.collection("Admin_Edits")
  .doc("gallery12")
  .get()
  .then((doc) => {
    r_e("gallery12_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit gallery photo13
r_e("gallery13_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "gallery13", "#gallery13_image", "#gallery13_input");
});
db.collection("Admin_Edits")
  .doc("gallery13")
  .get()
  .then((doc) => {
    r_e("gallery13_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit pen car 1
r_e("pencar1_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "pencar1", "#pencar1_image", "#pencar1_input");
});
db.collection("Admin_Edits")
  .doc("pencar1")
  .get()
  .then((doc) => {
    r_e("pencar1_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit pen car 2
r_e("pencar2_image_submit").addEventListener("click", (e) => {
  e.preventDefault();
  images("Admin_Edits", "pencar2", "#pencar2_image", "#pencar2_input");
});
db.collection("Admin_Edits")
  .doc("pencar2")
  .get()
  .then((doc) => {
    r_e("pencar2_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

//submit edits to milestones description product page

r_e("submit_milestone_product_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("milestones")
    .update({
      product_de: document.querySelector("#milestone_product_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("milestones")
    .get()
    .then((doc) => {
      document.querySelector("#milestone_product_section").innerHTML = `<p>${
        doc.data().product_de
      }</p>`;
    });

  document.querySelector("#milestone_product_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("milestones")
  .get()
  .then((doc) => {
    document.querySelector("#milestone_product_section").innerHTML = `<p>${
      doc.data().product_de
    }</p>`;
  });

//submit edits to milestones description home page

r_e("submit_milestone_home_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("milestones")
    .update({
      home_de: document.querySelector("#milestone_home_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("milestones")
    .get()
    .then((doc) => {
      document.querySelector("#milestone_home_section").innerHTML = `<p>${
        doc.data().home_de
      }</p>`;
    });

  document.querySelector("#milestone_home_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("milestones")
  .get()
  .then((doc) => {
    document.querySelector("#milestone_home_section").innerHTML = `<p>${
      doc.data().home_de
    }</p>`;
  });

//submit edits to garland home page

r_e("submit_garland_home_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      home_des: document.querySelector("#garland_home_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector("#garland_home_section").innerHTML = `<p>${
        doc.data().home_des
      }</p>`;
    });
  document.querySelector("#garland_home_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector("#garland_home_section").innerHTML = `<p>${
      doc.data().home_des
    }</p>`;
  });

//submit edits to garland description product page

r_e("submit_garland_product_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      product_des: document.querySelector("#garland_product_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector("#garland_product_section").innerHTML = `<p>${
        doc.data().product_des
      }</p>`;
    });
  document.querySelector("#garland_product_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector("#garland_product_section").innerHTML = `<p>${
      doc.data().product_des
    }</p>`;
  });

//submit edits to buntings description home page

r_e("submit_bunting_home_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      home_desc: document.querySelector("#bunting_home_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector("#bunting_home_section").innerHTML = `<p>${
        doc.data().home_desc
      }</p>`;
    });
  document.querySelector("#bunting_home_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector("#bunting_home_section").innerHTML = `<p>${
      doc.data().home_desc
    }</p>`;
  });

//submit edits to buntings description on product page
r_e("submit_bunting_product_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      product_desc: document.querySelector("#bunting_product_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector("#bunting_product_section").innerHTML = `<p>${
        doc.data().product_desc
      }</p>`;
    });
  document.querySelector("#bunting_product_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector("#bunting_product_section").innerHTML = `<p>${
      doc.data().product_desc
    }</p>`;
  });

//submit edits to pennant description on product page

r_e("submit_pennant_product_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("pennants")
    .update({
      product_description: document.querySelector("#pennant_product_edits")
        .value,
    });

  db.collection("Admin_Edits")
    .doc("pennants")
    .get()
    .then((doc) => {
      document.querySelector("#pennant_body_section").innerHTML = `<p>${
        doc.data().product_description
      }</p>`;
    });
  document.querySelector("#pennant_product_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("pennants")
  .get()
  .then((doc) => {
    document.querySelector("#pennant_body_section").innerHTML = `<p>${
      doc.data().product_description
    }</p>`;
  });

//submit edits to pennant price on product page

r_e("submit_pennant_price_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("pennants")
    .update({
      price: document.querySelector("#pennant_price_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("pennants")
    .get()
    .then((doc) => {
      document.querySelector(
        "#pennant_price"
      ).innerHTML = `<p id = pennant_price class = "is-size-4">$${
        doc.data().price
      }</p>`;
    });
  document.querySelector("#pennant_price_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("pennants")
  .get()
  .then((doc) => {
    document.querySelector(
      "#pennant_price"
    ).innerHTML = `<p id = pennant_price class = "is-size-4">$${
      doc.data().price
    }</p>`;
  });
//submit edits to home page pennant description

r_e("submit_pennant_home_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("pennants")
    .update({
      home_description: document.querySelector("#pennant_home_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("pennants")
    .get()
    .then((doc) => {
      document.querySelector("#pennant_home_section").innerHTML = `<p>${
        doc.data().home_description
      }</p>`;
    });
  document.querySelector("#pennant_home_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("pennants")
  .get()
  .then((doc) => {
    document.querySelector("#pennant_home_section").innerHTML = `<p>${
      doc.data().home_description
    }</p>`;
  });

//submit edits to maker page
r_e("submit_maker_title_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("maker_body_edit")
    .update({
      title: document.querySelector("#maker_title_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("maker_body_edit")
    .get()
    .then((doc) => {
      document.querySelector(
        "#maker_title_section"
      ).innerHTML = `<p class="title">${doc.data().title}</p>`;

      //r_e("maker_image").innerHTML = `<img src="${doc.data().url}" />`
    });
  document.querySelector("#maker_title_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("maker_body_edit")
  .get()
  .then((doc) => {
    document.querySelector(
      "#maker_title_section"
    ).innerHTML = `<p class="title">${doc.data().title}</p>`;
    r_e("maker_image").innerHTML = `<img src="${doc.data().url}" />`;
  });

r_e("submit_maker_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("maker_body_edit")
    .update({
      message: document.querySelector("#maker_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("maker_body_edit")
    .get()
    .then((doc) => {
      document.querySelector("#maker_section").innerHTML = `<p>${
        doc.data().message
      }</p>`;
    });
  document.querySelector("#maker_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("maker_body_edit")
  .get()
  .then((doc) => {
    document.querySelector("#maker_section").innerHTML = `<p>${
      doc.data().message
    }</p>`;
  });

//shipping modal
r_e("checkout").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("address_modal").classList.add("is-active");
  load_sc();
});

r_e("back_button").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("address_modal").classList.add("is-hidden");
});

//accept payment
r_e("order_agree").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-hidden");
  configure_message_bar(`Order successfully submitted`);
  load_sc();
});

//back or exit
r_e("payment_back_button").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-hidden");
});

r_e("venmo_modalbg").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-hidden");
});

r_e("shipping_modalbg").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("address_modal").classList.add("is-hidden");
});
let address = "";
let city = "";
let state = "";
let zip = "";
r_e("shipping_submit").addEventListener("click", (event) => {
  event.preventDefault();
  r_e("venmo_modal").classList.add("is-active");
  r_e("address_modal").classList.add("is-hidden");
  address = r_e("order_address").value;
  city = r_e("order_city").value;
  state = r_e("order_state").value;
  zip = r_e("order_zip").value;
});

//submitted orders to db
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
      let total = 8;
      order.forEach((doc) => {
        total += parseInt(doc.data().price);
      });
      const date = new Date();
      db.collection("Orders").add({
        combinedData: ordersData, // Store the combined orders' data in a single field
        createdAt: date,
        user_venmo: r_e("user_venmo").value,
        address: address,
        city: city,
        state: state,
        zip: zip,
        total: total,
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
  load_sc();
});

// account details
function load_account() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      //display order details
      db.collection("Customers")
        .get()
        .then((data) => {
          let docs = data.docs;
          let custhtml = ``;
          docs.forEach((doc) => {
            if (auth.currentUser.email == doc.data().UserEmail) {
              custhtml += `<p>${doc.data().FirstName} ${doc.data().LastName}</p>
            <p>Email: ${doc.data().UserEmail}</p>
            <p>Phone Number: ${doc.data().PhoneNumber}</p>`;
            }
          });
          document.querySelector("#AccountDetails").innerHTML = custhtml;
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });

      //display customer orders
      db.collection("Orders")
        .get()
        .then((data) => {
          let docs = data.docs;
          let orderhtml = ``;
          docs.forEach((doc) => {
            if (auth.currentUser.email == doc.data().combinedData[0].email) {
              orderhtml += `<div class="box">
                <div>
                  <h3 id="type"class="subtitle is-5">Order</h3>    
                </div>
              <div>Ordered on ${doc.data().createdAt.toDate().getMonth()}/${doc
                .data()
                .createdAt.toDate()
                .getDate()}/${doc.data().createdAt.toDate().getFullYear()}</div>
                <div>Total: $${doc.data().total}</div>
                <div>Venmo: @${doc.data().user_venmo}</div>
                <div>Shipping Address: ${doc.data().address} ${
                doc.data().city
              }, ${doc.data().state} ${doc.data().zip}</div>
                <br>`;
              let items = doc.data().combinedData;
              items.forEach((item) => {
                orderhtml += `<p>${completed_product_html(item)}</p>`;
              });
              orderhtml += `</div>
              </div>`;
            }
          });
          document.querySelector("#OrderDetails").innerHTML = orderhtml;
        })
        .catch((error) => {
          console.error("Error getting documents: ", error);
        });
    }
  });
}

//Carousel

// Next/previous controls
function plusSlides(n, className) {
  showSlides((slideIndex += n), className);
}

// Thumbnail image controls
function currentSlide(n, className) {
  showSlides((slideIndex = n), className);
}

function showSlides(n, className) {
  let i;
  let slides = document.getElementsByClassName(className);
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

//adding prices
db.collection("Admin_Edits")
  .doc("pennants")
  .get()
  .then((doc) => {
    document.querySelector("#pennant_price").innerHTML = `$${doc.data().price}`;
  });

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option1"
    ).innerHTML = ` <input type="radio" name="bunt-choice">
   ${doc.data().boption1} ($${doc.data().bprice1})`;
  });

//change words
r_e("submit_bunting_words1_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      boption1: document.querySelector("#bunting_words1_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option1"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
        ${doc.data().boption1} ($${doc.data().bprice1})`;
    });
  document.querySelector("#bunting_words1_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option1"
    ).innerHTML = `<input type="radio" name="bunt-choice">
      ${doc.data().boption1} ($${doc.data().bprice1})`;
  });

//change price
r_e("submit_bunting_price1_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      bprice1: document.querySelector("#bunting_price1_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option1"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
      ${doc.data().boption1} ($${doc.data().bprice1})`;
    });
  document.querySelector("#bunting_price1_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option1"
    ).innerHTML = `<input type="radio" name="bunt-choice">
    ${doc.data().boption1} ($${doc.data().bprice1})`;
  });

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option2"
    ).innerHTML = ` <input type="radio" name="bunt-choice">
   ${doc.data().boption2} ($${doc.data().bprice2})`;
  });

//change words
r_e("submit_bunting_words2_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      boption2: document.querySelector("#bunting_words2_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option2"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
        ${doc.data().boption2} ($${doc.data().bprice2})`;
    });
  document.querySelector("#bunting_words2_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option2"
    ).innerHTML = `<input type="radio" name="bunt-choice">
      ${doc.data().boption2} ($${doc.data().bprice2})`;
  });

//change price
r_e("submit_bunting_price2_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      bprice2: document.querySelector("#bunting_price2_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option2"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
      ${doc.data().boption2} ($${doc.data().bprice2})`;
    });
  document.querySelector("#bunting_price2_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option2"
    ).innerHTML = `<input type="radio" name="bunt-choice">
    ${doc.data().boption2} ($${doc.data().bprice2})`;
  });
db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option3"
    ).innerHTML = ` <input type="radio" name="bunt-choice">
   ${doc.data().boption3} ($${doc.data().bprice3})`;
  });
//change words
r_e("submit_bunting_words3_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      boption3: document.querySelector("#bunting_words3_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option3"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
        ${doc.data().boption3} ($${doc.data().bprice3})`;
    });
  document.querySelector("#bunting_words3_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option3"
    ).innerHTML = `<input type="radio" name="bunt-choice">
      ${doc.data().boption3} ($${doc.data().bprice3})`;
  });

//change price
r_e("submit_bunting_price3_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      bprice3: document.querySelector("#bunting_price3_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option3"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
      ${doc.data().boption3} ($${doc.data().bprice3})`;
    });
  document.querySelector("#bunting_price3_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option3"
    ).innerHTML = `<input type="radio" name="bunt-choice">
    ${doc.data().boption3} ($${doc.data().bprice3})`;
  });
db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option4"
    ).innerHTML = ` <input type="radio" name="bunt-choice">
   ${doc.data().boption4} ($${doc.data().bprice4})`;
  });

//change words
r_e("submit_bunting_words4_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      boption4: document.querySelector("#bunting_words4_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option4"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
        ${doc.data().boption4} ($${doc.data().bprice4})`;
    });
  document.querySelector("#bunting_words4_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option4"
    ).innerHTML = `<input type="radio" name="bunt-choice">
      ${doc.data().boption4} ($${doc.data().bprice4})`;
  });

//change price
r_e("submit_bunting_price4_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("buntings")
    .update({
      bprice4: document.querySelector("#bunting_price4_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("buntings")
    .get()
    .then((doc) => {
      document.querySelector(
        "#bunt_option4"
      ).innerHTML = ` <input type="radio" name="bunt-choice">
      ${doc.data().boption4} ($${doc.data().bprice4})`;
    });
  document.querySelector("#bunting_price4_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("buntings")
  .get()
  .then((doc) => {
    document.querySelector(
      "#bunt_option4"
    ).innerHTML = `<input type="radio" name="bunt-choice">
    ${doc.data().boption4} ($${doc.data().bprice4})`;
  });
// change options
r_e("submit_gar_words2_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      goption2: document.querySelector("#gar_words2_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector(
        "#gar_option2"
      ).innerHTML = ` <input type="radio" name="gar-choice">
          ${doc.data().goption2} ($${doc.data().gprice2})`;
    });
  document.querySelector("#gar_words2_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option2"
    ).innerHTML = `<input type="radio" name="gar-choice">
        ${doc.data().goption2} ($${doc.data().gprice2})`;
  });

//change price
r_e("submit_gar_price2_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      gprice2: document.querySelector("#gar_price2_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector(
        "#gar_option2"
      ).innerHTML = ` <input type="radio" name="gar-choice">
        ${doc.data().goption2} ($${doc.data().gprice2})`;
    });
  document.querySelector("#gar_price2_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option2"
    ).innerHTML = `<input type="radio" name="gar-choice">
    ${doc.data().goption2} ($${doc.data().gprice2})`;
  });
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option1"
    ).innerHTML = ` <input type="radio" name="gar-choice">
   ${doc.data().goption1} ($${doc.data().gprice1})`;
  });
// change options
r_e("submit_gar_words1_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      goption1: document.querySelector("#gar_words1_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector(
        "#gar_option1"
      ).innerHTML = ` <input type="radio" name="gar-choice">
          ${doc.data().goption1} ($${doc.data().gprice1})`;
    });
  document.querySelector("#gar_words1_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option1"
    ).innerHTML = `<input type="radio" name="gar-choice">
        ${doc.data().goption1} ($${doc.data().gprice1})`;
  });

//change price
r_e("submit_gar_price1_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      gprice1: document.querySelector("#gar_price1_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector(
        "#gar_option1"
      ).innerHTML = ` <input type="radio" name="gar-choice">
        ${doc.data().goption1} ($${doc.data().gprice1})`;
    });
  document.querySelector("#gar_price1_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option1"
    ).innerHTML = `<input type="radio" name="gar-choice">
    ${doc.data().goption1} ($${doc.data().gprice1})`;
  });

db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option1"
    ).innerHTML = `<input type="radio" name="gar-choice">
    ${doc.data().goption1} ($${doc.data().gprice1})`;
  });
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option2"
    ).innerHTML = ` <input type="radio" name="gar-choice">
   ${doc.data().goption2} ($${doc.data().gprice2})`;
  });

db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option3"
    ).innerHTML = ` <input type="radio" name="gar-choice">
   ${doc.data().goption3} ($${doc.data().gprice3})`;
  });
// change options
r_e("submit_gar_words3_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      goption3: document.querySelector("#gar_words3_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector(
        "#gar_option3"
      ).innerHTML = ` <input type="radio" name="gar-choice">
          ${doc.data().goption3} ($${doc.data().gprice3})`;
    });
  document.querySelector("#gar_words3_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option3"
    ).innerHTML = `<input type="radio" name="gar-choice">
        ${doc.data().goption3} ($${doc.data().gprice3})`;
  });

//change price
r_e("submit_gar_price3_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("garlands")
    .update({
      gprice3: document.querySelector("#gar_price3_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("garlands")
    .get()
    .then((doc) => {
      document.querySelector(
        "#gar_option3"
      ).innerHTML = ` <input type="radio" name="gar-choice">
        ${doc.data().goption3} ($${doc.data().gprice3})`;
    });
  document.querySelector("#gar_price2_edits").value = "";
});
db.collection("Admin_Edits")
  .doc("garlands")
  .get()
  .then((doc) => {
    document.querySelector(
      "#gar_option3"
    ).innerHTML = `<input type="radio" name="gar-choice">
    ${doc.data().goption3} ($${doc.data().gprice3})`;
  });
r_e("submit_ms_price_edits").addEventListener("click", (event) => {
  event.preventDefault();
  db.collection("Admin_Edits")
    .doc("milestones")
    .update({
      price: document.querySelector("#ms_price_edits").value,
    });

  db.collection("Admin_Edits")
    .doc("milestones")
    .get()
    .then((doc) => {
      document.querySelector(
        "#ms_price"
      ).innerHTML = `<p id = ms_price class = "is-size-4">$${
        doc.data().price
      }</p>`;
    });
  document.querySelector("#ms_price_edits").value = "";
});

db.collection("Admin_Edits")
  .doc("milestones")
  .get()
  .then((doc) => {
    document.querySelector(
      "#ms_price"
    ).innerHTML = `<p id = ms_price class = "is-size-4">$${
      doc.data().price
    }</p>`;
  });
db.collection("Admin_Edits")
  .doc("milestones")
  .get()
  .then((doc) => {
    document.querySelector("#ms_price").innerHTML = `$${doc.data().price}`;
  });

//this was in the event listener above

// // 7. Getting the image ready
// let file = document.querySelector('#maker_image_input').files[0];
// let image = new Date() + "_" + file.name;

// const task = ref.child(image).put(file);

// task
//   .then(snapshot => snapshot.ref.getDownloadURL())
//   .then(url => {
//     // Url is ready now
//     // 4. Object

//     db.collection("Admin_Edits")
//       .doc("maker_body_edit")
//       .update({
//         url: url
//       });

//     db.collection("Admin_Edits")
//       .doc("maker_body_edit")
//       .get()
//       .then((doc) => {
//         document.querySelector(
//           "#maker_image"
//         ).innerHTML = `<p class=" has-text-centered m-3"><img width="200" src="${doc.data().url}" /></p>`
//       });

//   })
