if (location.href.startsWith("http://")) {
  //location = location.href.replace("http://", "https://");
}

const searchParams = new URLSearchParams(location.search);
const useEssentia = searchParams.get("essentia") !== null;
/** @type {GainNode} */
let gainNode;
/** @type {HTMLAudioElement} */
let audio;

function setupWebsocketConnection(webpageName, onMessage, onConnect) {
  // Create WebSocket connection.
  let socket;

  const createSocket = () => {
    socket = new WebSocket("ws://localhost/");

    socket.addEventListener("open", () => {
      console.log("connection opened");
      send({
        type: "connection",
        webpage: webpageName,
      });
      if (onConnect) {
        onConnect(send);
      }
    });
    socket.addEventListener("message", (event) => {
      //console.log("Message from server ", event.data);
      const message = JSON.parse(event.data);
      onMessage(message);
    });
    socket.addEventListener("close", (event) => {
      console.log("connection closed");
      createSocket();
    });
  };
  createSocket();

  const send = (object) => {
    object.from = webpageName;
    socket.send(JSON.stringify(object));
  };

  return send;
}
function setupBroadcastChannel(webpageName, onMessage, onConnect) {
  let broadcastChannel, send;
  const createBroadcastChannel = () => {
    broadcastChannel = new BroadcastChannel("pink-trombone");
    broadcastChannel.addEventListener("message", (event) => {
      //console.log("Message from peer ", event.data);
      const message = event.data;
      if (message.to && message.to.includes(webpageName)) {
        onMessage(message);
      }
    });
    send = (object) => {
      object.from = webpageName;
      broadcastChannel.postMessage(object);
    };
    if (onConnect) {
      onConnect(send);
    }
  };
  createBroadcastChannel();

  return send;
}
const useWebSockets = false;
/**
 * Resumes the audiocontext when it's suspended after a user clicks
 * @param {string} webpageName the name of the webpage this is called from to identify itself
 * @param {function} onMessage is called when the webpage receives websocket messages from the server
 * @returns {object} a send function to send websocket messages to the server
 */
function setupConnection(webpageName, onMessage, onConnect) {
  let send;

  if (useWebSockets) {
    send = setupWebsocketConnection(...arguments);
  } else {
    send = setupBroadcastChannel(...arguments);
  }

  return { send };
}

/**
 * Resumes the audiocontext when it's suspended after a user clicks
 * @param {AudioContext} audioContext
 */
function autoResumeAudioContext(audioContext) {
  window.audioContext = audioContext;
  const resumeAudioContext = () => {
    console.log(`new audio context state "${audioContext.state}"`);
    if (audioContext.state != "running" && audioContext.state != "closed") {
      document.body.addEventListener("click", () => audioContext?.resume(), {
        once: true,
      });
    }
  };
  audioContext.addEventListener("statechange", (e) => {
    resumeAudioContext();
  });
  audioContext.dispatchEvent(new Event("statechange"));
  //resumeAudioContext();
}

/**
 * Returns throttle function that gets called at most once every interval.
 *
 * @param {function} functionToThrottle
 * @param {number} minimumInterval - Minimal interval between calls (milliseconds).
 * @param {object} optionalContext - If given, bind function to throttle to this context.
 * @returns {function} Throttled function.
 */
function throttle(functionToThrottle, minimumInterval, optionalContext) {
  var lastTime;
  if (optionalContext) {
    functionToThrottle = module.exports.bind(
      functionToThrottle,
      optionalContext
    );
  }
  return function () {
    var time = Date.now();
    var sinceLastTime =
      typeof lastTime === "undefined" ? minimumInterval : time - lastTime;
    if (typeof lastTime === "undefined" || sinceLastTime >= minimumInterval) {
      lastTime = time;
      functionToThrottle.apply(null, arguments);
    }
  };
}

// https://www.dyslexia-reading-well.com/44-phonemes-in-english.html
const phonemes =   {
    "": {
      "voiced": true,
      "graphemes": [
        "9"
      ],
      "example": "9",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "9"
      ],
      "example": "9",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "9"
      ],
      "example": "9",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 31.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "9"
      ],
      "example": "9",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 21.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 41.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 38,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": 0.1
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": -0.8
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": 0.4
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 26.5,
          "diameter": 0.8
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.01,
      "frequency": 160
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.01,
      "frequency": 140
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.01,
      "frequency": 120
    },
    "": {
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.1,
      "constrictions": {
        "back": {
          "index": 4,
          "diameter": 2.35
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.2,
      "intensity": 1
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.2,
      "intensity": 0.01
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {
          "front": {
            "index": 34,
            "diameter": 0.8
          }
        },
        {
          "front": {
            "index": 34,
            "diameter": 0
          },
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "front": {
            "index": 34,
            "diameter": 2
          }
        }
      ]
    },
    "": {
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {},
        {
          "back": {
            "index": 5,
            "diameter": 0
          },
          "front": {
            "index": 41.5,
            "diameter": 0
          }
        },
        {
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "front": {
            "index": 41.5,
            "diameter": 2
          }
        }
      ]
    },
    "": {
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {},
        {
          "back": {
            "index": 5,
            "diameter": 0
          },
          "front": {
            "index": 38,
            "diameter": 0
          }
        },
        {
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "front": {
            "index": 38,
            "diameter": 2
          }
        }
      ]
    },
    "": {
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {},
        {
          "back": {
            "index": 5,
            "diameter": 0
          },
          "front": {
            "index": 31.5,
            "diameter": 0
          }
        },
        {
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "front": {
            "index": 31.5,
            "diameter": 2
          }
        }
      ]
    },
    "": {
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {},
        {
          "front": {
            "index": 26.5,
            "diameter": 0
          },
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "front": {
            "index": 26.5,
            "diameter": 2
          }
        }
      ]
    },
    "": {
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {},
        {
          "back": {
            "index": 5,
            "diameter": 0
          },
          "front": {
            "index": 21.5,
            "diameter": 0
          }
        },
        {
          "back": {
            "index": 5,
            "diameter": 0
          }
        },
        {
          "front": {
            "index": 21.5,
            "diameter": 2
          }
        }
      ]
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {
          "front": {
            "index": 41,
            "diameter": 0.8
          }
        },
        {
          "front": {
            "index": 41,
            "diameter": 3
          }
        },
        {
          "front": {
            "index": 41,
            "diameter": 0.8
          }
        },
        {
          "front": {
            "index": 41,
            "diameter": 3
          }
        },
        {
          "front": {
            "index": 41,
            "diameter": 0.8
          }
        }
      ]
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {
          "front": {
            "index": 31.5,
            "diameter": 1
          }
        },
        {
          "front": {
            "index": 31.5,
            "diameter": 0.5
          }
        },
        {
          "front": {
            "index": 31.5,
            "diameter": 1
          }
        },
        {
          "front": {
            "index": 31.5,
            "diameter": 0.5
          }
        },
        {
          "front": {
            "index": 31.5,
            "diameter": 1
          }
        }
      ]
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": [
        {
          "back": {
            "index": 21.5,
            "diameter": 0.8
          }
        },
        {
          "back": {
            "index": 21.5,
            "diameter": 3
          }
        },
        {
          "back": {
            "index": 21.5,
            "diameter": 0.8
          }
        },
        {
          "back": {
            "index": 21.5,
            "diameter": 3
          }
        },
        {
          "back": {
            "index": 21.5,
            "diameter": 0.8
          }
        }
      ]
    },
    "": {
      "voiced": true,
      "graphemes": [
        "9"
      ],
      "example": "9",
      "constrictions": {
        "back": {
          "index": 17.5,
          "diameter": 0
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "back": {
          "index": 17.5,
          "diameter": -1.5
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "back": {
          "index": 17.5,
          "diameter": 0.5
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "back": {
          "index": 17.5,
          "diameter": 1
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "9"
      ],
      "example": "9",
      "constrictions": {
        "front": {
          "index": 29,
          "diameter": 0
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 29,
          "diameter": -1.5
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 29,
          "diameter": 0.5
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "10"
      ],
      "example": "10",
      "constrictions": {
        "front": {
          "index": 29,
          "diameter": 1
        }
      }
    },
    "": {
      "voiced": false,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "holdTime": 0.1
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 14,
          "diameter": 2.78
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 27,
          "diameter": 2.76
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 29,
          "diameter": 2
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 16.3,
          "diameter": 2
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 20.6,
          "diameter": 2
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 19.5,
          "diameter": 3.5
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 2
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 20.5,
          "diameter": 2.78
        }
      }
    },
    "": {
      "voiced": true,
      "graphemes": [
        "7"
      ],
      "example": "7",
      "constrictions": {
        "tongue": {
          "index": 24.8,
          "diameter": 2
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 2.5
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 19,
          "diameter": 3.7
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 28.5,
          "diameter": 2.2
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 16.5,
          "diameter": 1.7
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 22.5,
          "diameter": 1.7
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 2.8
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 1.2
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 20,
          "diameter": 2.7
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 25,
          "diameter": 2.5
        },
        "back": {
          "index": 8,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 2.5
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 19,
          "diameter": 3.7
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 28.5,
          "diameter": 2.2
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 16.5,
          "diameter": 1.7
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 22.5,
          "diameter": 1.7
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 2.8
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 12,
          "diameter": 1.2
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 20,
          "diameter": 2.7
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    },
    "": {
      "graphemes": [
        "9"
      ],
      "example": "9",
      "voiced": true,
      "constrictions": {
        "tongue": {
          "index": 25,
          "diameter": 2.5
        },
        "back": {
          "index": 3,
          "diameter": 0.65
        }
      }
    }
  };

for (const phoneme in phonemes) {
  const phonemeInfo = phonemes[phoneme];
  if ("alternative" in phonemeInfo) {
    const alternative = phonemes[phonemeInfo.alternative];
    alternative.alternative = phoneme;
    phonemeInfo.constrictions = alternative.constrictions;
  }
  phonemeInfo.type = "voiced" in phonemeInfo ? "consonant" : "vowel";

  if (!Array.isArray(phonemeInfo.constrictions)) {
    phonemeInfo.constrictions = [phonemeInfo.constrictions];
  }
}

const getInterpolation = (from, to, value) => {
  return (value - from) / (to - from);
};
const clamp = (value, min = 0, max = 1) => {
  return Math.max(min, Math.min(max, value));
};

// https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js#L47
// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
function inverseLerp(x, y, value) {
  if (x !== y) {
    return (value - x) / (y - x);
  } else {
    return 0;
  }
}

// https://github.com/mrdoob/three.js/blob/master/src/math/MathUtils.js#L62
// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(x, y, t) {
  return (1 - t) * x + t * y;
}

// https://github.com/aframevr/aframe/blob/f5f2790eca841bf633bdaa0110b0b59d36d7e854/src/utils/index.js#L140
/**
 * Returns debounce function that gets called only once after a set of repeated calls.
 *
 * @param {function} functionToDebounce
 * @param {number} wait - Time to wait for repeated function calls (milliseconds).
 * @param {boolean} immediate - Calls the function immediately regardless of if it should be waiting.
 * @returns {function} Debounced function.
 */
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const alternateIPAs = {
  e: "ɛ",
  o: "ɒ",
  ɚ: "r",
  a: "ɒ",
  ɑ: "ɒ",
  ɹ: "r",
  //i: "ɪ",
  //u: "w",
  //ɔ: "ɒ",
  ʤ: "dʒ",
  ʧ: "tʃ",
};

for (const alternatePhoneme in alternateIPAs) {
  const phoneme = alternateIPAs[alternatePhoneme];
  phonemes[alternatePhoneme] = phonemes[phoneme];
  if (!phonemes[phoneme].aliases) {
    phonemes[phoneme].aliases = new Set();
  }
  phonemes[phoneme].aliases.add(phoneme);
  phonemes[phoneme].aliases.add(alternatePhoneme);
}

const utterances = [
  {
    name: "pleasure",
    keyframes: [
      {
        time: 0,
        name: "p",
        frequency: 156.8715057373047,
        "tongue.index": 12.899999618530273,
        "tongue.diameter": 2.430000066757202,
        "frontConstriction.index": 40.881263732910156,
        "frontConstriction.diameter": -0.422436386346817,
        tenseness: 0.5045413374900818,
        loudness: 0.8427993655204773,
        intensity: 0,
      },
      {
        time: 0.08958333333333333,
        name: "l",
        frequency: 190.45954805788224,
        "tongue.index": 16.921409606933594,
        "tongue.diameter": 1.9775906801223755,
        "frontConstriction.index": 34.73271560668945,
        "frontConstriction.diameter": 0.774807870388031,
        tenseness: 0.7361269593238831,
        loudness: 0.9262712597846985,
        intensity: 1,
      },
      {
        time: 0.2,
        name: "e",
        frequency: 140.82355356753655,
        "tongue.index": 25.9163875579834,
        "tongue.diameter": 2.715711832046509,
        "frontConstriction.index": 37.73653030395508,
        "frontConstriction.diameter": 2.874277114868164,
        tenseness: 0.7361269593238831,
        loudness: 0.9262712597846985,
        intensity: 1,
      },
      {
        time: 0.35208333333333325,
        name: "s",
        frequency: 102.00469207763672,
        "tongue.index": 23.960628509521484,
        "tongue.diameter": 1.543920636177063,
        "frontConstriction.index": 31.57721519470215,
        "frontConstriction.diameter": 0.3962106704711914,
        tenseness: 0.8181954026222229,
        loudness: 0.9509599804878235,
        intensity: 1,
      },
      {
        time: 0.4833333333333334,
        name: "ure",
        frequency: 82.13327455905124,
        "tongue.index": 12.490761756896973,
        "tongue.diameter": 1.8611775636672974,
        "frontConstriction.index": 28.101966857910156,
        "frontConstriction.diameter": 0.9815574884414673,
        tenseness: 0.6612620949745178,
        loudness: 0.9017650485038757,
        intensity: 0.7,
      },
      {
        time: 0.6812499999999999,
        name: ".",
        frequency: 81.25236574691407,
        "tongue.index": 12.490761756896973,
        "tongue.diameter": 1.8611775636672974,
        "frontConstriction.index": 28.101966857910156,
        "frontConstriction.diameter": 0.9815574884414673,
        tenseness: 0.6612620949745178,
        loudness: 0.9017650485038757,
        intensity: 0,
      },
    ],
  },
];

function deconstructVoiceness(voiceness) {
  const tenseness = 1 - Math.cos(voiceness * Math.PI * 0.5);
  const loudness = Math.pow(tenseness, 0.25);
  return { tenseness, loudness };
}

const phonemeSubstitutions = {};
let holdTimes = {
  ˈ: 0.05,
  ˌ: 0.05,
  ".": 1.0,
};
let Voiceness = {
  "1": 0.2,
  "2": 0.0001,
};
let consonantHoldTime = 0.1;
let timeBetweenSubResults = 0.1; // seconds
let spaceTime = 0.1;
let releaseTime = 0.1;
let timeBetweenPhonemes = 0.1;
let timeBetweenSubPhonemes = 0.01;
let defaultVoiceness = 0.85; //voicesetting
let defaultVoiceless = 0.15;
const generateKeyframes = (pronunciation) => {
  const keyframes = [];
  Array.from(pronunciation).forEach((phoneme, index) => {
    if (nonPhonemeIPAs.includes(phoneme)) {
      return;
    }

    let offsetTime = 0.05;

    let holdTime = 0;
    let nextPhoneme = pronunciation[index + 1];
    if (nextPhoneme == "ˈ" || nextPhoneme == "ˌ") {
      holdTime = holdTimes[nextPhoneme];
    }

    const { type, voiced, constrictions } = phonemes[phoneme];
    if (type == "consonant") {
      holdTime = consonantHoldTime;
    }

    const _keyframes = [];
    constrictions.forEach((constriction, index) => {
      let name = phoneme;
      if (constrictions.length > 1) {
        name += `(${index})`;
      }

      const keyframe = {
        intensity: 1,
        name,
        timeDelta:
          index == constrictions.length - 1
            ? timeBetweenPhonemes
            : timeBetweenSubPhonemes,
        "frontConstriction.diameter": 5,
        "backConstriction.diameter": 5,
      };

      let voiceness = defaultVoiceness;
      if (type == "consonant") {
        voiceness = voiced ? defaultVoiceness : defaultVoiceless;
      }
      Object.assign(keyframe, deconstructVoiceness(voiceness));

      for (const key in constriction) {
        for (const subKey in constriction[key]) {
          let string = key;
          if (key != "tongue") {
            string += "Constriction";
          }
          string += `.${subKey}`;
          keyframe[string] = constriction[key][subKey];
        }
      }
      _keyframes.push(keyframe);

      const holdKeyframe = Object.assign({}, keyframe);
      holdKeyframe.isHold = true;
      holdKeyframe.timeDelta = holdTime;
      holdKeyframe.name = `${holdKeyframe.name}]`;
      _keyframes.push(holdKeyframe);

      if (index == 0 && type == "consonant" && !voiced) {
        // add keyframe after first to change to voiced
        Object.assign(_keyframes[0], deconstructVoiceness(defaultVoiceness));
        _keyframes[0].intensity = 0;
        const voicedToVoicelessKeyframe = Object.assign({}, _keyframes[0]);
        voicedToVoicelessKeyframe.name = `{${voicedToVoicelessKeyframe.name}`;
        //voicedToVoicelessKeyframe.isHold = false;
        voicedToVoicelessKeyframe.timeDelta = 0.001;
        voicedToVoicelessKeyframe.intensity = 0.8;
        Object.assign(
          voicedToVoicelessKeyframe,
          deconstructVoiceness(defaultVoiceless)
        );
        _keyframes.splice(1, 0, voicedToVoicelessKeyframe);

        // add keyframe after last to change back to voiced
        const voicelessToVoicedKeyframe = Object.assign(
          {},
          _keyframes[_keyframes.length - 1]
        );
        voicelessToVoicedKeyframe.timeDelta = 0.001;
        voicelessToVoicedKeyframe.name = `${voicelessToVoicedKeyframe.name}}`;
        //voicelessToVoicedKeyframe.isHold = false;

        //voicelessToVoicedKeyframe.intensity = 0;
        Object.assign(
          voicelessToVoicedKeyframe,
          deconstructVoiceness(defaultVoiceness)
        );
        _keyframes.push(voicelessToVoicedKeyframe);
      }
    });
    keyframes.push(..._keyframes);
  });
  return keyframes;
};

const RenderKeyframes = (keyframes, time = 0, frequency = 140, speed = 1) => {
  const _keyframes = [];
  keyframes.forEach((keyframe) => {
    const _keyframe = Object.assign({}, keyframe);
    if (_keyframe.timeDelta > 0) {
      time += _keyframe.timeDelta / speed;
      _keyframe.time = time;

      if ("frequency" in keyframe) {
        _keyframe.frequency = keyframe.frequency;
      } else if ("semitones" in keyframe) {
        _keyframe.frequency = 140 * 2 ** (keyframe.semitones / 12);
      } else {
        _keyframe.frequency = frequency;
      }

      delete _keyframe.timeDelta;
      _keyframes.push(_keyframe);
    }
  });
  _keyframes.push({
    name: ".",
    time: time + releaseTime / speed,
    frequency,
    intensity: 0,
  });
  return _keyframes;
};

const nonPhonemeIPAs = ["ˈ", "ˌ", ".","1","2","3"];

const getPhonemesAlternativesFromWords = (
  wordsString,
  shouldTrimPronunciation = false
) => {
  const wordsStrings = wordsString.split(" ");
  const wordsPhonemesAlternatives = [];
  const validWordStrings = [];

  wordsStrings.forEach((wordString) => {
    if (wordString.length > 0) {
      let ipas = TextToIPA._IPADict[wordString];
      if (ipas) {
        validWordStrings.push(wordString);
        ipas = ipas.slice();
        if (shouldTrimPronunciation) {
          ipas = ipas.map((ipa) => trimPronunciation(ipa));
        }
        wordsPhonemesAlternatives.push(ipas);
      }
    }
  });

  return { wordsPhonemesAlternatives, validWordStrings };
};

const splitPhonemesIntoSyllables = (_phonemes) => {
  const syllables = [];

  let currentSyllable;

  _phonemes = trimDuplicateAdjacentCharacters(_phonemes);

  _phonemes.split("").forEach((phoneme) => {
    if (phoneme in phonemes) {
      const { type } = phonemes[phoneme];
      const isSemiVowel = semiVowels.includes(phoneme);
      if (
        currentSyllable &&
        currentSyllable.type == type &&
        !isSemiVowel &&
        !currentSyllable.isSemiVowel
      ) {
        currentSyllable.phonemes += phoneme;
      } else {
        currentSyllable = { type, phonemes: phoneme, isSemiVowel };
        syllables.push(currentSyllable);
      }
    }
  });
  return syllables;
};

let semiVowels = ["w", "ɚ", "r", "ɹ", "j"];
//semiVowels.length = 0;

const trimDuplicateAdjacentCharacters = (string) =>
  string
    .replace(" ", "")
    .split("")
    .filter((char, i) => string[i - 1] != char)
    .join("");

const consonantGroups = [
  ["b", "p", "m", "n"],
  ["d", "t", "s", "z", "ð", "θ"],
  ["dʒ", "h", "tʃ", "ʃ", "ʒ", "ʤ", "ʧ"],
  ["f", "v", "w"],
  ["g", "k", "ŋ"],
  ["r", "ɚ", "ɹ"],
  ["l"],
  ["", "", ""],
];

const areConsonantsInSameGroup = (a, b) => {
  let consonantsAreInSameGroup = false;
  consonantGroups.some((consonantGroup) => {
    if (consonantGroup.includes(a)) {
      consonantsAreInSameGroup = consonantGroup.includes(b);
      return true;
    }
  });
  return consonantsAreInSameGroup;
};

const tractLengthRange = { min: 15, max: 88 };
const isTractLengthInRange = (tractLength) =>
  tractLength >= tractLengthRange.min && tractLength <= tractLengthRange.max;
