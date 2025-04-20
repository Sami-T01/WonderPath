// js/routeGuardian.js

const RouteGuardian = (function () {
  let markers = [];

  function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
  }

  function samplePath(path, n) {
    if (path.length <= n) return path.slice();
    const step = Math.floor(path.length / n);
    const out = [];
    for (let i = 0; i < path.length && out.length < n; i += step) {
      out.push(path[i]);
    }
    return out;
  }

  /**
   * @param {string|LatLng} start
   * @param {string|LatLng|null} end
   * @param {{type: string, keyword: string|null}[]} filters
   * @param {string} mode
   */
  function start(start, end, filters, mode) {
    clearMarkers();

    return new Promise((resolve, reject) => {
      const origin = start || window.startLocation;
      const destination = end || null;

      const doSearch = (points, filters) => {
        const searches = [];

        for (const pt of points) {
          for (const f of filters) {
            const request = {
              location: pt,
              radius: 500,
            };

            if (f.type === 'surprise') {
              request.type = 'tourist_attraction';
            } else {
              request.type = f.type;
              request.keyword = f.keyword;
            }

            searches.push(new Promise(res => {
              window.placesService.nearbySearch(request, (places, status) => {
                res(status === 'OK' ? places : []);
              });
            }));
          }
        }

        Promise.all(searches).then(results => {
          const flat = results.flat();
          const uniqueMap = new Map(flat.map(p => [p.place_id, p]));
          const unique = Array.from(uniqueMap.values());

          // Shuffle
          const shuffled = unique.sort(() => Math.random() - 0.5);
          const selected = shuffled.slice(0, 3);

          const pois = selected.map(p => {
            const m = new google.maps.Marker({
              position: p.geometry.location,
              map,
              title: p.name
            });
            markers.push(m);
            return {
              id: p.place_id,
              name: p.name,
              description: p.rating ? `${p.rating} ⭐ (${p.user_ratings_total})` : '',
              location: p.geometry.location
            };
          });

          resolve(pois);
        });
      };

      // Fallback: if no destination, just search around origin
      if (!destination) {
        return doSearch([origin], filters);
      }

      // Use directions to sample path
      window.directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[mode || 'WALKING'],
      }, (result, status) => {
        if (status !== 'OK') {
          console.warn('Directions failed — fallback to origin only');
          return doSearch([origin], filters);
        }

        const path = result.routes[0].overview_path;
        const samples = samplePath(path, 5);
        doSearch(samples, filters);
      });
    });
  }

  return { start };
})();
