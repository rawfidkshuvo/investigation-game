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
  arrayRemove,
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
  Crosshair,
  Info,
  BookOpen,
  Hammer,
  Sparkles,
  ThumbsUp,
  PlayCircle,
  Home,
  HatGlasses,
} from "lucide-react";

// --- Firebase Init ---
const firebaseConfig = {
  apiKey: "AIzaSyBjIjK53vVJW1y5RaqEFGSFp0ECVDBEe1o",
  authDomain: "game-hub-ff8aa.firebaseapp.com",
  projectId: "game-hub-ff8aa",
  storageBucket: "game-hub-ff8aa.firebasestorage.app",
  messagingSenderId: "586559578902",
  appId: "1:586559578902:web:c87b26c0536b13eb6aa637",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== "undefined" ? __app_id : "investigation-game";
const GAME_ID = "2";

// --- Game Data Assets ---

const MEANS_CARDS = [
  "Kitchen Knife",
  "Dagger",
  "Crossed Swords",
  "Fire Axe",
  "Pickaxe",
  "Hook",
  "Scissors",
  "Champagne Bottle",
  "Katana",
  "Blade",
  "Saw",
  "Hammer",
  "Cricket Bat",
  "Field Hockey Stick",
  "Wrench",
  "Crowbar",
  "Brick",
  "Moai Statue",
  "Candlestick",
  "Frying Pan",
  "Stone",
  "Pistol",
  "Silenced Gun",
  "Boxing Glove",
  "Shotgun",
  "Bow and Arrow",
  "Rope",
  "Wire",
  "Necktie",
  "Teddy Bear",
  "Plastic Bag",
  "Chain",
  "Scarf",
  "Arsenic",
  "Cyanide Pill",
  "Venomous Snake",
  "Syringe",
  "Sleeping Pills",
  "Chainsaw",
  "Explosives",
  "Dynamite",
  "Electrocution",
  "Drowning",
  "Push from Heights",
  "Vehicle",
  "Trophy",
  "Screwdriver",
  "Clamp",
  "Fist",
  "Electric Plug",
  "Fire",
  "Oil Drum",
  "Lighter",
];

const CLUE_CARDS = [
  "Hand",
  "Shoe",
  "Blood Stain",
  "DNA Sample",
  "T-Shirt",
  "Shirt Button",
  "Sewing Thread",
  "Wedding Ring",
  "Wristwatch",
  "Gem Stone",
  "Glasses",
  "Purse",
  "Name Badge",
  "Credit Card",
  "Receipt",
  "Ticket",
  "Memo",
  "Notebook",
  "Framed Picture",
  "World Map",
  "Floppy Disk",
  "Smartphone",
  "Laptop",
  "Key",
  "Coin",
  "Cigarette",
  "Flashlight",
  "Funeral Urn",
  "Ice Cube",
  "Fork and Knife",
  "Wilted Flower",
  "Leaf",
  "Droplet",
  "Oil Drum",
  "Artist Palette",
  "Fountain Pen",
  "Candy",
  "Wine Glass",
  "Hot Beverage",
  "Kiss Mark",
  "Lotion Bottle",
  "Salt Shaker",
  "Collision",
  "Hammer",
  "Glove",
  "Ninja Mask",
  "Joker Card",
  "Game Die",
  "Mirror",
];

const CARD_ICONS = {
  // WEAPONS
  "Kitchen Knife": "🔪",
  Dagger: "🗡️",
  "Crossed Swords": "⚔️",
  "Fire Axe": "🪓",
  Pickaxe: "⛏️",
  Hook: "🪝",
  Scissors: "✂️",
  "Champagne Bottle": "🍾",
  Katana: "⚔️",
  Blade: "🔪",
  Saw: "🪚",
  Hammer: "🔨",
  "Cricket Bat": "🏏",
  "Field Hockey Stick": "🏑",
  Wrench: "🔧",
  Crowbar: "🛠️",
  Brick: "🧱",
  "Moai Statue": "🗿",
  Candlestick: "🕯️",
  "Frying Pan": "🍳",
  Stone: "🪨",
  Pistol: "🔫",
  "Silenced Gun": "🔫",
  "Boxing Glove": "🥊",
  Shotgun: "🔫",
  "Bow and Arrow": "🏹",
  Rope: "🪢",
  Wire: "➰",
  Necktie: "👔",
  "Teddy Bear": "🧸",
  "Plastic Bag": "🛍️",
  Chain: "⛓️",
  Scarf: "🧣",
  Arsenic: "☠️",
  "Cyanide Pill": "💊",
  "Venomous Snake": "🐍",
  Syringe: "💉",
  "Sleeping Pills": "💤",
  Chainsaw: "🪚",
  Explosives: "💣",
  Dynamite: "🧨",
  Electrocution: "⚡",
  Drowning: "🌊",
  "Push from Heights": "🧗",
  Vehicle: "🚗",
  Trophy: "🏆",
  Screwdriver: "🪛",
  Clamp: "🗜️",
  Fist: "👊",
  "Electric Plug": "🔌",
  Fire: "🔥",
  "Oil Drum": "🛢️",
  Lighter: "🔥",

  // CLUES
  Hand: "✋",
  Shoe: "👞",
  "Blood Stain": "🩸",
  "DNA Sample": "🧬",
  "T-Shirt": "👕",
  "Shirt Button": "🔘",
  "Sewing Thread": "🧵",
  "Wedding Ring": "💍",
  Wristwatch: "⌚",
  "Gem Stone": "💎",
  Glasses: "👓",
  Purse: "👛",
  "Name Badge": "📛",
  "Credit Card": "💳",
  Receipt: "🧾",
  Ticket: "🎫",
  Memo: "📝",
  Notebook: "📓",
  "Framed Picture": "🖼️",
  "World Map": "🗺️",
  "Floppy Disk": "💾",
  Smartphone: "📱",
  Laptop: "💻",
  Key: "🔑",
  Coin: "🪙",
  Cigarette: "🚬",
  Flashlight: "🔦",
  "Funeral Urn": "⚱️",
  "Ice Cube": "🧊",
  "Fork and Knife": "🍽️",
  "Wilted Flower": "🥀",
  Leaf: "🍃",
  Droplet: "💧",
  "Artist Palette": "🎨",
  "Fountain Pen": "✒️",
  Candy: "🍬",
  "Wine Glass": "🍷",
  "Hot Beverage": "☕",
  "Kiss Mark": "💋",
  "Lotion Bottle": "🧴",
  "Salt Shaker": "🧂",
  Collision: "💥",
  Glove: "🧤",
  "Ninja Mask": "🥷",
  "Joker Card": "🃏",
  "Game Die": "🎲",
  Mirror: "🪞",
};

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
        "Balcony",
        "Garden",
      ],
    },
    {
      title: "Location of Crime",
      type: "green",
      options: [
        "Office",
        "Hotel",
        "Restaurant",
        "Pub/Bar",
        "School",
        "Hospital",
      ],
    },
    {
      title: "Location of Crime",
      type: "green",
      options: [
        "Vacation home",
        "Park",
        "Supermarket",
        "Forest",
        "University",
        "Bookstore",
      ],
    },
    {
      title: "Location of Crime",
      type: "green",
      options: [
        "Playground",
        "Classroom",
        "Dormitory",
        "Cafeteria",
        "Lift",
        "Toilet",
      ],
    },
  ],
  SUBORDINATE: [
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
      title: "Weapon Origin",
      options: [
        "Household",
        "Industrial/Work",
        "Medical/Chemical",
        "Outdoor/Nature",
        "Military/Tactical",
        "Sports/Recreation",
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
      title: "State of Scene",
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
      title: "Injury/Wounds",
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
      title: "Assassin Hint",
      options: ["Man", "Woman", "Tall", "Short", "Strong", "Weak"],
    },
    {
      title: "Shape of Evidence",
      options: [
        "Round/Spherical",
        "Square/Rectangular",
        "Long/Thin",
        "Flat/Sheet",
        "Irregular/Amorphous",
        "Sharp/Pointed",
      ],
    },
    {
      title: "Weapon Operation",
      options: [
        "Muscle Power",
        "Mechanism/Trigger",
        "Chemical/Reaction",
        "Electrical",
        "Passive/Trap",
        "Animal/Living",
      ],
    },
    {
      title: "Evidence Domain",
      options: [
        "Work/Office",
        "Home/Domestic",
        "Travel/Outdoor",
        "Leisure/Hobby",
        "Medical/Hygiene",
        "Vice/Illegal",
      ],
    },
    {
      title: "Concealability (Weapon)",
      options: [
        "Pocket Size",
        "Bag/Backpack Size",
        "Two-Handed/Large",
        "Not Concealable",
        "Invisible/Internal",
        "Disguised as Object",
      ],
    },
    {
      title: "Relation to Victim (Evidence)",
      options: [
        "Owned by Victim",
        "Stolen from Victim",
        "Gifted to Victim",
        "Belonged to Killer",
        "Found at Scene",
        "Unknown Origin",
      ],
    },
    {
      title: "Texture of Evidence",
      options: [
        "Hard/Rigid",
        "Soft/Flexible",
        "Metallic/Cold",
        "Wooden/Rough",
        "Paper-like",
        "Sticky/Liquid",
      ],
    },
    {
      title: "Residue Left by Weapon",
      options: [
        "Blood",
        "Powder/Dust",
        "Water/Fluid",
        "Ash/Burn Mark",
        "Fragments/Shards",
        "None/Clean",
      ],
    },
    {
      title: "Visibility of Injury",
      options: [
        "None Visible",
        "Small Puncture",
        "Large Wound",
        "Bruising/Swelling",
        "Burns/Rash",
        "Dismemberment/Breakage",
      ],
    },
  ],
};

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

const getCardIcon = (name) => {
  const icon = CARD_ICONS[name] || "❓";
  return (
    <span className="text-2xl leading-none filter drop-shadow-sm grayscale-[0.2] mb-1 block">
      {icon}
    </span>
  );
};

// --- Sub-Components ---
const FloatingBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80" />
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/black-scales.png")',
      }}
    ></div>
  </div>
);

const InvestigationLogo = () => (
  <div className="flex items-center justify-center gap-1 opacity-40 py-2 w-full bg-slate-950/80 backdrop-blur-sm border-t border-slate-900/50 z-50">
    <HatGlasses size={12} className="text-green-500" />
    <span className="text-[10px] font-black tracking-widest text-green-500 uppercase">
      INVESTIGATION
    </span>
  </div>
);

const TutorialModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] bg-slate-950/95 flex justify-center overflow-y-auto p-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
    <div className="w-full max-w-4xl relative">
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:absolute md:-right-12 md:top-0 bg-slate-800 p-2 rounded-full text-white hover:bg-slate-700 shadow-lg z-50"
      >
        <X size={24} />
      </button>
      <div className="space-y-8 pb-20 mt-12 md:mt-0">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-600">
            GAME GUIDE
          </h2>
          <p className="text-slate-400">Deduction, Deception, and Discovery</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="text-red-500" /> The Objective
          </h3>
          <p className="text-slate-300 leading-relaxed">
            A murder has been committed. The{" "}
            <span className="text-blue-400 font-bold">Detective</span> knows the
            solution but can only communicate through vague clues. The{" "}
            <span className="text-green-400 font-bold">Investigators</span> must
            interpret these clues to find the true{" "}
            <strong className="text-white">Murder Weapon</strong> and{" "}
            <strong className="text-white">Evidence</strong>.
          </p>
        </div>
        <div className="text-center pt-8">
          <button
            onClick={onClose}
            className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function InvestigationGame() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Local Interaction State
  const [solveTarget, setSolveTarget] = useState(null);
  const [showSolveModal, setShowSolveModal] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [replacementMode, setReplacementMode] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showCluesMobile, setShowCluesMobile] = useState(true);
  const [uiAlert, setUiAlert] = useState(null);
  const [witnessHuntModalOpen, setWitnessHuntModalOpen] = useState(true);
  const [showSuggestionToast, setShowSuggestionToast] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  // --- Persistence & Auth ---
  useEffect(() => {
    // 1. Check Local Storage on Load
    const savedRoom = localStorage.getItem("inv_roomId");
    const savedName = localStorage.getItem("inv_name");
    if (savedName) setPlayerName(savedName);
    if (savedRoom) {
      setRoomId(savedRoom);
      setRoomCodeInput(savedRoom);
    }

    // 2. Init Auth
    const initAuth = async () => {
      if (typeof __initial_auth_token !== "undefined" && __initial_auth_token) {
        try {
          await signInWithCustomToken(auth, __initial_auth_token);
        } catch (err) {
          console.error("Custom token sign-in failed", err);
          await signInAnonymously(auth);
        }
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- Room Listener ---
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

          // KICK / TERMINATED CHECK
          if (data.status === "terminated") {
            localStorage.removeItem("inv_roomId");
            setRoomId(null);
            setView("menu");
            setGameState(null);
            setError("Host has ended the session.");
            return;
          }

          const amIInRoom = data.players.find((p) => p.id === user.uid);
          if (!amIInRoom) {
            localStorage.removeItem("inv_roomId");
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

          if (data.status === "lobby") {
            setShowSolveModal(false);
            setSolveTarget(null);
            setReplacementMode(false);
          }
        } else {
          localStorage.removeItem("inv_roomId");
          setRoomId(null);
          setView("menu");
          setError("Room closed.");
        }
      },
      (err) => console.error(err)
    );
    return () => unsubscribe();
  }, [roomId, user]);

  // --- Maintenance Check ---
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "game_hub_settings", "config"), (doc) => {
      if (doc.exists() && doc.data()[GAME_ID]?.maintenance)
        setIsMaintenance(true);
      else setIsMaintenance(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (gameState?.phase === "WITNESS_HUNT") {
      setWitnessHuntModalOpen(true);
      setShowSuggestionToast(true);
    } else {
      setWitnessHuntModalOpen(false);
    }
  }, [gameState?.phase]);

  // --- Maintenance View ---
  if (isMaintenance) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="bg-orange-500/10 p-8 rounded-2xl border border-orange-500/30">
          <Hammer
            size={64}
            className="text-orange-500 mx-auto mb-4 animate-bounce"
          />
          <h1 className="text-3xl font-bold mb-2">Under Maintenance</h1>
          <p className="text-gray-400">Crime scene sealed.</p>
        </div>
      </div>
    );
  }

  // --- Actions ---

  const handleAlert = (title, message) =>
    setUiAlert({ title, message, type: "alert" });
  const handleConfirm = (title, message, onConfirm) =>
    setUiAlert({ title, message, type: "confirm", onConfirm });
  const closeAlert = () => setUiAlert(null);

  const createRoom = async () => {
    if (!user || !playerName.trim()) return setError("Enter nickname.");
    setLoading(true);
    const newRoomId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const roomData = {
      roomId: newRoomId,
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
      readyReplay: [], // New for replay feature
      activeAccusation: null,
    };
    try {
      await setDoc(
        doc(db, "artifacts", appId, "public", "data", "rooms", newRoomId),
        roomData
      );
      localStorage.setItem("inv_roomId", newRoomId);
      localStorage.setItem("inv_name", playerName);
      setRoomId(newRoomId);
      setRoomCodeInput(newRoomId);
    } catch (e) {
      setError("Failed to create room.");
    }
    setLoading(false);
  };

  const joinRoom = async () => {
    if (!user || !roomCodeInput || !playerName.trim())
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
        roomCodeInput.toUpperCase()
      );
      const snap = await getDoc(roomRef);
      if (!snap.exists()) throw new Error("Room not found.");
      const data = snap.data();
      if (data.status === "terminated")
        throw new Error("This session has ended.");
      if (data.players.length >= 10) throw new Error("Room full.");

      // Allow rejoin if already in player list even if started, otherwise only lobby
      const exists = data.players.find((p) => p.id === user.uid);
      if (!exists && data.status !== "lobby") throw new Error("Game started.");

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
      localStorage.setItem("inv_roomId", roomCodeInput.toUpperCase());
      localStorage.setItem("inv_name", playerName);
      setRoomId(roomCodeInput.toUpperCase());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const leaveRoom = async () => {
    if (!roomId || !user || !gameState) return;

    // Clear local persistence
    localStorage.removeItem("inv_roomId");

    const roomRef = doc(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "rooms",
      roomId
    );

    if (gameState.hostId === user.uid) {
      // HOST LEAVES -> TERMINATE ROOM
      try {
        await updateDoc(roomRef, { status: "terminated" });
      } catch (e) {
        console.error(e);
      }
    } else {
      // GUEST LEAVES -> REMOVE SELF
      const updatedPlayers = gameState.players.filter((p) => p.id !== user.uid);
      try {
        await updateDoc(roomRef, { players: updatedPlayers });
      } catch (e) {
        console.error(e);
      }
    }

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
      { players: updatedPlayers }
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
        readyReplay: [], // Reset replay readiness
        activeAccusation: null,
      }
    );
  };

  const startGame = async () => {
    if (gameState.players.length < 4) return setError("Need 4+ players.");
    const pCount = gameState.players.length;
    let roles = ["DETECTIVE", "MURDERER"];
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
      const pMeans = [],
        pClues = [];
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
        phase: "PRE_GAME_MURDER",
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
        readyReplay: [], // Clear persistence
        activeAccusation: null,
      }
    );
  };

  // --- Game Logic ---

  const handleReplayReady = async () => {
    const isReady = gameState.readyReplay?.includes(user.uid);
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        readyReplay: isReady ? arrayRemove(user.uid) : arrayUnion(user.uid),
      }
    );
  };

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
      { activeTiles: newTiles }
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
          text: `Round ${gameState.round} Clues Revealed!`,
          type: "info",
        }),
        nextRoundRequests: [],
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
      return handleAlert("Invalid Action", "Cannot replace core tiles.");
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
          text: `Round ${gameState.round + 1} Begins.`,
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
      continueVotes: [],
    };

    const newRequests = gameState.nextRoundRequests || [];
    if (!newRequests.includes(user.uid)) newRequests.push(user.uid);

    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      {
        players: updatedPlayers,
        accusations: arrayUnion(accusationData),
        activeAccusation: accusationData,
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
    const newVotes = [
      ...(gameState.activeAccusation.continueVotes || []),
      user.uid,
    ];
    const allVoted = gameState.players.length === newVotes.length;
    let updates = { "activeAccusation.continueVotes": newVotes };

    if (allVoted) {
      updates.activeAccusation = null;
      if (gameState.activeAccusation.isCorrect) {
        if (gameState.settings?.useWitness) {
          updates.phase = "WITNESS_HUNT";
          updates.successfulSolvers = [gameState.activeAccusation.solverId];
          updates.logs = arrayUnion({
            text: "CORRECT! Murderer hunting Witness...",
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
          text: `${gameState.activeAccusation.solverName} was WRONG.`,
          type: "danger",
        });
        // Check for active badges - if all gone, game over bad
        const activeBadges = gameState.players.filter(
          (p) => p.role !== "DETECTIVE" && p.badge === true
        ).length;
        if (activeBadges === 0) {
          // Since this player just used one, check if that was the last
          // Handled by snapshot listener or explicitly here, but let's check explicitly
          const currentActive = gameState.players.filter(
            (p) => p.role !== "DETECTIVE" && p.badge === true
          ).length;
          if (currentActive === 0) {
            updates.phase = "GAME_OVER_BAD";
            updates.logs = arrayUnion({
              text: "All badges used. Murderer Escapes!",
              type: "danger",
            });
          }
        }
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
      { accompliceSuggestion: playerId }
    );
  };

  const attemptFindWitness = async (targetId) => {
    const target = gameState.players.find((p) => p.id === targetId);
    let nextPhase =
      target.role === "WITNESS" ? "GAME_OVER_BAD" : "GAME_OVER_GOOD";
    let logs =
      target.role === "WITNESS"
        ? [
            {
              text: `Murderer found Witness (${target.name})! Murderer Wins!`,
              type: "danger",
            },
          ]
        : [
            {
              text: `Murderer guessed wrong! Investigators Win!`,
              type: "success",
            },
          ];
    await updateDoc(
      doc(db, "artifacts", appId, "public", "data", "rooms", roomId),
      { phase: nextPhase, logs: arrayUnion(...logs) }
    );
  };

  const RoleCard = ({ role }) => {
    if (!role) return null;
    let color = "bg-gray-600",
      icon = User;
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
    return (
      <div
        className={`${color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm`}
      >
        {React.createElement(icon, { size: 12 })}{" "}
        <span className="whitespace-nowrap">
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </span>
      </div>
    );
  };

  if (!user)
    return (
      <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading Case Files...
      </div>
    );

  // --- MENU ---
  if (view === "menu") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <FloatingBackground />
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}
        <div className="z-10 text-center mb-10 animate-in fade-in zoom-in duration-700">
          <HatGlasses
            size={64}
            className="text-green-500 mx-auto mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-600 font-serif tracking-widest drop-shadow-md">
            INVESTIGATION
          </h1>
          <p className="text-gray-400 tracking-[0.3em] uppercase mt-2">
            Murder Mystery
          </p>
        </div>
        <div className="bg-gray-900/80 backdrop-blur border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl z-10 animate-in slide-in-from-bottom-10 duration-700 delay-100">
          {error && (
            <div className="bg-red-900/50 text-red-200 p-2 mb-4 rounded text-center text-sm border border-red-800">
              {error}
            </div>
          )}
          <input
            className="w-full bg-black/50 border border-gray-600 p-3 rounded mb-4 text-white placeholder-gray-500 focus:border-green-500 outline-none transition-colors"
            placeholder="Your Codename"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button
            onClick={createRoom}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 p-4 rounded font-bold mb-4 flex items-center justify-center gap-2 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all"
          >
            <Badge size={20} /> Create Case File
          </button>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              className="w-full sm:flex-1 bg-black/50 border border-gray-600 p-3 rounded text-white placeholder-gray-500 uppercase font-mono tracking-wider focus:border-green-500 outline-none"
              placeholder="ROOM CODE"
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            />
            <button
              onClick={joinRoom}
              disabled={loading}
              className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 border border-gray-600 px-6 py-3 rounded font-bold transition-colors"
            >
              Join
            </button>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="w-full text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 py-2"
          >
            <BookOpen size={16} /> How to Play
          </button>
        </div>
        <div className="fixed bottom-0 left-0 w-full">
          <InvestigationLogo />
        </div>
      </div>
    );
  }

  // --- LOBBY ---
  if (view === "lobby" && gameState) {
    const isHost = gameState.hostId === user.uid;
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 relative pb-16">
        <FloatingBackground />
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}
        <div className="z-10 w-full max-w-lg bg-gray-800/90 p-8 rounded-2xl border border-gray-700 shadow-2xl mb-4">
          <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-serif text-green-500">
              Case: {gameState.roomId}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={16} /> {gameState.players.length}/10
              </div>
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="p-2 bg-red-900/50 hover:bg-red-900 rounded text-red-300"
                title="Leave Room"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-gray-300 font-bold">
              <Settings size={18} /> Settings
            </div>
            <div className="flex gap-4">
              {gameState.players.length >= 6 && (
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    !isHost && "opacity-50 pointer-events-none"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={gameState.settings?.useAccomplice || false}
                    onChange={() => isHost && toggleSetting("useAccomplice")}
                    className="w-4 h-4 accent-green-500 rounded"
                  />
                  <span className="text-sm">Accomp.</span>
                </label>
              )}
              {gameState.players.length >= 5 && (
                <label
                  className={`flex items-center gap-2 cursor-pointer ${
                    !isHost && "opacity-50 pointer-events-none"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={gameState.settings?.useWitness || false}
                    onChange={() => isHost && toggleSetting("useWitness")}
                    className="w-4 h-4 accent-green-500 rounded"
                  />
                  <span className="text-sm">Witness</span>
                </label>
              )}
            </div>
          </div>
          <div className="space-y-3 mb-8 max-h-60 overflow-y-auto">
            {gameState.players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-gray-900 p-4 rounded border border-gray-700"
              >
                <span
                  className={`font-bold ${
                    p.id === user.uid ? "text-green-500" : "text-gray-300"
                  }`}
                >
                  {p.name} {p.id === gameState.hostId && "👑"}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-green-600 flex items-center gap-1 text-sm">
                    <CheckCircle size={14} /> Ready
                  </span>
                  {isHost && p.id !== user.uid && (
                    <button
                      onClick={() => kickPlayer(p.id)}
                      className="text-red-900 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isHost ? (
            <button
              onClick={startGame}
              disabled={gameState.players.length < 4}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                gameState.players.length < 4
                  ? "bg-gray-700 cursor-not-allowed text-gray-500"
                  : "bg-green-700 hover:bg-green-600 text-white shadow-green-900/30"
              }`}
            >
              Start Investigation
            </button>
          ) : (
            <div className="text-center text-green-500/80 font-serif mb-2">
              Waiting for Host to start...
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 w-full">
          <InvestigationLogo />
        </div>
        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Leave Case?</h3>
              <p className="text-slate-400 mb-6 text-sm">
                {isHost
                  ? "As Host, leaving will terminate the session for everyone."
                  : "You will be removed from the lobby."}
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
    if (!me) return <div className="p-10 text-white">Loading...</div>;

    let knownRoles = {};
    knownRoles[me.id] = me.role;
    if (me.role === "DETECTIVE")
      gameState.players.forEach((p) => (knownRoles[p.id] = p.role));
    if (me.role === "MURDERER") {
      const acc = gameState.players.find((p) => p.role === "ACCOMPLICE");
      if (acc) knownRoles[acc.id] = "ACCOMPLICE";
    }
    if (me.role === "ACCOMPLICE") {
      const mur = gameState.players.find((p) => p.role === "MURDERER");
      if (mur) knownRoles[mur.id] = "MURDERER";
    }
    if (me.role === "WITNESS")
      gameState.players.forEach((p) => {
        if (p.role === "MURDERER") knownRoles[p.id] = "MURDERER";
      });

    const isScientist = me.role === "DETECTIVE";
    const isHost = gameState.hostId === user.uid;

    const toggleSelection = (pId, type, item) => {
      if (isScientist || !me.badge || gameState.phase !== "INVESTIGATION")
        return;
      setSolveTarget((prev) => {
        if (prev?.targetId !== pId)
          return {
            targetId: pId,
            [type]: item,
            [type === "means" ? "clue" : "means"]: null,
          };
        const newState = { ...prev };
        if (newState[type] === item) newState[type] = null;
        else newState[type] = item;
        return newState;
      });
    };

    const everyoneRequested = gameState.players
      .filter((p) => p.role !== "DETECTIVE")
      .every(
        (p) =>
          gameState.nextRoundRequests?.includes(p.id) ||
          gameState.accusations?.some((acc) => acc.solverId === p.id)
      );
    const myAccusation = gameState.accusations?.find(
      (acc) => acc.solverId === user.uid
    );

    // --- GAME OVER SCREEN (Common Logic) ---
    const isGameOver =
      gameState.phase === "GAME_OVER_GOOD" ||
      gameState.phase === "GAME_OVER_BAD";

    if (isGameOver) {
      const isGood = gameState.phase === "GAME_OVER_GOOD";
      const readyCount = (gameState.readyReplay || []).length;
      // Host counts players excluding themselves usually, or total players minus 1 (since host controls it)
      // But let's assume Host also counts as a player for total count, but Host controls button.
      // Logic: Host waits for Guests. Guests = Total Players - 1 (Host).
      const guestsCount = gameState.players.length - 1;
      const allGuestsReady = readyCount >= guestsCount;

      return (
        <div
          className={`fixed inset-0 ${
            isGood ? "bg-blue-900/95" : "bg-red-950/95"
          } z-50 flex flex-col items-center justify-center p-6 text-center`}
        >
          {isGood ? (
            <Badge size={96} className="text-yellow-400 mb-6 shadow-xl" />
          ) : (
            <Skull size={96} className="text-red-500 mb-6 shadow-xl" />
          )}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            {isGood ? "INVESTIGATORS WIN" : "MURDERER WINS"}
          </h1>
          <p
            className={`${
              isGood ? "text-blue-200" : "text-red-200"
            } text-lg md:text-xl max-w-lg mb-8`}
          >
            {isGood
              ? "The truth has been revealed."
              : "The investigation failed."}
          </p>

          <div className="bg-white/10 p-6 rounded-xl border border-white/20 mb-8 w-full max-w-md backdrop-blur-md">
            <div
              className={`text-sm uppercase tracking-widest ${
                isGood ? "text-blue-300" : "text-red-300"
              } mb-6 font-bold`}
            >
              The Solution
            </div>
            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-slate-900/80 border-2 border-red-500/50 p-4 rounded-xl flex flex-col items-center justify-center w-32 h-36">
                <div className="scale-150 mb-2">
                  {getCardIcon(gameState.solution?.means)}
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {gameState.solution?.means}
                </div>
              </div>
              <div className="flex items-center text-white/50">
                <span className="text-2xl font-black">+</span>
              </div>
              <div className="bg-slate-900/80 border-2 border-blue-500/50 p-4 rounded-xl flex flex-col items-center justify-center w-32 h-36">
                <div className="scale-150 mb-2">
                  {getCardIcon(gameState.solution?.clue)}
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {gameState.solution?.clue}
                </div>
              </div>
            </div>
            <div className="text-lg bg-black/20 p-2 rounded-lg inline-block px-6 text-gray-300">
              Culprit:{" "}
              <span className="text-white font-black">
                {
                  gameState.players.find(
                    (p) => p.id === gameState.solution?.murdererId
                  )?.name
                }
              </span>
            </div>
          </div>

          <div className="w-full max-w-md space-y-3">
            {/* REPLAY CONTROLS */}
            {isHost ? (
              <div className="space-y-3">
                <div className="text-sm font-bold text-white/70 uppercase tracking-widest">
                  {allGuestsReady
                    ? "Everyone is Ready"
                    : `Waiting for players (${readyCount}/${guestsCount})`}
                </div>

                {/* Progress Bar for Host */}
                <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-green-500 h-full transition-all duration-500"
                    style={{
                      width: `${
                        (readyCount / Math.max(1, guestsCount)) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={restartGame}
                    disabled={!allGuestsReady}
                    className={`py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                      allGuestsReady
                        ? "bg-white text-black hover:scale-105 shadow-xl"
                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <PlayCircle size={20} /> New Game
                  </button>
                  <button
                    onClick={() => {
                      restartGame(); /* Actually logic to return lobby is same reset but keeping state lobby */
                    }}
                    disabled={!allGuestsReady}
                    className={`py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${
                      allGuestsReady
                        ? "bg-black/40 text-white hover:bg-black/60 border border-white/20"
                        : "bg-gray-800/50 text-gray-500 border border-gray-700 cursor-not-allowed"
                    }`}
                  >
                    <RotateCcw size={20} /> Lobby
                  </button>
                </div>
                <div className="pt-4 border-t border-white/10 mt-4">
                  <button
                    onClick={leaveRoom}
                    className="text-red-400 text-sm hover:text-white flex items-center justify-center gap-2 mx-auto"
                  >
                    <LogOut size={14} /> Terminate Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleReplayReady}
                  className={`w-full py-4 rounded-full font-black text-lg transition-all transform flex items-center justify-center gap-2 ${
                    gameState.readyReplay?.includes(user.uid)
                      ? "bg-green-500 text-white scale-105 shadow-lg shadow-green-500/50"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {gameState.readyReplay?.includes(user.uid) ? (
                    <>
                      <CheckCircle size={24} /> READY FOR NEXT
                    </>
                  ) : (
                    <>
                      <ThumbsUp size={24} /> READY FOR ANOTHER?
                    </>
                  )}
                </button>
                <div className="text-xs text-white/50 uppercase font-bold mt-2">
                  Waiting for Host to restart...
                </div>
                <button
                  onClick={() => setShowLeaveConfirm(true)}
                  className="mt-4 text-white/40 hover:text-white text-sm flex items-center justify-center gap-1 mx-auto"
                >
                  <LogOut size={14} /> Leave Room
                </button>
              </div>
            )}
          </div>
          {/* Leave Confirm for Game Over Screen */}
          {showLeaveConfirm && (
            <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4">
              <div className="bg-slate-800 p-6 rounded-xl text-center">
                <h3 className="text-white font-bold mb-4">Leave?</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLeaveConfirm(false)}
                    className="bg-slate-600 px-4 py-2 rounded text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={leaveRoom}
                    className="bg-red-600 px-4 py-2 rounded text-white"
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

    // --- PHASE 0: PRE-GAME ---
    if (gameState.phase === "PRE_GAME_MURDER") {
      const isReady = gameState.readyPlayers?.includes(user.uid);
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative pb-16">
          <FloatingBackground />
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
          <div className="flex-1 overflow-y-auto p-4 bg-transparent z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto pb-20">
              {gameState.players.map((p) => {
                const isMe = p.id === user.uid;
                const roleVisible = knownRoles[p.id] || p.role === "DETECTIVE";
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
                            className="p-1.5 rounded bg-slate-800 border border-red-900/30 flex flex-col items-center justify-center text-center gap-1 min-h-[50px] shadow-sm"
                          >
                            {getCardIcon(m)}
                            <span className="text-[9px] font-bold text-red-200 leading-tight line-clamp-2">
                              {m}
                            </span>
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
                            className="p-1.5 rounded bg-slate-800 border border-blue-900/30 flex flex-col items-center justify-center text-center gap-1 min-h-[50px] shadow-sm"
                          >
                            {getCardIcon(c)}
                            <span className="text-[9px] font-bold text-blue-200 leading-tight line-clamp-2">
                              {c}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-full z-50">
            <InvestigationLogo />
          </div>
        </div>
      );
    }

    // --- PHASE 1: MURDERER SELECT ---
    if (gameState.phase === "MURDERER_SELECT") {
      if (me.role === "MURDERER" || me.role === "ACCOMPLICE") {
        return (
          <div className="min-h-screen bg-red-950 text-white p-4 flex flex-col items-center justify-center relative pb-16">
            <FloatingBackground />
            <div className="z-10 text-center w-full flex-1 flex flex-col">
              <div className="mt-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-red-500 mb-2">
                  COMMIT THE CRIME
                </h1>
                <p className="text-red-200 mb-4 max-w-md mx-auto text-sm md:text-base">
                  {me.role === "MURDERER"
                    ? "Select 1 Murder Weapon and 1 Evidence."
                    : "The Murderer is selecting the weapon and evidence. Watch closely."}
                </p>
              </div>
              {me.role === "MURDERER" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto flex-1 overflow-y-auto pb-32">
                  <div className="bg-red-900/30 p-4 rounded-xl border border-red-800 h-fit">
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
                          className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all min-h-[80px] shadow-md hover:shadow-lg active:scale-95 ${
                            solveTarget?.means === m
                              ? "bg-red-600 border-white text-white scale-105 shadow-xl ring-2 ring-white/50"
                              : "bg-red-900/50 border-red-700 text-red-200 hover:bg-red-800"
                          }`}
                        >
                          {getCardIcon(m)}
                          <span className="text-xs font-bold leading-tight">
                            {m}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-800 h-fit">
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
                          className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all min-h-[80px] shadow-md hover:shadow-lg active:scale-95 ${
                            solveTarget?.clue === c
                              ? "bg-blue-600 border-white text-white scale-105 shadow-xl ring-2 ring-white/50"
                              : "bg-blue-900/50 border-blue-700 text-blue-200 hover:bg-blue-800"
                          }`}
                        >
                          {getCardIcon(c)}
                          <span className="text-xs font-bold leading-tight">
                            {c}
                          </span>
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
            </div>
            {me.role === "MURDERER" && (
              <div className="fixed bottom-12 left-0 w-full p-4 flex justify-center z-40 pointer-events-none">
                <button
                  disabled={!solveTarget?.means || !solveTarget?.clue}
                  onClick={() =>
                    handleMurdererSelect(solveTarget.means, solveTarget.clue)
                  }
                  className="w-full max-w-md bg-white text-red-900 px-8 py-3 rounded-full font-black text-lg hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-2xl pointer-events-auto"
                >
                  CONFIRM KILL
                </button>
              </div>
            )}
            <div className="fixed bottom-0 left-0 w-full z-50">
              <InvestigationLogo />
            </div>
          </div>
        );
      } else if (isScientist) {
        return (
          <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center relative pb-16">
            <FloatingBackground />
            <div className="z-10">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">
                Awaiting The Crime...
              </h2>
              <div className="animate-pulse bg-slate-800 p-6 rounded-xl max-w-lg">
                <p className="text-slate-300">
                  The Murderer is choosing the Murder Weapon and Evidence.
                </p>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
              <InvestigationLogo />
            </div>
          </div>
        );
      } else {
        return (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center relative pb-16">
            <div className="z-10">
              <EyeOff size={64} className="text-slate-700 mb-6 mx-auto" />
              <h2 className="text-4xl font-black text-slate-500 mb-4">
                EYES CLOSED
              </h2>
              <p className="text-slate-600">The Murder is taking place.</p>
            </div>
            <div className="fixed bottom-0 left-0 w-full z-50">
              <InvestigationLogo />
            </div>
          </div>
        );
      }
    }

    // --- MAIN GAMEPLAY UI ---
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative overflow-hidden pb-12">
        <FloatingBackground />
        {showTutorial && (
          <TutorialModal onClose={() => setShowTutorial(false)} />
        )}

        {/* Top Bar */}
        <div className="bg-slate-900 border-b border-slate-800 p-2 px-3 flex justify-between items-center shadow-md z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="font-serif font-black text-xl tracking-wider text-green-500">
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
            {isScientist && gameState.phase === "DETECTIVE_TURN" && (
              <button
                onClick={finishScientistPhase}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold shadow-lg animate-pulse"
              >
                Confirm
              </button>
            )}
            {gameState.phase === "INVESTIGATION" &&
              isScientist &&
              gameState.round < 3 && (
                <button
                  disabled={!everyoneRequested}
                  onClick={() => setReplacementMode(!replacementMode)}
                  className={`${
                    replacementMode
                      ? "bg-red-500 animate-pulse"
                      : everyoneRequested
                      ? "bg-blue-600"
                      : "bg-slate-700 opacity-50 cursor-not-allowed"
                  } hover:brightness-110 text-white px-3 py-1.5 rounded text-xs font-bold shadow-lg transition-colors flex items-center gap-1`}
                >
                  {replacementMode ? "Select Tile" : "Next Rnd"}{" "}
                  {!everyoneRequested && (
                    <span className="text-[10px] bg-black/30 px-1 rounded">
                      {gameState.nextRoundRequests?.length || 0}/
                      {gameState.players.length - 1}
                    </span>
                  )}
                </button>
              )}
            {gameState.phase === "INVESTIGATION" &&
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
            {gameState.phase === "INVESTIGATION" &&
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

        {/* Mobile Clue Toggle */}
        <div className="bg-slate-800/80 p-2 flex justify-center md:hidden border-b border-slate-700 z-10">
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

        {/* Tiles Area */}
        {showCluesMobile && (
          <div className="bg-slate-900/50 p-2 overflow-x-auto border-b border-slate-800 z-10">
            <div className="flex gap-2 min-w-max mx-auto px-2">
              {gameState.activeTiles.map((tile, tIdx) => (
                <div
                  key={tile.id}
                  onClick={() => {
                    if (replacementMode && isScientist && tIdx >= 2)
                      nextRound(tIdx);
                  }}
                  className={`w-40 bg-slate-800 rounded-lg border-2 flex flex-col relative shadow-lg transition-all ${
                    replacementMode && tIdx >= 2 && isScientist
                      ? "border-red-500 cursor-pointer hover:bg-red-900/20 scale-105"
                      : isScientist &&
                        gameState.phase === "DETECTIVE_TURN" &&
                        "hover:border-blue-500/50"
                  } ${
                    tile.selected === null
                      ? "border-slate-700"
                      : "border-slate-600"
                  } ${replacementMode && tIdx < 2 && "opacity-50"}`}
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
                    {tile.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            isScientist &&
                            gameState.phase === "DETECTIVE_TURN"
                          )
                            handleScientistClue(tIdx, oIdx);
                        }}
                        className={`text-[10px] px-1.5 py-1 rounded cursor-pointer flex justify-between items-center transition-colors ${
                          tile.selected === oIdx
                            ? "bg-red-600 text-white font-bold shadow-md ring-1 ring-red-400"
                            : isScientist &&
                              gameState.phase === "DETECTIVE_TURN"
                            ? "hover:bg-slate-700 text-slate-300"
                            : "text-slate-500 opacity-50"
                        }`}
                      >
                        <span className="truncate">{opt}</span>
                        {tile.selected === oIdx && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full ml-1 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-transparent relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-7xl mx-auto pb-32">
            {gameState.players.map((p) => {
              const isMe = p.id === user.uid;
              const roleVisible =
                knownRoles[p.id] ||
                p.role === "DETECTIVE" ||
                gameState.phase.includes("GAME_OVER");
              const isTarget = solveTarget?.targetId === p.id;
              const isSuggested = gameState.accompliceSuggestion === p.id;
              const isAccusedByMe = myAccusation?.targetId === p.id;
              const pAccusation = gameState.accusations?.find(
                (acc) => acc.solverId === p.id
              );
              const showWitnessButtons =
                gameState.phase === "WITNESS_HUNT" &&
                !witnessHuntModalOpen &&
                (me.role === "ACCOMPLICE" || me.role === "MURDERER") &&
                p.role !== "DETECTIVE" &&
                p.role !== "MURDERER" &&
                p.role !== "ACCOMPLICE";

              return (
                <div
                  key={p.id}
                  className={`relative bg-slate-900 border rounded-xl overflow-hidden shadow-lg transition-all ${
                    isMe
                      ? "border-blue-500/30 ring-1 ring-blue-900/50"
                      : "border-slate-800"
                  } ${
                    gameState.phase === "WITNESS_HUNT" &&
                    isSuggested &&
                    me.role === "MURDERER"
                      ? "ring-4 ring-yellow-500 scale-105"
                      : ""
                  } ${
                    isAccusedByMe
                      ? "border-yellow-500/50 ring-1 ring-yellow-500/30"
                      : ""
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
                  <div className="p-2 grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-red-900 mb-1">
                        Murder Weapon
                      </div>
                      {p.means.map((m) => (
                        <div
                          key={m}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (p.id !== user.uid)
                              toggleSelection(p.id, "means", m);
                          }}
                          className={`p-1.5 rounded-md border flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 touch-manipulation min-h-[60px] shadow-sm ${
                            isTarget && solveTarget.means === m
                              ? "bg-red-600 text-white font-bold shadow-md scale-105 border border-white"
                              : isAccusedByMe && myAccusation.means === m
                              ? "bg-red-900/40 text-red-200 border border-yellow-500/50 shadow-inner"
                              : (isScientist ||
                                  me.role === "ACCOMPLICE" ||
                                  me.role === "MURDERER") &&
                                gameState.solution?.means === m &&
                                gameState.solution?.murdererId === p.id
                              ? "bg-purple-900/80 text-white border-2 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"
                              : "bg-slate-800 text-red-200 border border-red-900/30 hover:bg-red-900/20 hover:border-red-500"
                          } ${
                            p.id === user.uid && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {getCardIcon(m)}
                          <span className="text-[10px] font-bold leading-tight line-clamp-2 w-full">
                            {m}
                          </span>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            if (p.id !== user.uid)
                              toggleSelection(p.id, "clue", c);
                          }}
                          className={`p-1.5 rounded-md border flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 touch-manipulation min-h-[60px] shadow-sm ${
                            isTarget && solveTarget.clue === c
                              ? "bg-blue-600 text-white font-bold shadow-md scale-105 border border-white"
                              : isAccusedByMe && myAccusation.clue === c
                              ? "bg-blue-900/40 text-blue-200 border border-yellow-500/50 shadow-inner"
                              : (isScientist ||
                                  me.role === "ACCOMPLICE" ||
                                  me.role === "MURDERER") &&
                                gameState.solution?.clue === c &&
                                gameState.solution?.murdererId === p.id
                              ? "bg-purple-900/80 text-white border-2 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"
                              : "bg-slate-800 text-blue-200 border border-blue-900/30 hover:bg-blue-900/20 hover:border-blue-500"
                          } ${
                            p.id === user.uid && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {getCardIcon(c)}
                          <span className="text-[10px] font-bold leading-tight line-clamp-2 w-full">
                            {c}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {showWitnessButtons && (
                    <div className="p-2 pt-0 mt-auto sticky bottom-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 -mx-px -mb-px rounded-b-xl z-30">
                      {me.role === "ACCOMPLICE" && (
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
                      {me.role === "MURDERER" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              gameState.settings?.useAccomplice &&
                              !gameState.accompliceSuggestion
                            )
                              return handleAlert(
                                "Wait!",
                                "Wait for your Accomplice to suggest a target first!"
                              );
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
                  {isTarget &&
                    (solveTarget.means || solveTarget.clue) &&
                    gameState.phase !== "WITNESS_HUNT" && (
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

        {/* MODALS & OVERLAYS */}
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
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showLeaveConfirm && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Leave Game?</h3>
              <p className="text-slate-400 mb-6 text-sm">
                {isHost
                  ? "As Host, you can terminate the session here."
                  : "Are you sure? You will be removed."}
              </p>
              {isHost ? (
                <div className="grid grid-cols-1 gap-3">
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
                    Terminate Session
                  </button>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        )}

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

        {showSolveModal && solveTarget && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
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
                      <div className="p-3 bg-red-900/50 border border-red-600 rounded text-red-100 font-bold text-center text-sm flex items-center justify-center gap-2">
                        {getCardIcon(solveTarget.means)}
                        {solveTarget.means}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-800 border border-slate-700 border-dashed rounded text-slate-500 text-center text-xs">
                        Select Weapon
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase mb-1">
                      Evidence on Site
                    </div>
                    {solveTarget.clue ? (
                      <div className="p-3 bg-blue-900/50 border border-blue-600 rounded text-blue-100 font-bold text-center text-sm flex items-center justify-center gap-2">
                        {getCardIcon(solveTarget.clue)}
                        {solveTarget.clue}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-800 border border-slate-700 border-dashed rounded text-slate-500 text-center text-xs">
                        Select Evidence
                      </div>
                    )}
                  </div>
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

        {gameState.activeAccusation && (
          <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4">
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
                      Weapon
                    </div>
                    <div className="text-white font-bold text-sm flex items-center justify-center gap-1">
                      {getCardIcon(gameState.activeAccusation.means)}
                      {gameState.activeAccusation.means}
                    </div>
                  </div>
                  <div className="bg-blue-900/30 border border-blue-500/30 p-2 rounded text-center">
                    <div className="text-[10px] text-blue-300 uppercase font-bold mb-1">
                      Evidence
                    </div>
                    <div className="text-white font-bold text-sm flex items-center justify-center gap-1">
                      {getCardIcon(gameState.activeAccusation.clue)}
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

        {gameState.phase === "WITNESS_HUNT" && witnessHuntModalOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80">
            {me.role === "MURDERER" || me.role === "ACCOMPLICE" ? (
              <div className="bg-red-950 border-2 border-red-500 p-6 rounded-xl shadow-2xl text-center max-w-lg animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl md:text-3xl font-black text-red-500 mb-2">
                  YOU HAVE BEEN CAUGHT!
                </h2>
                <p className="text-red-100 text-base md:text-lg mb-4">
                  {me.role === "ACCOMPLICE"
                    ? "Help the Murderer find the Witness."
                    : "Identify the Witness to steal the win."}
                </p>
                {me.role === "MURDERER" &&
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
              </div>
            )}
          </div>
        )}
        <div className="fixed bottom-0 left-0 w-full z-50">
          <InvestigationLogo />
        </div>
      </div>
    );
  }

  return null;
}
