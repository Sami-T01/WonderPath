// js/checkpointVerifier.js

function checkpointReached(poi) {
  return new Promise((resolve) => {
    console.log(`✅ User reached: ${poi.name}`);

    // Award points using the correct function
    TokenEarner.reward(50);

    // Optionally log or track check-ins here
    resolve();
  });
}
