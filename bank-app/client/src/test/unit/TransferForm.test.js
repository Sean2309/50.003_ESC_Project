// axios.post = jest.fn().mockResolvedValue();

  // simulate successful response from sending POST request to TransferConnect API endpoint
  const mockServerSuccessfulResponse = {
    status: 201,
    data: {
      memberName: "mockUser",
      membershipId: "01",
      transferDate: "11-11-11",
      transferAmount: 2000,
      referenceNumber: "101",
      partnerCode: "mockApp",
      notificationMethod: "1",
      emailAddress: "mock@email.com",
      phoneNumber: "88100110",

    }
  };