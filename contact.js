// ============================================
// CONFIGURATION - Edit these values
// ============================================

// Image directory path (relative to index.html)
// Example: "images/" or "./assets/photos/"
const IMAGE_DIR = "photos-56544/";

// List your image filenames here
// These will be loaded from the IMAGE_DIR folder
const GALLERY_IMAGES = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
];

// Scroll speed in seconds (higher = slower)
const SCROLL_SPEED = 30;

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================

// Set current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Load gallery images
function loadGallery() {
    var track = document.getElementById("gallery-track");
    
    if (GALLERY_IMAGES.length === 0) {
        document.getElementById("gallery").style.display = "none";
        return;
    }

    // Create images twice for seamless loop
    var allImages = GALLERY_IMAGES.concat(GALLERY_IMAGES);

    allImages.forEach(function(filename) {
        var img = document.createElement("img");
        img.src = IMAGE_DIR + filename;
        img.alt = "Healesville Magic Car Wash";
        img.loading = "lazy";
        track.appendChild(img);
    });

    // Update animation speed
    track.style.animationDuration = SCROLL_SPEED + "s";
}

// Handle contact form submission with Web3Forms
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formData.append("access_key", "eb2647d6-3d6d-4984-87f5-13fd34905614");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Initialize gallery on page load
document.addEventListener("DOMContentLoaded", loadGallery);
