// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LocationManager {
    struct Location {
        string name;
        string description;
        string long;
        string lat;
        uint voteCount;
    }

    Location[] private locations;
    mapping(uint => mapping(address => bool)) public hasVoted;

    event LocationAdded(uint indexed locationId, string name, string description, string long, string lat);
    event LocationVoted(uint indexed locationId, address indexed voter);

    function addLocation(
        string memory _name,
        string memory _description,
        string memory _long,
        string memory _lat
    ) external {
        locations.push(Location({
            name: _name,
            description: _description,
            long: _long,
            lat: _lat,
            voteCount: 0
        }));
        emit LocationAdded(locations.length - 1, _name, _description, _long, _lat);
    }

    function voteLocation(uint _locationId) external {
        require(_locationId < locations.length, "Location does not exist");
        require(!hasVoted[_locationId][msg.sender], "Already voted");
        hasVoted[_locationId][msg.sender] = true;
        locations[_locationId].voteCount += 1;
        emit LocationVoted(_locationId, msg.sender);
    }

    function getAllLocations() external view returns (Location[] memory) {
        return locations;
    }
}