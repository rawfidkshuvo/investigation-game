import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import {
  Search,
  Skull,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Gavel,
  Eye,
  EyeOff,
  Briefcase,
  RotateCcw,
  LogOut,
  Badge,
  Settings,
  History,
  X,
  Target,
  Trash2,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  ThumbsUp,
  Crosshair,
  Info,
  BookOpen,
} from "lucide-react";

// --- Firebase Init ---
const firebaseConfig = {
  apiKey: "AIzaSyDf86JHBvY9Y1B1x8QDbJkASmlANouEvX0",
  authDomain: "card-games-28729.firebaseapp.com",
  projectId: "card-games-28729",
  storageBucket: "card-games-28729.firebasestorage.app",
  messagingSenderId: "466779458834",
  appId: "1:466779458834:web:68f8deac8c018f2c6d37cb",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== "undefined" ? __app_id : "investigation-v2";

// --- Game Data Assets (From PDF) ---

const MEANS_CARDS = [
  "Kitchen Knife",
  "Dagger",
  "Machete",
  "Fire Axe",
  "Ice Pick",
  "Surgical Scalpel",
  "Scissors",
  "Broken Bottle",
  "Katana",
  "Cleaver",
  "Hammer",
  "Baseball Bat",
  "Golf Club",
  "Wrench",
  "Crowbar",
  "Brick",
  "Heavy Statue",
  "Candlestick",
  "Frying Pan",
  "Rock",
  "Pistol",
  "Silenced Gun",
  "Sniper Rifle",
  "Shotgun",
  "Crossbow",
  "Rope",
  "Wire",
  "Necktie",
  "Pillow",
  "Plastic Bag",
  "Arsenic",
  "Cyanide Pill",
  "Venomous Snake",
  "Overdose Injection",
  "Sleeping Pills",
  "Chainsaw",
  "Explosives",
  "Molotov Cocktail",
  "Electrocution",
  "Drowning",
  "Push from Heights",
  "Vehicle",
  "Trophy",
  "Screwdriver",
  "Garden Shears",
  "Bare Hands",
  "Laptop Cord",
  "Frozen Lamb Leg",
  "Radioactive Isotope",
  "Liquid Mercury",
];

const CLUE_CARDS = [
  "Fingerprint",
  "Muddy Footprint",
  "Blood Stain",
  "Strand of Hair",
  "Torn Fabric",
  "Shirt Button",
  "Sewing Thread",
  "Wedding Ring",
  "Wristwatch",
  "Diamond Necklace",
  "Broken Glasses",
  "Leather Wallet",
  "ID Badge",
  "Credit Card",
  "Grocery Receipt",
  "Plane Ticket",
  "Crumpled Note",
  "Locked Diary",
  "Torn Photograph",
  "City Map",
  "USB Drive",
  "Smartphone",
  "Laptop",
  "House Keys",
  "Rare Coin",
  "Cigarette Butt",
  "Gold Lighter",
  "Matchbook",
  "Pile of Ashes",
  "Shard of Glass",
  "Shattered Plate",
  "Crushed Flower",
  "Tree Leaf",
  "Puddle of Water",
  "Oil Stain",
  "Spray Paint",
  "Spilled Ink",
  "Candy Wrapper",
  "Empty Wine Bottle",
  "Coffee Cup",
  "Lipstick Mark",
  "Scent of Perfume",
  "White Powder",
  "Bullet Casing",
  "Tool Marks",
  "Leather Glove",
  "Ski Mask",
  "Playing Card",
  "Dice",
  "Pocket Mirror",
];

const TILES_DATA = {
  FIXED: {
    title: "Cause of Death",
    type: "purple",
    options: [
      "Suffocation",
      "Severe Injury",
      "Loss of Blood",
      "Chemical / Sickness",
      "Accident",
      "Projectile / Blast",
    ],
  },
  MAIN: [
    {
      title: "Location of Crime",
      type: "green",
      options: [
        "Living Room",
        "Bedroom",
        "Kitchen / Dining",
        "Bathroom",
        "Outdoors / Park",
        "Workplace / Office",
      ],
    },
    {
      title: "State of Scene",
      type: "green",
      options: [
        "Chaos / Destruction",
        "Signs of Struggle",
        "Perfectly Tidy",
        "Items Missing",
        "Staged / Artificially Arranged",
        "Covered (Ash/Water/Dust)",
      ],
    },
    {
      title: "Condition of Corpse",
      type: "green",
      options: [
        "Head / Neck",
        "Chest / Torso",
        "Hands / Arms",
        "Legs / Feet",
        "Internal Organs",
        "No Visible Wounds",
      ],
    },
    {
      title: "Victim's Identity",
      type: "green",
      options: [
        "Child",
        "Young Adult",
        "Middle-Aged",
        "Elderly",
        "Male",
        "Female",
      ],
    },
  ],
  SUBORDINATE: [
    {
      title: "Weather",
      options: [
        "Sunny/Clear",
        "Rainy/Stormy",
        "Foggy/Misty",
        "Snowing",
        "Hot/Dry",
        "Windy",
      ],
    },
    {
      title: "Time of Death",
      options: [
        "Dawn",
        "Noon",
        "Afternoon",
        "Evening",
        "Midnight",
        "Late Night",
      ],
    },
    {
      title: "Duration of Crime",
      options: [
        "Instantaneous",
        "Few Seconds",
        "Few Minutes",
        "Under an Hour",
        "Several Hours",
        "Days",
      ],
    },
    {
      title: "Trace at Scene",
      options: [
        "Footprints",
        "Fingerprints",
        "Blood/Fluids",
        "Smell/Scent",
        "Sound/Recording",
        "Writing/Marks",
      ],
    },
    {
      title: "Weapon Type",
      options: [
        "Sharp",
        "Blunt",
        "Toxin/Chemical",
        "Projectile",
        "Everyday Object",
        "Machinery/Tool",
      ],
    },
    {
      title: "Weapon Property",
      options: [
        "Heavy",
        "Lightweight",
        "Long",
        "Short/Small",
        "Noisy",
        "Silent",
      ],
    },
    {
      title: "Evidence Material",
      options: [
        "Fabric/Cloth",
        "Metal",
        "Paper/Wood",
        "Plastic",
        "Biological",
        "Stone/Glass",
      ],
    },
    {
      title: "Evidence Condition",
      options: [
        "Broken/Damaged",
        "New/Shiny",
        "Old/Worn",
        "Wet/Dirty",
        "Burnt/Singed",
        "Incomplete",
      ],
    },
    {
      title: "Social Relation",
      options: [
        "Relatives",
        "Friends",
        "Colleagues",
        "Lovers",
        "Strangers",
        "Enemies",
      ],
    },
    {
      title: "Victim's Activity",
      options: [
        "Sleeping",
        "Eating/Drinking",
        "Working",
        "Cleaning",
        "Entertainment",
        "Argument/Fight",
      ],
    },
    {
      title: "Sudden Incident",
      options: [
        "Loud Shout",
        "Heavy Thud",
        "Bright Flash",
        "Dead Silence",
        "Scream",
        "Breaking Glass",
      ],
    },
    {
      title: "Motive",
      options: [
        "Hatred/Revenge",
        "Greed/Money",
        "Love/Passion",
        "Jealousy",
        "Fear/Defense",
        "Madness",
      ],
    },
    {
      title: "Killer's Trait",
      options: [
        "Arrogant",
        "Cautious",
        "Violent",
        "Calm/Cold",
        "Nervous",
        "Calculating",
      ],
    },
    {
      title: "Victim's Clothes",
      options: [
        "Pajamas",
        "Uniform",
        "Formal Suit",
        "Casual",
        "Naked",
        "Costume",
      ],
    },
    {
      title: "Impression",
      options: [
        "Natural",
        "Artistic",
        "Cruel",
        "Clumsy",
        "Professional",
        "Bizarre",
      ],
    },
    {
      title: "Noticed By Others",
      options: [
        "Sound",
        "Smell",
        "Silhouette",
        "Someone Running",
        "Object Thrown",
        "Nothing",
      ],
    },
    {
      title: "Evidence Size",
      options: ["Tiny", "Small", "Medium", "Large", "Heavy", "Microscopic"],
    },
    {
      title: "Evidence Color",
      options: [
        "Red/Purple",
        "Blue/Green",
        "Yellow/Orange",
        "Black/Grey",
        "White/Clear",
        "Metallic",
      ],
    },
    {
      title: "In Progress",
      options: [
        "Entering",
        "Leaving",
        "Conversation",
        "Meal",
        "Distracted",
        "On Phone",
      ],
    },
    {
      title: "Assassin Hint",
      options: ["Man", "Woman", "Tall", "Short", "Strong", "Weak"],
    },
  ],
};

// --- Helper Functions ---
const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }
  return newArray;
};

// --- Main Component ---
export default function InvestigationGame() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Local Interaction State
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [selectedTileOption, setSelectedTileOption] = useState(null);
  const [solveTarget, setSolveTarget] = useState(null);
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [replacementMode, setReplacementMode] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false); // Confirm Leave Modal
  const [showCluesMobile, setShowCluesMobile] = useState(true); // Toggle clues visibility on mobile
  const [uiAlert, setUiAlert] = useState(null); // { title, message, type: 'alert'|'confirm', onConfirm }

  // New State for Witness Hunt Interaction
  const [witnessHuntModalOpen, setWitnessHuntModalOpen] = useState(true);
  const [showSuggestionToast, setShowSuggestionToast] = useState(true);

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // Reset Witness Hunt Modal when phase changes
  useEffect(() => {
    if (gameState?.phase === "WITNESS_HUNT") {
      setWitnessHuntModalOpen(true);
      setShowSuggestionToast(true);
    } else {
      setWitnessHuntModalOpen(false);
    }
  }, [gameState?.phase]);

  // Show Suggestion Toast if suggestion arrives
  useEffect(() => {
    if (gameState?.accompliceSuggestion) {
      setShowSuggestionToast(true);
    }
  }, [gameState?.accompliceSuggestion]);

  useEffect(() => {
    if (!roomId || !user) return;
    const roomRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "rooms",
      roomId
    );
    const unsubscribe = onSnapshot(
      roomRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          // 1. KICK CHECK: If I am not in the player list, return to menu
          const amIInRoom = data.players.find((p) => p.id === user.uid);
          if (!amIInRoom) {
            setRoomId(null);
            setView("menu");
            setGameState(null);
            setError("You were removed from the room.");
            return;
          }

          setGameState({ id: docSnap.id, ...data });
          if (data.status === "playing" || data.status === "finished")
            setView("game");
          else setView("lobby");

          // Reset local UI if status changed to lobby (restarted)
          if (data.status === "lobby") {
            setShowSolveModal(false);
            setSolveTarget(null);
            setReplacementMode(false);
          }

          // Check for Game Over conditions (All badges used)
          if (data.status === "playing" && data.phase === "INVESTIGATION") {
            const activeBadges = data.players.filter(
              (p) => p.role !== "DETECTIVE" && p.badge === true
            ).length;
            if (activeBadges === 0 && !data.activeAccusation) {
              // Trigger resolution if I am host (to avoid multiple triggers)
              if (data.hostId === user.uid) {
                resolveGameBadgesGone(data);
              }
            }
          }
        } else {
          setRoomId(null);
          setView("menu");
          setError("Room closed.");
        }
      },
      (err) => console.error(err)
    );
    return () => unsubscribe();
  }, [roomId, user]);

  const resolveGameBadgesGone = async (currentState) => {
    let logs = [{ text: "All badges used. Murderer Escapes!", type: "danger" }];
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        phase: "GAME_OVER_BAD",
        logs: arrayUnion(...logs),
      }
    );
  };

  // --- Alert Helpers ---
  const handleAlert = (title, message) => {
    setUiAlert({ title, message, type: "alert" });
  };

  const handleConfirm = (title, message, onConfirm) => {
    setUiAlert({ title, message, type: "confirm", onConfirm });
  };

  const closeAlert = () => setUiAlert(null);

  // --- Actions ---

  const createRoom = async () => {
    if (!user || !playerName.trim()) return setError("Enter nickname.");
    setLoading(true);
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const roomData = {
      hostId: user.uid,
      players: [
        {
          id: user.uid,
          name: playerName,
          role: null,
          means: [],
          clues: [],
          badge: true,
          ready: true,
        },
      ],
      status: "lobby",
      settings: { useAccomplice: false, useWitness: false },
      logs: [],
      accusations: [],
      nextRoundRequests: [],
      readyPlayers: [],
      activeAccusation: null, // Tracks current result being displayed
    };
    try {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "rooms", newRoomId),
        roomData
      );
      setRoomId(newRoomId);
    } catch (e) {
      setError("Failed to create room.");
    }
    setLoading(false);
  };

  const joinRoom = async () => {
    if (!user || !roomCode || !playerName.trim())
      return setError("Enter details.");
    setLoading(true);
    try {
      const roomRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "rooms",
        roomCode
      );
      const snap = await getDoc(roomRef);
      if (!snap.exists()) throw new Error("Room not found.");
      const data = snap.data();
      if (data.players.length >= 10) throw new Error("Room full.");
      if (data.status !== "lobby") throw new Error("Game started.");

      const exists = data.players.find((p) => p.id === user.uid);
      if (!exists) {
        await updateDoc(roomRef, {
          players: arrayUnion({
            id: user.uid,
            name: playerName,
            role: null,
            means: [],
            clues: [],
            badge: true,
            ready: true,
          }),
        });
      }
      setRoomId(roomCode);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const toggleSetting = async (setting) => {
    if (!gameState || gameState.hostId !== user.uid) return;
    const current = gameState.settings?.[setting] || false;
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        [`settings.${setting}`]: !current,
      }
    );
  };

  const leaveRoom = async () => {
    if (!roomId || !user || !gameState) return;
    const updatedPlayers = gameState.players.filter((p) => p.id !== user.uid);
    try {
      await updateDoc(
        doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
        {
          players: updatedPlayers,
        }
      );
    } catch (e) {}
    setRoomId(null);
    setView("menu");
    setGameState(null);
    setShowLeaveConfirm(false);
  };

  const kickPlayer = async (playerId) => {
    if (!gameState || gameState.hostId !== user.uid) return;
    const updatedPlayers = gameState.players.filter((p) => p.id !== playerId);
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        players: updatedPlayers,
      }
    );
  };

  const restartGame = async () => {
    if (!gameState || gameState.hostId !== user.uid) return;

    const resetPlayers = gameState.players.map((p) => ({
      ...p,
      role: null,
      means: [],
      clues: [],
      badge: true,
      ready: true,
    }));

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        status: "lobby",
        phase: null,
        solution: null,
        activeTiles: null,
        logs: [],
        players: resetPlayers,
        round: 1,
        accusations: [],
        successfulSolvers: [],
        accompliceSuggestion: null,
        murdererGuess: null,
        nextRoundRequests: [],
        readyPlayers: [],
        activeAccusation: null,
      }
    );
  };

  const startGame = async () => {
    if (gameState.players.length < 4) return setError("Need 4+ players.");

    const pCount = gameState.players.length;
    let roles = ["DETECTIVE", "MURDERER"];

    // Only add roles if Player Count allows AND Toggle is ON
    if (pCount >= 6 && gameState.settings?.useAccomplice)
      roles.push("ACCOMPLICE");
    if (pCount >= 5 && gameState.settings?.useWitness) roles.push("WITNESS");

    while (roles.length < pCount) roles.push("INVESTIGATOR");

    roles = shuffle(roles);

    const allMeans = shuffle([...MEANS_CARDS]);
    const allClues = shuffle([...CLUE_CARDS]);

    const players = gameState.players.map((p, i) => {
      if (roles[i] === "DETECTIVE")
        return { ...p, role: roles[i], means: [], clues: [], badge: false };

      const pMeans = [];
      const pClues = [];
      for (let j = 0; j < 4; j++) pMeans.push(allMeans.pop());
      for (let j = 0; j < 4; j++) pClues.push(allClues.pop());

      return {
        ...p,
        role: roles[i],
        means: pMeans,
        clues: pClues,
        badge: true,
      };
    });

    const mainTile = shuffle([...TILES_DATA.MAIN])[0];
    const subTiles = shuffle([...TILES_DATA.SUBORDINATE]).slice(0, 4);

    const activeTiles = [
      { ...TILES_DATA.FIXED, id: "cause", selected: null },
      { ...mainTile, id: "main", selected: null },
      ...subTiles.map((t, i) => ({ ...t, id: `scene_${i}`, selected: null })),
    ];

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        status: "playing",
        phase: "PRE_GAME_MURDER", // Starts here now
        players,
        activeTiles,
        solution: null,
        round: 1,
        logs: arrayUnion({
          text: "Game Started. Planning Phase...",
          type: "neutral",
        }),
        accusations: [],
        nextRoundRequests: [],
        readyPlayers: [],
        activeAccusation: null,
      }
    );
  };

  // --- Game Logic ---

  const handlePreGameReady = async () => {
    if (gameState.readyPlayers?.includes(user.uid)) return;

    const newReadyList = [...(gameState.readyPlayers || []), user.uid];
    const allReady = gameState.players.length === newReadyList.length;

    let updates = { readyPlayers: newReadyList };
    if (allReady) {
      updates.phase = "MURDERER_SELECT";
      updates.logs = arrayUnion({
        text: "Everyone Ready. Murderer is choosing...",
        type: "danger",
      });
    }

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      updates
    );
  };

  const handleMurdererSelect = async (means, clue) => {
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        solution: { means, clue, murdererId: user.uid },
        phase: "DETECTIVE_TURN",
        logs: arrayUnion({
          text: "Crime Committed. Detective is analyzing evidence...",
          type: "danger",
        }),
      }
    );
  };

  const handleScientistClue = async (tileIndex, optionIndex) => {
    const newTiles = [...gameState.activeTiles];
    newTiles[tileIndex].selected = optionIndex;

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        activeTiles: newTiles,
      }
    );
  };

  const finishScientistPhase = async () => {
    const allSelected = gameState.activeTiles.every((t) => t.selected !== null);
    if (!allSelected)
      return handleAlert("Incomplete", "Select an option for every tile!");

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        phase: "INVESTIGATION",
        logs: arrayUnion({
          text: `Round ${gameState.round} Clues Revealed! Investigators, submit your files when ready.`,
          type: "info",
        }),
        nextRoundRequests: [], // Reset requests for the new round
      }
    );
  };

  const requestNextRound = async () => {
    if (gameState.nextRoundRequests?.includes(user.uid)) return;
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        nextRoundRequests: arrayUnion(user.uid),
      }
    );
  };

  const nextRound = async (tileToReplaceIndex) => {
    if (tileToReplaceIndex < 2)
      return handleAlert(
        "Invalid Action",
        "You cannot replace the Cause of Death or Main Location tile."
      );
    if (gameState.round >= 3) return;

    const currentSceneTitles = gameState.activeTiles.map((t) => t.title);
    const available = TILES_DATA.SUBORDINATE.filter(
      (t) => !currentSceneTitles.includes(t.title)
    );
    const newTile = shuffle(available)[0];

    const newActiveTiles = [...gameState.activeTiles];
    newActiveTiles[tileToReplaceIndex] = {
      ...newTile,
      id: `scene_r${gameState.round + 1}_${tileToReplaceIndex}`,
      selected: null,
    };

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        phase: "DETECTIVE_TURN",
        round: gameState.round + 1,
        activeTiles: newActiveTiles,
        logs: arrayUnion({
          text: `Round ${
            gameState.round + 1
          } Begins. Detective is updating a clue...`,
          type: "neutral",
        }),
      }
    );
    setReplacementMode(false);
  };

  const submitAccusation = async () => {
    if (!solveTarget) return;
    const { targetId, means, clue } = solveTarget;

    const meIndex = gameState.players.findIndex((p) => p.id === user.uid);
    const updatedPlayers = [...gameState.players];
    updatedPlayers[meIndex].badge = false;

    // Check Correctness
    const solution = gameState.solution;
    const isCorrect =
      targetId === solution.murdererId &&
      means === solution.means &&
      clue === solution.clue;

    const accusationData = {
      solverId: user.uid,
      solverName: updatedPlayers[meIndex].name,
      targetId,
      means,
      clue,
      isCorrect,
      continueVotes: [], // Tracks who pressed "Continue"
    };

    // Submitting also counts as requesting next round
    const newRequests = gameState.nextRoundRequests || [];
    if (!newRequests.includes(user.uid)) newRequests.push(user.uid);

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        players: updatedPlayers,
        accusations: arrayUnion(accusationData),
        activeAccusation: accusationData, // Show this modal to everyone
        nextRoundRequests: newRequests,
        logs: arrayUnion({
          text: `${updatedPlayers[meIndex].name} submitted a case file.`,
          type: "neutral",
        }),
      }
    );

    setShowSolveModal(false);
    setSolveTarget(null);
  };

  const handleContinueAccusation = async () => {
    if (!gameState.activeAccusation) return;
    const currentVotes = gameState.activeAccusation.continueVotes || [];
    if (currentVotes.includes(user.uid)) return;

    const newVotes = [...currentVotes, user.uid];
    const allVoted = gameState.players.length === newVotes.length;

    let updates = { "activeAccusation.continueVotes": newVotes };

    // If everyone voted to continue
    if (allVoted) {
      updates.activeAccusation = null; // Close modal for everyone

      // Logic for what happens next
      if (gameState.activeAccusation.isCorrect) {
        if (gameState.settings?.useWitness) {
          updates.phase = "WITNESS_HUNT";
          updates.successfulSolvers = [gameState.activeAccusation.solverId];
          updates.logs = arrayUnion({
            text: "CORRECT! But Murderer can steal win by finding Witness.",
            type: "warning",
          });
        } else {
          updates.phase = "GAME_OVER_GOOD";
          updates.successfulSolvers = [gameState.activeAccusation.solverId];
          updates.logs = arrayUnion({
            text: "CORRECT! Investigators Win!",
            type: "success",
          });
        }
      } else {
        updates.logs = arrayUnion({
          text: `${gameState.activeAccusation.solverName} was WRONG. Game Continues.`,
          type: "danger",
        });
      }
    }

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      updates
    );
  };

  const handleAccompliceSuggest = async (playerId) => {
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        accompliceSuggestion: playerId,
      }
    );
  };

  const attemptFindWitness = async (targetId) => {
    const target = gameState.players.find((p) => p.id === targetId);
    let nextPhase = "GAME_OVER_GOOD";
    let logs = [];

    if (target.role === "WITNESS") {
      nextPhase = "GAME_OVER_BAD";
      logs.push({
        text: `Murderer identified the Witness (${target.name})! Murderer Wins!`,
        type: "danger",
      });
    } else {
      nextPhase = "GAME_OVER_GOOD";
      logs.push({
        text: `Murderer guessed wrong! Investigators Win!`,
        type: "success",
      });
    }

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        phase: nextPhase,
        logs: arrayUnion(...logs),
      }
    );
  };

  // --- Views ---

  const RoleCard = ({ role }) => {
    if (!role) return null;
    let color = "bg-gray-600";
    let icon = User;
    if (role === "DETECTIVE") {
      color = "bg-blue-600";
      icon = Search;
    }
    if (role === "MURDERER") {
      color = "bg-red-600";
      icon = Skull;
    }
    if (role === "INVESTIGATOR") {
      color = "bg-emerald-600";
      icon = Badge;
    }
    if (role === "ACCOMPLICE") {
      color = "bg-orange-600";
      icon = Briefcase;
    }
    if (role === "WITNESS") {
      color = "bg-indigo-600";
      icon = Eye;
    }

    const displayRole = role.charAt(0) + role.slice(1).toLowerCase();

    return (
      <div
        className={`${color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm`}
      >
        {React.createElement(icon, { size: 12 })}{" "}
        <span className="whitespace-nowrap">{displayRole}</span>
      </div>
    );
  };

  if (!user)
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );

  // --- MENU ---
  if (view === "menu") {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-9xl">?</div>
          <div className="absolute bottom-20 right-20 text-9xl">?</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20"></div>
        </div>

        <div className="z-10 w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-600">
              INVESTIGATION
            </h1>
            <p className="text-slate-400 text-sm uppercase tracking-widest">
              Murder Mystery
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl">
            {error && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded text-sm mb-4 flex items-center gap-2">
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">
                  Codename
                </label>
                <input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors group">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                    Join Case
                  </h3>
                  <div className="flex gap-2">
                    <input
                      value={roomCode}
                      onChange={(e) =>
                        setRoomCode(e.target.value.toUpperCase())
                      }
                      className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm uppercase tracking-widest font-mono focus:border-blue-500 outline-none"
                      placeholder="ROOM CODE"
                    />
                    <button
                      onClick={joinRoom}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-500 px-4 rounded font-bold transition-colors"
                    >
                      GO
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors group">
                  <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                    New Investigation
                  </h3>
                  <button
                    onClick={createRoom}
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-purple-900/20"
                  >
                    Create Case File
                  </button>
                </div>

                <button
                  onClick={() => setShowTutorial(true)}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white py-2 transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  <BookOpen size={16} /> How to Play
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 flex justify-center overflow-y-auto p-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="w-full max-w-4xl relative">
              <button
                onClick={() => setShowTutorial(false)}
                className="fixed top-4 right-4 md:absolute md:-right-12 md:top-0 bg-slate-800 p-2 rounded-full text-white hover:bg-slate-700 shadow-lg z-50"
              >
                <X size={24} />
              </button>

              <div className="space-y-8 pb-20 mt-12 md:mt-0">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    GAME GUIDE
                  </h2>
                  <p className="text-slate-400">
                    Deduction, Deception, and Discovery
                  </p>
                </div>

                {/* Section 1: The Goal */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Target className="text-red-500" /> The Objective
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    A murder has been committed. The{" "}
                    <span className="text-blue-400 font-bold">Detective</span>{" "}
                    knows the solution but can only communicate through vague
                    clues. The{" "}
                    <span className="text-green-400 font-bold">
                      Investigators
                    </span>{" "}
                    must interpret these clues to find the true{" "}
                    <strong className="text-white">Murder Weapon</strong> and{" "}
                    <strong className="text-white">Evidence</strong> before time
                    runs out. Meanwhile, the{" "}
                    <span className="text-red-400 font-bold">Murderer</span>{" "}
                    hides among them, trying to mislead the investigation.
                  </p>
                </div>

                {/* Section 2: The Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-600 p-1.5 rounded text-white">
                        <Search size={16} />
                      </div>
                      <span className="font-bold text-blue-400">Detective</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      Host & Guide. Knows the solution. Cannot speak about the
                      case. Selects tile cards to give hints.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-red-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-red-600 p-1.5 rounded text-white">
                        <Skull size={16} />
                      </div>
                      <span className="font-bold text-red-400">Murderer</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      The Culprit. Chooses the Means & Clue at the start. Hides
                      identity and tries to sabotage the team.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-emerald-600 p-1.5 rounded text-white">
                        <Badge size={16} />
                      </div>
                      <span className="font-bold text-emerald-400">
                        Investigator
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      The Team. Discusses clues and submits accusations to solve
                      the crime.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-orange-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-orange-600 p-1.5 rounded text-white">
                        <Briefcase size={16} />
                      </div>
                      <span className="font-bold text-orange-400">
                        Accomplice
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">
                      (Optional) Knows who the Murderer is. Helps them win
                      without getting caught.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 border border-indigo-500/30 rounded-xl p-5 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-indigo-600 p-1.5 rounded text-white">
                        <Eye size={16} />
                      </div>
                      <span className="font-bold text-indigo-400">Witness</span>
                    </div>
                    <p className="text-sm text-slate-300">
                      (Optional) Knows the Murderer but not the solution. Must
                      help Investigators without revealing themselves. If the
                      Murderer finds the Witness at the end, the Murderer wins!
                    </p>
                  </div>
                </div>

                {/* Section 3: Gameplay Loop */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white pl-2 border-l-4 border-purple-500">
                    How It Works
                  </h3>

                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-500">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-white">The Crime</h4>
                      <p className="text-sm text-slate-400">
                        Everyone closes their eyes. The Murderer wakes up and
                        selects 1 Means card and 1 Clue card from their hand.
                        This becomes the solution.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-500">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-white">
                        The Investigation
                      </h4>
                      <p className="text-sm text-slate-400">
                        The Detective analyzes the solution. They receive random
                        "Scene Tiles" (e.g., Location, Weather, Victim's
                        Clothes). The Detective selects the option on each tile
                        that <em>best relates</em> to the solution.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-500">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-white">
                        Discussion & Rounds
                      </h4>
                      <p className="text-sm text-slate-400">
                        Investigators discuss the tiles. "Why did the Detective
                        say it was 'Noisy'? Maybe the weapon is a Gun?" <br />
                        The game lasts <strong>3 Rounds</strong>. In each new
                        round, the Detective replaces one old tile with a new
                        one to refine the clues.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-500">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-white">
                        Accusation & Winning
                      </h4>
                      <ul className="text-sm text-slate-400 list-disc ml-4 mt-1 space-y-1">
                        <li>
                          Investigators can spend their{" "}
                          <strong className="text-yellow-500">Badge</strong> to
                          make an accusation at any time.
                        </li>
                        <li>
                          If <strong>CORRECT</strong>: Investigators Win!
                          (Unless Murderer finds Witness).
                        </li>
                        <li>
                          If <strong>WRONG</strong>: The player loses their
                          badge and can no longer solve.
                        </li>
                        <li>
                          If all badges are used or rounds end without a
                          solution: <strong>Murderer Wins!</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-8">
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Got it, Let's Play!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- LOBBY ---
  if (view === "lobby" && gameState) {
    const isHost = gameState.hostId === user.uid;
    const playerCount = gameState.players.length;

    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Case File:{" "}
                <span className="font-mono text-blue-400">{gameState.id}</span>
              </h2>
              <p className="text-slate-400 text-sm">
                Waiting for investigators...
              </p>
            </div>
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="text-slate-500 hover:text-white flex items-center gap-1 text-sm"
            >
              <LogOut size={16} /> Leave
            </button>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <Settings size={18} /> Settings
            </div>
            <div className="flex gap-4">
              {playerCount >= 6 && (
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    !isHost && "opacity-50 pointer-events-none"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={gameState.settings?.useAccomplice || false}
                    onChange={() => toggleSetting("useAccomplice")}
                    className="w-4 h-4 accent-purple-500 rounded"
                  />
                  <span className="text-sm">Accomp.</span>
                </label>
              )}
              {playerCount >= 5 && (
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    !isHost && "opacity-50 pointer-events-none"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={gameState.settings?.useWitness || false}
                    onChange={() => toggleSetting("useWitness")}
                    className="w-4 h-4 accent-indigo-500 rounded"
                  />
                  <span className="text-sm">Witness</span>
                </label>
              )}
              {playerCount < 5 && (
                <span className="text-xs text-slate-500">
                  Need 5+ players for extra roles
                </span>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <span className="font-bold text-slate-400">
                ROSTER ({gameState.players.length}/10)
              </span>
            </div>
            <div className="divide-y divide-slate-700">
              {gameState.players.map((p) => (
                <div
                  key={p.id}
                  className="p-4 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-400">
                      {p.name[0].toUpperCase()}
                    </div>
                    <span
                      className={
                        p.id === user.uid
                          ? "text-blue-400 font-bold"
                          : "text-slate-300"
                      }
                    >
                      {p.name} {p.id === gameState.hostId && "👑"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-500 flex items-center gap-1 text-sm">
                      <CheckCircle size={14} /> Ready
                    </span>
                    {isHost && p.id !== user.uid && (
                      <button
                        onClick={() => kickPlayer(p.id)}
                        className="text-red-900 group-hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isHost && (
            <button
              onClick={startGame}
              disabled={gameState.players.length < 4}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all ${
                gameState.players.length >= 4
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {gameState.players.length < 4
                ? "Need 4 Players to Start"
                : "Distribute Roles & Start"}
            </button>
          )}
        </div>

        {/* Leave Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Leave Game?</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Are you sure? You will be removed from the lobby.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded font-bold"
                >
                  Stay
                </button>
                <button
                  onClick={leaveRoom}
                  className="bg-red-600 hover:bg-red-500 text-white py-3 rounded font-bold"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- GAME ---
  if (view === "game" && gameState) {
    const me = gameState.players.find((p) => p.id === user.uid);
    if (!me)
      return (
        <div
          onClick={() => window.location.reload()}
          className="p-10 text-white cursor-pointer"
        >
          You were removed. Click to reload.
        </div>
      );

    // Derived Knowledge Logic
    let knownRoles = {};
    knownRoles[me.id] = me.role;

    // Detective knows everyone
    if (me.role === "DETECTIVE") {
      gameState.players.forEach((p) => (knownRoles[p.id] = p.role));
    }

    if (me.role === "MURDERER") {
      const acc = gameState.players.find((p) => p.role === "ACCOMPLICE");
      if (acc) knownRoles[acc.id] = "ACCOMPLICE";
    }
    if (me.role === "ACCOMPLICE") {
      const mur = gameState.players.find((p) => p.role === "MURDERER");
      if (mur) knownRoles[mur.id] = "MURDERER";
    }
    if (me.role === "WITNESS") {
      gameState.players.forEach((p) => {
        if (p.role === "MURDERER") knownRoles[p.id] = "MURDERER";
      });
    }

    const isScientist = me.role === "DETECTIVE";
    const isMurderer = me.role === "MURDERER";
    const isAccomplice = me.role === "ACCOMPLICE";

    const isPreGamePhase = gameState.phase === "PRE_GAME_MURDER";
    const isMurdererSelectPhase = gameState.phase === "MURDERER_SELECT";
    const isScientistPhase = gameState.phase === "DETECTIVE_TURN";
    const isInvestigationPhase = gameState.phase === "INVESTIGATION";
    const isFindWitnessPhase = gameState.phase === "WITNESS_HUNT";
    const isGameOverGood = gameState.phase === "GAME_OVER_GOOD";

    // Check if I have already submitted an accusation
    const myAccusation = gameState.accusations?.find(
      (acc) => acc.solverId === user.uid
    );
    // Check if everyone requested next round
    const everyoneRequested = gameState.players
      .filter((p) => p.role !== "DETECTIVE")
      .every((p) => {
        const hasRequested = gameState.nextRoundRequests?.includes(p.id);
        const hasSubmitted = gameState.accusations?.some(
          (acc) => acc.solverId === p.id
        );
        return hasRequested || hasSubmitted;
      });

    const toggleSelection = (pId, type, item) => {
      if (isScientist || !me.badge || !isInvestigationPhase) return;

      setSolveTarget((prev) => {
        if (prev?.targetId !== pId) {
          return {
            targetId: pId,
            [type]: item,
            [type === "means" ? "clue" : "means"]: null,
          };
        }
        const newState = { ...prev };
        if (newState[type] === item) newState[type] = null;
        else newState[type] = item;
        return newState;
      });
    };

    // --- PHASE 0: PRE-GAME MURDER PLANNING ---
    if (isPreGamePhase) {
      const isReady = gameState.readyPlayers?.includes(user.uid);

      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative">
          {/* Top Action Bar */}
          <div className="bg-slate-800 p-3 shadow-lg z-20 flex justify-between items-center sticky top-0 border-b border-slate-700">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">
                Pre-Game Phase
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Eye size={16} /> View Roles & Cards
              </div>
            </div>
            <button
              onClick={handlePreGameReady}
              disabled={isReady}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                isReady
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg animate-pulse"
              }`}
            >
              {isReady ? "Waiting for others..." : "Ready for Murder"}
            </button>
          </div>

          {/* Player Grid (Read Only) */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto pb-20">
              {gameState.players.map((p) => {
                const isMe = p.id === user.uid;
                const roleVisible = knownRoles[p.id] || p.role === "DETECTIVE"; // Everyone sees Detective + Own Role rules

                // Highlight logic for Accomplice & Detective during Pre-Game if already selected (not likely yet) or just roles

                return (
                  <div
                    key={p.id}
                    className={`relative bg-slate-900 border rounded-xl overflow-hidden shadow-lg ${
                      isMe ? "border-blue-500/50" : "border-slate-800"
                    }`}
                  >
                    <div className="p-2 bg-slate-800/80 flex justify-between items-center border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-bold text-sm ${
                            isMe ? "text-blue-400" : "text-slate-200"
                          }`}
                        >
                          {p.name}
                        </div>
                        {roleVisible && <RoleCard role={p.role} />}
                      </div>
                    </div>
                    <div className="p-2 grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-red-900 mb-1">
                          Murder Weapon
                        </div>
                        {p.means.map((m) => (
                          <div
                            key={m}
                            className="px-2 py-1.5 rounded text-xs font-medium text-center truncate bg-slate-800 text-red-200 border border-red-900/30"
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-bold text-blue-900 mb-1">
                          Evidence on Site
                        </div>
                        {p.clues.map((c) => (
                          <div
                            key={c}
                            className="px-2 py-1.5 rounded text-xs font-medium text-center truncate bg-slate-800 text-blue-200 border border-blue-900/30"
                          >
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // --- PHASE 1: MURDERER SELECT SCREEN ---
    if (isMurdererSelectPhase) {
      if (isMurderer || isAccomplice) {
        return (
          <div className="min-h-screen bg-red-950 text-white p-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-black text-red-500 mb-2">
              COMMIT THE CRIME
            </h1>
            <p className="text-red-200 mb-6 max-w-md text-center text-sm md:text-base">
              {isMurderer
                ? "Select 1 Murder Weapon and 1 Evidence."
                : "The Murderer is selecting the weapon and evidence. Watch closely."}
            </p>

            {/* If Accomplice, they just view. If Murderer, they select. */}
            {isMurderer ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl flex-1 overflow-y-auto pb-20">
                <div className="bg-red-900/30 p-4 rounded-xl border border-red-800">
                  <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2 text-sm">
                    <Gavel size={16} /> MURDER WEAPON
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {me.means.map((m) => (
                      <button
                        key={m}
                        onClick={() =>
                          setSolveTarget({ ...solveTarget, means: m })
                        }
                        className={`p-3 rounded border text-xs font-bold transition-all ${
                          solveTarget?.means === m
                            ? "bg-red-600 border-white text-white scale-105 shadow-lg"
                            : "bg-red-900/50 border-red-700 text-red-200 hover:bg-red-800"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-800">
                  <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-sm">
                    <Search size={16} /> EVIDENCE ON SITE
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {me.clues.map((c) => (
                      <button
                        key={c}
                        onClick={() =>
                          setSolveTarget({ ...solveTarget, clue: c })
                        }
                        className={`p-3 rounded border text-xs font-bold transition-all ${
                          solveTarget?.clue === c
                            ? "bg-blue-600 border-white text-white scale-105 shadow-lg"
                            : "bg-blue-900/50 border-blue-700 text-blue-200 hover:bg-blue-800"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-red-900/20 p-8 rounded-xl border border-red-500/30 animate-pulse text-center">
                  <Skull size={48} className="mx-auto text-red-500 mb-4" />
                  <div className="text-red-300 font-bold">
                    MURDER IN PROGRESS...
                  </div>
                </div>
              </div>
            )}

            {isMurderer && (
              <div className="fixed bottom-0 left-0 w-full p-4 bg-red-950 border-t border-red-900 flex justify-center">
                <button
                  disabled={!solveTarget?.means || !solveTarget?.clue}
                  onClick={() =>
                    handleMurdererSelect(solveTarget.means, solveTarget.clue)
                  }
                  className="w-full max-w-md bg-white text-red-900 px-8 py-3 rounded-full font-black text-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-2xl"
                >
                  CONFIRM KILL
                </button>
              </div>
            )}
          </div>
        );
      } else if (isScientist) {
        return (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">
              Awaiting The Crime...
            </h2>
            <div className="animate-pulse bg-slate-800 p-6 rounded-xl max-w-lg">
              <p className="text-slate-300">
                The Murderer is choosing the Murder Weapon and Evidence.
              </p>
              <p className="text-slate-500 text-sm mt-4">
                Study everyone's cards carefully while you wait.
              </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <EyeOff size={64} className="text-slate-700 mb-6" />
            <h2 className="text-4xl font-black text-slate-500 mb-4">
              EYES CLOSED
            </h2>
            <p className="text-slate-600">
              The Murder is taking place. You will be informed once the
              detective finishes examining the crime scene.
            </p>
          </div>
        );
      }
    }

    // --- MAIN GAME UI ---

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        {/* Top Bar: Info & Roles */}
        <div className="bg-slate-900 border-b border-slate-800 p-2 px-3 flex justify-between items-center shadow-md z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="font-black text-xl tracking-tighter text-blue-500">
              INV.
            </div>
            <div
              className="flex flex-col leading-tight"
              onClick={() => setShowIdentity(!showIdentity)}
            >
              <span className="text-[10px] text-slate-500 uppercase font-bold">
                Role
              </span>
              <div className="flex items-center gap-1 cursor-pointer hover:bg-slate-800 rounded -ml-1 transition-colors">
                {showIdentity ? (
                  <RoleCard role={me.role} />
                ) : (
                  <span className="text-xs font-bold text-slate-300 flex items-center">
                    Show <Eye size={10} className="ml-1" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-center mr-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Rnd
              </span>
              <span className="text-sm font-bold text-white">
                {gameState.round}/3
              </span>
            </div>

            {isScientist && isScientistPhase && (
              <button
                onClick={finishScientistPhase}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-lg animate-pulse"
              >
                Confirm
              </button>
            )}

            {/* Replacement Mode for Scientist (Requires Consensus) */}
            {isInvestigationPhase && isScientist && gameState.round < 3 && (
              <button
                disabled={!everyoneRequested}
                onClick={() => setReplacementMode(!replacementMode)}
                className={`${
                  replacementMode
                    ? "bg-red-500 animate-pulse"
                    : everyoneRequested
                    ? "bg-blue-600"
                    : "bg-slate-700 opacity-50 cursor-not-allowed"
                } 
                     hover:brightness-110 text-white px-3 py-1.5 rounded text-xs font-bold shadow-lg transition-colors flex items-center gap-1`}
              >
                {replacementMode ? "Select Tile" : "Next Rnd"}
                {!everyoneRequested && (
                  <span className="text-[10px] bg-black/30 px-1 rounded">
                    {gameState.nextRoundRequests?.length || 0}/
                    {gameState.players.length - 1}
                  </span>
                )}
              </button>
            )}

            {/* Request Button for Players - Only for Rounds 1 and 2 */}
            {isInvestigationPhase &&
              !isScientist &&
              !myAccusation &&
              !gameState.nextRoundRequests?.includes(user.uid) &&
              gameState.round < 3 && (
                <button
                  onClick={requestNextRound}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-lg"
                >
                  Req. Next
                </button>
              )}
            {isInvestigationPhase &&
              !isScientist &&
              gameState.nextRoundRequests?.includes(user.uid) && (
                <div className="text-[10px] text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded border border-green-800">
                  Ready
                </div>
              )}

            <button
              onClick={() => setShowLogs(true)}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              <History size={18} />
            </button>
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Clues Toggle Mobile */}
        <div className="bg-slate-800/80 p-2 flex justify-center md:hidden border-b border-slate-700">
          <button
            onClick={() => setShowCluesMobile(!showCluesMobile)}
            className="text-xs font-bold text-slate-400 flex items-center gap-1"
          >
            {showCluesMobile ? "Hide Clues" : "Show Clues"}{" "}
            {showCluesMobile ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>
        </div>

        {/* Tiles Area (The Clues) */}
        {showCluesMobile && (
          <div className="bg-slate-900/50 p-2 overflow-x-auto border-b border-slate-800">
            <div className="flex gap-2 min-w-max mx-auto px-2">
              {gameState.activeTiles.map((tile, tIdx) => (
                <div
                  key={tile.id}
                  onClick={() => {
                    if (replacementMode && isScientist && tIdx >= 2) {
                      nextRound(tIdx);
                    }
                  }}
                  className={`w-40 bg-slate-800 rounded-lg border-2 flex flex-col relative shadow-lg transition-all
                    ${
                      replacementMode && tIdx >= 2 && isScientist
                        ? "border-red-500 cursor-pointer hover:bg-red-900/20 scale-105"
                        : isScientist &&
                          isScientistPhase &&
                          "hover:border-blue-500/50"
                    } 
                    ${
                      tile.selected === null
                        ? "border-slate-700"
                        : "border-slate-600"
                    }
                    ${replacementMode && tIdx < 2 && "opacity-50"} 
                  `}
                >
                  {replacementMode && tIdx >= 2 && isScientist && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 text-red-500 font-bold">
                      <XCircle size={32} />
                    </div>
                  )}
                  <div
                    className={`p-1.5 text-center font-bold text-[10px] uppercase tracking-wider text-white truncate ${
                      tile.type === "purple"
                        ? "bg-purple-900"
                        : tile.type === "green"
                        ? "bg-emerald-900"
                        : "bg-slate-700"
                    }`}
                  >
                    {tile.title}
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    {tile.options.map((opt, oIdx) => {
                      const isSelected = tile.selected === oIdx;
                      return (
                        <div
                          key={oIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isScientist && isScientistPhase) {
                              handleScientistClue(tIdx, oIdx);
                            }
                          }}
                          className={`text-[10px] px-1.5 py-1 rounded cursor-pointer flex justify-between items-center transition-colors ${
                            isSelected
                              ? "bg-red-600 text-white font-bold shadow-md ring-1 ring-red-400"
                              : isScientist && isScientistPhase
                              ? "hover:bg-slate-700 text-slate-300"
                              : "text-slate-500 opacity-50"
                          }`}
                        >
                          <span className="truncate">{opt}</span>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full ml-1 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto pb-20">
            {gameState.players.map((p) => {
              const isMe = p.id === user.uid;
              const roleVisible =
                knownRoles[p.id] ||
                p.role === "DETECTIVE" ||
                gameState.phase.includes("GAME_OVER");
              const isTarget = solveTarget?.targetId === p.id;
              const isSuggested = gameState.accompliceSuggestion === p.id;

              const isAccusedByMe = myAccusation?.targetId === p.id;

              // Look up if this player has accused someone
              const pAccusation = gameState.accusations?.find(
                (acc) => acc.solverId === p.id
              );

              // Logic to show Witness Select Buttons
              const showWitnessButtons =
                isFindWitnessPhase &&
                !witnessHuntModalOpen &&
                (isAccomplice || isMurderer) &&
                p.role !== "DETECTIVE" &&
                p.role !== "MURDERER" &&
                p.role !== "ACCOMPLICE";

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    // Deprecated click logic - using buttons now, but keeping this for safety or if user clicks card body
                    // Leaving it empty for witness phase to prioritize buttons
                  }}
                  className={`relative bg-slate-900 border rounded-xl overflow-hidden shadow-lg transition-all 
                     ${
                       isMe
                         ? "border-blue-500/30 ring-1 ring-blue-900/50"
                         : "border-slate-800"
                     }
                     ${
                       isFindWitnessPhase && isSuggested && isMurderer
                         ? "ring-4 ring-yellow-500 scale-105"
                         : ""
                     }
                     ${
                       isAccusedByMe
                         ? "border-yellow-500/50 ring-1 ring-yellow-500/30"
                         : ""
                     }
                   `}
                >
                  {/* Header */}
                  <div className="p-2 bg-slate-800/80 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-bold text-sm ${
                          isMe ? "text-blue-400" : "text-slate-200"
                        }`}
                      >
                        {p.name}
                      </div>
                      {roleVisible && <RoleCard role={p.role} />}
                    </div>
                    {p.badge && p.role !== "DETECTIVE" && (
                      <Badge
                        size={14}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                    )}

                    {/* Show 'Submitted' Badge */}
                    {!p.badge && p.role !== "DETECTIVE" && (
                      <div className="text-[10px] text-slate-600 font-bold uppercase">
                        Submitted
                      </div>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="p-2 grid grid-cols-2 gap-2">
                    {/* Means */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-red-900 mb-1">
                        Murder Weapon
                      </div>
                      {p.means.map((m) => {
                        const isSelected = isTarget && solveTarget.means === m;
                        const isSubmitted =
                          isAccusedByMe && myAccusation.means === m;
                        // UPDATE: Murderer now also sees solution highlight
                        const isSolution =
                          (isScientist || isAccomplice || isMurderer) &&
                          gameState.solution?.means === m &&
                          gameState.solution?.murdererId === p.id;

                        return (
                          <div
                            key={m}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (p.id === user.uid) return;
                              toggleSelection(p.id, "means", m);
                            }}
                            className={`px-2 py-2 rounded text-xs font-medium text-center truncate cursor-pointer transition-all active:scale-95 touch-manipulation min-h-[36px] flex items-center justify-center ${
                              isSelected
                                ? "bg-red-600 text-white font-bold shadow-md scale-105 border border-white"
                                : isSubmitted
                                ? "bg-red-900/40 text-red-200 border border-yellow-500/50 shadow-inner"
                                : isSolution
                                ? "bg-purple-900/80 text-white border-2 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"
                                : "bg-slate-800 text-red-200 border border-red-900/30 hover:bg-red-900/20 hover:border-red-500"
                            } ${
                              p.id === user.uid &&
                              "opacity-50 cursor-not-allowed hover:bg-slate-800 hover:border-red-900/30"
                            }`}
                          >
                            {m}
                          </div>
                        );
                      })}
                    </div>
                    {/* Clues */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-blue-900 mb-1">
                        Evidence on Site
                      </div>
                      {p.clues.map((c) => {
                        const isSelected = isTarget && solveTarget.clue === c;
                        const isSubmitted =
                          isAccusedByMe && myAccusation.clue === c;
                        // UPDATE: Murderer now also sees solution highlight
                        const isSolution =
                          (isScientist || isAccomplice || isMurderer) &&
                          gameState.solution?.clue === c &&
                          gameState.solution?.murdererId === p.id;

                        return (
                          <div
                            key={c}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (p.id === user.uid) return;
                              toggleSelection(p.id, "clue", c);
                            }}
                            className={`px-2 py-2 rounded text-xs font-medium text-center truncate cursor-pointer transition-all active:scale-95 touch-manipulation min-h-[36px] flex items-center justify-center ${
                              isSelected
                                ? "bg-blue-600 text-white font-bold shadow-md scale-105 border border-white"
                                : isSubmitted
                                ? "bg-blue-900/40 text-blue-200 border border-yellow-500/50 shadow-inner"
                                : isSolution
                                ? "bg-purple-900/80 text-white border-2 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"
                                : "bg-slate-800 text-blue-200 border border-blue-900/30 hover:bg-blue-900/20 hover:border-blue-500"
                            } ${
                              p.id === user.uid &&
                              "opacity-50 cursor-not-allowed hover:bg-slate-800 hover:border-blue-900/30"
                            }`}
                          >
                            {c}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Suggestion Marker (Now visible to Murderer too) */}
                  {isFindWitnessPhase &&
                    isSuggested &&
                    (isAccomplice || isMurderer) && (
                      <div className="absolute inset-0 bg-yellow-500/30 pointer-events-none flex items-center justify-center z-20">
                        <div
                          className={`bg-yellow-500 text-black px-3 py-1.5 rounded-lg font-black text-xs shadow-xl border-2 border-black transform -rotate-6 ${
                            isMurderer ? "animate-pulse scale-110" : ""
                          }`}
                        >
                          {isAccomplice ? "YOU SUGGESTED" : "ACCOMPLICE'S PICK"}
                        </div>
                      </div>
                    )}

                  {/* REDESIGNED: Show Submitted Accusation Details (Bottom Space) */}
                  {pAccusation && (
                    <div
                      className={`mx-2 mb-2 border-2 rounded-lg p-2 text-center relative overflow-hidden ${
                        // Check correctness based on if phase has advanced (Witness Hunt/Game Over) OR check against solution
                        (isFindWitnessPhase || isGameOverGood) &&
                        pAccusation.isCorrect
                          ? "border-green-500 bg-green-950/40"
                          : "border-red-500 bg-red-950/40"
                      }`}
                    >
                      <div
                        className={`absolute top-0 left-0 w-full h-1 ${
                          (isFindWitnessPhase || isGameOverGood) &&
                          pAccusation.isCorrect
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div
                        className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                          (isFindWitnessPhase || isGameOverGood) &&
                          pAccusation.isCorrect
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {(isFindWitnessPhase || isGameOverGood) &&
                        pAccusation.isCorrect
                          ? "SUCCESSFUL ATTEMPT"
                          : "FAILED ATTEMPT"}
                      </div>
                      <div className="text-xs text-slate-200 mb-1">
                        Suspected:{" "}
                        <span className="font-bold text-white text-sm">
                          {
                            gameState.players.find(
                              (t) => t.id === pAccusation.targetId
                            )?.name
                          }
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div
                          className={`border rounded px-1 py-0.5 text-[10px] truncate ${
                            (isFindWitnessPhase || isGameOverGood) &&
                            pAccusation.isCorrect
                              ? "bg-black/40 border-green-500/20 text-green-200"
                              : "bg-black/40 border-red-500/20 text-red-200"
                          }`}
                        >
                          {pAccusation.means}
                        </div>
                        <div
                          className={`border rounded px-1 py-0.5 text-[10px] truncate ${
                            (isFindWitnessPhase || isGameOverGood) &&
                            pAccusation.isCorrect
                              ? "bg-black/40 border-green-500/20 text-green-200"
                              : "bg-black/40 border-blue-500/20 text-blue-200"
                          }`}
                        >
                          {pAccusation.clue}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WITNESS SELECT BUTTONS (New Feature) */}
                  {showWitnessButtons && (
                    <div className="p-2 pt-0 mt-auto sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 -mx-px -mb-px rounded-b-xl z-30">
                      {isAccomplice && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccompliceSuggest(p.id);
                          }}
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-bottom-2 fade-in"
                        >
                          <Target size={14} /> Suggest as Witness
                        </button>
                      )}
                      {isMurderer && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Murderer Logic Check: Accomplice present but no suggestion?
                            const hasAccomplice =
                              gameState.settings?.useAccomplice;
                            const hasSuggestion =
                              gameState.accompliceSuggestion;

                            if (hasAccomplice && !hasSuggestion) {
                              handleAlert(
                                "Wait!",
                                "Wait for your Accomplice to suggest a target first!"
                              );
                              return;
                            }
                            handleConfirm(
                              "Eliminate Witness?",
                              `Eliminate ${p.name} as the Witness? This ends the game.`,
                              () => attemptFindWitness(p.id)
                            );
                          }}
                          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-bottom-2 fade-in animate-pulse"
                        >
                          <Crosshair size={14} /> ELIMINATE
                        </button>
                      )}
                    </div>
                  )}

                  {/* "Review Accusation" Button Container - FIXED TO BOTTOM OF CARD */}
                  {/* Only show if NOT in Witness Hunt phase to avoid button clutter */}
                  {isTarget &&
                    (solveTarget.means || solveTarget.clue) &&
                    !isFindWitnessPhase && (
                      <div className="p-2 pt-0 mt-auto sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 -mx-px -mb-px rounded-b-xl z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSolveModal(true);
                          }}
                          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-bottom-2 fade-in transition-transform active:scale-95"
                        >
                          <Badge size={14} /> Review Accusation
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Log History Modal */}
        {showLogs && (
          <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
            <div className="w-full max-w-md bg-slate-900 h-full border-l border-slate-700 flex flex-col shadow-2xl animate-in slide-in-from-right">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <History /> Case Logs
                </h3>
                <button onClick={() => setShowLogs(false)}>
                  <X className="text-slate-400 hover:text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {[...(gameState.logs || [])].reverse().map((log, i) => (
                  <div
                    key={i}
                    className={`text-sm p-3 rounded border-l-4 ${
                      log.type === "danger"
                        ? "bg-red-900/20 border-red-500 text-red-200"
                        : log.type === "success"
                        ? "bg-green-900/20 border-green-500 text-green-200"
                        : log.type === "warning"
                        ? "bg-orange-900/20 border-orange-500 text-orange-200"
                        : "bg-slate-800 border-blue-500 text-slate-300"
                    }`}
                  >
                    <div className="font-mono text-[10px] opacity-50 mb-1">
                      EVENT {gameState.logs.length - i}
                    </div>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leave Confirmation Modal */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Leave Game?</h3>
              <p className="text-slate-400 mb-6 text-sm">
                Are you sure? You will be removed from the lobby.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded font-bold"
                >
                  Stay
                </button>
                <button
                  onClick={leaveRoom}
                  className="bg-red-600 hover:bg-red-500 text-white py-3 rounded font-bold"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert/Confirm Modal (New Feature) */}
        {uiAlert && (
          <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-center mb-4">
                {uiAlert.type === "confirm" ? (
                  <AlertTriangle size={48} className="text-yellow-500" />
                ) : (
                  <Info size={48} className="text-blue-500" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {uiAlert.title}
              </h3>
              <p className="text-slate-400 mb-6 text-sm">{uiAlert.message}</p>
              <div
                className={`grid ${
                  uiAlert.type === "confirm" ? "grid-cols-2" : "grid-cols-1"
                } gap-3`}
              >
                {uiAlert.type === "confirm" && (
                  <button
                    onClick={closeAlert}
                    className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded font-bold"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => {
                    if (uiAlert.onConfirm) uiAlert.onConfirm();
                    closeAlert();
                  }}
                  className={`${
                    uiAlert.type === "confirm"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-blue-600 hover:bg-blue-500"
                  } text-white py-3 rounded font-bold`}
                >
                  {uiAlert.type === "confirm" ? "Confirm" : "OK"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Persistent Floating Accomplice Suggestion (New Feature) */}
        {isFindWitnessPhase &&
          !witnessHuntModalOpen &&
          isMurderer &&
          gameState.accompliceSuggestion &&
          showSuggestionToast && (
            <div
              className="fixed inset-0 z-40 flex items-start justify-center pt-20"
              onClick={() => setShowSuggestionToast(false)} // Clicking backdrop closes it
            >
              <div
                onClick={(e) => e.stopPropagation()} // Clicking content prevents closing
                className="bg-green-900/90 border-2 border-green-500 p-4 rounded-xl shadow-2xl animate-bounce cursor-default max-w-xs text-center backdrop-blur-sm"
              >
                <div className="font-bold text-green-400 text-sm mb-1 uppercase">
                  <Target size={14} className="inline mr-1" /> Target Confirmed
                </div>
                Accomplice suggests:{" "}
                <span className="text-white font-black text-lg block mt-1">
                  {
                    gameState.players.find(
                      (p) => p.id === gameState.accompliceSuggestion
                    )?.name
                  }
                </span>
                <div className="text-[10px] text-green-300 mt-2 uppercase tracking-wide">
                  Click empty space to dismiss
                </div>
              </div>
            </div>
          )}

        {/* MODAL: SOLVE ATTEMPT */}
        {showSolveModal && solveTarget && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-black text-yellow-500 mb-4 flex items-center gap-2">
                <Badge /> SUBMIT CASE FILE
              </h3>
              <div className="space-y-4 mb-8">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 uppercase">
                    Suspect
                  </div>
                  <div className="text-xl font-bold text-white">
                    {
                      gameState.players.find(
                        (p) => p.id === solveTarget.targetId
                      )?.name
                    }
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-1">
                      Murder Weapon
                    </div>
                    {solveTarget.means ? (
                      <div className="p-3 bg-red-900/50 border border-red-600 rounded text-red-100 font-bold text-center text-sm">
                        {solveTarget.means}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-800 border border-slate-700 border-dashed rounded text-slate-500 text-center text-xs">
                        Select Murder Weapon from Card
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-1">
                      Evidence on Site
                    </div>
                    {solveTarget.clue ? (
                      <div className="p-3 bg-blue-900/50 border border-blue-600 rounded text-blue-100 font-bold text-center text-sm">
                        {solveTarget.clue}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-800 border border-slate-700 border-dashed rounded text-slate-500 text-center text-xs">
                        Select Evidence on Site from Card
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-blue-900/20 p-3 rounded text-sm text-blue-200 text-center border border-blue-800">
                  <div className="font-bold mb-1">PROCEDURE NOTE</div>
                  Your result will be revealed only after <strong>
                    ALL
                  </strong>{" "}
                  investigators have submitted their files.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowSolveModal(false)}
                  className="py-3 rounded-lg font-bold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  disabled={!solveTarget.means || !solveTarget.clue}
                  onClick={submitAccusation}
                  className="bg-yellow-600 hover:bg-yellow-500 text-black py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CONFIRM & SUBMIT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ACCUSATION FEEDBACK (NEW) */}
        {gameState.activeAccusation && (
          <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4">
            <div
              className={`max-w-lg w-full p-6 rounded-2xl border-4 shadow-2xl text-center ${
                gameState.activeAccusation.isCorrect
                  ? "bg-green-900/90 border-green-500"
                  : "bg-red-900/90 border-red-500"
              }`}
            >
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">
                {gameState.activeAccusation.isCorrect
                  ? "CASE SOLVED!"
                  : "WRONG ACCUSATION"}
              </h2>
              <div className="bg-black/30 p-4 rounded-xl mb-6 text-left">
                <div className="text-xs uppercase font-bold text-white/50 mb-2 border-b border-white/10 pb-1">
                  The Accusation Attempt
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-2 items-center mb-1">
                  <span className="text-sm text-gray-400 font-bold">
                    Accuser:
                  </span>
                  <span className="text-white font-bold">
                    {gameState.activeAccusation.solverName}
                  </span>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-2 items-center mb-4">
                  <span className="text-sm text-gray-400 font-bold">
                    Suspect:
                  </span>
                  <span className="text-xl text-white font-black">
                    {
                      gameState.players.find(
                        (p) => p.id === gameState.activeAccusation.targetId
                      )?.name
                    }
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-900/30 border border-red-500/30 p-2 rounded text-center">
                    <div className="text-[10px] text-red-300 uppercase font-bold mb-1">
                      Murder Weapon
                    </div>
                    <div className="text-white font-bold text-sm">
                      {gameState.activeAccusation.means}
                    </div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500/30 p-2 rounded text-center">
                    <div className="text-[10px] text-blue-300 uppercase font-bold mb-1">
                      Evidence on Site
                    </div>
                    <div className="text-white font-bold text-sm">
                      {gameState.activeAccusation.clue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="text-xs uppercase font-bold text-white/50">
                  Waiting for players:{" "}
                  {gameState.activeAccusation.continueVotes?.length || 0}/
                  {gameState.players.length}
                </div>
                <button
                  onClick={handleContinueAccusation}
                  disabled={gameState.activeAccusation.continueVotes?.includes(
                    user.uid
                  )}
                  className={`px-8 py-3 rounded-full font-bold text-lg transition-all flex items-center gap-2 ${
                    gameState.activeAccusation.continueVotes?.includes(user.uid)
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-white text-black hover:scale-105 shadow-xl"
                  }`}
                >
                  {gameState.activeAccusation.continueVotes?.includes(user.uid)
                    ? "WAITING..."
                    : "CONTINUE"}{" "}
                  <ChevronUp className="rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WITNESS HUNT OVERLAY (Modified to allow interaction) */}
        {isFindWitnessPhase && witnessHuntModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80">
            {isMurderer || isAccomplice ? (
              <div className="bg-red-950 border-2 border-red-500 p-6 rounded-xl shadow-2xl text-center max-w-lg animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl md:text-3xl font-black text-red-500 mb-2">
                  YOU HAVE BEEN CAUGHT!
                </h2>
                <p className="text-red-100 text-base md:text-lg mb-4">
                  {isAccomplice
                    ? "Help the Murderer find the Witness."
                    : "Identify the Witness to steal the win."}
                </p>

                {isMurderer &&
                  gameState.settings?.useAccomplice &&
                  (!gameState.accompliceSuggestion ? (
                    <div className="bg-black/40 p-3 rounded border border-red-500/50 mb-4 animate-pulse">
                      <div className="font-bold text-yellow-400 text-sm mb-1 uppercase">
                        <AlertTriangle size={14} className="inline mr-1" /> Hold
                        Fire
                      </div>
                      Waiting for Accomplice suggestion...
                    </div>
                  ) : (
                    <div className="bg-green-900/40 p-3 rounded border border-green-500 mb-4 animate-bounce">
                      <div className="font-bold text-green-400 text-sm mb-1 uppercase">
                        <Target size={14} className="inline mr-1" /> Target
                        Confirmed
                      </div>
                      Accomplice suggests:{" "}
                      <span className="text-white font-black text-lg block mt-1">
                        {
                          gameState.players.find(
                            (p) => p.id === gameState.accompliceSuggestion
                          )?.name
                        }
                      </span>
                    </div>
                  ))}

                <button
                  onClick={() => setWitnessHuntModalOpen(false)}
                  className="mt-4 bg-white text-red-900 px-8 py-3 rounded-full font-black uppercase text-sm hover:scale-105 transition-transform shadow-xl"
                >
                  Select Witness
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/95 border-2 border-yellow-500 p-6 rounded-xl shadow-2xl text-center max-w-lg animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-black text-yellow-500 mb-2">
                  CRIME SOLVED!
                </h2>
                <p className="text-slate-200 text-lg mb-4">
                  The Investigators found the solution. However...
                </p>
                <div className="text-xl font-bold text-red-400 mb-4 animate-pulse">
                  THE MURDERER IS HUNTING FOR THE WITNESS
                </div>
                <p className="text-slate-400 text-sm">
                  If the Murderer identifies the Witness correctly, the Bad Guys
                  steal the win.
                </p>
              </div>
            )}
          </div>
        )}

        {/* GAME OVER SCREENS */}
        {gameState.phase === "GAME_OVER_GOOD" && (
          <div className="fixed inset-0 bg-blue-900/95 z-50 flex flex-col items-center justify-center p-6 text-center">
            <Badge size={96} className="text-yellow-400 mb-6 shadow-xl" />
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              INVESTIGATORS WIN
            </h1>
            <p className="text-blue-200 text-lg md:text-xl max-w-lg mb-8">
              Solved by:{" "}
              <span className="text-yellow-400 font-bold">
                {(gameState.successfulSolvers || [])
                  .map((id) => gameState.players.find((p) => p.id === id)?.name)
                  .join(", ") || "The Team"}
              </span>
            </p>

            <div className="bg-white/10 p-6 rounded-xl border border-white/20 mb-8 w-full max-w-md">
              <div className="text-sm uppercase tracking-widest text-blue-300 mb-2">
                The Solution
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {gameState.solution.means} + {gameState.solution.clue}
              </div>
              <div className="text-lg text-blue-200">
                Culprit:{" "}
                {
                  gameState.players.find(
                    (p) => p.id === gameState.solution.murdererId
                  )?.name
                }
              </div>
            </div>

            {gameState.hostId === user.uid && (
              <button
                onClick={restartGame}
                className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                <RotateCcw size={20} /> Return to Lobby
              </button>
            )}
          </div>
        )}

        {gameState.phase === "GAME_OVER_BAD" && (
          <div className="fixed inset-0 bg-red-950/95 z-50 flex flex-col items-center justify-center p-6 text-center">
            <Skull size={96} className="text-red-500 mb-6 shadow-xl" />
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              MURDERER WINS
            </h1>
            <p className="text-red-200 text-lg md:text-xl max-w-lg mb-8">
              The investigation failed or the witness was silenced.
            </p>

            <div className="bg-white/10 p-6 rounded-xl border border-white/20 mb-8 w-full max-w-md">
              <div className="text-sm uppercase tracking-widest text-red-300 mb-2">
                The Solution
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {gameState.solution.means} + {gameState.solution.clue}
              </div>
              <div className="text-lg text-red-200">
                Culprit:{" "}
                {
                  gameState.players.find(
                    (p) => p.id === gameState.solution.murdererId
                  )?.name
                }
              </div>
            </div>

            {gameState.hostId === user.uid && (
              <button
                onClick={restartGame}
                className="bg-white text-red-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                <RotateCcw size={20} /> Return to Lobby
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}