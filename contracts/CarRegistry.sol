// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CarRegistry
 * @dev A decentralized car registry for storing vehicle ownership information
 */
contract CarRegistry {
    struct Car {
        string ownerName;
        string carModel;
    }
    
    Car[] public cars;
    
    event CarRegistered(uint256 indexed carId, string ownerName, string carModel);
    
    /**
     * @dev Register a new car in the registry
     * @param _ownerName The name of the car owner
     * @param _carModel The model of the car
     */
    function registerCar(string memory _ownerName, string memory _carModel) public {
        cars.push(Car(_ownerName, _carModel));
        emit CarRegistered(cars.length - 1, _ownerName, _carModel);
    }
    
    /**
     * @dev Get all registered cars
     * @return An array of all registered cars
     */
    function getAllCars() public view returns (Car[] memory) {
        return cars;
    }
    
    /**
     * @dev Get the total number of registered cars
     * @return The count of registered cars
     */
    function getCarCount() public view returns (uint256) {
        return cars.length;
    }
}
