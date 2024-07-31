function initMap() {
    // This function is kept minimal for async loading
}




let guessMarker, map, originalLocation;
let gameCount = 1;
let totalScore = 0;



function startGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = "block";

    // originalLocation = new google.maps.LatLng(40.730610, -73.935242);

    getRandomRoad();
    updateScoreCounter();
}

function resetView() {
    // Reset Street View
    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById('street-view'), {
            position: originalLocation,
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            addressControl: false,
            linksControl: false,
            panControl: false,
            enableCloseButton: false,
            showRoadLabels: false
        });
}

function validateGuess() {
    const guessedPosition = guessMarker.getPosition();

    // Marker for the original location
    const originalMarker = new google.maps.Marker({
        position: originalLocation,
        map: map,
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"  // Green icon for distinction
        }
    });

    // Draw a line between the original location and the guess
    const linePath = new google.maps.Polyline({
        path: [originalLocation, guessedPosition],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
    const score = calculateDistanceAndScore(originalLocation, guessedPosition); // Updated function call
    totalScore += score;
    gameCount++;
    updateScoreCounter();

    const mapContainer = document.getElementById('map');
    mapContainer.classList.add('fullscreen');

    const streetViewContainer = document.getElementById('street-view');
    streetViewContainer.style.display = 'none'; // Hide Street View for fullscreen map
    map.setCenter(originalLocation);
    map.setZoom(15); // Adjust zoom level as needed
}


function calculateDistanceAndScore(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((point2.lat() - point1.lat()) * Math.PI) / 180;
    const dLon = ((point2.lng() - point1.lng()) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(point1.lat() * Math.PI / 180) * Math.cos(point2.lat() * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    const maxScore = 5000;
    const score = Math.max(0, maxScore - distance * 1000); // Score calculation adjusted for km

    document.getElementById('distanceResult').innerText = `Distance from original location: ${distance.toFixed(2)} km`;
    document.getElementById('scoreResult').innerText = `Score: ${Math.round(score)}`;
    document.getElementById('resultModal').style.display = "block";

    openModal(Math.round(score));
    return Math.round(score);
}


function openModal(score) {
    const modal = document.getElementById('resultModal');
    const scoreBar = document.getElementById('scoreBar');
    const scoreResult = document.getElementById('scoreResult');

    const maxScore = 5000;
    const percentage = (score / maxScore) * 100;

    scoreResult.textContent = `Score: ${score}`;
    
    // Ensure the width is initially set to 0
    scoreBar.style.width = '0';

    // Display the modal
    modal.style.display = 'flex';

    // Update the width with a slight delay to trigger the transition
    setTimeout(() => {
        scoreBar.style.width = `${percentage}%`;
    }, 100); // 100ms delay to ensure transition is applied

}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}


function closeGame() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.display = "none";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('street-view').addEventListener('mouseenter', function() {
        this.style.flex = '7';
        document.getElementById('map').style.flex = '3';
    });

    document.getElementById('street-view').addEventListener('mouseleave', function() {
        this.style.flex = '1';
        document.getElementById('map').style.flex = '1';
    });
});

function getRandomLocation() {
    const locations = [
        { lat: 48.8606, lng: 2.3376 }, // Near Louvre Museum
        { lat: 48.853, lng: 2.3499 },  // Near Notre Dame
        { lat: 48.8867, lng: 2.3431 }, // Near Sacré-Cœur
        { lat: 48.8517, lng: 2.3561 }, // Near Pompidou Center
        { lat: 48.8414, lng: 2.3003 }  // Near Eiffel Tower
    ];
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
}

function getRandomRoad(retryCount = 0) {
    let centralLat = 48.8606; // Latitude for Louvre Museum, Paris
    let centralLng = 2.3376;  // Longitude for Louvre Museum, Paris
    louvreLocation = new google.maps.LatLng(centralLat, centralLng);
    let variance = 0.05;      // This is the range of variation (about 5km)
    const randomCenter = getRandomLocation();

    let randomLat = randomCenter.lat + (Math.random() - 0.5) * variance; 
    let randomLng = randomCenter.lng + (Math.random() - 0.5) * variance;

    getNearestRoad(randomLat, randomLng, louvreLocation, retryCount);
}

function getNearestRoad(lat, lng, louvreLocation, retryCount = 0) {
    const apiKey = 'AIzaSyBCMm6CS82t6Hv_ymU2Es6uo63HlJ6J0qg'; // Replace with your actual Google API key
    const url = `https://roads.googleapis.com/v1/nearestRoads?points=${lat},${lng}&key=${apiKey}`;
    const maxRetries = 3; // Limit the number of retries to prevent infinite recursion

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.snappedPoints && data.snappedPoints.length > 0) {
                const nearestRoadLat = data.snappedPoints[0].location.latitude;
                const nearestRoadLng = data.snappedPoints[0].location.longitude;
                originalLocation = new google.maps.LatLng(nearestRoadLat, nearestRoadLng);

                // Initialize Street View and Map with the nearest road location
                const panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('street-view'), {
                        position: originalLocation, 
                        pov: { heading: 165, pitch: 0 },
                        zoom: 1,
                        addressControl: false,
                        linksControl: false,
                        panControl: false,
                        enableCloseButton: false,
                        showRoadLabels: false
                    });

                map = new google.maps.Map(document.getElementById('map'), {
                    center: louvreLocation,
                    zoom: 12
                });

                guessMarker = new google.maps.Marker({
                    map: map,
                    draggable: true,
                    title: "Drag me!"
                });

                map.addListener('click', function(event) {
                    guessMarker.setPosition(event.latLng);
                });
            } else if (retryCount < maxRetries) {
                console.error('No road found near this location, retrying...');
                getRandomRoad(retryCount + 1); // Call getRandomRoad with incremented retry count
            } else {
                console.error('Failed to find a road after several attempts.');
            }
        })
        .catch(error => {
            console.error('Error fetching nearest road:', error);
            if (retryCount < maxRetries) {
                console.error('Attempting to retry...');
                getRandomRoad(retryCount + 1); // Call getRandomRoad with incremented retry count
            } else {
                console.error('Failed to recover after several retries.');
            }
        });
}

function nextMap() {

    if (gameCount == 5) {
        showFinalScoreModal();
        resetGame();
        return;
    }

    document.getElementById('resultModal').style.display = 'none';
    document.getElementById('distanceResult').innerText = '';
    document.getElementById('scoreResult').innerText = '';
    document.getElementById('street-view').style.display = 'block';
    document.getElementById('map').classList.remove('fullscreen');
    getRandomRoad();
}


function updateScoreCounter() {
    document.getElementById('gameCount').innerText = `Game: ${gameCount}/5`;
    document.getElementById('totalScore').innerText = `Total Score: ${totalScore}`;
}


function resetGame() {
    gameCount = 1;
    totalScore = 0;
    updateScoreCounter();
    startGame();
}



function showFinalScoreModal() {
    const modal = document.getElementById('finalScoreModal');
    const scoreBar = document.getElementById('finalScoreBar');
    const scoreResult = document.getElementById('finalScoreResult');

    const maxScore = 25000;
    const percentage = (totalScore / maxScore) * 100;

    scoreResult.textContent = `Total Score: ${totalScore}`;
    scoreBar.style.width = '0';
    modal.style.display = 'flex';
    setTimeout(() => {
        scoreBar.style.width = `${percentage}%`;
    }, 100);
}

function closeFinalScoreModal() {
    document.getElementById('finalScoreModal').style.display = 'none';
    resetGame();
}