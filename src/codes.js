const FOLDER_URL = "https://drive.google.com/drive/folders/1hDkf17mY0jaKqlWOcNdBzpzBz1vHWj9-";
const EMAIL_ADDRESS = 'demo@demo.com'
const TRIGGER_INTERVAL_TIME = 24  // hours

function notifyUploadedFile(folderUrl) {
  // Extract the Folder ID from the URL
  const FOLDER_ID = extractFolderIdFromUrl(FOLDER_URL);

  // Get the creation time of files in the folder
  let folder = DriveApp.getFolderById(FOLDER_ID);
  let files = folder.getFiles();
  let createdTimes = [];

  while (files.hasNext()) {
    let file = files.next();
    let createdTime = file.getDateCreated();
    createdTimes.push(createdTime);
  }

  // Get the creation time of the last file created
  let lastCreatedTime = new Date(Math.max(...createdTimes));

  // Get the current time
  let currentTime = new Date();

  // Calculate the time difference between the current time and the last file's creation time
  let diff = (currentTime - lastCreatedTime) / (3600 * 1000); 
  // Here, 'diff' represents the time difference in hours. 
  // 'currentTime - lastCreatedTime' gives the difference in milliseconds,
  // which is then divided by (3600 * 1000) to convert it into hours.
  // The result is rounded to one decimal place for easier reading.
  
  console.log(`The last file was uploaded ${Math.round(diff * 10) / 10} hours ago.`);
  // This line logs a message to the console indicating how many hours ago 
  // the last file was uploaded in the folder. The time is displayed with one decimal place.

  // Send an email notification if the time difference is within `TRIGGER_INTERVAL_TIME`
  if (diff < TRIGGER_INTERVAL_TIME) {
    // Get the folder name to use in the email subject
    const folderName = folder.getName();

    let subject = `New File(s) in ${folderName}`;

    let body = `Someone has uploaded file(s) in ${folderName}. Please check it from the link below. \n${folderUrl}`;

    // Sending the email
    GmailApp.sendEmail(EMAIL_ADDRESS, subject, body);
    // console.log('Email has been sent.');
  }
}

// Function to extract folder ID from URL
function extractFolderIdFromUrl(url) {
  // This pattern matches the folder ID in the Google Drive URL
  let pattern = /folders\/([a-zA-Z0-9-_]+)/;
  let matches = url.match(pattern);
  if (matches && matches[1]) {
    return matches[1];
  } else {
    throw new Error("Invalid Google Drive folder URL.");
  }
}
