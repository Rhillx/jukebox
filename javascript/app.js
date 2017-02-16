
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
const button= document.querySelector('.js-searchBtn')
const playlistPanel= document.querySelector('.js-playlistContainer')
const resultPanel= document.querySelector('.js-resultsContainer')



button.addEventListener('click', (e)=> validSearch());
input.addEventListener('keydown',(e) => {
		if (e.keyCode === 13){
		 validSearch()
		 
		 return

		}

	})

function validSearch (){
	const searchTerm = input.value;

		if (searchTerm.trim() === "") {
			alert('Please input a value!')
			return;
		}

		input.setAttribute('disabled', 'disabled');
		button.setAttribute('disabled', 'disabled'); 
		// WHY DOESNT BUTTON DISABLE???

		spotifySearch(searchTerm, "track", dataReturn)
			
}

const reqParam = () => {
	throw new error('THIS IS A REQUIRED PARAM!')
};

const spotifySearch = (q = reqParam(), type, callback, limit =10, offset =0) =>{
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

      			callback(data);
      		}
      	}

      	http.open('GET', url);
      	http.send()
      }

const dataReturn = (data)=>{
	const searchTerm = data.searchTerm;

	resultPanel.innerHTML="";

	for(const trackData of data.tracks.items){
		const trackId = trackData.id;

	}



}



})();





