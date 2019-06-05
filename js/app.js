// Handle audio recording
// Based on https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/


URL = window.URL || window.webkitURL;
// stream from getUserMedia()
var gumStream;
// Recorder.js object
var rec;

// Audio context
var input;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext;

// Event for record button
var recordButton = document.getElementById("recordButton");
recordButton.addEventListener("click", startRecording);

function startRecording() {
    console.log("recordButton clicked");

    var constraints = {
        audio: true,
        video: false
    }

    // Disable record button until success/fail from getUserMedia()
    recordButton.disabled = true;

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js");
        gumStream = stream;

        input = audioContext.createMediaStreamSource(stream);

        // Create recorder object (1 channel mode)
        rec = new Recorder(input, {
            numChannels: 1
        })

       // Start recording
       rec.record()
       console.log("Recording started");
       window.setTimeout(stopRecording, 2500);

    }).catch(function(err) {
        // Enable the record button if getUserMedia() fails.
        recordButton.disabled = false;
    });
}

function stopRecording() {
    console.log("Recording stopped");
    // Allow new recordings
    recordButton.disabled = false;
    rec.stop(); // Stop mic access
    gumStream.getAudioTracks()[0].stop();
    rec.exportWAV(createDownloadLink); // Create blob and pass to createDownloadLink
}
// Replaces whitespace with dashes and converts strings to lowercase
function strProcess(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
}

function createFilename() {
    // Filename uses an ISO time string (not same as CSAI python version)
    var firstName = strProcess(document.getElementById('firstName').value);
    var lastName = strProcess(document.getElementById('lastName').value);
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var desc = strProcess(document.getElementById('description').value);
    var loc = strProcess(document.getElementById('location').value);
    var noise = document.querySelector('input[name="noise"]:checked').value;
    var wwnotww = document.querySelector('input[name="wwnotww"]:checked').value;
    var datetime = new Date().toISOString();
    var filename = wwnotww + '_' + gender + '_' + desc + '_' + loc + '_' + noise + '_' + lastName + '_' + firstName + '_' + datetime + '_ewenike.wav';
    return filename;
}

function createDownloadLink(blob) {
    // host audio
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    // add player controls
    au.controls = true;
    // link audio to blob
    au.src = url;
    link.href = url;
    link.download = createFilename();
    link.innerHTML = link.download;

    li.appendChild(au);
    li.appendChild(link);
    recordingsList.appendChild(li);

}
