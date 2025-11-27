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
            if (activeBadges === 0) {
              // Trigger resolution if I am host (to avoid multiple triggers)
              if (data.hostId === user.uid) {
                resolveAccusations(data);
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

  // --- Logic to Resolve Accusations (Host Only) ---
  const resolveAccusations = async (currentState) => {
    const accusations = currentState.accusations || [];
    const solution = currentState.solution;
    const successfulSolvers = [];

    accusations.forEach((acc) => {
      if (
        acc.means === solution.means &&
        acc.clue === solution.clue &&
        acc.targetId === solution.murdererId
      ) {
        successfulSolvers.push(acc.solverId);
      }
    });

    let nextPhase = "GAME_OVER_BAD";
    let logs = [
      { text: "All badges used. Revealing results...", type: "neutral" },
    ];

    if (successfulSolvers.length > 0) {
      if (currentState.settings?.useWitness) {
        nextPhase = "WITNESS_HUNT";
        logs.push({
          text: `Case Solved! But the Murderer can steal the win by finding the Witness.`,
          type: "warning",
        });
      } else {
        nextPhase = "GAME_OVER_GOOD";
        logs.push({ text: "CASE SOLVED! Investigators Win!", type: "success" });
      }
    } else {
      logs.push({
        text: "No correct accusations. Murderer Escapes!",
        type: "danger",
      });
    }

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        phase: nextPhase,
        successfulSolvers: successfulSolvers, // Store who got it right
        logs: arrayUnion(...logs),
      }
    );
  };

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
      nextRoundRequests: [], // Array of player IDs who requested next round
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
        phase: "MURDERER_SELECT",
        players,
        activeTiles,
        solution: null,
        round: 1,
        logs: arrayUnion({
          text: "Game Started. Murderer is choosing the Murder Weapon & Evidence...",
          type: "neutral",
        }),
        accusations: [],
        nextRoundRequests: [],
      }
    );
  };

  // --- Game Logic ---

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
    if (!allSelected) return alert("Select an option for every tile!");

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
      return alert(
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

    // Add accusation to the batch
    const accusationData = {
      solverId: user.uid,
      solverName: updatedPlayers[meIndex].name,
      targetId,
      means,
      clue,
    };

    // Submitting also counts as requesting next round (they are done)
    const newRequests = gameState.nextRoundRequests || [];
    if (!newRequests.includes(user.uid)) newRequests.push(user.uid);

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        players: updatedPlayers,
        accusations: arrayUnion(accusationData),
        nextRoundRequests: newRequests, // Auto-request next round
        logs: arrayUnion({
          text: `${updatedPlayers[meIndex].name} submitted a case file.`,
          type: "neutral",
        }),
      }
    );

    setShowSolveModal(false);
    setSolveTarget(null);
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
              Murder in Hong Kong Style
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
              </div>
            </div>
          </div>
        </div>
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
        if (p.role === "MURDERER" || p.role === "ACCOMPLICE")
          knownRoles[p.id] = "SUSPECT";
      });
    }

    const isScientist = me.role === "DETECTIVE";
    const isMurderer = me.role === "MURDERER";
    const isAccomplice = me.role === "ACCOMPLICE";

    const isMurdererSelectPhase = gameState.phase === "MURDERER_SELECT";
    const isScientistPhase = gameState.phase === "DETECTIVE_TURN";
    const isInvestigationPhase = gameState.phase === "INVESTIGATION";
    const isFindWitnessPhase = gameState.phase === "WITNESS_HUNT";

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

    // --- PHASE 1: MURDERER SELECT SCREEN ---
    if (isMurdererSelectPhase) {
      if (isMurderer) {
        return (
          <div className="min-h-screen bg-red-950 text-white p-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-black text-red-500 mb-2">
              COMMIT THE CRIME
            </h1>
            <p className="text-red-200 mb-6 max-w-md text-center text-sm md:text-base">
              Select 1 Murder Weapon and 1 Evidence from your cards.
            </p>

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
              The Murderer is active. Do not look at the screen.
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

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    // Accomplice Suggestion Logic
                    if (
                      isFindWitnessPhase &&
                      isAccomplice &&
                      p.role !== "MURDERER" &&
                      p.role !== "ACCOMPLICE"
                    ) {
                      handleAccompliceSuggest(p.id);
                    }
                    // Murderer Selection Logic (Requires Accomplice Suggestion First)
                    if (
                      isFindWitnessPhase &&
                      isMurderer &&
                      p.role !== "MURDERER" &&
                      p.role !== "ACCOMPLICE"
                    ) {
                      const hasAccomplice = gameState.settings?.useAccomplice;
                      const hasSuggestion = gameState.accompliceSuggestion;

                      if (hasAccomplice && !hasSuggestion) {
                        alert(
                          "Wait for your Accomplice to suggest a target first!"
                        );
                        return;
                      }

                      attemptFindWitness(p.id);
                    }
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
                       isFindWitnessPhase &&
                       (isMurderer || isAccomplice) &&
                       p.role !== "MURDERER" &&
                       p.role !== "ACCOMPLICE"
                         ? "cursor-pointer hover:border-indigo-500"
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
                    {!p.badge && p.role !== "DETECTIVE" && (
                      <div className="text-[10px] text-slate-600 font-bold uppercase">
                        Submitted
                      </div>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="p-2 grid grid-cols-2 gap-2 pb-12">
                    {/* Means */}
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-red-900 mb-1">
                        Murder Weapon
                      </div>
                      {p.means.map((m) => {
                        const isSelected = isTarget && solveTarget.means === m;
                        const isSubmitted =
                          isAccusedByMe && myAccusation.means === m;
                        const isSolution =
                          isScientist &&
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
                        const isSolution =
                          isScientist &&
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

                  {/* "Review Accusation" Button */}
                  {isTarget && (solveTarget.means || solveTarget.clue) && (
                    <div className="absolute bottom-0 left-0 w-full p-2 bg-slate-900/90 border-t border-slate-700 flex justify-center backdrop-blur-sm z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSolveModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-full text-xs flex items-center gap-2 shadow-lg animate-in slide-in-from-bottom-2 fade-in w-full justify-center"
                      >
                        <Badge size={14} /> Review Accusation
                      </button>
                    </div>
                  )}

                  {/* Suggestion Marker (Accomplice View) */}
                  {isFindWitnessPhase && isSuggested && isAccomplice && (
                    <div className="absolute inset-0 bg-yellow-500/20 pointer-events-none flex items-center justify-center">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold text-xs">
                        SUGGESTED
                      </span>
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

        {/* WITNESS HUNT OVERLAY (Modified to allow interaction) */}
        {isFindWitnessPhase && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none p-4">
            {isMurderer || isAccomplice ? (
              <div className="bg-red-950/95 border-2 border-red-500 p-6 rounded-xl shadow-2xl text-center max-w-lg animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl md:text-3xl font-black text-red-500 mb-2">
                  YOU HAVE BEEN CAUGHT!
                </h2>
                <p className="text-red-100 text-base md:text-lg mb-4">
                  {isAccomplice
                    ? "Help the Murderer find the Witness. Click a player to suggest."
                    : "Identify the Witness to steal the win."}
                </p>

                {isMurderer &&
                  gameState.settings?.useAccomplice &&
                  !gameState.accompliceSuggestion && (
                    <div className="bg-black/40 p-3 rounded border border-red-500/50 mb-4 animate-pulse">
                      <div className="font-bold text-yellow-400 text-sm mb-1 uppercase">
                        <AlertTriangle size={14} className="inline mr-1" /> Hold
                        Fire
                      </div>
                      Waiting for Accomplice suggestion...
                    </div>
                  )}

                <div className="text-xs md:text-sm font-bold text-red-400 uppercase tracking-widest animate-pulse">
                  Select a player from the board below
                </div>
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
