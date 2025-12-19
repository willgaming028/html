// CONFIGURATION - Edit this email address
const CONTACT_EMAIL = "contact@healesvillemagiccarwash.com.au";

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Handle contact form submission
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    var subject = "Contact Form: " + name;
    var body = "Name: " + name + "\n" +
               "Email: " + email + "\n\n" +
               "Message:\n" + message;

    var mailtoLink = "mailto:" + CONTACT_EMAIL +
                     "?subject=" + encodeURIComponent(subject) +
                     "&body=" + encodeURIComponent(body);

    window.location.href = mailtoLink;
});
