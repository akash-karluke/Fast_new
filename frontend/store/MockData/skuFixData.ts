export const skuFixData = {
    actionFor: "Increase Core OSA In Deodorant Category",
    dueDate: '2 sept 2022',
    currentStatus: {
      statusId: 1,
      value: "On Track"
    },
    allStatuses: [
      {
        statusId: 1,
        value: "On Track"
      },
      {
        statusId: 2,
        value: "Delayed"
      },
      {
        statusId: 3,
        value: "Stale"
      },
      {
        statusId: 4,
        value: "Started"
      },
    ],
    allRootCause: [
      {
        type: "Store has not received the stock",
        id: 1
      },
      {
        type: "Store is closed",
        id: 2
      },
      {
        type: "Stock Availabilty Issue",
        id: 3
      },
      {
        type: "Others",
        id: 4
      },
    ],
    store: {
      id: 1,
      name: "C&C",
      location: "Port Sunlight",
      locationId: 1001
    },
    totalSkus: 23,
    available: 15,
    notAvailable: 5,
    isComplete: false,
    currentlyAssignedTo: {
      name: 'Gopal Sharma',
      userId: 1
    },
    osa: {
      "current": 72,
      target: 82
    },
    allSku: {
      "77123": {
        desc: "AXE AER B SPRAY DARK TEMPT 12X96G/150ML",
        avaiabilityStatus: 1, // 1 for available,
        rootCause: null,
        comment: "no efforts",
        image: null,
      },
      "12323": {
        desc: "CHOCOLATE AXE DARK TEMPT 12X96G/150ML",
        avaiabilityStatus: 0, // 1 for available,
        rootCause: {
          id: 2,
          desc: "Store is closed"
        },
        comment: "",
        image: null,
      },
      "749837483": {
        desc: "FOGG 120 ML",
        avaiabilityStatus: 0, // 1 for available,
        rootCause: {
          id: 3,
          desc: "Stock Availabilty Issue"
        },
        comment: "",
        image: null,
      },
      "43242": {
        desc: "AXE AER B SPRAY DARK",
        avaiabilityStatus: 0, // 1 for available,
        rootCause: {
          id: 4,
          desc: "Not able to reach Store due to floods"
        },
        comment: "",
        image: null,
      },
      "9720742": {
        desc: "AXE AER 150ML",
        avaiabilityStatus: 1, // 1 for available,
        rootCause: null,
        comment: "",
        image: null,
      },
      "4325267": {
        desc: "FOGG AER B SPRAY DARK TEMPT 12X96G/150ML",
        avaiabilityStatus: 1, // 1 for available,
        rootCause: null,
        comment: "",
        image: null,
      },
    },
  }