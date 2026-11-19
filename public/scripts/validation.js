document.getElementById("job-form").onsubmit = () => {

    clearErrorMessages();
    var isValid = true;

    // Validates If The Title Input Is Empty
    let title = document.getElementById("title").value.trim();
    if (title === "") {
        document.getElementById("err-title").style.display = "block";
        isValid = false;
    }

    // Validates If The Company Input Is Empty
    let company = document.getElementById("company").value.trim();
    if (company === "") {
        document.getElementById("err-company").style.display = "block";
        isValid = false;
    }

    // Validates If A Trade Area Isn't Selected 
    let tradeArea = document.getElementById("tradeArea").value;
    if (tradeArea === "") {
        document.getElementById("err-tradeArea").style.display = "block";
        isValid = false;
    }

    // Validates If The Location Input Is Emtpy
    let location = document.getElementById("location").value.trim();
    if (location === "") {
        document.getElementById("err-location").style.display = "block";
        isValid = false;
    }

    // Validates If Hour Type Isn't Selected
    let hourSelected = false;
    let hourOptions = document.getElementsByName("hourType");
    for (let i = 0; i < hourOptions.length; i++) {
        if (hourOptions[i].checked)
            hourSelected = true;
    }

    if (!hourSelected) {
        document.getElementById("err-hourType").style.display = "block";
        isValid = false;
    }
    
    // Validates If Job Tyoe Type Isn't Selected
    let typeSelected = false;
    let typeOptions = document.getElementsByName("jobType");
    for (let i = 0; i < typeOptions.length; i++) {
        if (typeOptions[i].checked)
            typeSelected = true;
    }

    if (!typeSelected) {
        document.getElementById("err-jobType").style.display = "block";
        isValid = false;
    }

    // Validates If Date Isn't Offered
    let postDate = document.getElementById("postDate").value;
    if (postDate === "") {
        document.getElementById("err-postDate").style.display = "block";
        isValid = false;
    }

    // Check that expiration date is after post date
    let expirationDate = document.getElementById("expirationDate").value;
    if (expirationDate === "" || expirationDate < postDate) {
        document.getElementById("err-expirationDate").style.display = "block";
        isValid = false;
    }

    // Only allow real and secure links so students are sent to real employer pages
    let applicationUrl = document.getElementById("applicationUrl").value.trim();
    if (applicationUrl === "") {
        document.getElementById("err-applicationUrl").style.display = "block";
        isValid = false;
    } else if (!applicationUrl.startsWith("https://")) {
        document.getElementById("err-applicationUrl").style.display = "block";
        isValid = false;
    }

    return isValid;
}


// Clears the Error Messages when the user resubmits the form
function clearErrorMessages() {
    let errors = document.getElementsByClassName("error");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}
