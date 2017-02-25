
/* GAMEPLAN:

// UI TASKs
1. Need event listeners in input (keyDown) and for search button (click).

// DATA tasks (need promise here)
2.(with each event) make a function that will make a request to spotify API and return data.

// PLAYLIST MANAGEMENT
1. create a variable that represents your playlist (<Array> of tracks ids)
	create a variable called currentSong - the INDEX of playlist
2. function render that will walk through your playlist and generate HTML for tracks
3. function addToPlaylist - runs when user clicks on song from search results, adds to playlist array
	- and then calls the render function __again__
4. function nextSong plays next song (add ONE to currentSong)

// RICH PLAN
3. Within the then callback in above function, will need to create new elements in order to render to the browser.
4. within new tags create a button that will add selction to playlist.
5. Create a function that will automatically play songs in playlist one after another.(perhaps with promises)
6. Create a funtion that stores the added songs to the local storage.

access token : BQCHFSra-0Y4PSqrUxmKLke6qH35wiMVqzf9V_tu1G0-deEExYF7BOWblU_VGMEz8KWc2DjAtt54gEilqOLcDoYBrqJumyB27jqgaAF8BC4vzFUVLZUaPxXhoBuRMR3IbkeVdFkdHEOf

*/

(function (){


	const input= document.querySelector('.js-input')
	const button= document.querySelector('.js-search')
	const playlist= document.querySelector('.js-playlist')
	const results= document.querySelector('.js-searchresult')

	let playList=[];

	button.addEventListener('click', (e)=> validSearch());
	input.addEventListener('keydown',(e) => {
		if (e.keyCode === 13){
			validSearch();
		 	return;
		}
	});

	function validSearch (){
		const searchTerm = input.value;

		if (searchTerm.trim() === "") {
			alert('Please input a value!')
			return;
		}

		input.setAttribute('disabled', 'disabled');
		button.setAttribute('disabled', 'disabled'); 
		// WHY DOESNT BUTTON DISABLE???

		spotifySearch(searchTerm, "artist,album,track" )
			.then((data)=> { 

				input.removeAttribute('disabled', 'disabled')
				button.removeAttribute('disabled','disabled')

				results.innerHTML= "";
				
   				for(const track of data.tracks.items){
   					// console.log(track)
   				 	addTrackHtml(track);
   				}
   			 	
			})		
	}

	const reqParam = () => {
		throw new error('THIS IS A REQUIRED PARAM!')
	};

	const spotifySearch = (q = reqParam(), type, limit =12, offset =0) =>{

		return new Promise ((resolve, reject) =>{
			let url = 'http://api.spotify.com/v1/search?'

			url += '&q=' + q;
			url += '&type=' + type;
			url += '&offset=' + offset;
			url += '&limit=' + limit;


			const http= new XMLHttpRequest();

			http.onreadystatechange = () => {
				const isReqReady = http.readyState === XMLHttpRequest.DONE;
				const isReqDone = http.status === 200;

				if (isReqReady && isReqDone) {
					const data = JSON.parse(http.responseText);
					data.searchTerm = q;

	      			resolve(data);
	      		}
      		}

	      	http.open('GET', url);
	      	http.send()
      	});
	};

	const addTrackHtml = (track)=>{
		const {name, preview_url, id, album} = track;
        const imageUrl = album.images[1].url;

        const div = document.createElement('div');
        div.classList.add('ui','teal','card', 'dimmable');
        div.innerHTML = getCardMarkup(name, preview_url, id, album, imageUrl);;
        results.appendChild(div);
	

		div.addEventListener('click',() => {
            PlaylistManager.addTrack(track);
            const currentIndex = PlaylistManager.tracks.length - 1;
            // console.log(currentIndex);

            const playlistTrack = document.createElement('div');
            playlistTrack.classList.add('ui','centered', 'card', 'trackid-' + id);
            playlistTrack.innerHTML = `
<div class="item playlist-track trackid-${id}">
    <a href="#" class="playlist-close js-playlist-close">
        <i class="icon remove"></i>
    </a>
    <div class="ui tiny image">
      <img src="${imageUrl}">
    </div>
    <div class="middle aligned content playlist-content">
      ${name}
    </div>
</div>
        <audio controls style="width: 100%;">
            <source src="${preview_url}">
        </audio>
            `
            playlist.appendChild(playlistTrack)

            // get the AUDIO tag
            const audio = playlistTrack.querySelector('audio');

            audio.addEventListener('play', () => {
                PlaylistManager.currentSong = currentIndex;
            });

            audio.addEventListener('ended', () => {
                console.log('done!')
                const nextTrackId = PlaylistManager.getNextSong();

                setTimeout(() => {
                    document.querySelector(`.trackid-${nextTrackId} audio`).play();
                }, 1000);
                
            })


            // get the CLOSE button
           const closeBtn = playlistTrack.querySelector('.js-playlist-close');
           closeBtn.addEventListener('click', () => {
                if (PlaylistManager.currentSong === currentIndex) {
                    const nextTrackId = PlaylistManager.getNextSong();

                    setTimeout(() => {
                        document.querySelector(`.trackid-${nextTrackId} audio`).play();
                    }, 500);
                }
                PlaylistManager.removeById(id);

                playlist.removeChild(playlistTrack);
           })
        })
        // console.log(html)
    }








	 const getCardMarkup = (name, preview_url, id, album, imageUrl) => {
        let html = `
            <div class="image">
                <img src="${imageUrl}">
            </div>
            <div class="content">
                <a class="header">${name}</a>
                <div class="meta">${album.name}</div>
                <div class="description">
                    <audio controls class="${id}" style="width: 100%;">
                        <source src="${preview_url}">
                    </audio>
                </div>
            </div>
        `;

        return html;
    }
	

})();





