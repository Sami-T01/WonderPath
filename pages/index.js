import Head from 'next/head';
import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function Home() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        // store current user for on-chain interactions
        window.currentUser = accounts[0];
        // initialize on-chain token balance
        TokenEarner.init();
        document.getElementById('screen-login').style.display = 'none';
        // Reveal portal and show route filters
        document.getElementById('portal').classList.remove('hidden');
        // Hide all individual screens then show filters
        document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
        document.getElementById('screen-route-filters').classList.remove('hidden');
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('MetaMask not detected. Please install a Web3 wallet.');
    }
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>WonderPath</title>
        <link rel="stylesheet" href="/css/styles.css" />
      </Head>

      {/* LOGIN SCREEN */}
      <div id="screen-login" className="screen">
        <h2>Connect Wallet</h2>
        <button
          id="btn-connect-wallet"
          type="button"
          onClick={connectWallet}
        >
          {account
            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : '🔗 Connect Wallet'}
        </button>
      </div>

      {/* HEADER + MAIN PORTAL */}
      <div id="portal" className="hidden">
        <header>
          <h1>WonderPath</h1>
          <div>
            Points: <span id="points-balance">0</span>
            <button id="user-profile" className="profile-tag">
              {account
                ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                : 'Profile'}
            </button>
          </div>
        </header>
        <div id="map" style={{ width: '100%', height: '300px', marginTop: '60px' }}></div>

        {/* Route Filters */}
        <div id="screen-route-filters" className="screen hidden">
          <h2>Route Filters</h2>
          <label>Start:</label>
          <input id="startInput" type="text" placeholder="Enter start location" />
          <label>End (optional):</label>
          <input id="endInput" type="text" placeholder="Enter end location" />
          <label>Time Budget (mins):</label>
          <input id="timeBudget" type="number" min="1" placeholder="e.g. 60" />
          <div className="modes">
            <button type="button" data-mode="WALKING">Walk</button>
            <button type="button" data-mode="BICYCLING">Bike</button>
            <button type="button" data-mode="DRIVING">Drive</button>
            <button type="button" data-mode="TRANSIT">Public Transport</button>
          </div>
          <button id="btn-route-next" type="button">Next</button>
        </div>

        {/* POI Filters */}
        <div id="screen-poi-filters" className="screen hidden">
          <h2>Choose POI Categories</h2>
          <div><label><input type="checkbox" id="cat-cafe" /> Café</label>
            <select id="subcat-cafe" disabled>
              <option value="cafe">All Cafés</option>
              <option value="coffee">Coffee Shop</option>
              <option value="pastry">Pastry Café</option>
              <option value="tea">Tea House</option>
            </select>
          </div>
          <div><label><input type="checkbox" id="cat-restaurant" /> Restaurant</label>
            <select id="subcat-restaurant" disabled>
              <option value="restaurant">All Restaurants</option>
              <option value="italian">Italian</option>
              <option value="sushi">Sushi</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div><label><input type="checkbox" id="cat-bar" /> Bar</label>
            <select id="subcat-bar" disabled>
              <option value="bar">All Bars</option>
              <option value="rooftop_bar">Rooftop Bar</option>
              <option value="sports_bar">Sports Bar</option>
              <option value="cocktail_bar">Cocktail Bar</option>
            </select>
          </div>
          <div className="actions">
            <button id="btn-poi-next" type="button">Next</button>
            <button id="btn-poi-surprise" type="button">Surprise Me</button>
          </div>
        </div>

        {/* First Stop */}
        <div id="screen-first-stop" className="screen hidden">
          <h2>First Stop</h2>
          <div id="first-stop-options"></div>
        </div>

        {/* Next Suggestion */}
        <div id="screen-next-stop" className="screen hidden">
          <h2>Your Next Suggestion</h2>
          <div id="next-stop-info"></div>
          <button id="btn-go-here" type="button">Go Here</button>
          <button id="btn-im-here" type="button" style={{ display: 'none' }}>I'm Here</button>
        </div>

        {/* Final Arrival */}
        <div id="screen-arrival" className="screen hidden">
          <h2>You've arrived!</h2>
          <p>Thanks for exploring with us.</p>
          <button id="btn-start-over" type="button">Start Over</button>
        </div>

        {/* Dashboard */}
        <div id="screen-dashboard" className="screen hidden">
          <h2>Your Profile</h2>
          <p><strong>User:</strong> <span id="dashboard-user-id">Guest</span></p>
          <p><strong>Tokens:</strong> <span id="dashboard-token-count">0</span></p>
          <h3>Where You Earned Them:</h3>
          <ul id="dashboard-token-sources"></ul>
          <button id="dashboard-redeem-button">Redeem Tokens</button>
          <button id="btn-back-from-dashboard">Back</button>
        </div>

        {/* Redeem */}
        <div id="screen-redeem" className="screen hidden">
          <h2>Redeem Tokens</h2>
          <label>Voucher Cost:</label>
          <input id="voucherCost" type="number" min="0" />
          <button id="redeemButton" type="button">Redeem</button>
          <button id="btn-start-adventure" type="button">Start an Adventure</button>
        </div>
      </div>

      {/* Scripts */}
      <Script src="/js/map.js" strategy="beforeInteractive" />
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCx4GXwuK0O-Bt7OZOagQvI51FY84TTfKY&libraries=places"
        strategy="afterInteractive"
        onLoad={() => window.initMap()}
      />
      <Script src="/js/routeGuardian.js" strategy="afterInteractive" />
      <Script src="/js/checkpointVerifier.js" strategy="afterInteractive" />
      <Script src="/js/tokenEarner.js" strategy="afterInteractive" />
      <Script src="/js/voucherRedeemer.js" strategy="afterInteractive" />
      <Script src="/js/app.js" strategy="afterInteractive" />
    </>
  );
}
