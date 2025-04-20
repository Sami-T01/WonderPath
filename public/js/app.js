// js/app.js

// Immediately initialize event handlers
(() => {
  // Wallet connection is handled via Next.js; skip Polkadot extension logic.

  function showScreen(id) {
    document.querySelectorAll('#screen-login, .screen').forEach(el =>
      el.classList.add('hidden')
    );
    document.getElementById(id)?.classList.remove('hidden');
  }``

  // STATE
  let routeParams = { start: null, end: null, mode: null, timeBudget: null };
  let selectedFilters = [];
  let poiSuggestions = [];
  let visitedPOIs = [];
  let suggestionIndex = 0;
  let currentLocation = null;
  let remainingTime = null;
  let directionsRenderer = null;

  // TRANSPORT MODE SELECTOR
  document.querySelectorAll('.modes button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modes button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      routeParams.mode = btn.dataset.mode;
    });
  });

  // START OVER
  document.getElementById('btn-start-over')?.addEventListener('click', () => {
    routeParams = { start: null, end: null, mode: null, timeBudget: null };
    selectedFilters = [];
    poiSuggestions = [];
    visitedPOIs = [];
    suggestionIndex = 0;
    currentLocation = null;
    remainingTime = null;

    if (directionsRenderer) {
      directionsRenderer.setMap(null);
      directionsRenderer = null;
    }

    document.querySelectorAll('.modes button').forEach(b => b.classList.remove('active'));
    showScreen('screen-route-filters');
  });

  // DASHBOARD
  document.getElementById('user-profile').addEventListener('click', () => {
    showScreen('screen-dashboard');
    document.getElementById('dashboard-user-id').textContent = window.currentUserId || 'Guest';
    document.getElementById('dashboard-token-count').textContent = TokenEarner.getBalance();
    const list = document.getElementById('dashboard-token-sources');
    list.innerHTML = '';
    TokenEarner.getSources().forEach(src => {
      const li = document.createElement('li');
      li.textContent = `${src.amount} tokens from ${src.source}`;
      list.appendChild(li);
    });
  });

  document.getElementById('dashboard-redeem-button')?.addEventListener('click', () =>
    showScreen('screen-redeem')
  );

  document.getElementById('btn-back-from-dashboard')?.addEventListener('click', () =>
    showScreen('screen-route-filters')
  );

  // Redeem modal: start adventure navigates to route filters
  document.getElementById('btn-start-adventure')?.addEventListener('click', () => {
    showScreen('screen-route-filters');
  });

  // ROUTE FILTERS
  document.getElementById('btn-route-next')?.addEventListener('click', () => {
    if (!routeParams.mode) {
      alert("Please select a mode of transport.");
      return;
    }

    routeParams.start = document.getElementById('startInput').value;
    routeParams.end = document.getElementById('endInput').value;
    routeParams.timeBudget = parseInt(document.getElementById('timeBudget').value, 10);
    remainingTime = routeParams.timeBudget;
    currentLocation = routeParams.start;
    visitedPOIs = [];
    showScreen('screen-poi-filters');
  });

  document.getElementById('btn-poi-surprise')?.addEventListener('click', () => {
    selectedFilters = [{ type: 'surprise', keyword: null }];
    fetchAndShowPOIs();
  });

  document.getElementById('btn-poi-next')?.addEventListener('click', () => {
    const categories = ['cafe', 'restaurant', 'bar', 'park', 'museum', 'lodging'];
    selectedFilters = categories.filter(cat => {
      const cb = document.getElementById(`cat-${cat}`);
      return cb?.checked;
    }).map(cat => ({
      type: cat,
      keyword: document.getElementById(`subcat-${cat}`)?.value || null
    }));
    fetchAndShowPOIs();
  });

  function fetchAndShowPOIs() {
    RouteGuardian.start(currentLocation, routeParams.end, selectedFilters, routeParams.mode)
      .then(pois => {
        const newSuggestions = pois.filter(p =>
          !visitedPOIs.some(v => v.id === p.id)
        );

        if (newSuggestions.length === 0) {
          alert(" No more suggestions. You’ve completed your journey!");
          showScreen('screen-arrival');
          return;
        }

        poiSuggestions = newSuggestions;
        renderPOIOptions(poiSuggestions);
        showScreen('screen-first-stop');
      });
  }

  function renderPOIOptions(pois) {
    const container = document.getElementById('first-stop-options');
    container.innerHTML = '';
    pois.forEach((poi, i) => {
      const btn = document.createElement('button');
      btn.textContent = poi.name;
      btn.onclick = () => {
        suggestionIndex = i;
        showSuggestion();
      };
      container.appendChild(btn);
    });
  }

  function showSuggestion() {
    const poi = poiSuggestions[suggestionIndex];
    if (!routeParams.mode || !google.maps.TravelMode[routeParams.mode]) {
      alert(" Travel mode not selected or invalid.");
      return;
    }

    document.getElementById('next-stop-info').textContent =
      `${poi.name} — ${poi.description}`;
    showScreen('screen-next-stop');

    if (!directionsRenderer) {
      directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(window.map);
    }

    const directionsService = new google.maps.DirectionsService();
    const mode = google.maps.TravelMode[routeParams.mode];

    directionsService.route({
      origin: currentLocation,
      destination: poi.location,
      travelMode: mode
    }, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }

  document.getElementById('btn-go-here')?.addEventListener('click', () => {
    document.getElementById('btn-go-here').style.display = 'none';
    document.getElementById('btn-im-here').style.display = 'inline-block';
  });

  document.getElementById('btn-im-here')?.addEventListener('click', async () => {
    const poi = poiSuggestions[suggestionIndex];
    const duration = await getTravelDuration(currentLocation, poi.location, routeParams.mode);
    remainingTime -= duration;

    visitedPOIs.push(poi);
    currentLocation = poi.location;

    checkpointReached(poi);

    if (remainingTime <= 0) {
      const proceed = confirm(" Your time is up! Do you want to continue?");
      if (!proceed) {
        localStorage.setItem('journeyHistory', JSON.stringify(visitedPOIs));
        showScreen('screen-arrival');
        return;
      }
    }

    fetchAndShowPOIs();
  });

  async function getTravelDuration(from, to, mode) {
    if (!mode || !google.maps.TravelMode[mode]) {
      console.error("Invalid travelMode:", mode);
      return 0;
    }

    return new Promise(resolve => {
      window.directionsService.route({
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode[mode]
      }, (res, status) => {
        if (status === 'OK') {
          const mins = res.routes[0].legs[0].duration.value / 60;
          resolve(mins);
        } else {
          resolve(0);
        }
      });
    });
  }

  window.checkpointReached = function(poi) {
    TokenEarner.reward(50, poi.name || "Unknown POI");
  };
})();