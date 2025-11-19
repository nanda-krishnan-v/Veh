const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarRegistry", function () {
  let carRegistry;
  let owner;
  let addr1;
  let addr2;

  // Deploy contract before each test
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const CarRegistry = await ethers.getContractFactory("CarRegistry");
    carRegistry = await CarRegistry.deploy();
    await carRegistry.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await carRegistry.getAddress();
      expect(address).to.not.equal(0);
      expect(address).to.not.equal("");
      expect(address).to.not.equal(null);
      expect(address).to.not.equal(undefined);
    });

    it("Should start with zero cars", async function () {
      const carCount = await carRegistry.getCarCount();
      expect(carCount).to.equal(0);
    });
  });

  describe("Car Registration", function () {
    it("Should register a car successfully", async function () {
      const tx = await carRegistry.registerCar("John Doe", "Tesla Model 3");
      await tx.wait();

      const carCount = await carRegistry.getCarCount();
      expect(carCount).to.equal(1);
    });

    it("Should emit CarRegistered event", async function () {
      await expect(carRegistry.registerCar("Jane Smith", "BMW X5"))
        .to.emit(carRegistry, "CarRegistered")
        .withArgs(0, "Jane Smith", "BMW X5");
    });

    it("Should register multiple cars", async function () {
      await carRegistry.registerCar("Alice", "Honda Civic");
      await carRegistry.registerCar("Bob", "Ford Mustang");
      await carRegistry.registerCar("Charlie", "Audi A4");

      const carCount = await carRegistry.getCarCount();
      expect(carCount).to.equal(3);
    });

    it("Should store car details correctly", async function () {
      await carRegistry.registerCar("Test Owner", "Test Model");
      
      const car = await carRegistry.cars(0);
      expect(car.ownerName).to.equal("Test Owner");
      expect(car.carModel).to.equal("Test Model");
    });
  });

  describe("Car Retrieval", function () {
    beforeEach(async function () {
      // Register some test cars
      await carRegistry.registerCar("Owner1", "Car1");
      await carRegistry.registerCar("Owner2", "Car2");
      await carRegistry.registerCar("Owner3", "Car3");
    });

    it("Should return all cars", async function () {
      const cars = await carRegistry.getAllCars();
      expect(cars.length).to.equal(3);
    });

    it("Should return correct car details", async function () {
      const cars = await carRegistry.getAllCars();
      
      expect(cars[0].ownerName).to.equal("Owner1");
      expect(cars[0].carModel).to.equal("Car1");
      
      expect(cars[1].ownerName).to.equal("Owner2");
      expect(cars[1].carModel).to.equal("Car2");
      
      expect(cars[2].ownerName).to.equal("Owner3");
      expect(cars[2].carModel).to.equal("Car3");
    });

    it("Should handle empty string values", async function () {
      await carRegistry.registerCar("", "");
      const carCount = await carRegistry.getCarCount();
      expect(carCount).to.equal(4);
    });
  });

  describe("Gas Optimization", function () {
    it("Should track gas usage for registration", async function () {
      const tx = await carRegistry.registerCar("Gas Test", "Test Car");
      const receipt = await tx.wait();
      
      console.log(`      ⛽ Gas used for registration: ${receipt.gasUsed.toString()}`);
      
      // Ensure gas usage is reasonable (adjust threshold as needed)
      expect(receipt.gasUsed).to.be.lessThan(100000n);
    });
  });
});
