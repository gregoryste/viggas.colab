window.addEventListener('message', function(event) {
    if (event.origin === 'https://www.youtube.com') {
      console.log('Received message from YouTube:', event.data);
    }
});

// Cases 
const apiKey = document.querySelector(".js-api-key-value").value; // Replace with your actual API key
const elementsWithPlaylist = document.querySelectorAll('[data-video]:not([data-video=""])');
const VideosIds = Array.from(elementsWithPlaylist).map(element => element.getAttribute('data-video'));

document.querySelectorAll(".js-open-modal").forEach(function(item){
    item.addEventListener("click", function(){
        const idElement = item.getAttribute("data-id");
        var modal = document.querySelector(`#js-modal-case--${idElement}`);

        modal.classList.add("modal-cases--active");

        const videoPlayer = modal.getElementsByClassName("modal-cases__player")[0];

        modal.addEventListener("click", (e) => {
            if (e.target.classList.value.includes("js-close") == true) {
                modal.classList.remove("modal-cases--active");
            }
        })
    })
})

VideosIds.forEach(videoId => {
    fetchVideoDetails(videoId)
        .then(videoDetails => {
            const videoIframe = document.createElement('iframe');
            videoIframe.setAttribute("class", "modal-cases__player");
            videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
            document.querySelector(`[data-container-video="${videoId}"]`).appendChild(videoIframe);
        });
});

function fetchVideoDetails(videoId) {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    return fetch(apiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    }).then(data => {
        // Extract video details from the response
        const videoDetails = data.items[0].snippet;
        return videoDetails;
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}