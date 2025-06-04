(() => {
    const songs = [
      
      { title: "Ae Mere Watan Ke", artist: "Lata Mangeshkar", src: "Ae Mere Watan Ke Logon - PagalWorld.mp3", cover: "Ae Mere Watan Ke Logon.jpg", duration: "4:53" },
      { title: "Sairat Zaala Ji", artist: "Ajay Gogavale", src: "Sairat Zaala Ji-128kbps.mp3", cover: "sairat.jpg", duration: "6:09" },
      { title: "Chand Tu Nabhatla", artist: "Swapnil Bandodkar", src: "Chand Tu Nabhatla-128kbps.mp3", cover: "sanduk.jpg", duration: "4:37" },
      { title: "Teri Ore", artist: "Rahat Fateh Ali Khan", src: "Teri Ore From Singh Is Kinng-128kbps.mp3", cover: "teri ore.jpg", duration: "5:38" },
      { title: "Shaky", artist: "Sanju Rathod,Vaishali Samant", src: "Shaky-128kbps.mp3", cover: "shaky.jpg", duration: "2:55" },
    ];

    const titleEl = document.getElementById('title');
    const artistEl = document.getElementById('artist');
    const coverEl = document.getElementById('cover');
    const prevBtn = document.getElementById('prev');
    const playBtn = document.getElementById('play');
    const nextBtn = document.getElementById('next');
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume');
    const volumeIcon = document.getElementById('volume-icon');
    const playlistEl = document.getElementById('playlist');
    const prevCover = document.getElementById('prev-cover');
    const prevTitle = document.getElementById('prev-title');
    const nextCover = document.getElementById('next-cover');
    const nextTitle = document.getElementById('next-title');
    const playerContainer = document.querySelector('.player-container');

    let audio = new Audio();
    let currentIndex = 0;
    let isPlaying = false;

    function loadSong(index) {
      const song = songs[index];
      audio.src = song.src;
      titleEl.textContent = song.title;
      artistEl.textContent = song.artist;
      coverEl.style.backgroundImage = `url('${song.cover}')`;
      durationEl.textContent = song.duration;

      const prevIndex = (index - 1 + songs.length) % songs.length;
      const nextIndex = (index + 1) % songs.length;

      prevCover.style.backgroundImage = `url('${songs[prevIndex].cover}')`;
      prevTitle.textContent = songs[prevIndex].title;

      nextCover.style.backgroundImage = `url('${songs[nextIndex].cover}')`;
      nextTitle.textContent = songs[nextIndex].title;

      updatePlaylistUI();
      audio.load();
    }

    function playSong() {
      audio.play();
      isPlaying = true;
      playBtn.innerHTML = '&#10073;&#10073;';
      coverEl.classList.add('playing');
    }

    function pauseSong() {
      audio.pause();
      isPlaying = false;
      playBtn.innerHTML = '&#9654;';
      coverEl.classList.remove('playing');
    }

    function togglePlayPause() {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    }

    function nextSong() {
      currentIndex = (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      playSong();
    }

    function prevSong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      playSong();
    }

    function updateProgress() {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        progressContainer.setAttribute('aria-valuenow', progressPercent.toFixed(0));
      }
    }

    function setProgress(e) {
      const width = this.clientWidth;
      const clickX = e.offsetX;
      const duration = audio.duration;
      if (duration) {
        audio.currentTime = (clickX / width) * duration;
      }
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }

    function updateVolume() {
      audio.volume = volumeSlider.value;
      updateVolumeIcon();
    }

    function updateVolumeIcon() {
      if (audio.volume === 0) {
        volumeIcon.textContent = '🔇';
      } else if (audio.volume < 0.5) {
        volumeIcon.textContent = '🔈';
      } else {
        volumeIcon.textContent = '🔊';
      }
    }

    function buildPlaylist() {
      songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        item.setAttribute('role', 'listitem');
        item.tabIndex = 0;
        item.innerHTML = `
          <div class="title">${song.title}</div>
          <div class="duration">${song.duration}</div>
        `;
        item.addEventListener('click', () => {
          currentIndex = index;
          loadSong(currentIndex);
          playSong();
        });
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            currentIndex = index;
            loadSong(currentIndex);
            playSong();
          }
        });
        playlistEl.appendChild(item);
      });
    }

    function updatePlaylistUI() {
      Array.from(playlistEl.children).forEach((child, idx) => {
        child.classList.toggle('active', idx === currentIndex);
      });
    }

    audio.addEventListener('ended', () => nextSong());

    
    playBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    volumeSlider.addEventListener('input', updateVolume);

    progressContainer.addEventListener('keydown', e => {
      if (!audio.duration) return;
      if (e.key === 'ArrowRight') {
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
      } else if (e.key === 'ArrowLeft') {
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
      }
    });

    document.getElementById('prev-card').addEventListener('click', prevSong);
    document.getElementById('next-card').addEventListener('click', nextSong);
    document.getElementById('prev-card').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        prevSong();
      }
    });
    document.getElementById('next-card').addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        nextSong();
      }
    });

   
    buildPlaylist();
    loadSong(currentIndex);
    updateVolume();
  })();
